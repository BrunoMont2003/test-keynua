import { ContractStatus } from '../services/cache.service';

export interface IContractRepository {
  setContractStatus(contractId: string, status: ContractStatus): void;
  getContractStatus(contractId: string): ContractStatus | undefined;
  updateContractStatus(contractId: string, updates: Partial<ContractStatus>): ContractStatus | null;
  addWebhookEvent(contractId: string, event: string, data?: any): ContractStatus | null;
  updateUserStatus(
    contractId: string,
    userEmail: string,
    status: 'pending' | 'signed' | 'viewed',
    signedAt?: string
  ): ContractStatus | null;
  getAllContracts(): ContractStatus[];
  hasProcessedEvent(contractId: string, eventId: string): boolean;
  markEventAsProcessed(contractId: string, eventId: string, ttlSeconds?: number): void;
}
