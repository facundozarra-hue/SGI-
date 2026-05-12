export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  role: 'ADMIN' | 'MANAGER' | 'USER';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface Documento {
  id: string;
  codigo: string;
  titulo: string;
  descripcion?: string;
  version: string;
  estado: 'BORRADOR' | 'REVISION' | 'APROBADO' | 'OBSOLETO';
  modulo: string;
  categoria: string;
  fechaEmision: string;
  fechaRevision?: string;
  creadoPor?: { nombre: string; apellido: string };
  createdAt: string;
}

export interface NoConformidad {
  id: string;
  codigo: string;
  titulo: string;
  descripcion: string;
  origen: string;
  estado: 'ABIERTA' | 'EN_PROCESO' | 'CERRADA' | 'CANCELADA';
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  accionCorrectiva?: string;
  fechaDeteccion: string;
  fechaCierre?: string;
  responsable?: { nombre: string; apellido: string };
  createdAt: string;
}

export interface Auditoria {
  id: string;
  codigo: string;
  titulo: string;
  tipo: 'INTERNA' | 'EXTERNA' | 'SEGUIMIENTO';
  estado: 'PLANIFICADA' | 'EN_CURSO' | 'COMPLETADA' | 'CANCELADA';
  modulo: string;
  alcance?: string;
  fechaInicio: string;
  fechaFin: string;
  auditor: string;
  hallazgos?: string;
  conclusiones?: string;
  responsable?: { nombre: string; apellido: string };
  createdAt: string;
}

export interface AspectoAmbiental {
  id: string;
  codigo: string;
  actividad: string;
  aspecto: string;
  impacto: string;
  significativo: boolean;
  medidas?: string;
  indicador?: string;
  meta?: string;
  estado: string;
  createdAt: string;
}

export interface Residuo {
  id: string;
  codigo: string;
  nombre: string;
  tipo: 'PELIGROSO' | 'NO_PELIGROSO' | 'RECICLABLE' | 'ORGANICO';
  cantidad: number;
  unidad: string;
  gestor?: string;
  destino?: string;
  fecha: string;
  observaciones?: string;
  createdAt: string;
}

export interface Riesgo {
  id: string;
  codigo: string;
  actividad: string;
  peligro: string;
  riesgo: string;
  nivel: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO';
  estado: 'IDENTIFICADO' | 'EN_TRATAMIENTO' | 'CONTROLADO' | 'CERRADO';
  probabilidad: number;
  consecuencia: number;
  medidas?: string;
  epi?: string;
  responsable?: { nombre: string; apellido: string };
  createdAt: string;
}

export interface Accidente {
  id: string;
  codigo: string;
  tipo: string;
  descripcion: string;
  lugar: string;
  fecha: string;
  lesionados: number;
  diasBaja: number;
  gravedad: 'LEVE' | 'GRAVE' | 'MUY_GRAVE' | 'MORTAL';
  causas?: string;
  accionesCorrectivas?: string;
  investigado: boolean;
  responsable?: { nombre: string; apellido: string };
  createdAt: string;
}
