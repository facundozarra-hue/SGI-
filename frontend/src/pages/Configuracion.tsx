import { useState } from 'react';
import { Settings, Save, Download, Upload, Trash2 } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function Configuracion() {
  const { empresa, setEmpresa, documentos, noConformidades, auditorias, aspectos, residuos, riesgos, accidentes } = useData();
  const [form, setForm] = useState(empresa);
  const [guardado, setGuardado] = useState(false);

  const handleSave = () => {
    setEmpresa(form);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
  };

  const handleExportBackup = () => {
    const backup = {
      empresa, documentos, noConformidades, auditorias,
      aspectos, residuos, riesgos, accidentes,
      exportadoEl: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_sgi_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          if (data.empresa) localStorage.setItem('sgi_empresa', JSON.stringify(data.empresa));
          if (data.documentos) localStorage.setItem('sgi_documentos', JSON.stringify(data.documentos));
          if (data.noConformidades) localStorage.setItem('sgi_ncs', JSON.stringify(data.noConformidades));
          if (data.auditorias) localStorage.setItem('sgi_auditorias', JSON.stringify(data.auditorias));
          if (data.aspectos) localStorage.setItem('sgi_aspectos', JSON.stringify(data.aspectos));
          if (data.residuos) localStorage.setItem('sgi_residuos', JSON.stringify(data.residuos));
          if (data.riesgos) localStorage.setItem('sgi_riesgos', JSON.stringify(data.riesgos));
          if (data.accidentes) localStorage.setItem('sgi_accidentes', JSON.stringify(data.accidentes));
          alert('✅ Datos importados correctamente. La página se recargará.');
          window.location.reload();
        } catch { alert('❌ El archivo no es válido.'); }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleBorrarTodo = () => {
    if (!confirm('⚠️ ¿Estás seguro de que quieres borrar TODOS los datos? Esta acción no se puede deshacer.')) return;
    ['sgi_empresa','sgi_documentos','sgi_ncs','sgi_auditorias','sgi_aspectos','sgi_residuos','sgi_riesgos','sgi_accidentes'].forEach(k => localStorage.removeItem(k));
    window.location.reload();
  };

  const totalRegistros = documentos.length + noConformidades.length + auditorias.length + aspectos.length + residuos.length + riesgos.length + accidentes.length;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings size={24} className="text-gray-600" />
          Configuración
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">Datos de la empresa y gestión del sistema</p>
      </div>

      <div className="card space-y-5">
        <h2 className="font-bold text-gray-800 text-base">Datos de la empresa</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la empresa *</label>
            <input className="input" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Talleres García S.A." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sector / Rubro</label>
            <input className="input" value={form.sector} onChange={e => setForm({ ...form, sector: e.target.value })} placeholder="Ej: Metalurgia, Construcción..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Responsable del SGI</label>
            <input className="input" value={form.responsable} onChange={e => setForm({ ...form, responsable: e.target.value })} placeholder="Nombre completo" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email de contacto</label>
            <input className="input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="sgi@empresa.com" />
          </div>
        </div>
        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          <Save size={16} />
          {guardado ? '✅ ¡Guardado!' : 'Guardar cambios'}
        </button>
      </div>

      <div className="card space-y-4">
        <h2 className="font-bold text-gray-800 text-base">Datos del sistema</h2>
        <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {[
            { label: 'Documentos', val: documentos.length },
            { label: 'No Conformidades', val: noConformidades.length },
            { label: 'Auditorías', val: auditorias.length },
            { label: 'Total registros', val: totalRegistros },
          ].map(item => (
            <div key={item.label}>
              <p className="text-2xl font-bold text-indigo-700">{item.val}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl">
            <Download size={20} className="text-indigo-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-gray-800">Exportar copia de seguridad</p>
              <p className="text-xs text-gray-500 mt-0.5">Descarga todos los datos del SGI en un archivo para guardar o transferir a otro equipo.</p>
              <button onClick={handleExportBackup} className="btn-primary mt-3 text-xs py-1.5">Descargar backup</button>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl">
            <Upload size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-gray-800">Importar copia de seguridad</p>
              <p className="text-xs text-gray-500 mt-0.5">Restaura los datos desde un archivo backup previamente descargado.</p>
              <button onClick={handleImportBackup} className="btn-secondary mt-3 text-xs py-1.5">Seleccionar archivo</button>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border border-red-200 bg-red-50 rounded-xl">
            <Trash2 size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-red-800">Borrar todos los datos</p>
              <p className="text-xs text-red-500 mt-0.5">Elimina permanentemente todos los registros. Recomendamos hacer un backup antes.</p>
              <button onClick={handleBorrarTodo} className="mt-3 text-xs py-1.5 px-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                Borrar todo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
