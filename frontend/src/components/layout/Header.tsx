import { useState } from 'react';
import { Bell, ChevronDown, LogOut, User as UserIcon } from 'lucide-react';
import { User } from '../../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div />
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {user?.nombre?.[0]}{user?.apellido?.[0]}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-800">
                {user?.nombre} {user?.apellido}
              </p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <button
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <UserIcon size={14} />
                Mi perfil
              </button>
              <button
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                onClick={onLogout}
              >
                <LogOut size={14} />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
