import { VALIDATION_MESSAGES } from '../../config/constants';
import { ContractUser } from '../../types/api.types';
import type { FormState } from '../../hooks/useContractForm';

export interface ValidationResult {
  valid: boolean;
  errors?: Record<string, string>;
}

export class ContractValidator {
  static validateTitle(title: string): ValidationResult {
    if (!title || !title.trim()) {
      return {
        valid: false,
        errors: { title: VALIDATION_MESSAGES.TITLE_REQUIRED }
      };
    }
    return { valid: true };
  }
  static validateDocuments(documents: any[]): ValidationResult {
    if (!documents || documents.length === 0) {
      return {
        valid: false,
        errors: { documents: VALIDATION_MESSAGES.DOCUMENTS_REQUIRED }
      };
    }
    return { valid: true };
  }

  static validateSigners(users: ContractUser[]): ValidationResult {
    const errors: Record<string, string> = {};

    users.forEach((user, index) => {
      if (!user.name || !user.name.trim()) {
        errors[`user_${index}_name`] = VALIDATION_MESSAGES.USER_NAME_REQUIRED;
      }

      if (!user.email || !user.email.trim()) {
        errors[`user_${index}_email`] = VALIDATION_MESSAGES.USER_EMAIL_REQUIRED;
      } else if (!this.isValidEmail(user.email)) {
        errors[`user_${index}_email`] = VALIDATION_MESSAGES.USER_EMAIL_INVALID;
      }
    });

    return {
      valid: Object.keys(errors).length === 0,
      errors: Object.keys(errors).length > 0 ? errors : undefined
    };
  }

  static validateStep(step: number, formState: FormState): ValidationResult {
    switch (step) {
      case 0:
        return this.validateTitle(formState.title);
      case 1:
        return this.validateDocuments(formState.documents);
      case 2:
        return this.validateSigners(formState.users);
      default:
        return { valid: true };
    }
  }

  private static isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
