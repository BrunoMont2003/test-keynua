import { useState, useCallback } from 'react';

export const useMultiStepForm = (totalSteps: number) => {
  const [currentStep, setCurrentStep] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentStep(prev => (prev < totalSteps - 1 ? prev + 1 : prev));
  }, [totalSteps]);

  const goToPrevious = useCallback(() => {
    setCurrentStep(prev => (prev > 0 ? prev - 1 : prev));
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  }, [totalSteps]);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return {
    currentStep,
    goToNext,
    goToPrevious,
    goToStep,
    isFirstStep,
    isLastStep,
    progress: ((currentStep + 1) / totalSteps) * 100
  };
};
