import { useState } from 'react';
import { AlertTriangle, Plus, Pencil, Trash2, Download } from 'lucide-react';
import { useData, Riesgo } from '../../context/DataContext';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';

const VACIO: Omit<Riesgo, 'id' | 'createdAt'> = {
  codigo: '', actividad: '', peligro: '', riesgo: '',
  probabilidad: '2', consecuencia: '2', nivel: 'Medio',
  medidas: '', epi: '', responsable: '', estado: 'Identificado',
};

function calcularNivel(p: string, c: string): string {
  const val = parseInt(p) * parseInt(c);
  if (val >= 15) return 'Crítico';
  if (val >= 8) return 'Alto';
  if (val >= 4) return 'Medio';
  return 'Bajo';
}

const nivelColor: Record<string, string> = {
  Bajo: 'bg-green-100 text-green-700',
  Medio: 'bg-yellow-100 text-yellow-700',
  Alto: 'bg-orange-100 text-orange-700',
  Crítico: 'bg-red-100 text-red-700',
};

export default function Riesgos() {
  const { riesgos, addRiesgo, updateRiesgo, deleteRiesgo, exportarCSV } = useData();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(VACIO);
  const [editId, setEditId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const abrirNuevo = () => { setForm(VACIO); setEditId(null); setModal(true); };
  const abrirEditar = (r: Riesgo) => {
    const { id, createdAt, ...rest } = r; void id; void createdAt;
    setForm(rest); setEditId(r.id); setModal(true);
  };
  const guardar = () => {
    if (!form.peligro.trim()) return alert('El peligro es obligatorio');
    const nivel = calcularNivel(form.probabilidad, form.consecuencia);
    if (editId) updateRiesgo(editId, { ...form, nivel }); else addRiesgo({ ...form, nivel });
    setModal(false);
  };
  const handlePC = (field: 'probabilidad' | 'consecuencia', val: string) => {
    const updated = { ...form, [field]: val };
    setForm({ ...updated, nivel: calcularNivel(updated.probabilidad, updated.consecuencia) });
  };

  const criticos = riesgos.filter(r => r.nivel === 'Crítico').length;
  const altos = riesgos.filter(r => r.nivel === 'Alto').length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle size={24} className="text-amber-500" /> Evaluación de Riesgos
          </h1>
          <p className="text-gray-500 text-sm">{riesgos.length} riesgos · {criticos} críticos · {altos} altos</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => exportarCSV('riesgos', riesgos)} className="btn-secondary flex items-center gap-1.5 text-xs"><Download size={14} /> Exportar</button>
          <button onClick={abrirNuevo} className="btn-primary flex items-center gap-2"><Plus size={16} /> Nuevo riesgo</button>
        </div>
      </div>

      <div className="card">
        {riesgos.length === 0 ? (
          <EmptyState icon={<AlertTriangle size={28} />} titulo="Sin riesgos registrados" descripcion="Identificá y evaluá los riesgos laborales de tu empresa." accion={<button onClick={abrirNuevo} className="btn-primary">+ Nuevo riesgo</button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-y border-gray-200">
                <tr>
                  <th className="table-header">Actividad</th>
                  <th className="table-header">Peligro</th>
                  <th className="table-header">Riesgo</th>
                  <th className="table-header text-center">P×C</th>
                  <th className="table-header">Nivel</th>
                  <th className="table-header">Estado</th>
                  <th className="table-header">Responsable</th>
                  <th className="table-header w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {riesgos.sort((a, b) => {
                  const orden = { Crítico: 0, Alto: 1, Medio: 2, Bajo: 3 };
                  return (orden[a.nivel as keyof typeof orden] ?? 4) - (orden[b.nivel as keyof typeof orden] ?? 4);
                }).map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="table-cell font-medium text-gray-800">{r.actividad}</td>
                    <td className="table-cell text-gray-700">{r.peligro}</td>
                    <td className="table-cell text-gray-500 text-sm">{r.riesgo}</td>
                    <td className="table-cell text-center font-bold text-gray-700">
                      {parseInt(r.probabilidad) * parseInt(r.consecuencia)}
                      <span className="text-xs text-gray-400 font-normal ml-1">({r.probabilidad}×{r.consecuencia})</span>
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${nivelColor[r.nivel]}`}>{r.nivel}</span>
                    </td>
                    <td className="table-cell"><StatusBadge status={r.estado} /></td>
                    <td className="table-cell text-gray-500 text-sm">{r.responsable || '—'}</td>
                    <td className="table-cell">
                      <div className="flex gap-1">
                        <button onClick={() => abrirEditar(r)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => setConfirmId(r.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <Modal title={editId ? 'Editar riesgo' : 'Nuevo riesgo'} onClose={() => setModal(false)} size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                <input className="input" value={form.codigo} onChange={e => setForm({ ...form, codigo: e.target.value })} placeholder="RSG-001" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Actividad / Puesto</label>
                <input className="input" value={form.actividad} onChange={e => setForm({ ...form, actividad: e.target.value })} placeholder="Ej: Soldadura, Almacén, Trabajo en altura..." />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Peligro identificado *</label>
              <input className="input" value={form.peligro} onChange={e => setForm({ ...form, peligro: e.target.value })} placeholder="Ej: Caída desde altura, Contacto eléctrico, Ruido..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Riesgo asociado</label>
              <input className="input" value={form.riesgo} onChange={e => setForm({ ...form, riesgo: e.target.value })} placeholder="Ej: Traumatismo grave, Quemaduras, Sordera..." />
            </div>
            <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Probabilidad (1-5)</label>
                <select className="input" value={form.probabilidad} onChange={e => handlePC('probabilidad', e.target.value)}>
                  {['1','2','3','4','5'].map(v => <option key={v} value={v}>{v} — {['Muy baja','Baja','Media','Alta','Muy alta'][+v-1]}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Consecuencia (1-5)</label>
                <select className="input" value={form.consecuencia} onChange={e => handlePC('consecuencia', e.target.value)}>
                  {['1','2','3','4','5'].map(v => <option key={v} value={v}>{v} — {['Leve','Moderada','Grave','Muy grave','Mortal'][+v-1]}</option>)}
                </select>
              </div>
              <div className="flex flex-col justify-end">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nivel resultante</label>
                <div className={`px-3 py-2 rounded-lg text-sm font-bold text-center ${nivelColor[form.nivel]}`}>
                  {form.nivel} ({parseInt(form.probabilidad) * parseInt(form.consecuencia)})
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medidas preventivas</label>
              <textarea className="input resize-none" rows={2} value={form.medidas} onChange={e => setForm({ ...form, medidas: e.target.value })} placeholder="¿Qué se hace para controlar el riesgo?" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">EPIs requeridos</label>
                <input className="input" value={form.epi} onChange={e => setForm({ ...form, epi: e.target.value })} placeholder="Casco, guantes, arnés..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select className="input" value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })}>
                  {['Identificado', 'En tratamiento', 'Controlado'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
              <input className="input" value={form.responsable} onChange={e => setForm({ ...form, responsable: e.target.value })} placeholder="Nombre del responsable" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(false)} className="flex-1 btn-secondary">Cancelar</button>
              <button onClick={guardar} className="flex-1 btn-primary">Guardar</button>
            </div>
          </div>
        </Modal>
      )}

      {confirmId && (
        <ConfirmDialog mensaje="Se eliminará este riesgo." onConfirm={() => { deleteRiesgo(confirmId); setConfirmId(null); }} onCancel={() => setConfirmId(null)} />
      )}
    </div>
  );
}
