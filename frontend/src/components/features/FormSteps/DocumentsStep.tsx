/**
 * Componente para Step 1: Documentos
 * SRP: Solo renderizar upload de documentos
 */

import React, { useRef } from 'react';
import { FileText, X as XIcon } from 'lucide-react';
import { useContract } from '../../../context/ContractContext';
import { fileToBase64, validatePdfFile, validateFilesCount } from '../../../utils/file';

interface DocumentsStepProps {
  onError: (error: string) => void;
}

export const DocumentsStep: React.FC<DocumentsStepProps> = ({ onError }) => {
  const { formState, updateField, fieldErrors, clearFieldError } = useContract();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      validateFilesCount(files.length);

      const documents = await Promise.all(
        Array.from(files).map(async file => {
          validatePdfFile(file);
          const base64 = await fileToBase64(file);
          return { name: file.name, base64 };
        })
      );

      const allDocuments = [...formState.documents, ...documents];
      updateField('documents', allDocuments);
      clearFieldError('documents');
      onError('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar archivo';
      onError(message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Archivos a Firmar</h2>
        <p className="text-gray-600">Sube los archivos PDF</p>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all ${
          fieldErrors.documents
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 bg-gray-50 hover:border-blue-500 hover:bg-gray-100'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
        <FileText size={48} className="mx-auto mb-3 text-blue-600" />
        <div className="text-base font-medium text-gray-900">Haz clic o arrastra los archivos</div>
        <div className="text-sm text-gray-600 mt-2">
          Solo PDF • Máximo 4.5 MB • Hasta 10 archivos
        </div>
      </div>
      {fieldErrors.documents && (
        <p className="text-red-600 text-sm">{fieldErrors.documents}</p>
      )}

      {formState.documents.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900">Archivos ({formState.documents.length})</h4>
          {formState.documents.map((doc, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 bg-gray-100 rounded-md border-l-4 border-blue-600"
            >
              <div className="flex items-center gap-3 flex-1">
                <FileText size={20} className="text-blue-600 flex-shrink-0" />
                <span className="text-sm text-gray-900 truncate">{doc.name}</span>
              </div>
              <button
                type="button"
                className="ml-2 text-gray-400 hover:text-red-600 transition-colors p-1"
                onClick={() => {
                  const newDocs = formState.documents.filter((_, i) => i !== index);
                  updateField('documents', newDocs);
                }}
              >
                <XIcon size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
