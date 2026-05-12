import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { User } from '../../types';

interface LayoutProps {
  user: User | null;
  onLogout: () => void;
}

export default function Layout({ user, onLogout }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header user={user} onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
