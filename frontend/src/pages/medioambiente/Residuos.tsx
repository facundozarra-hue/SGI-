import { useState } from 'react';
import { Trash2, Plus, Search } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import { Residuo } from '../../types';

const mockResiduos: Residuo[] = [
  { id: '1', codigo: 'RSD-2024-001', nombre: 'Aceite hidráulico usado', tipo: 'PELIGROSO', cantidad: 120, unidad: 'litros', gestor: 'Gestora Ambiental Norte S.L.', destino: 'Reciclaje energético', fecha: '2024-01-05', observaciones: 'Certificado de destrucción emitido', createdAt: '2024-01-05' },
  { id: '2', codigo: 'RSD-2024-002', nombre: 'Cartón y papel de oficina', tipo: 'RECICLABLE', cantidad: 85, unidad: 'kg', gestor: 'RecyPaper S.A.', destino: 'Reciclaje material', fecha: '2024-01-08', createdAt: '2024-01-08' },
  { id: '3', codigo: 'RSD-2024-003', nombre: 'Residuos de comedor', tipo: 'ORGANICO', cantidad: 210, unidad: 'kg', gestor: 'BioGest Municipal', destino: 'Compostaje', fecha: '2024-01-10', createdAt: '2024-01-10' },
  { id: '4', codigo: 'RSD-2024-004', nombre: 'Envases plásticos contaminados', tipo: 'PELIGROSO', cantidad: 45, unidad: 'kg', gestor: 'Gestora Ambiental Norte S.L.', destino: 'Incineración controlada', fecha: '2024-01-12', observaciones: 'Código LER 150110*', createdAt: '2024-01-12' },
  { id: '5', codigo: 'RSD-2024-005', nombre: 'Chatarra metálica', tipo: 'RECICLABLE', cantidad: 650, unidad: 'kg', gestor: 'Recuperaciones García', destino: 'Fundición y reciclaje', fecha: '2024-01-15', createdAt: '2024-01-15' },
  { id: '6', codigo: 'RSD-2024-006', nombre: 'Residuos mixtos', tipo: 'NO_PELIGROSO', cantidad: 320, unidad: 'kg', gestor: 'Gestión Municipal', destino: 'Vertedero autorizado', fecha: '2024-01-18', createdAt: '2024-01-18' },
];

const tipoStats = {
  PELIGROSO: mockResiduos.filter((r) => r.tipo === 'PELIGROSO').reduce((acc, r) => acc + r.cantidad, 0),
  RECICLABLE: mockResiduos.filter((r) => r.tipo === 'RECICLABLE').reduce((acc, r) => acc + r.cantidad, 0),
  ORGANICO: mockResiduos.filter((r) => r.tipo === 'ORGANICO').reduce((acc, r) => acc + r.cantidad, 0),
  NO_PELIGROSO: mockResiduos.filter((r) => r.tipo === 'NO_PELIGROSO').reduce((acc, r) => acc + r.cantidad, 0),
};

export default function Residuos() {
  const [search, setSearch] = useState('');
  const [tipoFilter, setTipoFilter] = useState('Todos');

  const filtered = mockResiduos.filter((r) => {
    const matchSearch = r.nombre.toLowerCase().includes(search.toLowerCase()) || r.codigo.toLowerCase().includes(search.toLowerCase());
    const matchTipo = tipoFilter === 'Todos' || r.tipo === tipoFilter;
    return matchSearch && matchTipo;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Trash2 size={24} className="text-amber-600" />
            Gestión de Residuos
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Control y seguimiento de residuos generados · ISO 14001</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Registrar residuo
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Peligrosos', cantidad: tipoStats.PELIGROSO, color: 'bg-red-50 border-red-200 text-red-700' },
          { label: 'Reciclables', cantidad: tipoStats.RECICLABLE, color: 'bg-green-50 border-green-200 text-green-700' },
          { label: 'Orgánicos', cantidad: tipoStats.ORGANICO, color: 'bg-lime-50 border-lime-200 text-lime-700' },
          { label: 'No peligrosos', cantidad: tipoStats.NO_PELIGROSO, color: 'bg-gray-50 border-gray-200 text-gray-700' },
        ].map((item) => (
          <div key={item.label} className={`rounded-xl p-4 border ${item.color}`}>
            <p className="text-2xl font-bold">{item.cantidad.toLocaleString()} kg</p>
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
              placeholder="Buscar residuos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9"
            />
          </div>
          <select value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value)} className="input w-auto">
            {['Todos', 'PELIGROSO', 'NO_PELIGROSO', 'RECICLABLE', 'ORGANICO'].map((t) => (
              <option key={t} value={t}>{t === 'Todos' ? 'Todos los tipos' : t.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-y border-gray-200">
              <tr>
                <th className="table-header">Código</th>
                <th className="table-header">Nombre</th>
                <th className="table-header">Tipo</th>
                <th className="table-header">Cantidad</th>
                <th className="table-header">Gestor</th>
                <th className="table-header">Destino</th>
                <th className="table-header">Fecha</th>
                <th className="table-header">Obs.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="table-cell font-mono text-xs font-medium text-amber-700">{r.codigo}</td>
                  <td className="table-cell font-medium text-gray-900">{r.nombre}</td>
                  <td className="table-cell"><StatusBadge status={r.tipo} /></td>
                  <td className="table-cell font-semibold text-gray-800">{r.cantidad.toLocaleString()} {r.unidad}</td>
                  <td className="table-cell text-gray-500 text-xs">{r.gestor ?? '—'}</td>
                  <td className="table-cell text-gray-500 text-xs">{r.destino ?? '—'}</td>
                  <td className="table-cell text-gray-500">{new Date(r.fecha).toLocaleDateString('es-ES')}</td>
                  <td className="table-cell text-gray-400 text-xs max-w-[120px] truncate">{r.observaciones ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">No se encontraron residuos</div>
          )}
        </div>
      </div>
    </div>
  );
}
