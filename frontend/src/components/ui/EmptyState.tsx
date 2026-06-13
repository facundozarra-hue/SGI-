import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  titulo: string;
  descripcion: string;
  accion?: ReactNode;
}

export default function EmptyState({ icon, titulo, descripcion, accion }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-400">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-gray-700 mb-1">{titulo}</h3>
      <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto">{descripcion}</p>
      {accion}
    </div>
  );
}
