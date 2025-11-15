import { cacheService } from './cache.service';

export class WebhookService {
  processContractCreatedEvent(contractId: string, _event: any): void {
  }

  processContractStartedEvent(contractId: string, event: any): void {
    cacheService.updateContractStatus(contractId, { status: 'started' });
    if (event.payload?.users) {
      event.payload.users.forEach((user: any) => {
        if (user.email) {
          cacheService.updateUserStatus(contractId, user.email, 'viewed');
        }
      });
    }
  }

  processContractFinishedEvent(contractId: string, event: any): void {
    cacheService.updateContractStatus(contractId, {
      status: 'completed',
      completedAt: event.payload?.finishedAt || new Date().toISOString()
    });
    if (event.payload?.users) {
      event.payload.users.forEach((user: any) => {
        if (user.email) {
          cacheService.updateUserStatus(
            contractId,
            user.email,
            'signed',
            event.payload?.finishedAt || new Date().toISOString()
          );
        }
      });
    }
  }

  processContractExpiredEvent(contractId: string, _event: any): void {
    cacheService.updateContractStatus(contractId, { status: 'expired' });
  }

  processContractCancelledEvent(contractId: string, _event: any): void {
    cacheService.updateContractStatus(contractId, { status: 'cancelled' });
  }

  processEvent(eventType: string, contractId: string, event: any): void {
    switch (eventType) {
      case 'ContractCreated':
        this.processContractCreatedEvent(contractId, event);
        break;
      case 'ContractStarted':
        this.processContractStartedEvent(contractId, event);
        break;
      case 'ContractFinished':
        this.processContractFinishedEvent(contractId, event);
        break;
      case 'ContractExpired':
        this.processContractExpiredEvent(contractId, event);
        break;
      case 'ContractCancelled':
        this.processContractCancelledEvent(contractId, event);
        break;
      default:
    }
  }
}

export const webhookService = new WebhookService();
