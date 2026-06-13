import { useState } from 'react';
import { Trash2, Plus, Pencil, Download } from 'lucide-react';
import { useData, Residuo } from '../../context/DataContext';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';

const VACIO: Omit<Residuo, 'id' | 'createdAt'> = {
  codigo: '', nombre: '', tipo: 'Reciclable', cantidad: '',
  unidad: 'kg', gestor: '', destino: '',
  fecha: new Date().toISOString().slice(0, 10), observaciones: '',
};

export default function Residuos() {
  const { residuos, addResiduo, updateResiduo, deleteResiduo, exportarCSV } = useData();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(VACIO);
  const [editId, setEditId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const abrirNuevo = () => { setForm(VACIO); setEditId(null); setModal(true); };
  const abrirEditar = (r: Residuo) => {
    const { id, createdAt, ...rest } = r; void id; void createdAt;
    setForm(rest); setEditId(r.id); setModal(true);
  };
  const guardar = () => {
    if (!form.nombre.trim()) return alert('El nombre es obligatorio');
    if (editId) updateResiduo(editId, form); else addResiduo(form);
    setModal(false);
  };

  const totalPorTipo = ['Peligroso', 'No peligroso', 'Reciclable', 'Orgánico'].map(tipo => ({
    tipo, total: residuos.filter(r => r.tipo === tipo).reduce((acc, r) => acc + (parseFloat(r.cantidad) || 0), 0),
    count: residuos.filter(r => r.tipo === tipo).length,
  })).filter(t => t.count > 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Trash2 size={24} className="text-amber-600" /> Gestión de Residuos
          </h1>
          <p className="text-gray-500 text-sm">{residuos.length} registros</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => exportarCSV('residuos', residuos)} className="btn-secondary flex items-center gap-1.5 text-xs"><Download size={14} /> Exportar</button>
          <button onClick={abrirNuevo} className="btn-primary flex items-center gap-2"><Plus size={16} /> Registrar residuo</button>
        </div>
      </div>

      {totalPorTipo.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {totalPorTipo.map(t => (
            <div key={t.tipo} className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
              <p className="text-xl font-bold text-gray-800">{t.total.toLocaleString('es-ES', { maximumFractionDigits: 1 })}</p>
              <p className="text-xs text-gray-500 mt-0.5">{t.tipo}</p>
              <p className="text-xs text-gray-400">{t.count} registro{t.count !== 1 ? 's' : ''}</p>
            </div>
          ))}
        </div>
      )}

      <div className="card">
        {residuos.length === 0 ? (
          <EmptyState icon={<Trash2 size={28} />} titulo="Sin residuos registrados" descripcion="Registrá los residuos generados por la empresa para su seguimiento." accion={<button onClick={abrirNuevo} className="btn-primary">+ Registrar residuo</button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-y border-gray-200">
                <tr>
                  <th className="table-header">Fecha</th>
                  <th className="table-header">Nombre</th>
                  <th className="table-header">Tipo</th>
                  <th className="table-header">Cantidad</th>
                  <th className="table-header">Gestor</th>
                  <th className="table-header">Destino</th>
                  <th className="table-header w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {residuos.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="table-cell text-gray-500">{new Date(r.fecha).toLocaleDateString('es-ES')}</td>
                    <td className="table-cell font-medium text-gray-900">{r.nombre}</td>
                    <td className="table-cell"><StatusBadge status={r.tipo} /></td>
                    <td className="table-cell font-semibold">{r.cantidad} {r.unidad}</td>
                    <td className="table-cell text-gray-500 text-sm">{r.gestor || '—'}</td>
                    <td className="table-cell text-gray-500 text-sm">{r.destino || '—'}</td>
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
        <Modal title={editId ? 'Editar residuo' : 'Registrar residuo'} onClose={() => setModal(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                <input className="input" value={form.codigo} onChange={e => setForm({ ...form, codigo: e.target.value })} placeholder="RSD-001" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input type="date" className="input" value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del residuo *</label>
              <input className="input" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Aceite usado, Cartón, Residuos orgánicos..." />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select className="input" value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
                  {['Peligroso', 'No peligroso', 'Reciclable', 'Orgánico'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                <input className="input" type="number" value={form.cantidad} onChange={e => setForm({ ...form, cantidad: e.target.value })} placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unidad</label>
                <select className="input" value={form.unidad} onChange={e => setForm({ ...form, unidad: e.target.value })}>
                  {['kg', 'toneladas', 'litros', 'm³', 'unidades'].map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Empresa gestora</label>
                <input className="input" value={form.gestor} onChange={e => setForm({ ...form, gestor: e.target.value })} placeholder="Quién retira el residuo" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destino final</label>
                <input className="input" value={form.destino} onChange={e => setForm({ ...form, destino: e.target.value })} placeholder="Ej: Reciclaje, Vertedero..." />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
              <textarea className="input resize-none" rows={2} value={form.observaciones} onChange={e => setForm({ ...form, observaciones: e.target.value })} placeholder="Certificado, notas adicionales..." />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(false)} className="flex-1 btn-secondary">Cancelar</button>
              <button onClick={guardar} className="flex-1 btn-primary">Guardar</button>
            </div>
          </div>
        </Modal>
      )}

      {confirmId && (
        <ConfirmDialog mensaje="Se eliminará este registro de residuo." onConfirm={() => { deleteResiduo(confirmId); setConfirmId(null); }} onCancel={() => setConfirmId(null)} />
      )}
    </div>
  );
}
