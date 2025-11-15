/**
 * Indicador de pasos - Reutilizable
 */

import { Check } from 'lucide-react';

interface Step {
  number: number;
  label: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export const StepIndicator = ({ steps, currentStep, onStepClick }: StepIndicatorProps) => {
  const progressPercent = steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0;

  return (
    <div className="mb-10">
      {/* Base line */}
      <div className="relative">
        <div className="absolute left-0 right-0 top-6 h-1 bg-gray-200 rounded" />
        <div
          className="absolute left-0 top-6 h-1 bg-blue-600 rounded transition-all"
          style={{ width: `${progressPercent}%` }}
        />

        <div className="flex justify-between relative">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;
            const isClickable = onStepClick && index <= currentStep;

            return (
              <button
                key={step.number}
                type="button"
                onClick={() => isClickable && onStepClick?.(index)}
                className={`flex items-start gap-3 bg-transparent text-left focus:outline-none ${
                  isClickable ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                {/* Circle */}
                <span
                  className={`flex items-center justify-center w-12 h-12 rounded-full font-semibold text-lg z-10 transition-all shadow-sm ${
                    isCompleted
                      ? 'bg-blue-600 text-white'
                      : isActive
                        ? 'bg-blue-600 text-white scale-105'
                        : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {isCompleted ? <Check size={22} /> : step.number}
                </span>

                {/* Labels */}
                <span className="flex flex-col pt-1">
                  <span
                    className={`text-base font-semibold leading-5 transition-colors ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-gray-900' : 'text-gray-600'
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="text-sm text-gray-500">{step.description}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
