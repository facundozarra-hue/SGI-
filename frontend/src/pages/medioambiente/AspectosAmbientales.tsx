import { useState } from 'react';
import { Recycle, Plus, Search } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import { AspectoAmbiental } from '../../types';

const mockAspectos: AspectoAmbiental[] = [
  { id: '1', codigo: 'ASP-001', actividad: 'Producción', aspecto: 'Consumo de agua', impacto: 'Agotamiento de recursos hídricos', significativo: true, medidas: 'Instalación de caudalímetros, reutilización de agua', indicador: 'm³/unidad producida', meta: 'Reducir 10% anual', estado: 'ACTIVO', createdAt: '2023-01-10' },
  { id: '2', codigo: 'ASP-002', actividad: 'Almacén', aspecto: 'Generación de residuos peligrosos', impacto: 'Contaminación del suelo', significativo: true, medidas: 'Gestión con empresa autorizada, contenedores específicos', indicador: 'kg/mes', meta: 'Reducir 5% trimestral', estado: 'ACTIVO', createdAt: '2023-01-10' },
  { id: '3', codigo: 'ASP-003', actividad: 'Oficinas', aspecto: 'Consumo energético', impacto: 'Emisiones CO₂', significativo: false, medidas: 'Sensores de presencia, equipos A+', indicador: 'kWh/mes', meta: 'Reducir 8% anual', estado: 'ACTIVO', createdAt: '2023-02-15' },
  { id: '4', codigo: 'ASP-004', actividad: 'Mantenimiento', aspecto: 'Vertido de aceites', impacto: 'Contaminación de suelo y agua', significativo: true, medidas: 'Bandejas de contención, gestión con gestor autorizado', indicador: 'incidentes/año', meta: '0 vertidos accidentales', estado: 'ACTIVO', createdAt: '2023-03-01' },
  { id: '5', codigo: 'ASP-005', actividad: 'Transporte', aspecto: 'Emisiones de vehículos', impacto: 'Contaminación atmosférica', significativo: false, medidas: 'Mantenimiento preventivo, rutas optimizadas', indicador: 'kg CO₂/km', meta: 'Renovar flota Euro 6', estado: 'ACTIVO', createdAt: '2023-04-20' },
  { id: '6', codigo: 'ASP-006', actividad: 'Limpieza', aspecto: 'Uso de productos químicos', impacto: 'Contaminación de agua residual', significativo: false, medidas: 'Productos ecológicos certificados', indicador: 'litros/mes', meta: 'Migrar al 80% productos eco', estado: 'ACTIVO', createdAt: '2023-05-10' },
];

export default function AspectosAmbientales() {
  const [search, setSearch] = useState('');
  const [sigFilter, setSigFilter] = useState('Todos');

  const filtered = mockAspectos.filter((a) => {
    const matchSearch = a.aspecto.toLowerCase().includes(search.toLowerCase()) || a.actividad.toLowerCase().includes(search.toLowerCase()) || a.codigo.toLowerCase().includes(search.toLowerCase());
    const matchSig = sigFilter === 'Todos' || (sigFilter === 'Significativo' ? a.significativo : !a.significativo);
    return matchSearch && matchSig;
  });

  const significativos = mockAspectos.filter((a) => a.significativo).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Recycle size={24} className="text-green-600" />
            Aspectos Ambientales
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Identificación y evaluación · ISO 14001</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Nuevo aspecto
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-3xl font-bold text-green-700">{mockAspectos.length}</p>
          <p className="text-sm font-medium text-green-600 mt-1">Total identificados</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-3xl font-bold text-red-700">{significativos}</p>
          <p className="text-sm font-medium text-red-600 mt-1">Significativos</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-3xl font-bold text-gray-700">{mockAspectos.length - significativos}</p>
          <p className="text-sm font-medium text-gray-600 mt-1">No significativos</p>
        </div>
      </div>

      <div className="card">
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por aspecto, actividad o código..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9"
            />
          </div>
          <select value={sigFilter} onChange={(e) => setSigFilter(e.target.value)} className="input w-auto">
            <option>Todos</option>
            <option value="Significativo">Significativos</option>
            <option value="NoSignificativo">No significativos</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-y border-gray-200">
              <tr>
                <th className="table-header">Código</th>
                <th className="table-header">Actividad</th>
                <th className="table-header">Aspecto</th>
                <th className="table-header">Impacto</th>
                <th className="table-header">Significativo</th>
                <th className="table-header">Indicador</th>
                <th className="table-header">Meta</th>
                <th className="table-header">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((asp) => (
                <tr key={asp.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="table-cell font-mono text-xs font-medium text-green-700">{asp.codigo}</td>
                  <td className="table-cell font-medium text-gray-800">{asp.actividad}</td>
                  <td className="table-cell text-gray-700">{asp.aspecto}</td>
                  <td className="table-cell text-gray-500 text-xs max-w-xs">{asp.impacto}</td>
                  <td className="table-cell">
                    {asp.significativo
                      ? <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Sí</span>
                      : <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">No</span>
                    }
                  </td>
                  <td className="table-cell text-gray-500 text-xs">{asp.indicador ?? '—'}</td>
                  <td className="table-cell text-gray-500 text-xs max-w-[150px] truncate">{asp.meta ?? '—'}</td>
                  <td className="table-cell"><StatusBadge status={asp.estado} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">No se encontraron aspectos ambientales</div>
          )}
        </div>
      </div>
    </div>
  );
}
