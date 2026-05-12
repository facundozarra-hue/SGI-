import { FileText, AlertCircle, ClipboardList, Recycle, Trash2, AlertTriangle, Ambulance, TrendingUp, ShieldCheck, Leaf, HardHat } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatsCard from '../components/ui/StatsCard';
import StatusBadge from '../components/ui/StatusBadge';

const stats = [
  { title: 'Documentos', value: 24, icon: <FileText size={22} />, color: 'indigo' as const, subtitle: '3 pendientes de revisión' },
  { title: 'No Conformidades', value: 8, icon: <AlertCircle size={22} />, color: 'red' as const, subtitle: '2 abiertas críticas' },
  { title: 'Auditorías', value: 5, icon: <ClipboardList size={22} />, color: 'blue' as const, subtitle: '1 en curso' },
  { title: 'Aspectos Ambientales', value: 15, icon: <Recycle size={22} />, color: 'green' as const, subtitle: '4 significativos' },
  { title: 'Residuos Gestionados', value: 32, icon: <Trash2 size={22} />, color: 'yellow' as const, subtitle: 'Este mes' },
  { title: 'Riesgos Identificados', value: 41, icon: <AlertTriangle size={22} />, color: 'purple' as const, subtitle: '7 nivel alto/crítico' },
];

const recentActivity = [
  { id: 1, type: 'nc', codigo: 'NC-2024-012', descripcion: 'Fallo en proceso de soldadura', estado: 'ABIERTA', fecha: '2024-01-15', modulo: 'Calidad' },
  { id: 2, type: 'doc', codigo: 'DOC-PRC-045', descripcion: 'Procedimiento de gestión de residuos', estado: 'APROBADO', fecha: '2024-01-14', modulo: 'Medio Ambiente' },
  { id: 3, type: 'audit', codigo: 'AUD-2024-003', descripcion: 'Auditoría interna ISO 9001 Q1', estado: 'EN_CURSO', fecha: '2024-01-13', modulo: 'Calidad' },
  { id: 4, type: 'riesgo', codigo: 'RSG-2024-018', descripcion: 'Trabajo en altura sector B', estado: 'EN_TRATAMIENTO', fecha: '2024-01-12', modulo: 'Seguridad' },
  { id: 5, type: 'accidente', codigo: 'ACC-2024-002', descripcion: 'Caída al mismo nivel en almacén', estado: 'CERRADA', fecha: '2024-01-10', modulo: 'Seguridad' },
];

const modules = [
  {
    title: 'Calidad',
    description: 'ISO 9001',
    icon: <ShieldCheck size={24} />,
    color: 'bg-indigo-600',
    links: [
      { label: 'Documentos', href: '/calidad/documentos' },
      { label: 'No Conformidades', href: '/calidad/no-conformidades' },
      { label: 'Auditorías', href: '/calidad/auditorias' },
    ],
  },
  {
    title: 'Medio Ambiente',
    description: 'ISO 14001',
    icon: <Leaf size={24} />,
    color: 'bg-green-600',
    links: [
      { label: 'Aspectos Ambientales', href: '/medioambiente/aspectos' },
      { label: 'Residuos', href: '/medioambiente/residuos' },
    ],
  },
  {
    title: 'Seguridad y Salud',
    description: 'ISO 45001',
    icon: <HardHat size={24} />,
    color: 'bg-amber-600',
    links: [
      { label: 'Evaluación de Riesgos', href: '/seguridad/riesgos' },
      { label: 'Accidentes', href: '/seguridad/accidentes' },
    ],
  },
];

const typeIcons: Record<string, React.ReactNode> = {
  nc: <AlertCircle size={14} className="text-red-500" />,
  doc: <FileText size={14} className="text-indigo-500" />,
  audit: <ClipboardList size={14} className="text-blue-500" />,
  riesgo: <AlertTriangle size={14} className="text-amber-500" />,
  accidente: <Ambulance size={14} className="text-rose-500" />,
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">Resumen general del Sistema de Gestión Integrado</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => (
          <StatsCard key={s.title} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {modules.map((mod) => (
          <div key={mod.title} className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className={`${mod.color} text-white p-2.5 rounded-xl`}>
                {mod.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{mod.title}</h3>
                <p className="text-xs text-gray-500">{mod.description}</p>
              </div>
            </div>
            <div className="space-y-1.5">
              {mod.links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <span className="text-sm text-gray-700 group-hover:text-indigo-600">{link.label}</span>
                  <TrendingUp size={14} className="text-gray-300 group-hover:text-indigo-400" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Actividad reciente</h2>
        <div className="divide-y divide-gray-100">
          {recentActivity.map((item) => (
            <div key={item.id} className="flex items-center gap-4 py-3">
              <div className="flex-shrink-0">
                {typeIcons[item.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.descripcion}</p>
                <p className="text-xs text-gray-500">{item.codigo} · {item.modulo} · {item.fecha}</p>
              </div>
              <StatusBadge status={item.estado} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
