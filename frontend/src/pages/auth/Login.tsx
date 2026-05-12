import { useState, FormEvent } from 'react';
import { Building2, Lock, Mail, AlertCircle } from 'lucide-react';
import { authService } from '../../services/api';
import { User } from '../../types';

interface LoginProps {
  onLogin: (token: string, user: User) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('admin@empresa.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      onLogin(res.data.token, res.data.user);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4 backdrop-blur">
            <Building2 size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">SGI</h1>
          <p className="text-indigo-200 mt-1">Sistema de Gestión Integrado</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Iniciar sesión</h2>

          {error && (
            <div className="mb-4 flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-9"
                  placeholder="tu@empresa.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-9"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-semibold text-gray-500 mb-2">Credenciales de demo:</p>
            <p className="text-xs text-gray-600">Email: <span className="font-mono">admin@empresa.com</span></p>
            <p className="text-xs text-gray-600">Contraseña: <span className="font-mono">admin123</span></p>
          </div>
        </div>

        <p className="text-center text-indigo-300 text-xs mt-6">
          ISO 9001 · ISO 14001 · ISO 45001
        </p>
      </div>
    </div>
  );
}
