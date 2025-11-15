import { config } from '../config/environment';
import { FILE_ERROR_MESSAGES } from '../config/constants';
import { FileError } from '../core/contracts/errors';

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = () => reject(new FileError(FILE_ERROR_MESSAGES.UPLOAD_FAILED));
  });
};

export const validatePdfFile = (file: File): void => {
  if (!config.form.acceptedFormats.includes(file.type as 'application/pdf')) {
    throw new FileError(FILE_ERROR_MESSAGES.INVALID_FORMAT);
  }

  if (file.size > config.form.maxFileSize) {
    throw new FileError(FILE_ERROR_MESSAGES.FILE_TOO_LARGE);
  }
};

export const validateFilesCount = (count: number): void => {
  if (count > config.form.maxFiles) {
    throw new FileError(FILE_ERROR_MESSAGES.TOO_MANY_FILES);
  }
};
