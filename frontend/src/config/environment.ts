/**
 * Configuración centralizada de variables de entorno
 * KISS: Una única fuente de verdad
 */

export const config = {
  api: {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
    timeout: 30000,
    endpoints: {
      contracts: '/api/contracts',
      contractStatus: (id: string) => `/api/contracts/${id}`,
    }
  },
  storage: {
    keys: {
      currentContractId: 'keynua_current_contract',
    }
  },
  polling: {
    contractStatusInterval: 5000,
    maxRetries: 10
  },
  form: {
    maxFileSize: 4.5 * 1024 * 1024, // 4.5 MB
    maxFiles: 10,
    acceptedFormats: ['application/pdf']
  }
} as const;
