import { Router } from 'express';
import {
  createContract,
  getContractStatus,
  listContracts
} from '../controllers/contracts.controller';

const router = Router();

router.post('/contracts', createContract);
router.get('/contracts/:id', getContractStatus);
router.get('/contracts', listContracts);

export default router;

