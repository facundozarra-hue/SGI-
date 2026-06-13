import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { useAuth } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Configuracion from './pages/Configuracion';
import Documentos from './pages/calidad/Documentos';
import NoConformidades from './pages/calidad/NoConformidades';
import Auditorias from './pages/calidad/Auditorias';
import AspectosAmbientales from './pages/medioambiente/AspectosAmbientales';
import Residuos from './pages/medioambiente/Residuos';
import Riesgos from './pages/seguridad/Riesgos';
import Accidentes from './pages/seguridad/Accidentes';

function AppRoutes() {
  const auth = useAuth();

  if (auth.loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
    </div>
  );

  if (!auth.isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<Login onLogin={auth.login} />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout user={auth.user} onLogout={auth.logout} />}>
        <Route index element={<Dashboard />} />
        <Route path="configuracion" element={<Configuracion />} />
        <Route path="calidad/documentos" element={<Documentos />} />
        <Route path="calidad/no-conformidades" element={<NoConformidades />} />
        <Route path="calidad/auditorias" element={<Auditorias />} />
        <Route path="medioambiente/aspectos" element={<AspectosAmbientales />} />
        <Route path="medioambiente/residuos" element={<Residuos />} />
        <Route path="seguridad/riesgos" element={<Riesgos />} />
        <Route path="seguridad/accidentes" element={<Accidentes />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <DataProvider>
      <Router>
        <AppRoutes />
      </Router>
    </DataProvider>
  );
}
