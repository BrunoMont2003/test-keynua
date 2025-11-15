/**
 * Constantes de la aplicación
 */
import { Language } from '../types/api.types';

export const DEFAULT_LANGUAGE = Language.ES;

export const STEPS = [
  { number: 1, label: 'Documento', description: 'Información básica' },
  { number: 2, label: 'Archivos', description: 'Archivos PDF' },
  { number: 3, label: 'Firmantes', description: 'Personas a firmar' }
] as const;

export const TOTAL_STEPS = STEPS.length;

export const FILE_ERROR_MESSAGES = {
  INVALID_FORMAT: 'Solo se aceptan archivos PDF',
  FILE_TOO_LARGE: 'El archivo es demasiado grande (máximo 4.5 MB)',
  TOO_MANY_FILES: 'Máximo 10 archivos permitidos',
  UPLOAD_FAILED: 'Error al subir el archivo'
} as const;

export const VALIDATION_MESSAGES = {
  TITLE_REQUIRED: 'El título es requerido',
  DOCUMENTS_REQUIRED: 'Debes subir al menos un documento',
  USER_NAME_REQUIRED: 'El nombre es requerido',
  USER_EMAIL_REQUIRED: 'El email es requerido',
  USER_EMAIL_INVALID: 'Email inválido'
} as const;
