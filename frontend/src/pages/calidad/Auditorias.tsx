import { useState } from 'react';
import { ClipboardList, Plus, Pencil, Trash2, Download, Calendar } from 'lucide-react';
import { useData, Auditoria } from '../../context/DataContext';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';

const VACIO: Omit<Auditoria, 'id' | 'createdAt'> = {
  codigo: '', titulo: '', tipo: 'Interna', modulo: 'Calidad',
  auditor: '', estado: 'Planificada',
  fechaInicio: new Date().toISOString().slice(0, 10),
  fechaFin: '', hallazgos: '', conclusiones: '',
};

export default function Auditorias() {
  const { auditorias, addAuditoria, updateAuditoria, deleteAuditoria, exportarCSV } = useData();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(VACIO);
  const [editId, setEditId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const abrirNuevo = () => { setForm(VACIO); setEditId(null); setModal(true); };
  const abrirEditar = (a: Auditoria) => {
    const { id, createdAt, ...rest } = a; void id; void createdAt;
    setForm(rest); setEditId(a.id); setModal(true);
  };
  const guardar = () => {
    if (!form.titulo.trim()) return alert('El título es obligatorio');
    if (editId) updateAuditoria(editId, form); else addAuditoria(form);
    setModal(false);
  };

  const estadoColor: Record<string, string> = {
    Planificada: 'border-blue-200 bg-blue-50',
    'En curso': 'border-indigo-200 bg-indigo-50',
    Completada: 'border-green-200 bg-green-50',
    Cancelada: 'border-gray-200 bg-gray-50',
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ClipboardList size={24} className="text-blue-600" /> Auditorías
          </h1>
          <p className="text-gray-500 text-sm">{auditorias.length} registros totales</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => exportarCSV('auditorias', auditorias)} className="btn-secondary flex items-center gap-1.5 text-xs"><Download size={14} /> Exportar</button>
          <button onClick={abrirNuevo} className="btn-primary flex items-center gap-2"><Plus size={16} /> Nueva auditoría</button>
        </div>
      </div>

      <div className="card">
        {auditorias.length === 0 ? (
          <EmptyState icon={<ClipboardList size={28} />} titulo="Sin auditorías" descripcion="Planificá y registrá tus auditorías internas y externas." accion={<button onClick={abrirNuevo} className="btn-primary">+ Nueva auditoría</button>} />
        ) : (
          <div className="space-y-3">
            {auditorias.map(a => (
              <div key={a.id} className={`border rounded-xl p-4 ${estadoColor[a.estado] ?? 'border-gray-200'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {a.codigo && <span className="font-mono text-xs text-blue-700 font-semibold">{a.codigo}</span>}
                      <StatusBadge status={a.tipo} />
                      <StatusBadge status={a.estado} />
                      <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full border">{a.modulo}</span>
                    </div>
                    <p className="font-semibold text-gray-900">{a.titulo}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(a.fechaInicio).toLocaleDateString('es-ES')}{a.fechaFin && ` — ${new Date(a.fechaFin).toLocaleDateString('es-ES')}`}</span>
                      {a.auditor && <span>Auditor: <span className="text-gray-700 font-medium">{a.auditor}</span></span>}
                    </div>
                    {a.hallazgos && <p className="text-xs text-gray-600 mt-2 bg-white/70 px-3 py-1.5 rounded-lg"><span className="font-medium">Hallazgos:</span> {a.hallazgos}</p>}
                    {a.conclusiones && <p className="text-xs text-gray-600 mt-1 bg-white/70 px-3 py-1.5 rounded-lg"><span className="font-medium">Conclusiones:</span> {a.conclusiones}</p>}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => abrirEditar(a)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-white rounded transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => setConfirmId(a.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <Modal title={editId ? 'Editar auditoría' : 'Nueva auditoría'} onClose={() => setModal(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                <input className="input" value={form.codigo} onChange={e => setForm({ ...form, codigo: e.target.value })} placeholder="AUD-001" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select className="input" value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
                  {['Interna', 'Externa'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
              <input className="input" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} placeholder="Nombre de la auditoría" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Módulo</label>
                <select className="input" value={form.modulo} onChange={e => setForm({ ...form, modulo: e.target.value })}>
                  {['Calidad', 'Medio Ambiente', 'Seguridad y Salud', 'Integrado'].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select className="input" value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })}>
                  {['Planificada', 'En curso', 'Completada', 'Cancelada'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Auditor / Equipo auditor</label>
              <input className="input" value={form.auditor} onChange={e => setForm({ ...form, auditor: e.target.value })} placeholder="Nombre del auditor" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
                <input type="date" className="input" value={form.fechaInicio} onChange={e => setForm({ ...form, fechaInicio: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
                <input type="date" className="input" value={form.fechaFin} onChange={e => setForm({ ...form, fechaFin: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hallazgos</label>
              <textarea className="input resize-none" rows={2} value={form.hallazgos} onChange={e => setForm({ ...form, hallazgos: e.target.value })} placeholder="Problemas o observaciones encontradas" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Conclusiones</label>
              <textarea className="input resize-none" rows={2} value={form.conclusiones} onChange={e => setForm({ ...form, conclusiones: e.target.value })} placeholder="Resumen y veredicto final" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(false)} className="flex-1 btn-secondary">Cancelar</button>
              <button onClick={guardar} className="flex-1 btn-primary">Guardar</button>
            </div>
          </div>
        </Modal>
      )}

      {confirmId && (
        <ConfirmDialog mensaje="Se eliminará esta auditoría permanentemente." onConfirm={() => { deleteAuditoria(confirmId); setConfirmId(null); }} onCancel={() => setConfirmId(null)} />
      )}
    </div>
  );
}
