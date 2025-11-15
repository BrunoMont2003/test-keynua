import { config } from '../config/index';

export interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: string;
  timeout?: number;
  retries?: number;
}

export interface HttpResponse<T> {
  ok: boolean;
  status: number;
  data: T;
}

class HttpError extends Error {
  constructor(
    public status: number,
    public message: string
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

/**
 * HTTP client with timeout, retries, and proper error handling
 */
export class HttpClient {
  private timeout: number;
  private maxRetries: number;

  constructor(timeout = config.http.timeoutMs, maxRetries = config.http.retries) {
    this.timeout = timeout;
    this.maxRetries = maxRetries;
  }

  async fetch<T>(url: string, options: FetchOptions = {}): Promise<HttpResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.timeout,
      retries = this.maxRetries
    } = options;

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          method,
          headers,
          body,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' })) as { message?: string };
          throw new HttpError(response.status, errorData.message || `HTTP ${response.status}`);
        }

        const data = await response.json() as T;
        return { ok: true, status: response.status, data };
      } catch (error) {
        clearTimeout(0); // Cleanup

        if (error instanceof HttpError && error.status < 500) {
          // Don't retry on client errors (4xx)
          throw error;
        }

        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt < retries) {
          const backoffMs = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
          console.log(`[HttpClient] Retry attempt ${attempt}/${retries} for ${url} after ${backoffMs}ms`);
          await new Promise(resolve => setTimeout(resolve, backoffMs));
        }
      }
    }

    throw lastError || new Error(`Failed to fetch ${url} after ${retries} retries`);
  }
}

export const httpClient = new HttpClient();
