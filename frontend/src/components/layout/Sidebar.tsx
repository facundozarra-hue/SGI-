import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ShieldCheck, Leaf, HardHat,
  FileText, AlertCircle, ClipboardList,
  Recycle, Trash2, AlertTriangle, Siren,
  ChevronDown, ChevronRight, Building2, Settings,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

interface NavChild { label: string; href: string; icon: React.ReactNode; count?: number; }
interface NavGroup { label: string; icon: React.ReactNode; children: NavChild[]; }
interface NavSingle { label: string; href: string; icon: React.ReactNode; }
type NavItem = NavSingle | NavGroup;

function isGroup(item: NavItem): item is NavGroup { return 'children' in item; }

export default function Sidebar() {
  const location = useLocation();
  const { documentos, noConformidades, auditorias, aspectos, residuos, riesgos, accidentes, empresa } = useData();
  const [open, setOpen] = useState<string[]>(['Calidad', 'Medio Ambiente', 'Seguridad y Salud']);

  const toggle = (label: string) =>
    setOpen(prev => prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]);

  const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/', icon: <LayoutDashboard size={18} /> },
    {
      label: 'Calidad', icon: <ShieldCheck size={18} />,
      children: [
        { label: 'Documentos', href: '/calidad/documentos', icon: <FileText size={15} />, count: documentos.length },
        { label: 'No Conformidades', href: '/calidad/no-conformidades', icon: <AlertCircle size={15} />, count: noConformidades.length },
        { label: 'Auditorías', href: '/calidad/auditorias', icon: <ClipboardList size={15} />, count: auditorias.length },
      ],
    },
    {
      label: 'Medio Ambiente', icon: <Leaf size={18} />,
      children: [
        { label: 'Aspectos Ambientales', href: '/medioambiente/aspectos', icon: <Recycle size={15} />, count: aspectos.length },
        { label: 'Residuos', href: '/medioambiente/residuos', icon: <Trash2 size={15} />, count: residuos.length },
      ],
    },
    {
      label: 'Seguridad y Salud', icon: <HardHat size={18} />,
      children: [
        { label: 'Riesgos', href: '/seguridad/riesgos', icon: <AlertTriangle size={15} />, count: riesgos.length },
        { label: 'Accidentes', href: '/seguridad/accidentes', icon: <Siren size={15} />, count: accidentes.length },
      ],
    },
    { label: 'Configuración', href: '/configuracion', icon: <Settings size={18} /> },
  ];

  return (
    <aside className="w-60 bg-gray-900 min-h-screen flex flex-col flex-shrink-0">
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-gray-700">
        <div className="bg-indigo-600 rounded-lg p-1.5 flex-shrink-0">
          <Building2 size={18} className="text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-white font-bold text-sm truncate leading-tight">
            {empresa.nombre || 'SGI'}
          </p>
          <p className="text-gray-400 text-xs">Sistema de Gestión</p>
        </div>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(item => {
          if (!isGroup(item)) {
            return (
              <NavLink key={item.href} to={item.href} end={item.href === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`
                }>
                {item.icon}{item.label}
              </NavLink>
            );
          }
          const isOpen = open.includes(item.label);
          const hasActive = item.children.some(c => location.pathname === c.href);
          return (
            <div key={item.label}>
              <button onClick={() => toggle(item.label)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${hasActive ? 'text-indigo-300' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
                {item.icon}
                <span className="flex-1 text-left">{item.label}</span>
                {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              </button>
              {isOpen && (
                <div className="ml-3 mt-0.5 pl-3 border-l border-gray-700 space-y-0.5">
                  {item.children.map(child => (
                    <NavLink key={child.href} to={child.href}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-indigo-600 text-white font-medium' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`
                      }>
                      {child.icon}
                      <span className="flex-1">{child.label}</span>
                      {(child.count ?? 0) > 0 && (
                        <span className="text-xs bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded-full">{child.count}</span>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-gray-700">
        <p className="text-gray-600 text-xs text-center">ISO 9001 · 14001 · 45001</p>
      </div>
    </aside>
  );
}
