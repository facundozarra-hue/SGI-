import { useState } from 'react';
import { Settings, Save, Download, Upload, Trash2, FileSpreadsheet } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function Configuracion() {
  const {
    empresa, setEmpresa,
    documentos, noConformidades, auditorias, aspectos, residuos, riesgos, accidentes,
    exportarCSV, importarBackup, borrarTodo,
  } = useData();
  const [form, setForm] = useState(empresa);
  const [guardado, setGuardado] = useState(false);
  const [importando, setImportando] = useState(false);
  const [borrando, setBorrando] = useState(false);

  const handleSave = () => {
    setEmpresa(form);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
  };

  const handleExportBackup = () => {
    const backup = {
      empresa,
      documentos: documentos.map(({ id, ...r }) => { void id; return r; }),
      noConformidades: noConformidades.map(({ id, ...r }) => { void id; return r; }),
      auditorias: auditorias.map(({ id, ...r }) => { void id; return r; }),
      aspectos: aspectos.map(({ id, ...r }) => { void id; return r; }),
      residuos: residuos.map(({ id, ...r }) => { void id; return r; }),
      riesgos: riesgos.map(({ id, ...r }) => { void id; return r; }),
      accidentes: accidentes.map(({ id, ...r }) => { void id; return r; }),
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
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          setImportando(true);
          await importarBackup(data);
          alert('✅ Datos importados correctamente en Firebase.');
        } catch { alert('❌ El archivo no es válido.'); }
        finally { setImportando(false); }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleImportCSV = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const text = ev.target?.result as string;
          const lines = text.split('\n').filter(Boolean);
          if (lines.length < 2) { alert('El CSV está vacío.'); return; }
          const cols = lines[0].replace(/"/g, '').split(';').map(c => c.trim());
          const rows = lines.slice(1).map(line => {
            const vals = line.replace(/^﻿/, '').split(';').map(v => v.replace(/^"|"$/g, '').trim());
            return Object.fromEntries(cols.map((c, i) => [c, vals[i] ?? '']));
          });
          // Detectar tipo por columnas
          const colsStr = cols.join(',').toLowerCase();
          let coleccion = '';
          if (colsStr.includes('titulo') && colsStr.includes('categoria')) coleccion = 'documentos';
          else if (colsStr.includes('titulo') && colsStr.includes('origen')) coleccion = 'noConformidades';
          else if (colsStr.includes('actividad') && colsStr.includes('peligro')) coleccion = 'riesgos';
          else if (colsStr.includes('actividad') && colsStr.includes('aspecto')) coleccion = 'aspectos';
          else if (colsStr.includes('nombre') && colsStr.includes('gestor')) coleccion = 'residuos';
          else if (colsStr.includes('descripcion') && colsStr.includes('gravedad')) coleccion = 'accidentes';
          else if (colsStr.includes('titulo') && colsStr.includes('auditor')) coleccion = 'auditorias';

          if (!coleccion) { alert('No se pudo detectar el tipo de datos del CSV. Exportá primero desde el sistema y usá ese formato.'); return; }

          setImportando(true);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await importarBackup({ [coleccion]: rows } as any);
          alert(`✅ ${rows.length} registros importados en ${coleccion}.`);
        } catch (err) { alert('❌ Error al procesar el CSV: ' + String(err)); }
        finally { setImportando(false); }
      };
      reader.readAsText(file, 'utf-8');
    };
    input.click();
  };

  const handleBorrarTodo = async () => {
    if (!confirm('⚠️ ¿Estás seguro de que querés borrar TODOS los datos de Firebase? Esta acción no se puede deshacer.')) return;
    setBorrando(true);
    try {
      await borrarTodo();
      alert('✅ Todos los datos fueron eliminados.');
    } catch { alert('❌ Error al borrar los datos.'); }
    finally { setBorrando(false); }
  };

  const totalRegistros = documentos.length + noConformidades.length + auditorias.length + aspectos.length + residuos.length + riesgos.length + accidentes.length;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings size={24} className="text-gray-600" /> Configuración
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
              <p className="text-xs text-gray-500 mt-0.5">Descarga todos los datos del SGI en formato JSON.</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <button onClick={handleExportBackup} className="btn-primary text-xs py-1.5">Descargar backup (.json)</button>
                <button onClick={() => exportarCSV('documentos', documentos)} className="btn-secondary text-xs py-1.5 flex items-center gap-1"><FileSpreadsheet size={13} /> Documentos CSV</button>
                <button onClick={() => exportarCSV('no_conformidades', noConformidades)} className="btn-secondary text-xs py-1.5 flex items-center gap-1"><FileSpreadsheet size={13} /> NC CSV</button>
                <button onClick={() => exportarCSV('riesgos', riesgos)} className="btn-secondary text-xs py-1.5 flex items-center gap-1"><FileSpreadsheet size={13} /> Riesgos CSV</button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl">
            <Upload size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-gray-800">Importar datos</p>
              <p className="text-xs text-gray-500 mt-0.5">Restaura desde un backup JSON, o importá registros desde un CSV exportado del sistema.</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <button onClick={handleImportBackup} disabled={importando} className="btn-secondary text-xs py-1.5 disabled:opacity-50">
                  {importando ? 'Importando...' : 'Importar backup (.json)'}
                </button>
                <button onClick={handleImportCSV} disabled={importando} className="btn-secondary text-xs py-1.5 flex items-center gap-1 disabled:opacity-50">
                  <FileSpreadsheet size={13} /> Importar CSV
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border border-red-200 bg-red-50 rounded-xl">
            <Trash2 size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-red-800">Borrar todos los datos</p>
              <p className="text-xs text-red-500 mt-0.5">Elimina permanentemente todos los registros de Firebase. Hacé un backup antes.</p>
              <button onClick={handleBorrarTodo} disabled={borrando} className="mt-3 text-xs py-1.5 px-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50">
                {borrando ? 'Borrando...' : 'Borrar todo'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
