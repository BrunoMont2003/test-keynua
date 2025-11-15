import { Request, Response, NextFunction } from 'express';
import { CreateContractPayload, ApiResponse, KeynuaContractResponse } from '../types/keynua.types';
import { ContractValidationError } from '../validation/contract.validation';
import { contractsService } from '../services/contracts.service';
import { AppError } from '../middlewares/errorHandler';

export const createContract = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload: CreateContractPayload = req.body;
    const contract = await contractsService.createContract(payload);

    const response: ApiResponse<KeynuaContractResponse> = {
      success: true,
      data: contract
    };

    res.json(response);
  } catch (error) {
    if (error instanceof ContractValidationError) {
      return next(new AppError(400, 'VALIDATION_ERROR', error.message));
    }
    next(error);
  }
};

export const getContractStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contractWithStatus = contractsService.getContractWithStatus(req.params.id);

    if (!contractWithStatus) {
      return next(new AppError(404, 'NOT_FOUND', 'Contract not found'));
    }

    res.json({
      success: true,
      data: contractWithStatus
    });
  } catch (error) {
    next(error);
  }
};

export const listContracts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const contracts = contractsService.getAllContracts();
    res.json({
      success: true,
      data: contracts
    });
  } catch (error) {
    next(error);
  }
};
