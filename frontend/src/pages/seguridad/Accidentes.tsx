import { useState } from 'react';
import { Siren, Plus, Pencil, Trash2, Download, CheckCircle, XCircle } from 'lucide-react';
import { useData, Accidente } from '../../context/DataContext';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';

const VACIO: Omit<Accidente, 'id' | 'createdAt'> = {
  codigo: '', tipo: 'Accidente de trabajo', descripcion: '', lugar: '',
  fecha: new Date().toISOString().slice(0, 10), lesionados: '0',
  diasBaja: '0', gravedad: 'Leve', causas: '', accionesCorrectivas: '', investigado: false,
};

export default function Accidentes() {
  const { accidentes, addAccidente, updateAccidente, deleteAccidente, exportarCSV } = useData();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(VACIO);
  const [editId, setEditId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const abrirNuevo = () => { setForm(VACIO); setEditId(null); setModal(true); };
  const abrirEditar = (a: Accidente) => {
    const { id, createdAt, ...rest } = a; void id; void createdAt;
    setForm(rest); setEditId(a.id); setModal(true);
  };
  const guardar = () => {
    if (!form.descripcion.trim()) return alert('La descripción es obligatoria');
    if (editId) updateAccidente(editId, form); else addAccidente(form);
    setModal(false);
  };

  const totalLesionados = accidentes.reduce((s, a) => s + (parseInt(a.lesionados) || 0), 0);
  const totalDiasBaja = accidentes.reduce((s, a) => s + (parseInt(a.diasBaja) || 0), 0);
  const sinInvestigar = accidentes.filter(a => !a.investigado).length;

  const gravedadColor: Record<string, string> = {
    Leve: 'bg-yellow-100 text-yellow-700',
    Grave: 'bg-orange-100 text-orange-700',
    'Muy grave': 'bg-red-100 text-red-700',
    Mortal: 'bg-red-900 text-red-100',
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Siren size={24} className="text-rose-600" /> Accidentes e Incidentes
          </h1>
          <p className="text-gray-500 text-sm">{accidentes.length} registros</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => exportarCSV('accidentes', accidentes)} className="btn-secondary flex items-center gap-1.5 text-xs"><Download size={14} /> Exportar</button>
          <button onClick={abrirNuevo} className="btn-primary flex items-center gap-2"><Plus size={16} /> Registrar</button>
        </div>
      </div>

      {accidentes.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-rose-700">{totalLesionados}</p>
            <p className="text-sm text-rose-600 font-medium mt-1">Lesionados total</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-amber-700">{totalDiasBaja}</p>
            <p className="text-sm text-amber-600 font-medium mt-1">Días de baja</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-orange-700">{sinInvestigar}</p>
            <p className="text-sm text-orange-600 font-medium mt-1">Sin investigar</p>
          </div>
        </div>
      )}

      <div className="card">
        {accidentes.length === 0 ? (
          <EmptyState icon={<Siren size={28} />} titulo="Sin accidentes registrados" descripcion="Registrá aquí todos los accidentes, incidentes y casi-accidentes." accion={<button onClick={abrirNuevo} className="btn-primary">+ Registrar</button>} />
        ) : (
          <div className="space-y-3">
            {accidentes.map(a => (
              <div key={a.id} className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {a.codigo && <span className="font-mono text-xs text-rose-700 font-semibold">{a.codigo}</span>}
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{a.tipo}</span>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${gravedadColor[a.gravedad]}`}>{a.gravedad}</span>
                      {a.investigado
                        ? <span className="flex items-center gap-1 text-xs text-green-600"><CheckCircle size={12} /> Investigado</span>
                        : <span className="flex items-center gap-1 text-xs text-orange-500"><XCircle size={12} /> Sin investigar</span>}
                    </div>
                    <p className="font-semibold text-gray-900">{a.descripcion}</p>
                    <div className="flex gap-4 mt-1 text-xs text-gray-400">
                      <span>📍 {a.lugar}</span>
                      <span>📅 {new Date(a.fecha).toLocaleDateString('es-ES')}</span>
                      {parseInt(a.lesionados) > 0 && <span>👤 {a.lesionados} lesionado{parseInt(a.lesionados) !== 1 ? 's' : ''}</span>}
                      {parseInt(a.diasBaja) > 0 && <span>🏥 {a.diasBaja} días de baja</span>}
                    </div>
                    {a.causas && <p className="text-xs text-gray-500 mt-2"><span className="font-medium text-gray-700">Causas:</span> {a.causas}</p>}
                    {a.accionesCorrectivas && <p className="text-xs text-gray-500 mt-1"><span className="font-medium text-gray-700">Acciones:</span> {a.accionesCorrectivas}</p>}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => abrirEditar(a)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => setConfirmId(a.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <Modal title={editId ? 'Editar registro' : 'Registrar accidente / incidente'} onClose={() => setModal(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                <input className="input" value={form.codigo} onChange={e => setForm({ ...form, codigo: e.target.value })} placeholder="ACC-001" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select className="input" value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
                  {['Accidente de trabajo', 'Casi accidente', 'Incidente ambiental', 'Enfermedad profesional'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
              <textarea className="input resize-none" rows={3} value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} placeholder="¿Qué ocurrió exactamente?" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lugar</label>
                <input className="input" value={form.lugar} onChange={e => setForm({ ...form, lugar: e.target.value })} placeholder="Ej: Planta 1, Almacén..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input type="date" className="input" value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gravedad</label>
                <select className="input" value={form.gravedad} onChange={e => setForm({ ...form, gravedad: e.target.value })}>
                  {['Leve', 'Grave', 'Muy grave', 'Mortal'].map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lesionados</label>
                <input type="number" className="input" min="0" value={form.lesionados} onChange={e => setForm({ ...form, lesionados: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Días de baja</label>
                <input type="number" className="input" min="0" value={form.diasBaja} onChange={e => setForm({ ...form, diasBaja: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Causas</label>
              <textarea className="input resize-none" rows={2} value={form.causas} onChange={e => setForm({ ...form, causas: e.target.value })} placeholder="¿Por qué ocurrió?" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Acciones correctivas</label>
              <textarea className="input resize-none" rows={2} value={form.accionesCorrectivas} onChange={e => setForm({ ...form, accionesCorrectivas: e.target.value })} placeholder="¿Qué se hará para que no vuelva a ocurrir?" />
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <input type="checkbox" id="inv" checked={form.investigado} onChange={e => setForm({ ...form, investigado: e.target.checked })} className="w-4 h-4 accent-green-600 cursor-pointer" />
              <label htmlFor="inv" className="text-sm font-medium text-gray-700 cursor-pointer">El accidente ya fue investigado formalmente</label>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(false)} className="flex-1 btn-secondary">Cancelar</button>
              <button onClick={guardar} className="flex-1 btn-primary">Guardar</button>
            </div>
          </div>
        </Modal>
      )}

      {confirmId && (
        <ConfirmDialog mensaje="Se eliminará este registro permanentemente." onConfirm={() => { deleteAccidente(confirmId); setConfirmId(null); }} onCancel={() => setConfirmId(null)} />
      )}
    </div>
  );
}
