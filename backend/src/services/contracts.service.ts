import { CreateContractPayload, KeynuaContractResponse } from '../types/keynua.types';
import { KeynuaService } from './keynua.service';
import { cacheService, ContractStatus } from './cache.service';
import { calculateProgress } from '../utils/progress';

export class ContractsService {
  private keynuaService: KeynuaService;

  constructor() {
    this.keynuaService = new KeynuaService();
  }

  async createContract(payload: CreateContractPayload): Promise<KeynuaContractResponse> {
    return this.keynuaService.createContract(payload);
  }

  getContractWithStatus(contractId: string): (ContractStatus & ReturnType<typeof calculateProgress>) | null {
    const status = cacheService.getContractStatus(contractId);
    if (!status) return null;

    const progressData = calculateProgress(status);
    return {
      ...status,
      ...progressData
    };
  }

  getAllContracts() {
    return cacheService.getAllContracts().map(c => {
      const progressData = calculateProgress(c);
      return {
        id: c.id,
        title: c.title,
        status: c.status,
        createdAt: c.createdAt,
        usersCount: c.users.length,
        eventsCount: c.webhookEvents.length,
        ...progressData
      };
    });
  }
}

export const contractsService = new ContractsService();
