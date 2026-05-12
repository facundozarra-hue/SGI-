import { useState } from 'react';
import { AlertCircle, Plus, Search } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import { NoConformidad } from '../../types';

const mockNC: NoConformidad[] = [
  { id: '1', codigo: 'NC-2024-001', titulo: 'Producto no conforme en línea A', descripcion: 'Se detectaron defectos dimensionales en lote #4521', origen: 'Inspección de producción', estado: 'CERRADA', prioridad: 'ALTA', accionCorrectiva: 'Revisión de parámetros de máquina CNC', fechaDeteccion: '2024-01-03', fechaCierre: '2024-01-20', createdAt: '2024-01-03', responsable: { nombre: 'Carlos', apellido: 'López' } },
  { id: '2', codigo: 'NC-2024-002', titulo: 'Incumplimiento de tiempo de entrega', descripcion: 'Retraso de 5 días en entrega a cliente XYZ', origen: 'Reclamación de cliente', estado: 'EN_PROCESO', prioridad: 'MEDIA', fechaDeteccion: '2024-01-08', createdAt: '2024-01-08', responsable: { nombre: 'María', apellido: 'Rodríguez' } },
  { id: '3', codigo: 'NC-2024-003', titulo: 'Calibración de equipo vencida', descripcion: 'Vernier #VRN-045 sin calibración vigente', origen: 'Auditoría interna', estado: 'ABIERTA', prioridad: 'ALTA', fechaDeteccion: '2024-01-12', createdAt: '2024-01-12', responsable: { nombre: 'Pedro', apellido: 'Sánchez' } },
  { id: '4', codigo: 'NC-2024-004', titulo: 'Documentación de proceso desactualizada', descripcion: 'PRC-PRD-007 sin actualizar desde hace 3 años', origen: 'Revisión documental', estado: 'ABIERTA', prioridad: 'BAJA', fechaDeteccion: '2024-01-15', createdAt: '2024-01-15', responsable: { nombre: 'Ana', apellido: 'García' } },
  { id: '5', codigo: 'NC-2024-005', titulo: 'Fallo en trazabilidad de materiales', descripcion: 'Lote de materia prima sin identificación correcta', origen: 'Inspección de recepción', estado: 'EN_PROCESO', prioridad: 'ALTA', fechaDeteccion: '2024-01-18', createdAt: '2024-01-18', responsable: { nombre: 'Luis', apellido: 'Martínez' } },
  { id: '6', codigo: 'NC-2024-006', titulo: 'Incidencia en soldadura sector B', descripcion: 'Fisuras detectadas en cordones de soldadura', origen: 'Control de calidad', estado: 'ABIERTA', prioridad: 'ALTA', fechaDeteccion: '2024-01-20', createdAt: '2024-01-20', responsable: { nombre: 'Carlos', apellido: 'López' } },
];

const prioridadColor: Record<string, string> = {
  BAJA: 'text-gray-500 bg-gray-100',
  MEDIA: 'text-yellow-700 bg-yellow-100',
  ALTA: 'text-orange-700 bg-orange-100',
  CRITICA: 'text-red-700 bg-red-100',
};

export default function NoConformidades() {
  const [search, setSearch] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('Todos');

  const filtered = mockNC.filter((nc) => {
    const matchSearch = nc.titulo.toLowerCase().includes(search.toLowerCase()) || nc.codigo.toLowerCase().includes(search.toLowerCase());
    const matchEst = estadoFilter === 'Todos' || nc.estado === estadoFilter;
    return matchSearch && matchEst;
  });

  const counts = {
    ABIERTA: mockNC.filter((n) => n.estado === 'ABIERTA').length,
    EN_PROCESO: mockNC.filter((n) => n.estado === 'EN_PROCESO').length,
    CERRADA: mockNC.filter((n) => n.estado === 'CERRADA').length,
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <AlertCircle size={24} className="text-red-500" />
            No Conformidades
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Gestión de no conformidades y acciones correctivas</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Nueva NC
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Abiertas', count: counts.ABIERTA, color: 'bg-red-50 border-red-200 text-red-700' },
          { label: 'En proceso', count: counts.EN_PROCESO, color: 'bg-blue-50 border-blue-200 text-blue-700' },
          { label: 'Cerradas', count: counts.CERRADA, color: 'bg-green-50 border-green-200 text-green-700' },
        ].map((item) => (
          <div key={item.label} className={`rounded-xl p-4 border ${item.color}`}>
            <p className="text-3xl font-bold">{item.count}</p>
            <p className="text-sm font-medium mt-1 opacity-80">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar no conformidades..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9"
            />
          </div>
          <select value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)} className="input w-auto">
            {['Todos', 'ABIERTA', 'EN_PROCESO', 'CERRADA', 'CANCELADA'].map((e) => (
              <option key={e} value={e}>{e === 'Todos' ? 'Todos los estados' : e.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-y border-gray-200">
              <tr>
                <th className="table-header">Código</th>
                <th className="table-header">Título</th>
                <th className="table-header">Origen</th>
                <th className="table-header">Prioridad</th>
                <th className="table-header">Estado</th>
                <th className="table-header">Detección</th>
                <th className="table-header">Responsable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((nc) => (
                <tr key={nc.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="table-cell font-mono text-xs font-medium text-red-700">{nc.codigo}</td>
                  <td className="table-cell">
                    <p className="font-medium text-gray-900">{nc.titulo}</p>
                    <p className="text-xs text-gray-500 truncate max-w-xs">{nc.descripcion}</p>
                  </td>
                  <td className="table-cell text-gray-500 text-xs">{nc.origen}</td>
                  <td className="table-cell">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${prioridadColor[nc.prioridad]}`}>
                      {nc.prioridad}
                    </span>
                  </td>
                  <td className="table-cell"><StatusBadge status={nc.estado} /></td>
                  <td className="table-cell text-gray-500">{new Date(nc.fechaDeteccion).toLocaleDateString('es-ES')}</td>
                  <td className="table-cell text-gray-600">{nc.responsable?.nombre} {nc.responsable?.apellido}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">No se encontraron no conformidades</div>
          )}
        </div>
      </div>
    </div>
  );
}
