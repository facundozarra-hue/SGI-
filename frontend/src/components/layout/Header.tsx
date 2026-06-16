import { useState } from 'react';
import { ChevronDown, LogOut, Settings, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { User } from '../../types';
import { useData } from '../../context/DataContext';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onToggleSidebar: () => void;
}

export default function Header({ user, onLogout, onToggleSidebar }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const { empresa } = useData();

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
        {empresa.nombre && (
          <span className="hidden sm:block text-sm font-semibold text-gray-700 truncate max-w-[200px]">
            {empresa.nombre}
          </span>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {user?.nombre?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-medium text-gray-800 leading-tight">{user?.nombre} {user?.apellido}</p>
            <p className="text-xs text-gray-400">{user?.role === 'ADMIN' ? 'Administrador' : 'Usuario'}</p>
          </div>
          <ChevronDown size={14} className="text-gray-400" />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
            <Link
              to="/configuracion"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings size={14} /> Configuración
            </Link>
            <div className="border-t border-gray-100 my-1" />
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={14} /> Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
