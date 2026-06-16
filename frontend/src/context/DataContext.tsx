import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, setDoc, getDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

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
  cargando: boolean;
}

const DataContext = createContext<DataContextType | null>(null);

const EMPRESA_DEFAULT: Empresa = { nombre: '', sector: '', responsable: '', email: '' };

function snapToList<T extends { id: string }>(snap: { docs: { id: string; data: () => object }[] }): T[] {
  return snap.docs
    .map(d => ({ ...d.data(), id: d.id } as T))
    .sort((a, b) => ((b as unknown as { createdAt?: string }).createdAt ?? '') > ((a as unknown as { createdAt?: string }).createdAt ?? '') ? 1 : -1);
}

const now = () => new Date().toISOString();

export function DataProvider({ children }: { children: ReactNode }) {
  const [empresa, setEmpresaState] = useState<Empresa>(EMPRESA_DEFAULT);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [noConformidades, setNoConformidades] = useState<NoConformidad[]>([]);
  const [auditorias, setAuditorias] = useState<Auditoria[]>([]);
  const [aspectos, setAspectos] = useState<AspectoAmbiental[]>([]);
  const [residuos, setResiduos] = useState<Residuo[]>([]);
  const [riesgos, setRiesgos] = useState<Riesgo[]>([]);
  const [accidentes, setAccidentes] = useState<Accidente[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getDoc(doc(db, 'config', 'empresa')).then(snap => {
      if (snap.exists()) setEmpresaState(snap.data() as Empresa);
    });
  }, []);

  useEffect(() => {
    let resolved = false;
    const unsubs = [
      onSnapshot(collection(db, 'documentos'), snap => {
        setDocumentos(snapToList<Documento>(snap));
        if (!resolved) { resolved = true; setCargando(false); }
      }),
      onSnapshot(collection(db, 'noConformidades'), snap => setNoConformidades(snapToList<NoConformidad>(snap))),
      onSnapshot(collection(db, 'auditorias'), snap => setAuditorias(snapToList<Auditoria>(snap))),
      onSnapshot(collection(db, 'aspectos'), snap => setAspectos(snapToList<AspectoAmbiental>(snap))),
      onSnapshot(collection(db, 'residuos'), snap => setResiduos(snapToList<Residuo>(snap))),
      onSnapshot(collection(db, 'riesgos'), snap => setRiesgos(snapToList<Riesgo>(snap))),
      onSnapshot(collection(db, 'accidentes'), snap => setAccidentes(snapToList<Accidente>(snap))),
    ];
    return () => unsubs.forEach(u => u());
  }, []);

  const setEmpresa = useCallback((e: Empresa) => {
    setEmpresaState(e);
    setDoc(doc(db, 'config', 'empresa'), e);
  }, []);

  const addDocumento = useCallback((d: Omit<Documento, 'id' | 'createdAt'>) => {
    addDoc(collection(db, 'documentos'), { ...d, createdAt: now() });
  }, []);
  const updateDocumento = useCallback((id: string, d: Partial<Documento>) => {
    updateDoc(doc(db, 'documentos', id), d as Record<string, unknown>);
  }, []);
  const deleteDocumento = useCallback((id: string) => {
    deleteDoc(doc(db, 'documentos', id));
  }, []);

  const addNoConformidad = useCallback((d: Omit<NoConformidad, 'id' | 'createdAt'>) => {
    addDoc(collection(db, 'noConformidades'), { ...d, createdAt: now() });
  }, []);
  const updateNoConformidad = useCallback((id: string, d: Partial<NoConformidad>) => {
    updateDoc(doc(db, 'noConformidades', id), d as Record<string, unknown>);
  }, []);
  const deleteNoConformidad = useCallback((id: string) => {
    deleteDoc(doc(db, 'noConformidades', id));
  }, []);

  const addAuditoria = useCallback((d: Omit<Auditoria, 'id' | 'createdAt'>) => {
    addDoc(collection(db, 'auditorias'), { ...d, createdAt: now() });
  }, []);
  const updateAuditoria = useCallback((id: string, d: Partial<Auditoria>) => {
    updateDoc(doc(db, 'auditorias', id), d as Record<string, unknown>);
  }, []);
  const deleteAuditoria = useCallback((id: string) => {
    deleteDoc(doc(db, 'auditorias', id));
  }, []);

  const addAspecto = useCallback((d: Omit<AspectoAmbiental, 'id' | 'createdAt'>) => {
    addDoc(collection(db, 'aspectos'), { ...d, createdAt: now() });
  }, []);
  const updateAspecto = useCallback((id: string, d: Partial<AspectoAmbiental>) => {
    updateDoc(doc(db, 'aspectos', id), d as Record<string, unknown>);
  }, []);
  const deleteAspecto = useCallback((id: string) => {
    deleteDoc(doc(db, 'aspectos', id));
  }, []);

  const addResiduo = useCallback((d: Omit<Residuo, 'id' | 'createdAt'>) => {
    addDoc(collection(db, 'residuos'), { ...d, createdAt: now() });
  }, []);
  const updateResiduo = useCallback((id: string, d: Partial<Residuo>) => {
    updateDoc(doc(db, 'residuos', id), d as Record<string, unknown>);
  }, []);
  const deleteResiduo = useCallback((id: string) => {
    deleteDoc(doc(db, 'residuos', id));
  }, []);

  const addRiesgo = useCallback((d: Omit<Riesgo, 'id' | 'createdAt'>) => {
    addDoc(collection(db, 'riesgos'), { ...d, createdAt: now() });
  }, []);
  const updateRiesgo = useCallback((id: string, d: Partial<Riesgo>) => {
    updateDoc(doc(db, 'riesgos', id), d as Record<string, unknown>);
  }, []);
  const deleteRiesgo = useCallback((id: string) => {
    deleteDoc(doc(db, 'riesgos', id));
  }, []);

  const addAccidente = useCallback((d: Omit<Accidente, 'id' | 'createdAt'>) => {
    addDoc(collection(db, 'accidentes'), { ...d, createdAt: now() });
  }, []);
  const updateAccidente = useCallback((id: string, d: Partial<Accidente>) => {
    updateDoc(doc(db, 'accidentes', id), d as Record<string, unknown>);
  }, []);
  const deleteAccidente = useCallback((id: string) => {
    deleteDoc(doc(db, 'accidentes', id));
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
      cargando,
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
