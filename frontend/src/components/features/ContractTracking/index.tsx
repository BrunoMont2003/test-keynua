import { useState, useEffect } from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { useContractAPI } from '../../../hooks/useContractAPI';
import { config } from '../../../config/environment';
import type { ContractStatusData } from '../../../services/api/contracts.api';
import { LoadingSpinner } from '../../shared/LoadingSpinner';
import { Button } from '../../shared/Button';
import { SignersList } from './SignersList';
import { Timeline } from './Timeline';

interface ContractTrackingProps {
  contractId: string;
  onCreateAnother: () => void;
}

export const ContractTracking: React.FC<ContractTrackingProps> = ({ contractId, onCreateAnother }) => {
  const { getContractStatus } = useContractAPI();
  const [status, setStatus] = useState<ContractStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [contractNotFound, setContractNotFound] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await getContractStatus(contractId);
        setStatus(data);
        setLastUpdate(new Date());
        setContractNotFound(false);
      } catch (error) {
        console.error('Error fetching status:', error);
        // Verificar si es un error 404
        if (error instanceof Error && error.message.includes('404')) {
          setContractNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, config.polling.contractStatusInterval);

    return () => clearInterval(interval);
  }, [contractId, getContractStatus]);

  if (contractNotFound) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <Clock size={48} className="mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Contrato no encontrado</h1>
            <p className="text-gray-600 mb-6">El contrato ha expirado o ha sido eliminado del servidor.</p>
            <Button variant="primary" onClick={onCreateAnother}>
              Crear nuevo contrato
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !status) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <LoadingSpinner message="Cargando estado del contrato..." />
        </div>
      </div>
    );
  }

  const allSigned = status.allSigned;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center mb-8 pb-8 border-b border-gray-200">
          <div className={`inline-flex justify-center mb-4 ${allSigned ? 'text-green-600' : 'text-blue-600'}`}>
            {allSigned ? <CheckCircle size={48} /> : <Clock size={48} />}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{allSigned ? 'Completado' : 'Enviado'}</h1>
          <p className="text-lg text-gray-600">
            {allSigned
              ? 'Todos los firmantes completaron la firma'
              : 'El contrato ha sido enviado a los firmantes'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progreso</span>
            <span className="text-sm font-semibold text-blue-600">{status.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-500"
              style={{ width: `${status.progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {status.signedCount} de {status.totalSigners} completados
          </p>
        </div>

        {/* Contract Details */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles</h3>
          <div className="space-y-3 bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-gray-600">ID</span>
              <span className="text-sm text-gray-900 font-mono break-all text-right max-w-xs">{status.id}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-gray-600">Título</span>
              <span className="text-sm text-gray-900 text-right">{status.title}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-gray-600">Estado</span>
              <span className="text-sm text-gray-900 text-right">{status.status}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-gray-600">Creado</span>
              <span className="text-sm text-gray-900 text-right">
                {new Date(status.createdAt).toLocaleString('es-PE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            {status.completedAt && (
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-600">Completado</span>
                <span className="text-sm text-gray-900 text-right">
                  {new Date(status.completedAt).toLocaleString('es-PE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Signers Status */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Firmantes</h3>
          <SignersList users={status.users} />
        </div>

        {/* Timeline */}
        {status.webhookEvents.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial</h3>
            <Timeline events={status.webhookEvents} />
          </div>
        )}

        {/* Auto-refresh indicator */}
        <div className="py-4 border-t border-gray-200 flex items-center justify-center text-sm text-gray-500">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
          Actualización automática • Última: {' '}
          {lastUpdate.toLocaleTimeString('es-PE', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-3 mt-8 pt-8 border-t border-gray-200">
          <Button variant="primary" onClick={onCreateAnother}>
            Crear otro
          </Button>
        </div>
      </div>
    </div>
  );
};
