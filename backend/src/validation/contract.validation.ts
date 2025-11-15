import { CreateContractPayload } from '../types/keynua.types';
import { VALIDATION_RULES } from '../constants/keynua.constants';

export class ContractValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ContractValidationError';
  }
}

export const validateContractPayload = (payload: CreateContractPayload): void => {
  if (!payload.title?.trim()) {
    throw new ContractValidationError('El título es requerido');
  }

  if (!payload.templateId?.trim()) {
    throw new ContractValidationError('El template ID es requerido');
  }

  if (!payload.documents || payload.documents.length < VALIDATION_RULES.documents.min) {
    throw new ContractValidationError(`Se requiere al menos ${VALIDATION_RULES.documents.min} documento`);
  }

  if (payload.documents.length > VALIDATION_RULES.documents.max) {
    throw new ContractValidationError(`Máximo ${VALIDATION_RULES.documents.max} documentos permitidos`);
  }

  payload.documents.forEach((doc, index) => {
    if (!doc.name?.trim()) {
      throw new ContractValidationError(`El documento ${index + 1} debe tener un nombre`);
    }
    if (!doc.base64 && !doc.storageId) {
      throw new ContractValidationError(`El documento ${index + 1} debe tener base64 o storageId`);
    }
  });

  if (!payload.users || payload.users.length === 0) {
    throw new ContractValidationError('Se requiere al menos un firmante');
  }

  payload.users.forEach((user, index) => {
    if (!user.name?.trim()) {
      throw new ContractValidationError(`El firmante ${index + 1} debe tener un nombre`);
    }
    if (!user.email?.trim()) {
      throw new ContractValidationError(`El firmante ${index + 1} debe tener un email para recibir la notificación de firma`);
    }
    if (!user.groups || user.groups.length === 0) {
      throw new ContractValidationError(`El firmante ${index + 1} debe pertenecer al menos a un grupo`);
    }
  });

  if (payload.expirationInHours !== undefined && payload.expirationInHours < VALIDATION_RULES.expirationInHours.min) {
    throw new ContractValidationError(`La expiración debe ser al menos de ${VALIDATION_RULES.expirationInHours.min} hora`);
  }
};

export const calculateTotalDocumentSize = (documents: { base64?: string }[]): number => {
  return documents.reduce((total, doc) => {
    if (!doc.base64) return total;
    const base64Length = doc.base64.replace(/^data:.*?;base64,/, '').length;
    const sizeInBytes = (base64Length * 3) / 4;
    return total + sizeInBytes;
  }, 0);
};

export const validateDocumentSize = (documents: { base64?: string }[]): void => {
  const totalSizeInMB = calculateTotalDocumentSize(documents) / (1024 * 1024);
  if (totalSizeInMB > VALIDATION_RULES.documents.maxTotalSizeMB) {
    throw new ContractValidationError(
      `Total document size (${totalSizeInMB.toFixed(2)}MB) exceeds maximum allowed (${VALIDATION_RULES.documents.maxTotalSizeMB}MB)`
    );
  }
};

