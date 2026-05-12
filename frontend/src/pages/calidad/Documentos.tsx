import { useState } from 'react';
import { FileText, Plus, Search, Download, Eye } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import { Documento } from '../../types';

const mockDocumentos: Documento[] = [
  { id: '1', codigo: 'PRC-CAL-001', titulo: 'Procedimiento de Control de Documentos', version: '3.0', estado: 'APROBADO', modulo: 'Calidad', categoria: 'Procedimiento', fechaEmision: '2023-01-15', fechaRevision: '2025-01-15', createdAt: '2023-01-15', creadoPor: { nombre: 'Ana', apellido: 'García' } },
  { id: '2', codigo: 'PRC-CAL-002', titulo: 'Procedimiento de Auditorías Internas', version: '2.1', estado: 'APROBADO', modulo: 'Calidad', categoria: 'Procedimiento', fechaEmision: '2023-03-20', fechaRevision: '2025-03-20', createdAt: '2023-03-20', creadoPor: { nombre: 'Luis', apellido: 'Martínez' } },
  { id: '3', codigo: 'INS-CAL-005', titulo: 'Instrucción de Calibración de Equipos', version: '1.2', estado: 'REVISION', modulo: 'Calidad', categoria: 'Instrucción', fechaEmision: '2024-01-10', createdAt: '2024-01-10', creadoPor: { nombre: 'Carlos', apellido: 'López' } },
  { id: '4', codigo: 'FOR-CAL-012', titulo: 'Registro de No Conformidades', version: '2.0', estado: 'APROBADO', modulo: 'Calidad', categoria: 'Formulario', fechaEmision: '2022-06-01', fechaRevision: '2024-06-01', createdAt: '2022-06-01', creadoPor: { nombre: 'María', apellido: 'Rodríguez' } },
  { id: '5', codigo: 'MAN-CAL-001', titulo: 'Manual de Calidad SGI', version: '4.0', estado: 'APROBADO', modulo: 'Calidad', categoria: 'Manual', fechaEmision: '2023-09-01', fechaRevision: '2025-09-01', createdAt: '2023-09-01', creadoPor: { nombre: 'Ana', apellido: 'García' } },
  { id: '6', codigo: 'PRC-CAL-010', titulo: 'Control de Producto No Conforme', version: '1.0', estado: 'BORRADOR', modulo: 'Calidad', categoria: 'Procedimiento', fechaEmision: '2024-01-20', createdAt: '2024-01-20', creadoPor: { nombre: 'Pedro', apellido: 'Sánchez' } },
  { id: '7', codigo: 'PRC-CAL-003', titulo: 'Procedimiento de Acciones Correctivas', version: '2.3', estado: 'OBSOLETO', modulo: 'Calidad', categoria: 'Procedimiento', fechaEmision: '2020-05-10', createdAt: '2020-05-10', creadoPor: { nombre: 'Luis', apellido: 'Martínez' } },
];

const categorias = ['Todos', 'Manual', 'Procedimiento', 'Instrucción', 'Formulario', 'Registro'];
const estados = ['Todos', 'BORRADOR', 'REVISION', 'APROBADO', 'OBSOLETO'];

export default function Documentos() {
  const [search, setSearch] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('Todos');
  const [estadoFilter, setEstadoFilter] = useState('Todos');

  const filtered = mockDocumentos.filter((d) => {
    const matchSearch = d.titulo.toLowerCase().includes(search.toLowerCase()) || d.codigo.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoriaFilter === 'Todos' || d.categoria === categoriaFilter;
    const matchEst = estadoFilter === 'Todos' || d.estado === estadoFilter;
    return matchSearch && matchCat && matchEst;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText size={24} className="text-indigo-600" />
            Documentos
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Control documental · ISO 9001</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Nuevo documento
        </button>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por título o código..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9"
            />
          </div>
          <select value={categoriaFilter} onChange={(e) => setCategoriaFilter(e.target.value)} className="input w-auto">
            {categorias.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)} className="input w-auto">
            {estados.map((e) => <option key={e}>{e === 'Todos' ? 'Todos los estados' : e}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-y border-gray-200">
              <tr>
                <th className="table-header">Código</th>
                <th className="table-header">Título</th>
                <th className="table-header">Categoría</th>
                <th className="table-header">Versión</th>
                <th className="table-header">Estado</th>
                <th className="table-header">Próxima revisión</th>
                <th className="table-header">Autor</th>
                <th className="table-header w-20">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="table-cell font-mono text-xs font-medium text-indigo-700">{doc.codigo}</td>
                  <td className="table-cell font-medium text-gray-900 max-w-xs truncate">{doc.titulo}</td>
                  <td className="table-cell text-gray-500">{doc.categoria}</td>
                  <td className="table-cell text-center">{doc.version}</td>
                  <td className="table-cell"><StatusBadge status={doc.estado} /></td>
                  <td className="table-cell text-gray-500">{doc.fechaRevision ? new Date(doc.fechaRevision).toLocaleDateString('es-ES') : '—'}</td>
                  <td className="table-cell text-gray-500">{doc.creadoPor?.nombre} {doc.creadoPor?.apellido}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
                        <Eye size={14} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
                        <Download size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">No se encontraron documentos</div>
          )}
        </div>
        <div className="mt-4 text-xs text-gray-500">{filtered.length} de {mockDocumentos.length} documentos</div>
      </div>
    </div>
  );
}
