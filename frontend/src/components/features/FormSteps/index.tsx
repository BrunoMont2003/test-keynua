/**
 * Router de pasos del formulario
 * SRP: Solo decidir qué paso renderizar
 */

import React from 'react';
import { DocumentStep } from './DocumentStep';
import { DocumentsStep } from './DocumentsStep';
import { SignersStep } from './SignersStep';

interface FormStepsProps {
  currentStep: number;
  onError: (error: string) => void;
}

export const FormSteps: React.FC<FormStepsProps> = ({ currentStep, onError }) => {
  switch (currentStep) {
    case 0:
      return <DocumentStep />;
    case 1:
      return <DocumentsStep onError={onError} />;
    case 2:
      return <SignersStep />;
    default:
      return null;
  }
};
