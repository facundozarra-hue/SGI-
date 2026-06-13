import { useState } from 'react';
import { Recycle, Plus, Pencil, Trash2, Download } from 'lucide-react';
import { useData, AspectoAmbiental } from '../../context/DataContext';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';

const VACIO: Omit<AspectoAmbiental, 'id' | 'createdAt'> = {
  codigo: '', actividad: '', aspecto: '', impacto: '',
  significativo: false, medidas: '', responsable: '', estado: 'Activo',
};

export default function AspectosAmbientales() {
  const { aspectos, addAspecto, updateAspecto, deleteAspecto, exportarCSV } = useData();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(VACIO);
  const [editId, setEditId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const abrirNuevo = () => { setForm(VACIO); setEditId(null); setModal(true); };
  const abrirEditar = (a: AspectoAmbiental) => {
    const { id, createdAt, ...rest } = a; void id; void createdAt;
    setForm(rest); setEditId(a.id); setModal(true);
  };
  const guardar = () => {
    if (!form.aspecto.trim()) return alert('El aspecto es obligatorio');
    if (editId) updateAspecto(editId, form); else addAspecto(form);
    setModal(false);
  };

  const significativos = aspectos.filter(a => a.significativo).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Recycle size={24} className="text-green-600" /> Aspectos Ambientales
          </h1>
          <p className="text-gray-500 text-sm">{aspectos.length} identificados · {significativos} significativos</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => exportarCSV('aspectos_ambientales', aspectos)} className="btn-secondary flex items-center gap-1.5 text-xs"><Download size={14} /> Exportar</button>
          <button onClick={abrirNuevo} className="btn-primary flex items-center gap-2"><Plus size={16} /> Nuevo aspecto</button>
        </div>
      </div>

      <div className="card">
        {aspectos.length === 0 ? (
          <EmptyState icon={<Recycle size={28} />} titulo="Sin aspectos registrados" descripcion="Identificá los aspectos e impactos ambientales de tu empresa." accion={<button onClick={abrirNuevo} className="btn-primary">+ Nuevo aspecto</button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-y border-gray-200">
                <tr>
                  <th className="table-header">Actividad</th>
                  <th className="table-header">Aspecto</th>
                  <th className="table-header">Impacto</th>
                  <th className="table-header text-center">Significativo</th>
                  <th className="table-header">Medidas</th>
                  <th className="table-header">Responsable</th>
                  <th className="table-header w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {aspectos.map(a => (
                  <tr key={a.id} className={`hover:bg-gray-50 ${a.significativo ? 'bg-red-50/30' : ''}`}>
                    <td className="table-cell font-medium text-gray-800">{a.actividad}</td>
                    <td className="table-cell text-gray-700">{a.aspecto}</td>
                    <td className="table-cell text-gray-500 text-xs max-w-[160px]">{a.impacto}</td>
                    <td className="table-cell text-center">
                      {a.significativo
                        ? <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Sí</span>
                        : <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">No</span>}
                    </td>
                    <td className="table-cell text-gray-500 text-xs max-w-[160px] truncate">{a.medidas || '—'}</td>
                    <td className="table-cell text-gray-500">{a.responsable || '—'}</td>
                    <td className="table-cell">
                      <div className="flex gap-1">
                        <button onClick={() => abrirEditar(a)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => setConfirmId(a.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={14} /></button>
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
        <Modal title={editId ? 'Editar aspecto' : 'Nuevo aspecto ambiental'} onClose={() => setModal(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                <input className="input" value={form.codigo} onChange={e => setForm({ ...form, codigo: e.target.value })} placeholder="ASP-001" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select className="input" value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })}>
                  {['Activo', 'Inactivo'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Actividad</label>
              <input className="input" value={form.actividad} onChange={e => setForm({ ...form, actividad: e.target.value })} placeholder="Ej: Producción, Mantenimiento, Oficinas..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aspecto ambiental *</label>
              <input className="input" value={form.aspecto} onChange={e => setForm({ ...form, aspecto: e.target.value })} placeholder="Ej: Consumo de agua, Generación de residuos..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Impacto asociado</label>
              <input className="input" value={form.impacto} onChange={e => setForm({ ...form, impacto: e.target.value })} placeholder="Ej: Contaminación del suelo, Agotamiento de recursos..." />
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <input type="checkbox" id="sig" checked={form.significativo} onChange={e => setForm({ ...form, significativo: e.target.checked })} className="w-4 h-4 accent-red-600 cursor-pointer" />
              <label htmlFor="sig" className="text-sm font-medium text-gray-700 cursor-pointer">
                Aspecto <span className="text-red-600">significativo</span> (requiere control especial)
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medidas de control</label>
              <textarea className="input resize-none" rows={2} value={form.medidas} onChange={e => setForm({ ...form, medidas: e.target.value })} placeholder="¿Qué se hace para minimizar el impacto?" />
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
        <ConfirmDialog mensaje="Se eliminará este aspecto ambiental." onConfirm={() => { deleteAspecto(confirmId); setConfirmId(null); }} onCancel={() => setConfirmId(null)} />
      )}
    </div>
  );
}
