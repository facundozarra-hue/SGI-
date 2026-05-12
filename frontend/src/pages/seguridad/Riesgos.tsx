import { useState } from 'react';
import { AlertTriangle, Plus, Search } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import { Riesgo } from '../../types';

const mockRiesgos: Riesgo[] = [
  { id: '1', codigo: 'RSG-001', actividad: 'Trabajo en altura', peligro: 'Caída desde altura', riesgo: 'Traumatismo grave por caída', nivel: 'ALTO', estado: 'EN_TRATAMIENTO', probabilidad: 2, consecuencia: 5, medidas: 'Uso obligatorio de arnés, línea de vida, barandillas', epi: 'Arnés anticaída, casco, calzado de seguridad', createdAt: '2023-06-01', responsable: { nombre: 'Carlos', apellido: 'López' } },
  { id: '2', codigo: 'RSG-002', actividad: 'Manejo de cargas', peligro: 'Sobreesfuerzo muscular', riesgo: 'Lesión músculo-esquelética', nivel: 'MEDIO', estado: 'CONTROLADO', probabilidad: 3, consecuencia: 2, medidas: 'Formación en técnicas de manejo manual, carros ergonómicos', epi: 'Faja lumbar, guantes', createdAt: '2023-06-01', responsable: { nombre: 'María', apellido: 'Rodríguez' } },
  { id: '3', codigo: 'RSG-003', actividad: 'Soldadura', peligro: 'Exposición a humos metálicos', riesgo: 'Enfermedad respiratoria', nivel: 'ALTO', estado: 'EN_TRATAMIENTO', probabilidad: 3, consecuencia: 4, medidas: 'Ventilación localizada, cabinas de soldadura', epi: 'Máscara respiratoria FFP3, pantalla de soldadura', createdAt: '2023-07-15', responsable: { nombre: 'Pedro', apellido: 'Sánchez' } },
  { id: '4', codigo: 'RSG-004', actividad: 'Almacén', peligro: 'Golpe con carretilla elevadora', riesgo: 'Atropello o colisión', nivel: 'CRITICO', estado: 'EN_TRATAMIENTO', probabilidad: 2, consecuencia: 5, medidas: 'Señalización vial, separación peatones/vehículos, velocidad 5km/h', epi: 'Chaleco reflectante, calzado de seguridad', createdAt: '2023-08-01', responsable: { nombre: 'Luis', apellido: 'Martínez' } },
  { id: '5', codigo: 'RSG-005', actividad: 'Oficinas', peligro: 'Trabajo con pantallas', riesgo: 'Fatiga visual y postural', nivel: 'BAJO', estado: 'CONTROLADO', probabilidad: 4, consecuencia: 1, medidas: 'Descansos regulares, revisión ergonómica de puestos', epi: 'Filtros de pantalla', createdAt: '2023-09-10', responsable: { nombre: 'Ana', apellido: 'García' } },
  { id: '6', codigo: 'RSG-006', actividad: 'Mantenimiento eléctrico', peligro: 'Contacto eléctrico', riesgo: 'Electrocución', nivel: 'CRITICO', estado: 'IDENTIFICADO', probabilidad: 1, consecuencia: 5, medidas: 'Bloqueo y etiquetado (LOTO), formación especializada', epi: 'Guantes dieléctricos, calzado aislante, ropa ignífuga', createdAt: '2023-10-20', responsable: { nombre: 'Carlos', apellido: 'López' } },
];

const nivelOrder: Record<string, number> = { CRITICO: 0, ALTO: 1, MEDIO: 2, BAJO: 3 };

