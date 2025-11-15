import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useContract } from '../../../context/ContractContext';
import { useContractAPI } from '../../../hooks/useContractAPI';
import { FormSteps } from '../FormSteps';
import { ConfirmationModal } from './ConfirmationModal';
import { StepIndicator } from '../../shared/StepIndicator';
import { Button } from '../../shared/Button';
import { STEPS } from '../../../config/constants';

interface ContractFormProps {
  onSuccess: (contractId: string) => void;
}

export const ContractForm: React.FC<ContractFormProps> = ({ onSuccess }) => {
  const {
    currentStep,
    goToNext,
    goToPrevious,
    goToStep,
    isFirstStep,
    isLastStep,
    validateStep,
    clearErrors,
    buildPayload
  } = useContract();

  const { createContract, loading, error, clearError } = useContractAPI();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (isLastStep) {
        setShowConfirmation(true);
      } else {
        goToNext();
        clearErrors();
        clearError();
      }
    }
  };

  const handleConfirm = async () => {
    try {
      const payload = buildPayload();
      const contract = await createContract(payload);
      setShowConfirmation(false);
      onSuccess(contract.id);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Error al crear contrato');
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-8">
        <StepIndicator steps={STEPS as any} currentStep={currentStep} onStepClick={goToStep} />

        {(error || apiError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {error || apiError}
          </div>
        )}

        <FormSteps currentStep={currentStep} onError={setApiError} />

        {/* Navegación */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
          {!isFirstStep && (
            <Button variant="secondary" onClick={goToPrevious} disabled={loading}>
              <ChevronLeft size={18} />
              Anterior
            </Button>
          )}
          <div className="flex-1" />
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={loading}
            isLoading={loading}
          >
            {isLastStep ? 'Enviar' : 'Siguiente'}
            {!isLastStep && <ChevronRight size={18} />}
          </Button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmation}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirmation(false)}
        loading={loading}
      />
    </>
  );
};
