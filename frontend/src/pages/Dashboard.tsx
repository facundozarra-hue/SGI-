import { Link } from 'react-router-dom';
import {
  FileText, AlertCircle, ClipboardList, Recycle, Trash2,
  AlertTriangle, Siren, ShieldCheck, Leaf, HardHat,
  ArrowRight, Bell, Calendar,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useData } from '../context/DataContext';
import StatsCard from '../components/ui/StatsCard';

const COLORES_ESTADO = {
  Aprobado: '#22c55e',
  Borrador: '#94a3b8',
  'En revisión': '#f59e0b',
  Obsoleto: '#ef4444',
};

const COLORES_NC = {
  Abierta: '#ef4444',
  'En proceso': '#3b82f6',
  Cerrada: '#22c55e',
};

const COLORES_RIESGO = {
  Bajo: '#22c55e',
  Medio: '#f59e0b',
  Alto: '#f97316',
  Crítico: '#ef4444',
};

function diasDesde(fecha: string) {
  return Math.floor((Date.now() - new Date(fecha).getTime()) / 86400000);
}

function diasHasta(fecha: string) {
  return Math.floor((new Date(fecha).getTime() - Date.now()) / 86400000);
}

export default function Dashboard() {
  const { documentos, noConformidades, auditorias, aspectos, residuos, riesgos, accidentes, empresa } = useData();

  const ncsAbiertas = noConformidades.filter(n => n.estado === 'Abierta' || n.estado === 'En proceso').length;
  const riesgosCriticos = riesgos.filter(r => r.nivel === 'Crítico' || r.nivel === 'Alto').length;
  const auditoriasActivas = auditorias.filter(a => a.estado === 'Planificada' || a.estado === 'En curso').length;
  const aspectosSignificativos = aspectos.filter(a => a.significativo).length;

  // Alertas: documentos próximos a vencer (≤30 días) o vencidos
  const docsVencimiento = documentos
    .filter(d => d.fechaRevision && d.estado !== 'Obsoleto')
    .map(d => ({ ...d, dias: diasHasta(d.fechaRevision) }))
    .filter(d => d.dias <= 30)
    .sort((a, b) => a.dias - b.dias)
    .slice(0, 5);

  // NCs abiertas hace más de 30 días
  const ncsVencidas = noConformidades
    .filter(n => n.estado === 'Abierta' && diasDesde(n.fechaDeteccion) > 30)
    .slice(0, 3);

  const totalAlertas = docsVencimiento.length + ncsVencidas.length;

  // Datos para gráficos
  const dataDocs = Object.entries(
    documentos.reduce((acc, d) => ({ ...acc, [d.estado]: (acc[d.estado] ?? 0) + 1 }), {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const dataNC = Object.entries(
    noConformidades.reduce((acc, n) => ({ ...acc, [n.estado]: (acc[n.estado] ?? 0) + 1 }), {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const dataRiesgos = Object.entries(
    riesgos.reduce((acc, r) => ({ ...acc, [r.nivel]: (acc[r.nivel] ?? 0) + 1 }), {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const stats = [
    { title: 'Documentos', value: documentos.length, icon: <FileText size={22} />, color: 'indigo' as const, subtitle: `${documentos.filter(d => d.estado === 'Aprobado').length} aprobados` },
    { title: 'NC abiertas', value: ncsAbiertas, icon: <AlertCircle size={22} />, color: 'red' as const, subtitle: `${noConformidades.length} total registradas` },
    { title: 'Auditorías activas', value: auditoriasActivas, icon: <ClipboardList size={22} />, color: 'blue' as const, subtitle: `${auditorias.length} total` },
    { title: 'Aspectos significativos', value: aspectosSignificativos, icon: <Recycle size={22} />, color: 'green' as const, subtitle: `${aspectos.length} total` },
    { title: 'Residuos registrados', value: residuos.length, icon: <Trash2 size={22} />, color: 'yellow' as const, subtitle: 'Total' },
    { title: 'Riesgos críticos/altos', value: riesgosCriticos, icon: <AlertTriangle size={22} />, color: 'purple' as const, subtitle: `${riesgos.length} total` },
  ];

  const modulos = [
    {
      titulo: 'Calidad', norma: 'ISO 9001', icon: <ShieldCheck size={22} />, color: 'bg-indigo-600',
      links: [
        { label: 'Documentos', href: '/calidad/documentos', count: documentos.length },
        { label: 'No Conformidades', href: '/calidad/no-conformidades', count: noConformidades.length },
        { label: 'Auditorías', href: '/calidad/auditorias', count: auditorias.length },
      ],
    },
    {
      titulo: 'Medio Ambiente', norma: 'ISO 14001', icon: <Leaf size={22} />, color: 'bg-green-600',
      links: [
        { label: 'Aspectos Ambientales', href: '/medioambiente/aspectos', count: aspectos.length },
        { label: 'Residuos', href: '/medioambiente/residuos', count: residuos.length },
      ],
    },
    {
      titulo: 'Seguridad y Salud', norma: 'ISO 45001', icon: <HardHat size={22} />, color: 'bg-amber-600',
      links: [
        { label: 'Evaluación de Riesgos', href: '/seguridad/riesgos', count: riesgos.length },
        { label: 'Accidentes e Incidentes', href: '/seguridad/accidentes', count: accidentes.length },
      ],
    },
  ];

  const hayDatos = (documentos.length + noConformidades.length + riesgos.length) > 0;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
          {empresa.nombre ? `${empresa.nombre}` : 'Panel de Control'}
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">Resumen general del Sistema de Gestión Integrado</p>
      </div>

      {!hayDatos && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 flex items-start gap-4">
          <div className="text-2xl">👋</div>
          <div>
            <p className="font-semibold text-indigo-800">¡Empieza a cargar tus datos!</p>
            <p className="text-indigo-600 text-sm mt-1">
              Usá el menú para acceder a cada módulo y comenzar a registrar documentos, no conformidades, riesgos y más.
              Si no configuraste la empresa aún, andá a{' '}
              <Link to="/configuracion" className="underline font-medium">Configuración</Link>.
            </p>
          </div>
        </div>
      )}

      {/* Alertas */}
      {totalAlertas > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h2 className="font-bold text-amber-800 flex items-center gap-2 mb-3">
            <Bell size={16} /> {totalAlertas} alerta{totalAlertas !== 1 ? 's' : ''} pendiente{totalAlertas !== 1 ? 's' : ''}
          </h2>
          <div className="space-y-2">
            {docsVencimiento.map(d => (
              <Link key={d.id} to="/calidad/documentos"
                className="flex items-center gap-2 text-sm text-amber-700 hover:text-amber-900">
                <Calendar size={14} className="flex-shrink-0" />
                <span className="font-medium">{d.titulo}</span>
                <span className="text-xs">
                  {d.dias < 0 ? `vencido hace ${Math.abs(d.dias)} días` : d.dias === 0 ? 'vence hoy' : `vence en ${d.dias} días`}
                </span>
              </Link>
            ))}
            {ncsVencidas.map(n => (
              <Link key={n.id} to="/calidad/no-conformidades"
                className="flex items-center gap-2 text-sm text-red-700 hover:text-red-900">
                <AlertCircle size={14} className="flex-shrink-0" />
                <span className="font-medium">{n.titulo}</span>
                <span className="text-xs">abierta hace {diasDesde(n.fechaDeteccion)} días</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {stats.map(s => <StatsCard key={s.title} {...s} />)}
      </div>

      {/* Gráficos — solo si hay datos */}
      {hayDatos && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dataDocs.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-gray-800 text-sm mb-3">Documentos por estado</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={dataDocs} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} label={({ value }) => `${value}`}>
                    {dataDocs.map((entry, i) => (
                      <Cell key={i} fill={(COLORES_ESTADO as Record<string, string>)[entry.name] ?? '#94a3b8'} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" iconSize={8} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {dataNC.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-gray-800 text-sm mb-3">No Conformidades por estado</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={dataNC} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" name="Cantidad" radius={[4, 4, 0, 0]}>
                    {dataNC.map((entry, i) => (
                      <Cell key={i} fill={(COLORES_NC as Record<string, string>)[entry.name] ?? '#6366f1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {dataRiesgos.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-gray-800 text-sm mb-3">Riesgos por nivel</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={dataRiesgos} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} label={({ value }) => `${value}`}>
                    {dataRiesgos.map((entry, i) => (
                      <Cell key={i} fill={(COLORES_RIESGO as Record<string, string>)[entry.name] ?? '#94a3b8'} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" iconSize={8} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Módulos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <Siren size={18} className="text-rose-500" /> Últimos accidentes registrados
          </h2>
          <div className="divide-y divide-gray-100">
            {accidentes.slice(0, 5).map(a => (
              <div key={a.id} className="py-2.5 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{a.descripcion}</p>
                  <p className="text-xs text-gray-500">{a.lugar} · {new Date(a.fecha).toLocaleDateString('es-ES')}</p>
                </div>
                <span className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
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
