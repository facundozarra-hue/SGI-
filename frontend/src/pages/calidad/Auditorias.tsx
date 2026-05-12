import { useState } from 'react';
import { ClipboardList, Plus, Search, Calendar } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import { Auditoria } from '../../types';

const mockAuditorias: Auditoria[] = [
  { id: '1', codigo: 'AUD-2024-001', titulo: 'Auditoría Interna ISO 9001 Q1', tipo: 'INTERNA', estado: 'COMPLETADA', modulo: 'Calidad', auditor: 'Ana García', fechaInicio: '2024-01-10', fechaFin: '2024-01-12', alcance: 'Procesos de producción y control de calidad', hallazgos: '3 no conformidades menores, 2 observaciones', conclusiones: 'Sistema de gestión conforme con requisitos ISO 9001', createdAt: '2024-01-10', responsable: { nombre: 'Ana', apellido: 'García' } },
  { id: '2', codigo: 'AUD-2024-002', titulo: 'Auditoría Ambiental ISO 14001', tipo: 'INTERNA', estado: 'EN_CURSO', modulo: 'Medio Ambiente', auditor: 'Luis Martínez', fechaInicio: '2024-01-20', fechaFin: '2024-01-22', alcance: 'Gestión de residuos y aspectos ambientales', createdAt: '2024-01-18', responsable: { nombre: 'Luis', apellido: 'Martínez' } },
  { id: '3', codigo: 'AUD-2024-003', titulo: 'Auditoría Externa Bureau Veritas', tipo: 'EXTERNA', estado: 'PLANIFICADA', modulo: 'Calidad', auditor: 'Equipo Bureau Veritas', fechaInicio: '2024-02-15', fechaFin: '2024-02-16', alcance: 'Certificación ISO 9001:2015 - Renovación', createdAt: '2024-01-15', responsable: { nombre: 'Ana', apellido: 'García' } },
  { id: '4', codigo: 'AUD-2023-012', titulo: 'Auditoría de Seguimiento SST', tipo: 'SEGUIMIENTO', estado: 'COMPLETADA', modulo: 'Seguridad', auditor: 'Carlos López', fechaInicio: '2023-11-05', fechaFin: '2023-11-06', alcance: 'Verificación de acciones correctivas ISO 45001', hallazgos: 'Todas las acciones correctivas implementadas', conclusiones: 'Sistema SST mejorando continuamente', createdAt: '2023-11-05', responsable: { nombre: 'Carlos', apellido: 'López' } },
  { id: '5', codigo: 'AUD-2024-004', titulo: 'Auditoría Integrada SGI', tipo: 'INTERNA', estado: 'PLANIFICADA', modulo: 'Calidad', auditor: 'María Rodríguez', fechaInicio: '2024-03-10', fechaFin: '2024-03-14', alcance: 'Todos los módulos del SGI', createdAt: '2024-01-20', responsable: { nombre: 'María', apellido: 'Rodríguez' } },
];

export default function Auditorias() {
  const [search, setSearch] = useState('');
  const [tipoFilter, setTipoFilter] = useState('Todos');
  const [estadoFilter, setEstadoFilter] = useState('Todos');

  const filtered = mockAuditorias.filter((a) => {
    const matchSearch = a.titulo.toLowerCase().includes(search.toLowerCase()) || a.codigo.toLowerCase().includes(search.toLowerCase());
    const matchTipo = tipoFilter === 'Todos' || a.tipo === tipoFilter;
    const matchEst = estadoFilter === 'Todos' || a.estado === estadoFilter;
    return matchSearch && matchTipo && matchEst;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ClipboardList size={24} className="text-blue-600" />
            Auditorías
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Planificación y seguimiento de auditorías</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Nueva auditoría
        </button>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar auditorías..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9"
            />
          </div>
          <select value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value)} className="input w-auto">
            {['Todos', 'INTERNA', 'EXTERNA', 'SEGUIMIENTO'].map((t) => (
              <option key={t}>{t === 'Todos' ? 'Todos los tipos' : t}</option>
            ))}
          </select>
          <select value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)} className="input w-auto">
            {['Todos', 'PLANIFICADA', 'EN_CURSO', 'COMPLETADA', 'CANCELADA'].map((e) => (
              <option key={e}>{e === 'Todos' ? 'Todos los estados' : e.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          {filtered.map((aud) => (
            <div key={aud.id} className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-blue-700 font-semibold">{aud.codigo}</span>
                    <StatusBadge status={aud.tipo} />
                    <StatusBadge status={aud.estado} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mt-1">{aud.titulo}</h3>
                  {aud.alcance && <p className="text-sm text-gray-500 mt-0.5 truncate">{aud.alcance}</p>}
                </div>
                <div className="text-right text-sm text-gray-500 flex-shrink-0">
                  <div className="flex items-center gap-1 justify-end">
                    <Calendar size={13} />
                    <span>{new Date(aud.fechaInicio).toLocaleDateString('es-ES')} — {new Date(aud.fechaFin).toLocaleDateString('es-ES')}</span>
                  </div>
                  <p className="mt-1 text-xs">Auditor: <span className="font-medium text-gray-700">{aud.auditor}</span></p>
                </div>
              </div>
              {aud.hallazgos && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500"><span className="font-medium">Hallazgos:</span> {aud.hallazgos}</p>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">No se encontraron auditorías</div>
          )}
        </div>
      </div>
    </div>
  );
}
