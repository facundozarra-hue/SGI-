import { useState } from 'react';
import { AlertCircle, Plus, Pencil, Trash2, Download, Search } from 'lucide-react';
import { useData, NoConformidad } from '../../context/DataContext';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';

const VACIO: Omit<NoConformidad, 'id' | 'createdAt'> = {
  codigo: '', titulo: '', descripcion: '', origen: '',
  prioridad: 'Media', estado: 'Abierta', accionCorrectiva: '',
  responsable: '', fechaDeteccion: new Date().toISOString().slice(0, 10), fechaCierre: '',
};

const prioridadColor: Record<string, string> = {
  Baja: 'bg-gray-100 text-gray-600',
  Media: 'bg-yellow-100 text-yellow-700',
  Alta: 'bg-orange-100 text-orange-700',
  Crítica: 'bg-red-100 text-red-700',
};

export default function NoConformidades() {
  const { noConformidades, addNoConformidad, updateNoConformidad, deleteNoConformidad, exportarCSV } = useData();
  const [busqueda, setBusqueda] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(VACIO);
  const [editId, setEditId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtradas = noConformidades.filter(n =>
    n.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    n.codigo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abiertas = noConformidades.filter(n => n.estado === 'Abierta').length;
  const enProceso = noConformidades.filter(n => n.estado === 'En proceso').length;
  const cerradas = noConformidades.filter(n => n.estado === 'Cerrada').length;

  const abrirNuevo = () => { setForm(VACIO); setEditId(null); setModal(true); };
  const abrirEditar = (n: NoConformidad) => {
    const { id, createdAt, ...rest } = n; void id; void createdAt;
    setForm(rest); setEditId(n.id); setModal(true);
  };
  const guardar = () => {
    if (!form.titulo.trim()) return alert('El título es obligatorio');
    if (editId) updateNoConformidad(editId, form); else addNoConformidad(form);
    setModal(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <AlertCircle size={24} className="text-red-500" /> No Conformidades
          </h1>
          <p className="text-gray-500 text-sm">{noConformidades.length} registros totales</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => exportarCSV('no_conformidades', noConformidades)} className="btn-secondary flex items-center gap-1.5 text-xs"><Download size={14} /> Exportar</button>
          <button onClick={abrirNuevo} className="btn-primary flex items-center gap-2"><Plus size={16} /> Nueva NC</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-red-700">{abiertas}</p>
          <p className="text-sm text-red-600 font-medium mt-1">Abiertas</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-blue-700">{enProceso}</p>
          <p className="text-sm text-blue-600 font-medium mt-1">En proceso</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-700">{cerradas}</p>
          <p className="text-sm text-green-600 font-medium mt-1">Cerradas</p>
        </div>
      </div>

      <div className="card">
        <div className="relative mb-4">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-9" placeholder="Buscar..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        </div>

        {filtradas.length === 0 ? (
          <EmptyState icon={<AlertCircle size={28} />} titulo={busqueda ? 'Sin resultados' : 'Sin no conformidades'} descripcion="Registrá una nueva no conformidad cuando detectes un problema." accion={!busqueda && <button onClick={abrirNuevo} className="btn-primary">+ Nueva NC</button>} />
        ) : (
          <div className="space-y-3">
            {filtradas.map(n => (
              <div key={n.id} className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {n.codigo && <span className="font-mono text-xs text-red-700 font-semibold">{n.codigo}</span>}
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${prioridadColor[n.prioridad]}`}>{n.prioridad}</span>
                      <StatusBadge status={n.estado} />
                    </div>
                    <p className="font-semibold text-gray-900">{n.titulo}</p>
                    {n.descripcion && <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{n.descripcion}</p>}
                    <div className="flex gap-4 mt-2 text-xs text-gray-400">
                      {n.origen && <span>Origen: <span className="text-gray-600">{n.origen}</span></span>}
                      {n.responsable && <span>Responsable: <span className="text-gray-600">{n.responsable}</span></span>}
                      <span>Detectada: <span className="text-gray-600">{new Date(n.fechaDeteccion).toLocaleDateString('es-ES')}</span></span>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => abrirEditar(n)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => setConfirmId(n.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
                {n.accionCorrectiva && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500"><span className="font-medium text-gray-700">Acción correctiva:</span> {n.accionCorrectiva}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <Modal title={editId ? 'Editar no conformidad' : 'Nueva no conformidad'} onClose={() => setModal(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                <input className="input" value={form.codigo} onChange={e => setForm({ ...form, codigo: e.target.value })} placeholder="NC-001" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de detección</label>
                <input type="date" className="input" value={form.fechaDeteccion} onChange={e => setForm({ ...form, fechaDeteccion: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
              <input className="input" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} placeholder="Descripción breve del problema" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción detallada</label>
              <textarea className="input resize-none" rows={3} value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} placeholder="¿Qué ocurrió? ¿Dónde y cuándo?" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Origen</label>
                <select className="input" value={form.origen} onChange={e => setForm({ ...form, origen: e.target.value })}>
                  <option value="">Seleccionar...</option>
                  {['Auditoría', 'Inspección', 'Reclamo de cliente', 'Control de producción', 'Revisión documental', 'Otro'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                <select className="input" value={form.prioridad} onChange={e => setForm({ ...form, prioridad: e.target.value })}>
                  {['Baja', 'Media', 'Alta', 'Crítica'].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select className="input" value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })}>
                  {['Abierta', 'En proceso', 'Cerrada'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                <input className="input" value={form.responsable} onChange={e => setForm({ ...form, responsable: e.target.value })} placeholder="Nombre del responsable" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Acción correctiva</label>
              <textarea className="input resize-none" rows={2} value={form.accionCorrectiva} onChange={e => setForm({ ...form, accionCorrectiva: e.target.value })} placeholder="¿Qué se hará para resolver el problema?" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(false)} className="flex-1 btn-secondary">Cancelar</button>
              <button onClick={guardar} className="flex-1 btn-primary">Guardar</button>
            </div>
          </div>
        </Modal>
      )}

      {confirmId && (
        <ConfirmDialog mensaje="Se eliminará esta no conformidad permanentemente." onConfirm={() => { deleteNoConformidad(confirmId); setConfirmId(null); }} onCancel={() => setConfirmId(null)} />
      )}
    </div>
  );
}
