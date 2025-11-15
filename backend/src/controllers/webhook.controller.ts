import { Request, Response, NextFunction } from 'express';
import { cacheService } from '../services/cache.service';
import { webhookService } from '../services/webhook.service';
import { AppError } from '../middlewares/errorHandler';

export const handleWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = req.body;

    if (event?.type === 'SubscriptionConfirmation') {
      console.log('Confirmación de suscripción');
      return res.status(200).send('KEYNUA');
    }

    console.log('Webhook:', JSON.stringify(event, null, 2));

    const eventType = event.type;
    const contractId = event.payload?.contractId;

    if (!contractId) {
      return next(new AppError(400, 'INVALID_REQUEST', 'Missing contractId'));
    }

    if (!eventType) {
      return next(new AppError(400, 'INVALID_REQUEST', 'Missing event type'));
    }

    cacheService.addWebhookEvent(contractId, eventType, event);
    webhookService.processEvent(eventType, contractId, event);

    res.status(200).json({
      received: true,
      contractId,
      eventType,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};
