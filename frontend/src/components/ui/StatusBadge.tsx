interface StatusBadgeProps {
  status: string;
  type?: 'documento' | 'nc' | 'auditoria' | 'riesgo' | 'residuo' | 'generic';
}

const colorMap: Record<string, string> = {
  BORRADOR: 'bg-gray-100 text-gray-700',
  REVISION: 'bg-yellow-100 text-yellow-700',
  APROBADO: 'bg-green-100 text-green-700',
  OBSOLETO: 'bg-red-100 text-red-700',
  ABIERTA: 'bg-red-100 text-red-700',
  EN_PROCESO: 'bg-blue-100 text-blue-700',
  CERRADA: 'bg-green-100 text-green-700',
  CANCELADA: 'bg-gray-100 text-gray-500',
  PLANIFICADA: 'bg-blue-100 text-blue-700',
  EN_CURSO: 'bg-indigo-100 text-indigo-700',
  COMPLETADA: 'bg-green-100 text-green-700',
  IDENTIFICADO: 'bg-yellow-100 text-yellow-700',
  EN_TRATAMIENTO: 'bg-blue-100 text-blue-700',
  CONTROLADO: 'bg-green-100 text-green-700',
  BAJO: 'bg-green-100 text-green-700',
  MEDIO: 'bg-yellow-100 text-yellow-700',
  ALTO: 'bg-orange-100 text-orange-700',
  CRITICO: 'bg-red-100 text-red-700',
  PELIGROSO: 'bg-red-100 text-red-700',
  NO_PELIGROSO: 'bg-gray-100 text-gray-700',
  RECICLABLE: 'bg-green-100 text-green-700',
  ORGANICO: 'bg-lime-100 text-lime-700',
  INTERNA: 'bg-indigo-100 text-indigo-700',
  EXTERNA: 'bg-purple-100 text-purple-700',
  SEGUIMIENTO: 'bg-cyan-100 text-cyan-700',
  LEVE: 'bg-yellow-100 text-yellow-700',
  GRAVE: 'bg-orange-100 text-orange-700',
  MUY_GRAVE: 'bg-red-100 text-red-700',
  MORTAL: 'bg-red-900 text-red-100',
  ACTIVO: 'bg-green-100 text-green-700',
  INACTIVO: 'bg-gray-100 text-gray-500',
};

const labelMap: Record<string, string> = {
  BORRADOR: 'Borrador',
  REVISION: 'En revisión',
  APROBADO: 'Aprobado',
  OBSOLETO: 'Obsoleto',
  ABIERTA: 'Abierta',
  EN_PROCESO: 'En proceso',
  CERRADA: 'Cerrada',
  CANCELADA: 'Cancelada',
  PLANIFICADA: 'Planificada',
  EN_CURSO: 'En curso',
  COMPLETADA: 'Completada',
  IDENTIFICADO: 'Identificado',
  EN_TRATAMIENTO: 'En tratamiento',
  CONTROLADO: 'Controlado',
  BAJO: 'Bajo',
  MEDIO: 'Medio',
  ALTO: 'Alto',
  CRITICO: 'Crítico',
  PELIGROSO: 'Peligroso',
  NO_PELIGROSO: 'No peligroso',
  RECICLABLE: 'Reciclable',
  ORGANICO: 'Orgánico',
  INTERNA: 'Interna',
  EXTERNA: 'Externa',
  SEGUIMIENTO: 'Seguimiento',
  LEVE: 'Leve',
  GRAVE: 'Grave',
  MUY_GRAVE: 'Muy grave',
  MORTAL: 'Mortal',
  ACTIVO: 'Activo',
  INACTIVO: 'Inactivo',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const colorClass = colorMap[status] ?? 'bg-gray-100 text-gray-700';
  const label = labelMap[status] ?? status;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  );
}
