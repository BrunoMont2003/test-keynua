
import { APIError } from '../../core/contracts/errors';

export interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

export class APIErrorWithStatus extends APIError {
  constructor(
    message: string,
    public statusCode: number | undefined,
    data?: any
  ) {
    super(message, statusCode, data);
  }
}

export class HTTPClient {
  constructor(private baseURL: string, private timeout: number = 30000) {}

  async request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const method = options.method || 'GET';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    const config: RequestInit = {
      method,
      headers,
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), options.timeout || this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new APIErrorWithStatus(
          `HTTP ${response.status}`,
          response.status,
          await response.json().catch(() => ({}))
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof APIErrorWithStatus) {
        throw error;
      }
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(
        error instanceof Error ? error.message : 'Unknown error',
        undefined,
        error
      );
    }
  }

  async get<T>(endpoint: string, options?: Omit<FetchOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, body: any, options?: Omit<FetchOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }
}