export default function Riesgos() {
  const [search, setSearch] = useState('');
  const [nivelFilter, setNivelFilter] = useState('Todos');
  const [estadoFilter, setEstadoFilter] = useState('Todos');

  const filtered = mockRiesgos
    .filter((r) => {
      const matchSearch = r.peligro.toLowerCase().includes(search.toLowerCase()) || r.actividad.toLowerCase().includes(search.toLowerCase()) || r.codigo.toLowerCase().includes(search.toLowerCase());
      const matchNivel = nivelFilter === 'Todos' || r.nivel === nivelFilter;
      const matchEst = estadoFilter === 'Todos' || r.estado === estadoFilter;
      return matchSearch && matchNivel && matchEst;
    })
    .sort((a, b) => nivelOrder[a.nivel] - nivelOrder[b.nivel]);

  const counts = {
    CRITICO: mockRiesgos.filter((r) => r.nivel === 'CRITICO').length,
    ALTO: mockRiesgos.filter((r) => r.nivel === 'ALTO').length,
    MEDIO: mockRiesgos.filter((r) => r.nivel === 'MEDIO').length,
    BAJO: mockRiesgos.filter((r) => r.nivel === 'BAJO').length,
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle size={24} className="text-amber-500" />
            Evaluación de Riesgos
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Identificación y control de riesgos laborales · ISO 45001</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Nuevo riesgo
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Críticos', count: counts.CRITICO, color: 'bg-red-50 border-red-300 text-red-700' },
          { label: 'Altos', count: counts.ALTO, color: 'bg-orange-50 border-orange-300 text-orange-700' },
          { label: 'Medios', count: counts.MEDIO, color: 'bg-yellow-50 border-yellow-300 text-yellow-700' },
          { label: 'Bajos', count: counts.BAJO, color: 'bg-green-50 border-green-300 text-green-700' },
        ].map((item) => (
          <div key={item.label} className={`rounded-xl p-4 border ${item.color}`}>
            <p className="text-3xl font-bold">{item.count}</p>
            <p className="text-sm font-medium mt-1 opacity-80">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar riesgos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9"
            />
          </div>
          <select value={nivelFilter} onChange={(e) => setNivelFilter(e.target.value)} className="input w-auto">
            {['Todos', 'CRITICO', 'ALTO', 'MEDIO', 'BAJO'].map((n) => (
              <option key={n} value={n}>{n === 'Todos' ? 'Todos los niveles' : n}</option>
            ))}
          </select>
          <select value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)} className="input w-auto">
            {['Todos', 'IDENTIFICADO', 'EN_TRATAMIENTO', 'CONTROLADO', 'CERRADO'].map((e) => (
              <option key={e} value={e}>{e === 'Todos' ? 'Todos los estados' : e.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-y border-gray-200">
              <tr>
                <th className="table-header">Código</th>
                <th className="table-header">Actividad</th>
                <th className="table-header">Peligro / Riesgo</th>
                <th className="table-header text-center">P×C</th>
                <th className="table-header">Nivel</th>
                <th className="table-header">Estado</th>
                <th className="table-header">EPIs</th>
                <th className="table-header">Responsable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="table-cell font-mono text-xs font-medium text-amber-700">{r.codigo}</td>
                  <td className="table-cell font-medium text-gray-800">{r.actividad}</td>
                  <td className="table-cell">
                    <p className="font-medium text-gray-900 text-sm">{r.peligro}</p>
                    <p className="text-xs text-gray-500">{r.riesgo}</p>
                  </td>
                  <td className="table-cell text-center">
                    <span className="font-bold text-gray-700">{r.probabilidad * r.consecuencia}</span>
                    <span className="text-xs text-gray-400 ml-1">({r.probabilidad}×{r.consecuencia})</span>
                  </td>
                  <td className="table-cell"><StatusBadge status={r.nivel} /></td>
                  <td className="table-cell"><StatusBadge status={r.estado} /></td>
                  <td className="table-cell text-gray-500 text-xs max-w-[150px] truncate">{r.epi ?? '—'}</td>
                  <td className="table-cell text-gray-600 text-sm">{r.responsable?.nombre} {r.responsable?.apellido}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">No se encontraron riesgos</div>
          )}
        </div>
      </div>
    </div>
  );
}
