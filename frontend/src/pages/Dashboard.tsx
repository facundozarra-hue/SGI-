import { Link } from 'react-router-dom';
import { FileText, AlertCircle, ClipboardList, Recycle, Trash2, AlertTriangle, Siren, ShieldCheck, Leaf, HardHat, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import StatsCard from '../components/ui/StatsCard';

export default function Dashboard() {
  const { documentos, noConformidades, auditorias, aspectos, residuos, riesgos, accidentes, empresa } = useData();

  const ncsAbiertas = noConformidades.filter(n => n.estado === 'Abierta' || n.estado === 'En proceso').length;
  const riesgosCriticos = riesgos.filter(r => r.nivel === 'Crítico' || r.nivel === 'Alto').length;
  const auditoriasActivas = auditorias.filter(a => a.estado === 'Planificada' || a.estado === 'En curso').length;
  const aspectosSignificativos = aspectos.filter(a => a.significativo).length;

  const stats = [
    { title: 'Documentos', value: documentos.length, icon: <FileText size={22} />, color: 'indigo' as const, subtitle: `${documentos.filter(d => d.estado === 'Aprobado').length} aprobados` },
    { title: 'No Conformidades abiertas', value: ncsAbiertas, icon: <AlertCircle size={22} />, color: 'red' as const, subtitle: `${noConformidades.length} total registradas` },
    { title: 'Auditorías activas', value: auditoriasActivas, icon: <ClipboardList size={22} />, color: 'blue' as const, subtitle: `${auditorias.length} total registradas` },
    { title: 'Aspectos significativos', value: aspectosSignificativos, icon: <Recycle size={22} />, color: 'green' as const, subtitle: `${aspectos.length} total identificados` },
    { title: 'Residuos registrados', value: residuos.length, icon: <Trash2 size={22} />, color: 'yellow' as const, subtitle: 'Este período' },
    { title: 'Riesgos críticos/altos', value: riesgosCriticos, icon: <AlertTriangle size={22} />, color: 'purple' as const, subtitle: `${riesgos.length} total identificados` },
  ];

  const modulos = [
    {
      titulo: 'Calidad',
      norma: 'ISO 9001',
      icon: <ShieldCheck size={22} />,
      color: 'bg-indigo-600',
      links: [
        { label: 'Documentos', href: '/calidad/documentos', count: documentos.length },
        { label: 'No Conformidades', href: '/calidad/no-conformidades', count: noConformidades.length },
        { label: 'Auditorías', href: '/calidad/auditorias', count: auditorias.length },
      ],
    },
    {
      titulo: 'Medio Ambiente',
      norma: 'ISO 14001',
      icon: <Leaf size={22} />,
      color: 'bg-green-600',
      links: [
        { label: 'Aspectos Ambientales', href: '/medioambiente/aspectos', count: aspectos.length },
        { label: 'Residuos', href: '/medioambiente/residuos', count: residuos.length },
      ],
    },
    {
      titulo: 'Seguridad y Salud',
      norma: 'ISO 45001',
      icon: <HardHat size={22} />,
      color: 'bg-amber-600',
      links: [
        { label: 'Evaluación de Riesgos', href: '/seguridad/riesgos', count: riesgos.length },
        { label: 'Accidentes e Incidentes', href: '/seguridad/accidentes', count: accidentes.length },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {empresa.nombre ? `Bienvenido, ${empresa.nombre}` : 'Panel de Control'}
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">Resumen general del Sistema de Gestión Integrado</p>
      </div>

      {(documentos.length + noConformidades.length + riesgos.length) === 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 flex items-start gap-4">
          <div className="text-2xl">👋</div>
          <div>
            <p className="font-semibold text-indigo-800">¡Empieza a cargar tus datos!</p>
            <p className="text-indigo-600 text-sm mt-1">
              Usa el menú de la izquierda para acceder a cada módulo y comenzar a registrar tus documentos, no conformidades, riesgos y más.
              Si aún no configuraste la empresa, ve a{' '}
              <Link to="/configuracion" className="underline font-medium">Configuración</Link>.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(s => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {modulos.map(mod => (
          <div key={mod.titulo} className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className={`${mod.color} text-white p-2.5 rounded-xl`}>{mod.icon}</div>
              <div>
                <h3 className="font-bold text-gray-900">{mod.titulo}</h3>
                <p className="text-xs text-gray-500">{mod.norma}</p>
              </div>
            </div>
            <div className="space-y-1">
              {mod.links.map(link => (
                <Link key={link.href} to={link.href}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 transition-colors group">
                  <span className="text-sm text-gray-700 group-hover:text-indigo-600">{link.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{link.count}</span>
                    <ArrowRight size={14} className="text-gray-300 group-hover:text-indigo-400" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {accidentes.length > 0 && (
        <div className="card">
          <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Siren size={18} className="text-rose-500" />
            Últimos accidentes registrados
          </h2>
          <div className="divide-y divide-gray-100">
            {accidentes.slice(0, 5).map(a => (
              <div key={a.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{a.descripcion}</p>
                  <p className="text-xs text-gray-500">{a.lugar} · {new Date(a.fecha).toLocaleDateString('es-ES')}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  a.gravedad === 'Mortal' ? 'bg-red-900 text-red-100' :
                  a.gravedad === 'Muy grave' ? 'bg-red-100 text-red-700' :
                  a.gravedad === 'Grave' ? 'bg-orange-100 text-orange-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>{a.gravedad}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
