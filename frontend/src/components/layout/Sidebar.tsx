import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ShieldCheck, Leaf, HardHat,
  FileText, AlertCircle, ClipboardList,
  Recycle, Trash2, AlertTriangle, Ambulance,
  ChevronDown, ChevronRight, Building2,
} from 'lucide-react';

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: { label: string; href: string; icon: React.ReactNode }[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/',
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: 'Calidad',
    icon: <ShieldCheck size={18} />,
    children: [
      { label: 'Documentos', href: '/calidad/documentos', icon: <FileText size={16} /> },
      { label: 'No Conformidades', href: '/calidad/no-conformidades', icon: <AlertCircle size={16} /> },
      { label: 'Auditorías', href: '/calidad/auditorias', icon: <ClipboardList size={16} /> },
    ],
  },
  {
    label: 'Medio Ambiente',
    icon: <Leaf size={18} />,
    children: [
      { label: 'Aspectos Ambientales', href: '/medioambiente/aspectos', icon: <Recycle size={16} /> },
      { label: 'Residuos', href: '/medioambiente/residuos', icon: <Trash2 size={16} /> },
    ],
  },
  {
    label: 'Seguridad y Salud',
    icon: <HardHat size={18} />,
    children: [
      { label: 'Evaluación de Riesgos', href: '/seguridad/riesgos', icon: <AlertTriangle size={16} /> },
      { label: 'Accidentes', href: '/seguridad/accidentes', icon: <Ambulance size={16} /> },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<string[]>(['Calidad', 'Medio Ambiente', 'Seguridad y Salud']);

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const isChildActive = (children: NavItem['children']) =>
    children?.some((c) => location.pathname === c.href) ?? false;

  return (
    <aside className="w-64 bg-gray-900 min-h-screen flex flex-col">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-700">
        <div className="bg-indigo-600 rounded-lg p-1.5">
          <Building2 size={20} className="text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">SGI</p>
          <p className="text-gray-400 text-xs">Sistema de Gestión</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          if (item.href) {
            return (
              <NavLink
                key={item.href}
                to={item.href}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            );
          }

          const isOpen = openGroups.includes(item.label);
          const hasActiveChild = isChildActive(item.children);

          return (
            <div key={item.label}>
              <button
                onClick={() => toggleGroup(item.label)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  hasActiveChild
                    ? 'text-indigo-300 bg-gray-800'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="flex-1 text-left">{item.label}</span>
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              {isOpen && item.children && (
                <div className="ml-4 mt-1 space-y-1 border-l border-gray-700 pl-3">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.href}
                      to={child.href}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                          isActive
                            ? 'bg-indigo-600 text-white font-medium'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`
                      }
                    >
                      {child.icon}
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-gray-700">
        <p className="text-gray-500 text-xs text-center">ISO 9001 · 14001 · 45001</p>
      </div>
    </aside>
  );
}
