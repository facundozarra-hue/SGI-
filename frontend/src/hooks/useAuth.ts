import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { User } from '../types';

function firebaseUserToUser(fbUser: { uid: string; email: string | null; displayName: string | null }): User {
  const displayName = fbUser.displayName ?? fbUser.email?.split('@')[0] ?? 'Usuario';
  const parts = displayName.split(' ');
  return {
    id: fbUser.uid,
    email: fbUser.email ?? '',
    nombre: parts[0] ?? displayName,
    apellido: parts.slice(1).join(' ') ?? '',
    role: 'ADMIN',
  };
}

function getAuthErrorMessage(code: string): string {
  if (['auth/invalid-credential', 'auth/wrong-password', 'auth/user-not-found'].includes(code)) {
    return 'Email o contraseña incorrectos';
  }
  return 'Error al iniciar sesión. Revisá tu conexión.';
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, fbUser => {
      setUser(fbUser ? firebaseUserToUser(fbUser) : null);
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      const code = (e as { code?: string }).code ?? '';
      throw new Error(getAuthErrorMessage(code));
    }
  };

  const logout = () => signOut(auth);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };
}
