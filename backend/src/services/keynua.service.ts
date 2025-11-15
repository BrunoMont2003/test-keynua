import { CreateContractPayload, KeynuaContractResponse } from '../types/keynua.types';
import { config } from '../config/index';
import { validateContractPayload, validateDocumentSize } from '../validation/contract.validation';
import { cacheService } from './cache.service';
import { httpClient } from './http.client';

export class KeynuaService {
  private apiKey: string;
  private apiToken: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = config.keynua.apiKey;
    this.apiToken = config.keynua.apiToken;
    this.baseUrl = config.keynua.apiUrl;
  }

  async createContract(payload: CreateContractPayload): Promise<KeynuaContractResponse> {
    validateContractPayload(payload);
    validateDocumentSize(payload.documents);

    const contractData = await httpClient.fetch<KeynuaContractResponse>(
      `${this.baseUrl}/contracts/v1`,
      {
        method: 'PUT',
        headers: {
          'x-api-key': this.apiKey,
          'authorization': this.apiToken,
          'content-type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    ).then(res => res.data);

    cacheService.setContractStatus(contractData.id, {
      id: contractData.id,
      status: contractData.status,
      title: contractData.title,
      createdAt: contractData.createdAt,
      users: payload.users.map(user => ({
        name: user.name,
        email: user.email || '',
        status: 'pending'
      })),
      webhookEvents: [{
        event: 'contract.created',
        timestamp: new Date().toISOString(),
        data: { contractId: contractData.id }
      }]
    });

    return contractData;
  }
}

