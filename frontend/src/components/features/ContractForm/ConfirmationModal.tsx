import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useContract } from '../../../context/ContractContext';
import { Modal } from '../../shared/Modal';
import { Button } from '../../shared/Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  loading
}) => {
  const { formState } = useContract();

  const footer = (
    <>
      <Button variant="secondary" onClick={onCancel} disabled={loading}>
        Cancelar
      </Button>
      <Button variant="primary" onClick={onConfirm} isLoading={loading}>
        {loading ? 'Enviando...' : 'Enviar'}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Confirmar envío"
      footer={footer}
      closeOnOverlay={!loading}
    >
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">Resumen</h3>

        <div className="border-b border-gray-200 py-3">
          <div className="text-sm font-medium text-gray-600">Título</div>
          <div className="text-gray-900">{formState.title}</div>
        </div>

        {formState.description && (
          <div className="border-b border-gray-200 py-3">
            <div className="text-sm font-medium text-gray-600">Descripción</div>
            <div className="text-gray-900">{formState.description}</div>
          </div>
        )}

        <div className="border-b border-gray-200 py-3">
          <div className="text-sm font-medium text-gray-600">Idioma</div>
          <div className="text-gray-900">
            {formState.language === 'es' ? 'Español' : 'English'}
          </div>
        </div>

        <div className="border-b border-gray-200 py-3">
          <div className="text-sm font-medium text-gray-600">Archivos ({formState.documents.length})</div>
          <div className="mt-2 space-y-1">
            {formState.documents.map((doc, i) => (
              <div key={i} className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-700">
                {doc.name}
              </div>
            ))}
          </div>
        </div>

        <div className="border-b border-gray-200 py-3">
          <div className="text-sm font-medium text-gray-600">Firmantes ({formState.users.length})</div>
          <div className="mt-2 space-y-1">
            {formState.users.map((user, i) => (
              <div key={i} className="px-2 py-1 bg-gray-100 rounded">
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                <div className="text-xs text-gray-600">{user.email}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 p-4 mt-4 bg-amber-50 border-l-4 border-amber-400 rounded">
        <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold text-amber-900">Confirmar envío</div>
          <p className="text-sm text-amber-800 mt-1">
            Se enviará un email a todos los firmantes. Esta acción no se puede deshacer.
          </p>
        </div>
      </div>
    </Modal>
  );
};
