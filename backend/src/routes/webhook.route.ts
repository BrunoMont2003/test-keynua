import { Router } from 'express';
import { handleWebhook } from '../controllers/webhook.controller';
import { webhookAuth } from '../middlewares/webhookAuth';

const router = Router();

router.post('/webhook', webhookAuth, handleWebhook);

export default router;
