import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

// ---- Tipos ----
export interface Empresa {
  nombre: string;
  sector: string;
  responsable: string;
  email: string;
}

export interface Documento {
  id: string;
  codigo: string;
  titulo: string;
  categoria: string;
  estado: string;
  version: string;
  fechaEmision: string;
  fechaRevision: string;
  responsable: string;
  observaciones: string;
  enlace: string;
  createdAt: string;
}

export interface NoConformidad {
  id: string;
  codigo: string;
  titulo: string;
  descripcion: string;
  origen: string;
  prioridad: string;
  estado: string;
  accionCorrectiva: string;
  responsable: string;
  fechaDeteccion: string;
  fechaCierre: string;
  createdAt: string;
}

export interface Auditoria {
  id: string;
  codigo: string;
  titulo: string;
  tipo: string;
  modulo: string;
  auditor: string;
  estado: string;
  fechaInicio: string;
  fechaFin: string;
  hallazgos: string;
  conclusiones: string;
  createdAt: string;
}

export interface AspectoAmbiental {
  id: string;
  codigo: string;
  actividad: string;
  aspecto: string;
  impacto: string;
  significativo: boolean;
  medidas: string;
  responsable: string;
  estado: string;
  createdAt: string;
}

export interface Residuo {
  id: string;
  codigo: string;
  nombre: string;
  tipo: string;
  cantidad: string;
  unidad: string;
  gestor: string;
  destino: string;
  fecha: string;
  observaciones: string;
  createdAt: string;
}

export interface Riesgo {
  id: string;
  codigo: string;
  actividad: string;
  peligro: string;
  riesgo: string;
  probabilidad: string;
  consecuencia: string;
  nivel: string;
  medidas: string;
  epi: string;
  responsable: string;
  estado: string;
  createdAt: string;
}

export interface Accidente {
  id: string;
  codigo: string;
  tipo: string;
  descripcion: string;
  lugar: string;
  fecha: string;
  lesionados: string;
  diasBaja: string;
  gravedad: string;
  causas: string;
  accionesCorrectivas: string;
  investigado: boolean;
  createdAt: string;
}

interface DataContextType {
  empresa: Empresa;
  setEmpresa: (e: Empresa) => void;
  documentos: Documento[];
  addDocumento: (d: Omit<Documento, 'id' | 'createdAt'>) => void;
  updateDocumento: (id: string, d: Partial<Documento>) => void;
  deleteDocumento: (id: string) => void;
  noConformidades: NoConformidad[];
  addNoConformidad: (d: Omit<NoConformidad, 'id' | 'createdAt'>) => void;
  updateNoConformidad: (id: string, d: Partial<NoConformidad>) => void;
  deleteNoConformidad: (id: string) => void;
  auditorias: Auditoria[];
  addAuditoria: (d: Omit<Auditoria, 'id' | 'createdAt'>) => void;
  updateAuditoria: (id: string, d: Partial<Auditoria>) => void;
  deleteAuditoria: (id: string) => void;
  aspectos: AspectoAmbiental[];
  addAspecto: (d: Omit<AspectoAmbiental, 'id' | 'createdAt'>) => void;
  updateAspecto: (id: string, d: Partial<AspectoAmbiental>) => void;
  deleteAspecto: (id: string) => void;
  residuos: Residuo[];
  addResiduo: (d: Omit<Residuo, 'id' | 'createdAt'>) => void;
  updateResiduo: (id: string, d: Partial<Residuo>) => void;
  deleteResiduo: (id: string) => void;
  riesgos: Riesgo[];
  addRiesgo: (d: Omit<Riesgo, 'id' | 'createdAt'>) => void;
  updateRiesgo: (id: string, d: Partial<Riesgo>) => void;
  deleteRiesgo: (id: string) => void;
  accidentes: Accidente[];
  addAccidente: (d: Omit<Accidente, 'id' | 'createdAt'>) => void;
  updateAccidente: (id: string, d: Partial<Accidente>) => void;
  deleteAccidente: (id: string) => void;
  exportarCSV: (nombre: string, datos: object[]) => void;
}

const DataContext = createContext<DataContextType | null>(null);

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function load<T>(key: string, def: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : def;
  } catch { return def; }
}

