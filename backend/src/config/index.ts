import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../..', '.env') });

interface AppConfig {
  port: number;
  corsOrigin: string;
  keynua: {
    apiUrl: string;
    apiKey: string;
    apiToken: string;
  };
  webhook: {
    apiKey: string | null;
  };
  http: {
    timeoutMs: number;
    retries: number;
  };
}

const getEnvVar = (name: string, defaultValue?: string): string => {
  const value = process.env[name];
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  return value || defaultValue || '';
};

export const config: AppConfig = {
  port: parseInt(getEnvVar('PORT', '3001'), 10),
  corsOrigin: getEnvVar('CORS_ORIGIN', 'http://localhost:5173'),
  keynua: {
    apiUrl: getEnvVar('KEYNUA_API_URL', 'https://api.stg.keynua.com'),
    apiKey: getEnvVar('KEYNUA_API_KEY'),
    apiToken: getEnvVar('KEYNUA_API_TOKEN'),
  },
  webhook: {
    apiKey: process.env.WEBHOOK_API_KEY || null,
  },
  http: {
    timeoutMs: parseInt(getEnvVar('HTTP_TIMEOUT_MS', '10000'), 10),
    retries: parseInt(getEnvVar('HTTP_RETRIES', '3'), 10),
  },
};

export default config;
