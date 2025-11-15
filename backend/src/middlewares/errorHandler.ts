import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/keynua.types';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const requestId = (res.locals.requestId || 'unknown') as string;

  // Log error
  if (err instanceof AppError) {
    console.error(`[${requestId}] ${err.code} (${err.statusCode}): ${err.message}`, err.details);
  } else {
    console.error(`[${requestId}] INTERNAL_ERROR:`, err);
  }

  // Prepare response
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const code = err instanceof AppError ? err.code : 'INTERNAL_ERROR';
  const message = err instanceof AppError ? err.message : 'Internal server error';
  const details = err instanceof AppError ? err.details : undefined;

  const response: ApiResponse<never> = {
    success: false,
    error: {
      message,
      code,
      ...(details && { details }),
    },
  };

  res.status(statusCode).json(response);
};

export default errorHandler;
