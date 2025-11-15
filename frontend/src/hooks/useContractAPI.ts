import { useState, useCallback } from 'react';
import { contractsAPI, ContractStatusData } from '../services/api/contracts.api';
import { CreateContractPayload, KeynuaContractResponse } from '../types/api.types';
import { useContractStorage } from './useContractStorage';
import { APIErrorWithStatus } from '../services/api/client';

export const useContractAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { clearContractId } = useContractStorage();

  const createContract = useCallback(async (payload: CreateContractPayload): Promise<KeynuaContractResponse> => {
    setLoading(true);
    setError(null);

    try {
      const contract = await contractsAPI.create(payload);
      return contract;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getContractStatus = useCallback(async (contractId: string): Promise<ContractStatusData> => {
    try {
      return await contractsAPI.getStatus(contractId);
    } catch (err) {
      if (err instanceof APIErrorWithStatus && err.statusCode === 404) {
        console.warn(`Contrato ${contractId} no encontrado. Limpiando del storage...`);
        clearContractId();
      }
      const message = err instanceof Error ? err.message : 'Error al obtener estado';
      setError(message);
      throw err;
    }
  }, [clearContractId]);

  const getContract = useCallback(async (contractId: string): Promise<KeynuaContractResponse> => {
    try {
      return await contractsAPI.getById(contractId);
    } catch (err) {
      if (err instanceof APIErrorWithStatus && err.statusCode === 404) {
        console.warn(`Contrato ${contractId} no encontrado. Limpiando del storage...`);
        clearContractId();
      }
      const message = err instanceof Error ? err.message : 'Error al obtener contrato';
      setError(message);
      throw err;
    }
  }, [clearContractId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    createContract,
    getContractStatus,
    getContract,
    loading,
    error,
    clearError
  };
};