function save(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [empresa, setEmpresaState] = useState<Empresa>(() =>
    load('sgi_empresa', { nombre: '', sector: '', responsable: '', email: '' })
  );
  const [documentos, setDocumentos] = useState<Documento[]>(() => load('sgi_documentos', []));
  const [noConformidades, setNoConformidades] = useState<NoConformidad[]>(() => load('sgi_ncs', []));
  const [auditorias, setAuditorias] = useState<Auditoria[]>(() => load('sgi_auditorias', []));
  const [aspectos, setAspectos] = useState<AspectoAmbiental[]>(() => load('sgi_aspectos', []));
  const [residuos, setResiduos] = useState<Residuo[]>(() => load('sgi_residuos', []));
  const [riesgos, setRiesgos] = useState<Riesgo[]>(() => load('sgi_riesgos', []));
  const [accidentes, setAccidentes] = useState<Accidente[]>(() => load('sgi_accidentes', []));

  useEffect(() => { save('sgi_empresa', empresa); }, [empresa]);
  useEffect(() => { save('sgi_documentos', documentos); }, [documentos]);
  useEffect(() => { save('sgi_ncs', noConformidades); }, [noConformidades]);
  useEffect(() => { save('sgi_auditorias', auditorias); }, [auditorias]);
  useEffect(() => { save('sgi_aspectos', aspectos); }, [aspectos]);
  useEffect(() => { save('sgi_residuos', residuos); }, [residuos]);
  useEffect(() => { save('sgi_riesgos', riesgos); }, [riesgos]);
  useEffect(() => { save('sgi_accidentes', accidentes); }, [accidentes]);

  const setEmpresa = useCallback((e: Empresa) => setEmpresaState(e), []);

  const now = () => new Date().toISOString();

  // Documentos
  const addDocumento = useCallback((d: Omit<Documento, 'id' | 'createdAt'>) => {
    setDocumentos(prev => [{ ...d, id: genId(), createdAt: now() }, ...prev]);
  }, []);
  const updateDocumento = useCallback((id: string, d: Partial<Documento>) => {
    setDocumentos(prev => prev.map(x => x.id === id ? { ...x, ...d } : x));
  }, []);
  const deleteDocumento = useCallback((id: string) => {
    setDocumentos(prev => prev.filter(x => x.id !== id));
  }, []);

  // No Conformidades
  const addNoConformidad = useCallback((d: Omit<NoConformidad, 'id' | 'createdAt'>) => {
    setNoConformidades(prev => [{ ...d, id: genId(), createdAt: now() }, ...prev]);
  }, []);
  const updateNoConformidad = useCallback((id: string, d: Partial<NoConformidad>) => {
    setNoConformidades(prev => prev.map(x => x.id === id ? { ...x, ...d } : x));
  }, []);
  const deleteNoConformidad = useCallback((id: string) => {
    setNoConformidades(prev => prev.filter(x => x.id !== id));
  }, []);

  // Auditorías
  const addAuditoria = useCallback((d: Omit<Auditoria, 'id' | 'createdAt'>) => {
    setAuditorias(prev => [{ ...d, id: genId(), createdAt: now() }, ...prev]);
  }, []);
  const updateAuditoria = useCallback((id: string, d: Partial<Auditoria>) => {
    setAuditorias(prev => prev.map(x => x.id === id ? { ...x, ...d } : x));
  }, []);
  const deleteAuditoria = useCallback((id: string) => {
    setAuditorias(prev => prev.filter(x => x.id !== id));
  }, []);

  // Aspectos
  const addAspecto = useCallback((d: Omit<AspectoAmbiental, 'id' | 'createdAt'>) => {
    setAspectos(prev => [{ ...d, id: genId(), createdAt: now() }, ...prev]);
  }, []);
  const updateAspecto = useCallback((id: string, d: Partial<AspectoAmbiental>) => {
    setAspectos(prev => prev.map(x => x.id === id ? { ...x, ...d } : x));
  }, []);
  const deleteAspecto = useCallback((id: string) => {
    setAspectos(prev => prev.filter(x => x.id !== id));
  }, []);

  // Residuos
  const addResiduo = useCallback((d: Omit<Residuo, 'id' | 'createdAt'>) => {
    setResiduos(prev => [{ ...d, id: genId(), createdAt: now() }, ...prev]);
  }, []);
  const updateResiduo = useCallback((id: string, d: Partial<Residuo>) => {
    setResiduos(prev => prev.map(x => x.id === id ? { ...x, ...d } : x));
  }, []);
  const deleteResiduo = useCallback((id: string) => {
    setResiduos(prev => prev.filter(x => x.id !== id));
  }, []);

  // Riesgos
  const addRiesgo = useCallback((d: Omit<Riesgo, 'id' | 'createdAt'>) => {
    setRiesgos(prev => [{ ...d, id: genId(), createdAt: now() }, ...prev]);
  }, []);
  const updateRiesgo = useCallback((id: string, d: Partial<Riesgo>) => {
    setRiesgos(prev => prev.map(x => x.id === id ? { ...x, ...d } : x));
  }, []);
  const deleteRiesgo = useCallback((id: string) => {
    setRiesgos(prev => prev.filter(x => x.id !== id));
  }, []);

  // Accidentes
  const addAccidente = useCallback((d: Omit<Accidente, 'id' | 'createdAt'>) => {
    setAccidentes(prev => [{ ...d, id: genId(), createdAt: now() }, ...prev]);
  }, []);
  const updateAccidente = useCallback((id: string, d: Partial<Accidente>) => {
    setAccidentes(prev => prev.map(x => x.id === id ? { ...x, ...d } : x));
  }, []);
  const deleteAccidente = useCallback((id: string) => {
    setAccidentes(prev => prev.filter(x => x.id !== id));
  }, []);

  const exportarCSV = useCallback((nombre: string, datos: object[]) => {
    if (!datos.length) return;
    const cols = Object.keys(datos[0]);
    const header = cols.join(';');
    const rows = datos.map(row =>
      cols.map(c => {
        const val = String((row as Record<string, unknown>)[c] ?? '').replace(/"/g, '""');
        return `"${val}"`;
      }).join(';')
    );
    const csv = '﻿' + [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${nombre}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return (
    <DataContext.Provider value={{
      empresa, setEmpresa,
      documentos, addDocumento, updateDocumento, deleteDocumento,
      noConformidades, addNoConformidad, updateNoConformidad, deleteNoConformidad,
      auditorias, addAuditoria, updateAuditoria, deleteAuditoria,
      aspectos, addAspecto, updateAspecto, deleteAspecto,
      residuos, addResiduo, updateResiduo, deleteResiduo,
      riesgos, addRiesgo, updateRiesgo, deleteRiesgo,
      accidentes, addAccidente, updateAccidente, deleteAccidente,
      exportarCSV,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData debe usarse dentro de DataProvider');
  return ctx;
}
