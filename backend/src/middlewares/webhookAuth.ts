import { Request, Response, NextFunction } from 'express';
import { config } from '../config/index';
import { constantTimeEqual } from '../utils/crypto';
import { AppError } from './errorHandler';

export const webhookAuth = (req: Request, _res: Response, next: NextFunction) => {
  const apiKeyHeader = req.headers['x-api-key'];
  const expectedApiKey = config.webhook.apiKey;

  if (!expectedApiKey) {
    return next();
  }

  if (!apiKeyHeader) {
    return next(new AppError(401, 'UNAUTHORIZED', 'Missing webhook authentication header'));
  }

  const apiKey = typeof apiKeyHeader === 'string' ? apiKeyHeader : apiKeyHeader[0];

  if (!constantTimeEqual(apiKey, expectedApiKey)) {
    return next(new AppError(401, 'UNAUTHORIZED', 'Invalid webhook API key'));
  }

  next();
};

export default webhookAuth;
