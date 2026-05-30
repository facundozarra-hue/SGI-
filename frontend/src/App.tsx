import { HashRouter as BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Documentos from './pages/calidad/Documentos';
import NoConformidades from './pages/calidad/NoConformidades';
import Auditorias from './pages/calidad/Auditorias';
import AspectosAmbientales from './pages/medioambiente/AspectosAmbientales';
import Residuos from './pages/medioambiente/Residuos';
import Riesgos from './pages/seguridad/Riesgos';
import Accidentes from './pages/seguridad/Accidentes';

interface AuthContextValue {
  user: ReturnType<typeof useAuth>['user'];
  logout: ReturnType<typeof useAuth>['logout'];
}

export let authContext: AuthContextValue = { user: null, logout: () => {} };

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const auth = useAuth();
  authContext = { user: auth.user, logout: auth.logout };

  if (auth.loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          auth.isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={auth.login} />
        } />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout user={auth.user} onLogout={auth.logout} />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="calidad/documentos" element={<Documentos />} />
          <Route path="calidad/no-conformidades" element={<NoConformidades />} />
          <Route path="calidad/auditorias" element={<Auditorias />} />
          <Route path="medioambiente/aspectos" element={<AspectosAmbientales />} />
          <Route path="medioambiente/residuos" element={<Residuos />} />
          <Route path="seguridad/riesgos" element={<Riesgos />} />
          <Route path="seguridad/accidentes" element={<Accidentes />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
