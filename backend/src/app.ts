import express from 'express';
import cors from 'cors';
import { config } from './config/index';
import { requestLogger } from './middlewares/requestLogger';
import { errorHandler } from './middlewares/errorHandler';
import contractsRouter from './routes/contracts.route';
import webhookRouter from './routes/webhook.route';

const app = express();

// Middleware: CORS
app.use(cors({ origin: config.corsOrigin }));

// Middleware: Request logging
app.use(requestLogger);

// Middleware: Body parsing
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api', contractsRouter);
app.use('/api', webhookRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
