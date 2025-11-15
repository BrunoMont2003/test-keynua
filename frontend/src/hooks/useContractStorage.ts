import { useCallback } from 'react';
import { config } from '../config/environment';
import { storageService } from '../services/storage/localStorage';

export const useContractStorage = () => {
  const saveContractId = useCallback((contractId: string) => {
    storageService.set(config.storage.keys.currentContractId, contractId);
  }, []);

  const getContractId = useCallback((): string | null => {
    return storageService.get(config.storage.keys.currentContractId);
  }, []);

  const clearContractId = useCallback(() => {
    storageService.remove(config.storage.keys.currentContractId);
  }, []);

  return {
    saveContractId,
    getContractId,
    clearContractId
  };
};
