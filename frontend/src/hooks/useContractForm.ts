import { useState, useCallback } from 'react';
import { CreateContractPayload, Language, ContractDocument, ContractUser } from '../types/api.types';
import { KEYNUA_CONFIG } from '../constants/keynua.constants';

export interface FormState {
  title: string;
  description: string;
  language: Language;
  documents: ContractDocument[];
  users: ContractUser[];
}

const initialState: FormState = {
  title: '',
  description: '',
  language: Language.ES,
  documents: [],
  users: [{ name: '', email: '', groups: [KEYNUA_CONFIG.DEFAULT_USER_GROUP] }]
};

export const useContractForm = () => {
  const [formState, setFormState] = useState<FormState>(initialState);

  const updateField = useCallback(<K extends keyof FormState>(field: K, value: FormState[K]) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  }, []);

  const addUser = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      users: [...prev.users, { name: '', email: '', groups: [KEYNUA_CONFIG.DEFAULT_USER_GROUP] }]
    }));
  }, []);

  const removeUser = useCallback((index: number) => {
    setFormState(prev => ({
      ...prev,
      users: prev.users.filter((_, i) => i !== index)
    }));
  }, []);

  const updateUser = useCallback((index: number, field: keyof ContractUser, value: any) => {
    setFormState(prev => ({
      ...prev,
      users: prev.users.map((user, i) => i === index ? { ...user, [field]: value } : user)
    }));
  }, []);

  const buildPayload = useCallback((): CreateContractPayload => {
    const payload: CreateContractPayload = {
      title: formState.title,
      templateId: KEYNUA_CONFIG.DEFAULT_TEMPLATE_ID,
      language: formState.language,
      documents: formState.documents,
      users: formState.users,
      userEmailNotifications: true
    };

    if (formState.description) {
      payload.description = formState.description;
    }

    return payload;
  }, [formState]);

  const reset = useCallback(() => {
    setFormState(initialState);
  }, []);

  return {
    formState,
    updateField,
    addUser,
    removeUser,
    updateUser,
    buildPayload,
    reset
  };
};

