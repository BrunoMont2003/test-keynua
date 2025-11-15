import NodeCache from 'node-cache';
import { IContractRepository } from '../repositories/contract.repository';

export interface ContractStatus {
  id: string;
  status: string;
  title: string;
  createdAt: string;
  users: Array<{
    name: string;
    email: string;
    status: 'pending' | 'signed' | 'viewed';
    signedAt?: string;
  }>;
  completedAt?: string;
  webhookEvents: Array<{
    event: string;
    timestamp: string;
    data?: any;
  }>;
}

class CacheService implements IContractRepository {
  private cache: NodeCache;
  private processedEvents: NodeCache;

  constructor() {
    this.cache = new NodeCache({ stdTTL: 86400, checkperiod: 600 });
    this.processedEvents = new NodeCache({ stdTTL: 3600, checkperiod: 300 });
  }

  setContractStatus(contractId: string, status: ContractStatus): void {
    this.cache.set(`contract:${contractId}`, status);
  }

  getContractStatus(contractId: string): ContractStatus | undefined {
    return this.cache.get(`contract:${contractId}`);
  }

  updateContractStatus(
    contractId: string,
    updates: Partial<ContractStatus>
  ): ContractStatus | null {
    const current = this.getContractStatus(contractId);
    if (!current) return null;

    const updated = { ...current, ...updates };
    this.setContractStatus(contractId, updated);
    return updated;
  }

  addWebhookEvent(
    contractId: string,
    event: string,
    data?: any
  ): ContractStatus | null {
    const contract = this.getContractStatus(contractId);
    if (!contract) return null;

    contract.webhookEvents.push({
      event,
      timestamp: new Date().toISOString(),
      data
    });

    this.setContractStatus(contractId, contract);
    return contract;
  }

  updateUserStatus(
    contractId: string,
    userEmail: string,
    status: 'pending' | 'signed' | 'viewed',
    signedAt?: string
  ): ContractStatus | null {
    const contract = this.getContractStatus(contractId);
    if (!contract) return null;

    const user = contract.users.find(u => u.email === userEmail);
    if (user) {
      user.status = status;
      if (signedAt) user.signedAt = signedAt;
    }

    this.setContractStatus(contractId, contract);
    return contract;
  }

  getAllContracts(): ContractStatus[] {
    const keys = this.cache.keys();
    return keys
      .filter(key => key.startsWith('contract:'))
      .map(key => this.cache.get(key))
      .filter((contract): contract is ContractStatus => contract !== undefined);
  }

  hasProcessedEvent(contractId: string, eventId: string): boolean {
    const key = `${contractId}:${eventId}`;
    return this.processedEvents.has(key);
  }

  markEventAsProcessed(contractId: string, eventId: string, ttlSeconds = 3600): void {
    const key = `${contractId}:${eventId}`;
    this.processedEvents.set(key, true, ttlSeconds);
  }
}

export const cacheService = new CacheService();
