import React, { createContext, useContext, ReactNode } from 'react';
import { useContractForm, FormState } from '../hooks/useContractForm';
import { useMultiStepForm } from '../hooks/useMultiStepForm';
import { useFormValidation } from '../hooks/useFormValidation';
import { TOTAL_STEPS } from '../config/constants';

import type { ContractUser } from '../types/api.types';

export interface ContractContextType {
  // Form state
  formState: FormState;
  updateField: (field: keyof FormState, value: any) => void;
  addUser: () => void;
  removeUser: (index: number) => void;
  updateUser: (index: number, field: keyof ContractUser, value: any) => void;
  buildPayload: () => any;
  resetForm: () => void;

  // Step navigation
  currentStep: number;
  goToNext: () => void;
  goToPrevious: () => void;
  goToStep: (step: number) => void;
  isFirstStep: boolean;
  isLastStep: boolean;

  // Validation
  fieldErrors: Record<string, string>;
  validateStep: (step: number) => boolean;
  clearErrors: () => void;
  clearFieldError: (fieldName: string) => void;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

interface ContractProviderProps {
  children: ReactNode;
}

export const ContractProvider: React.FC<ContractProviderProps> = ({ children }) => {
  const { formState, updateField, addUser, removeUser, updateUser, buildPayload, reset } = useContractForm();
  const { currentStep, goToNext, goToPrevious, goToStep, isFirstStep, isLastStep } = useMultiStepForm(TOTAL_STEPS);
  const { fieldErrors, validateStep: _validateStep, clearErrors, clearFieldError } = useFormValidation();

  const validateStep = (step: number): boolean => {
    return _validateStep(step, formState);
  };

  const value: ContractContextType = {
    // Form
    formState,
    updateField,
    addUser,
    removeUser,
    updateUser,
    buildPayload,
    resetForm: reset,

    // Navigation
    currentStep,
    goToNext,
    goToPrevious,
    goToStep,
    isFirstStep,
    isLastStep,

    // Validation
    fieldErrors,
    validateStep,
    clearErrors,
    clearFieldError
  };

  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = (): ContractContextType => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error('useContract debe estar dentro de ContractProvider');
  }
  return context;
};
