import { useState } from 'react';
import { FileText, Plus, Pencil, Trash2, Download, Search, ExternalLink, Link } from 'lucide-react';
import { useData, Documento } from '../../context/DataContext';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';

const VACIO: Omit<Documento, 'id' | 'createdAt'> = {
  codigo: '', titulo: '', categoria: 'Procedimiento', estado: 'Borrador',
  version: '1.0', fechaEmision: new Date().toISOString().slice(0, 10),
  fechaRevision: '', responsable: '', observaciones: '', enlace: '',
};

export default function Documentos() {
  const { documentos, addDocumento, updateDocumento, deleteDocumento, exportarCSV } = useData();
  const [busqueda, setBusqueda] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(VACIO);
  const [editId, setEditId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtrados = documentos.filter(d =>
    d.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    d.codigo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirNuevo = () => { setForm(VACIO); setEditId(null); setModal(true); };
  const abrirEditar = (d: Documento) => {
    const { id, createdAt, ...rest } = d; void id; void createdAt;
    setForm(rest); setEditId(d.id); setModal(true);
  };
  const guardar = () => {
    if (!form.titulo.trim()) return alert('El título es obligatorio');
    if (editId) updateDocumento(editId, form); else addDocumento(form);
    setModal(false);
  };

  const conArchivo = documentos.filter(d => d.enlace).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText size={24} className="text-indigo-600" /> Documentos
          </h1>
          <p className="text-gray-500 text-sm">
            {documentos.length} registros · {conArchivo} con archivo vinculado
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => exportarCSV('documentos', documentos)} className="btn-secondary flex items-center gap-1.5 text-xs">
            <Download size={14} /> Exportar
          </button>
          <button onClick={abrirNuevo} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Nuevo documento
          </button>
        </div>
      </div>

      {documentos.length > 0 && conArchivo === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Link size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-800">Vinculá tus archivos de Google Drive</p>
            <p className="text-sm text-blue-600 mt-0.5">
              Al editar un documento podés pegar el enlace de Google Drive para acceder al archivo directamente desde aquí.
            </p>
          </div>
        </div>
      )}

      <div className="card">
        <div className="relative mb-4">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-9" placeholder="Buscar por título o código..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        </div>

        {filtrados.length === 0 ? (
          <EmptyState
            icon={<FileText size={28} />}
            titulo={busqueda ? 'Sin resultados' : 'Sin documentos aún'}
            descripcion={busqueda ? 'Intenta con otro término de búsqueda.' : 'Cargá el primer documento haciendo clic en "Nuevo documento".'}
            accion={!busqueda && <button onClick={abrirNuevo} className="btn-primary">+ Nuevo documento</button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-y border-gray-200">
                <tr>
                  <th className="table-header">Código</th>
                  <th className="table-header">Título</th>
                  <th className="table-header">Categoría</th>
                  <th className="table-header">Versión</th>
                  <th className="table-header">Estado</th>
                  <th className="table-header">Responsable</th>
                  <th className="table-header">Rev. próxima</th>
                  <th className="table-header">Archivo</th>
                  <th className="table-header w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtrados.map(d => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="table-cell font-mono text-xs text-indigo-700 font-semibold">{d.codigo || '—'}</td>
                    <td className="table-cell font-medium text-gray-900">{d.titulo}</td>
                    <td className="table-cell text-gray-500">{d.categoria}</td>
                    <td className="table-cell text-center">{d.version}</td>
                    <td className="table-cell"><StatusBadge status={d.estado} /></td>
                    <td className="table-cell text-gray-500">{d.responsable || '—'}</td>
                    <td className="table-cell text-gray-500">
                      {d.fechaRevision ? new Date(d.fechaRevision).toLocaleDateString('es-ES') : '—'}
                    </td>
                    <td className="table-cell">
                      {d.enlace ? (
                        <a
                          href={d.enlace}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <ExternalLink size={12} /> Ver archivo
                        </a>
                      ) : (
                        <span className="text-xs text-gray-300">Sin archivo</span>
                      )}
                    </td>
                    <td className="table-cell">
                      <div className="flex gap-1">
                        <button onClick={() => abrirEditar(d)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => setConfirmId(d.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={14} /></button>
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
        <Modal title={editId ? 'Editar documento' : 'Nuevo documento'} onClose={() => setModal(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                <input className="input" value={form.codigo} onChange={e => setForm({ ...form, codigo: e.target.value })} placeholder="Ej: PRC-001" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Versión</label>
                <input className="input" value={form.version} onChange={e => setForm({ ...form, version: e.target.value })} placeholder="1.0" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
              <input className="input" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} placeholder="Nombre del documento" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select className="input" value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}>
                  {['Manual', 'Procedimiento', 'Instrucción', 'Formulario', 'Registro', 'Política'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select className="input" value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })}>
                  {['Borrador', 'En revisión', 'Aprobado', 'Obsoleto'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
              <input className="input" value={form.responsable} onChange={e => setForm({ ...form, responsable: e.target.value })} placeholder="Nombre del responsable" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de emisión</label>
                <input type="date" className="input" value={form.fechaEmision} onChange={e => setForm({ ...form, fechaEmision: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Próxima revisión</label>
                <input type="date" className="input" value={form.fechaRevision} onChange={e => setForm({ ...form, fechaRevision: e.target.value })} />
              </div>
            </div>

            {/* Campo de enlace a Google Drive */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
              <label className="block text-sm font-semibold text-blue-800 flex items-center gap-2">
                <Link size={15} /> Enlace al archivo (Google Drive, OneDrive, etc.)
              </label>
              <input
                className="input bg-white"
                value={form.enlace}
                onChange={e => setForm({ ...form, enlace: e.target.value })}
                placeholder="Pegá aquí el enlace compartido del archivo..."
              />
              <p className="text-xs text-blue-600">
                📌 <strong>Google Drive:</strong> clic derecho → Compartir → Copiar enlace<br />
                📌 <strong>OneDrive:</strong> clic derecho → Compartir → Cualquier persona → Copiar enlace<br />
                📌 <strong>Dropbox / otro:</strong> cualquier enlace compartido funciona igual.
              </p>
              {form.enlace && (
                <a href={form.enlace} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:underline font-medium">
                  <ExternalLink size={12} /> Verificar que el enlace funciona
                </a>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
              <textarea className="input resize-none" rows={2} value={form.observaciones} onChange={e => setForm({ ...form, observaciones: e.target.value })} placeholder="Notas adicionales..." />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(false)} className="flex-1 btn-secondary">Cancelar</button>
              <button onClick={guardar} className="flex-1 btn-primary">Guardar</button>
            </div>
          </div>
        </Modal>
      )}

      {confirmId && (
        <ConfirmDialog
          mensaje="Se eliminará este documento permanentemente."
          onConfirm={() => { deleteDocumento(confirmId); setConfirmId(null); }}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  );
}
