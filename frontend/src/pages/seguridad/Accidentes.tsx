import { useState } from 'react';
import { Ambulance, Plus, Search, CheckCircle, XCircle } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import { Accidente } from '../../types';

const mockAccidentes: Accidente[] = [
  { id: '1', codigo: 'ACC-2024-001', tipo: 'Accidente de trabajo', descripcion: 'Caída al mismo nivel por suelo mojado en zona de acceso', lugar: 'Pasillo planta 1', fecha: '2024-01-08', lesionados: 1, diasBaja: 3, gravedad: 'LEVE', causas: 'Ausencia de señalización de suelo mojado, falta de drenaje', accionesCorrectivas: 'Señalización permanente, mejora del sistema de drenaje', investigado: true, createdAt: '2024-01-08', responsable: { nombre: 'Carlos', apellido: 'López' } },
  { id: '2', codigo: 'ACC-2024-002', tipo: 'Casi accidente', descripcion: 'Trabajador casi atropellado por carretilla en almacén', lugar: 'Almacén principal', fecha: '2024-01-12', lesionados: 0, diasBaja: 0, gravedad: 'LEVE', causas: 'Visibilidad reducida, falta de separación zonas', accionesCorrectivas: 'Instalación de espejos convexos, marcado de carriles', investigado: true, createdAt: '2024-01-12', responsable: { nombre: 'María', apellido: 'Rodríguez' } },
  { id: '3', codigo: 'ACC-2024-003', tipo: 'Accidente de trabajo', descripcion: 'Corte en mano por herramienta sin guarda de protección', lugar: 'Taller mecánico', fecha: '2024-01-18', lesionados: 1, diasBaja: 7, gravedad: 'GRAVE', causas: 'Guarda de seguridad retirada por operario', accionesCorrectivas: 'Formación obligatoria, bloqueo de máquina sin protecciones', investigado: false, createdAt: '2024-01-18', responsable: { nombre: 'Pedro', apellido: 'Sánchez' } },
  { id: '4', codigo: 'ACC-2023-018', tipo: 'Incidente ambiental', descripcion: 'Pequeño derrame de aceite en zona de mantenimiento', lugar: 'Zona de mantenimiento', fecha: '2023-12-05', lesionados: 0, diasBaja: 0, gravedad: 'LEVE', causas: 'Recipiente en mal estado', accionesCorrectivas: 'Revisión periódica de recipientes, kit de emergencia instalado', investigado: true, createdAt: '2023-12-05', responsable: { nombre: 'Luis', apellido: 'Martínez' } },
  { id: '5', codigo: 'ACC-2023-015', tipo: 'Enfermedad profesional', descripcion: 'Trabajador con lumbalgia por manejo manual de cargas', lugar: 'Almacén', fecha: '2023-11-20', lesionados: 1, diasBaja: 21, gravedad: 'GRAVE', causas: 'Falta de ayudas mecánicas, técnica incorrecta', accionesCorrectivas: 'Instalación de carros elevadores, formación ergonomía', investigado: true, createdAt: '2023-11-20', responsable: { nombre: 'Ana', apellido: 'García' } },
];

export default function Accidentes() {
  const [search, setSearch] = useState('');
  const [gravedadFilter, setGravedadFilter] = useState('Todos');

  const filtered = mockAccidentes.filter((a) => {
    const matchSearch = a.descripcion.toLowerCase().includes(search.toLowerCase()) || a.codigo.toLowerCase().includes(search.toLowerCase()) || a.lugar.toLowerCase().includes(search.toLowerCase());
    const matchGrav = gravedadFilter === 'Todos' || a.gravedad === gravedadFilter;
    return matchSearch && matchGrav;
  });

  const totalLesionados = mockAccidentes.reduce((acc, a) => acc + a.lesionados, 0);
  const totalDiasBaja = mockAccidentes.reduce((acc, a) => acc + a.diasBaja, 0);
  const sinInvestigar = mockAccidentes.filter((a) => !a.investigado).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Ambulance size={24} className="text-rose-600" />
            Accidentes e Incidentes
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Registro y seguimiento de siniestros · ISO 45001</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Registrar accidente
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
          <p className="text-3xl font-bold text-rose-700">{totalLesionados}</p>
          <p className="text-sm font-medium text-rose-600 mt-1">Total lesionados</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-3xl font-bold text-amber-700">{totalDiasBaja}</p>
          <p className="text-sm font-medium text-amber-600 mt-1">Días de baja totales</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <p className="text-3xl font-bold text-orange-700">{sinInvestigar}</p>
          <p className="text-sm font-medium text-orange-600 mt-1">Sin investigar</p>
        </div>
      </div>

      <div className="card">
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por descripción, código o lugar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9"
            />
          </div>
          <select value={gravedadFilter} onChange={(e) => setGravedadFilter(e.target.value)} className="input w-auto">
            {['Todos', 'LEVE', 'GRAVE', 'MUY_GRAVE', 'MORTAL'].map((g) => (
              <option key={g} value={g}>{g === 'Todos' ? 'Todas las gravedades' : g.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-y border-gray-200">
              <tr>
                <th className="table-header">Código</th>
                <th className="table-header">Tipo</th>
                <th className="table-header">Descripción</th>
                <th className="table-header">Lugar</th>
                <th className="table-header">Fecha</th>
                <th className="table-header text-center">Lesionados</th>
                <th className="table-header text-center">Días baja</th>
                <th className="table-header">Gravedad</th>
                <th className="table-header text-center">Investigado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((acc) => (
                <tr key={acc.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="table-cell font-mono text-xs font-medium text-rose-700">{acc.codigo}</td>
                  <td className="table-cell text-xs text-gray-500">{acc.tipo}</td>
                  <td className="table-cell max-w-xs">
                    <p className="font-medium text-gray-900 text-sm truncate">{acc.descripcion}</p>
                  </td>
                  <td className="table-cell text-gray-500 text-sm">{acc.lugar}</td>
                  <td className="table-cell text-gray-500">{new Date(acc.fecha).toLocaleDateString('es-ES')}</td>
                  <td className="table-cell text-center font-semibold text-gray-800">{acc.lesionados}</td>
                  <td className="table-cell text-center font-semibold text-gray-800">{acc.diasBaja}</td>
                  <td className="table-cell"><StatusBadge status={acc.gravedad} /></td>
                  <td className="table-cell text-center">
                    {acc.investigado
                      ? <CheckCircle size={16} className="text-green-500 mx-auto" />
                      : <XCircle size={16} className="text-red-400 mx-auto" />
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">No se encontraron accidentes registrados</div>
          )}
        </div>
      </div>
    </div>
  );
}
