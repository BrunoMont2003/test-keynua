/**
 * Componente para Step 0: Información del Documento
 * SRP: Solo renderizar este paso
 */

import React from 'react';
import { useContract } from '../../../context/ContractContext';

export const DocumentStep: React.FC = () => {
  const { formState, updateField, fieldErrors, clearFieldError } = useContract();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Información del Documento</h2>
        <p className="text-gray-600">Ingresa los datos básicos</p>
      </div>

      {/* Título */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Título <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={formState.title}
          onChange={e => {
            updateField('title', e.target.value);
            if (fieldErrors.title) clearFieldError('title');
          }}
          placeholder="Ejemplo: Contrato de servicios"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            fieldErrors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        />
        {fieldErrors.title && (
          <p className="text-red-600 text-xs mt-1">{fieldErrors.title}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Descripción (opcional)
        </label>
        <textarea
          value={formState.description}
          onChange={e => updateField('description', e.target.value)}
          placeholder="Agrega más detalles..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical min-h-24"
        />
      </div>

      {/* Idioma */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Idioma <span className="text-red-600">*</span>
        </label>
        <select
          value={formState.language}
          onChange={e => updateField('language', e.target.value as any)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>
        <p className="text-gray-600 text-xs mt-1">Idioma para las notificaciones</p>
      </div>
    </div>
  );
};
