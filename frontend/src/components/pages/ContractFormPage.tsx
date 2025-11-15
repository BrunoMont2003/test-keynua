/**
 * Página de Creación de Contrato
 * Responsabilidad: Coordinar formulario y tracking
 */

import React, { useState } from 'react';
import { ContractForm } from '../features/ContractForm';
import { ContractTracking } from '../features/ContractTracking';
import { useContractStorage } from '../../hooks/useContractStorage';
import { LoadingSpinner } from '../shared/LoadingSpinner';

export const ContractFormPage: React.FC = () => {
  const [contractId, setContractId] = useState<string | null>(null);
  const [restoringContract, setRestoringContract] = useState(true);
  const { getContractId, clearContractId, saveContractId } = useContractStorage();

  React.useEffect(() => {
    const restore = async () => {
      try {
        const savedId = getContractId();
        if (savedId) {
          setContractId(savedId);
        }
      } finally {
        setRestoringContract(false);
      }
    };
    restore();
  }, []);

  if (restoringContract) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <LoadingSpinner message="Restaurando contrato..." />
        </div>
      </div>
    );
  }

  if (contractId) {
    return (
      <ContractTracking
        contractId={contractId}
        onCreateAnother={() => {
          clearContractId();
          setContractId(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12 pt-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Crear Contrato</h1>
        <p className="text-lg text-gray-600">Completa los pasos para enviar tu contrato</p>
      </div>

      <ContractForm
        onSuccess={(id) => {
          saveContractId(id);
          setContractId(id);
        }}
      />
    </div>
  );
};
