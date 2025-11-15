import { useState, useCallback } from 'react';
import { ContractValidator } from '../core/contracts/validators';
import type { FormState } from './useContractForm';

export const useFormValidation = () => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateStep = useCallback((step: number, formState: FormState): boolean => {
    const result = ContractValidator.validateStep(step, formState);

    if (!result.valid && result.errors) {
      setFieldErrors(result.errors);
    } else {
      setFieldErrors({});
    }

    return result.valid;
  }, []);

  const clearErrors = useCallback(() => {
    setFieldErrors({});
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setFieldErrors(prev => {
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
  }, []);

  return {
    fieldErrors,
    validateStep,
    clearErrors,
    clearFieldError,
    setFieldErrors
  };
};
