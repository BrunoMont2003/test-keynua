/**
 * Componente para Step 2: Firmantes
 * SRP: Solo renderizar formulario de firmantes
 */

import React from 'react';
import { useContract } from '../../../context/ContractContext';

export const SignersStep: React.FC = () => {
  const { formState, addUser, removeUser, updateUser, fieldErrors, clearFieldError } = useContract();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Personas a Firmar</h2>
        <p className="text-gray-600">Agrega los firmantes</p>
      </div>

      <div className="space-y-4">
        {formState.users.map((user, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-5 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-gray-900">Firmante {index + 1}</span>
              {formState.users.length > 1 && (
                <button
                  type="button"
                  className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                  onClick={() => removeUser(index)}
                >
                  Eliminar
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Nombre completo <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Juan Pérez"
                  value={user.name}
                  onChange={e => {
                    updateUser(index, 'name', e.target.value);
                    if (fieldErrors[`user_${index}_name`]) {
                      clearFieldError(`user_${index}_name`);
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    fieldErrors[`user_${index}_name`]
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300'
                  }`}
                />
                {fieldErrors[`user_${index}_name`] && (
                  <p className="text-red-600 text-xs mt-1">{fieldErrors[`user_${index}_name`]}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  placeholder="juan@ejemplo.com"
                  value={user.email || ''}
                  onChange={e => {
                    updateUser(index, 'email', e.target.value);
                    if (fieldErrors[`user_${index}_email`]) {
                      clearFieldError(`user_${index}_email`);
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    fieldErrors[`user_${index}_email`]
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300'
                  }`}
                />
                {fieldErrors[`user_${index}_email`] && (
                  <p className="text-red-600 text-xs mt-1">{fieldErrors[`user_${index}_email`]}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="w-full py-3 border-2 border-dashed border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
          onClick={addUser}
        >
          <span className="text-xl">+</span>
          Agregar otro
        </button>
      </div>
    </div>
  );
};
