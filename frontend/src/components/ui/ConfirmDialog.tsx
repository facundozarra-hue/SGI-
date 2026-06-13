import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  mensaje: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ mensaje, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={28} className="text-red-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">¿Eliminar registro?</h3>
        <p className="text-gray-500 text-sm mb-6">{mensaje}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 btn-secondary">Cancelar</button>
          <button onClick={onConfirm} className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm">
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
