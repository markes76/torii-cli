import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import type { ToriiConfig } from './types/index.js';
import { sleep, withRateLimit } from './utils/rate-limit.js';

export class ToriiClient {
  private http: AxiosInstance;
  private config: ToriiConfig;

  constructor(config: ToriiConfig) {
    this.config = config;
    this.http = axios.create({
      baseURL: config.baseUrl,
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'X-API-VERSION': '1.1',
      },
      timeout: 30_000,
    });
  }

  // Use a separate SCIM key if configured
  withScimKey(): ToriiClient {
    if (!this.config.scimApiKey) {
      throw new Error(
        'SCIM API key not configured. Set TORII_SCIM_API_KEY or run: torii config set scimApiKey <key>'
      );
    }
    return new ToriiClient({ ...this.config, apiKey: this.config.scimApiKey });
  }

  async get<T>(path: string, params: Record<string, unknown> = {}): Promise<T> {
    return this.request<T>({ method: 'GET', url: path, params });
  }

  async post<T>(path: string, data?: unknown): Promise<T> {
    return this.request<T>({ method: 'POST', url: path, data });
  }

  async put<T>(path: string, data?: unknown): Promise<T> {
    return this.request<T>({ method: 'PUT', url: path, data });
  }

  async patch<T>(path: string, data?: unknown): Promise<T> {
    return this.request<T>({ method: 'PATCH', url: path, data });
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>({ method: 'DELETE', url: path });
  }

  private async request<T>(config: AxiosRequestConfig, attempt = 1): Promise<T> {
    try {
      const res: AxiosResponse<T> = await withRateLimit(
        () => this.http.request<T>(config),
        res => res.headers as Record<string, string>
      );
      return res.data;
    } catch (err) {
      if (!axios.isAxiosError(err)) throw err;

      const status = err.response?.status;

      // 429 – rate limited: back off and retry (max 3 times)
      if (status === 429 && attempt <= 3) {
        const retryAfter = Number(err.response?.headers['retry-after'] ?? 0);
        const wait = retryAfter > 0 ? retryAfter * 1000 : Math.pow(2, attempt) * 1000;
        process.stderr.write(`Rate limited. Retrying in ${wait / 1000}s...\n`);
        await sleep(wait);
        return this.request<T>(config, attempt + 1);
      }

      // 5xx – server error: retry once after 2s
      if (status && status >= 500 && attempt === 1) {
        await sleep(2000);
        return this.request<T>(config, attempt + 1);
      }

      // Format a clean error message
      const body = err.response?.data as { message?: string; error?: string } | undefined;
      const message = body?.message ?? body?.error ?? err.message;
      const error = new Error(`HTTP ${status ?? '?'}: ${message}`);
      (error as NodeJS.ErrnoException & { status?: number; response?: unknown }).status = status;
      (error as NodeJS.ErrnoException & { status?: number; response?: unknown }).response = err.response?.data;
      throw error;
    }
  }
}
