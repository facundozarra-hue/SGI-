const colorMap: Record<string, string> = {
  // Estados documentos
  'Borrador': 'bg-gray-100 text-gray-600',
  'En revisión': 'bg-yellow-100 text-yellow-700',
  'Aprobado': 'bg-green-100 text-green-700',
  'Obsoleto': 'bg-red-100 text-red-700',
  // Estados NC
  'Abierta': 'bg-red-100 text-red-700',
  'En proceso': 'bg-blue-100 text-blue-700',
  'Cerrada': 'bg-green-100 text-green-700',
  // Estados auditoría
  'Planificada': 'bg-blue-100 text-blue-700',
  'En curso': 'bg-indigo-100 text-indigo-700',
  'Completada': 'bg-green-100 text-green-700',
  'Cancelada': 'bg-gray-100 text-gray-500',
  // Tipos auditoría
  'Interna': 'bg-indigo-100 text-indigo-700',
  'Externa': 'bg-purple-100 text-purple-700',
  // Riesgos
  'Identificado': 'bg-yellow-100 text-yellow-700',
  'En tratamiento': 'bg-blue-100 text-blue-700',
  'Controlado': 'bg-green-100 text-green-700',
  // Residuos
  'Peligroso': 'bg-red-100 text-red-700',
  'No peligroso': 'bg-gray-100 text-gray-600',
  'Reciclable': 'bg-green-100 text-green-700',
  'Orgánico': 'bg-lime-100 text-lime-700',
  // Aspectos
  'Activo': 'bg-green-100 text-green-700',
  'Inactivo': 'bg-gray-100 text-gray-500',
};

export default function StatusBadge({ status }: { status: string }) {
  const cls = colorMap[status] ?? 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}
