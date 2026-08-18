import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

import { env } from "./env";

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

class ApiClient {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: Array<() => void> = [];

  constructor() {
    this.instance = axios.create({
      baseURL: env.API_BASE,
      withCredentials: true,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Add request ID for tracing
        config.headers.set("X-Request-Id", crypto.randomUUID());
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiResponse>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // Handle 401 - attempt token refresh
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url?.includes("/auth/login") &&
          !originalRequest.url?.includes("/auth/refresh") &&
          !originalRequest.url?.includes("/auth/register")
        ) {
          if (this.isRefreshing) {
            // Wait for the ongoing refresh
            return new Promise((resolve) => {
              this.refreshSubscribers.push(() => {
                resolve(this.instance(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            await this.instance.post("/auth/refresh");
            this.refreshSubscribers.forEach((callback) => callback());
            this.refreshSubscribers = [];
            return this.instance(originalRequest);
          } catch (refreshError) {
            // Refresh failed - redirect to login
            this.refreshSubscribers = [];
            if (
              typeof window !== "undefined" &&
              !window.location.pathname.includes("/login")
            ) {
              window.location.href = "/login";
            }
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      },
    );
  }

  // Generic methods
  async get<T>(
    url: string,
    params?: Record<string, unknown>,
  ): Promise<ApiResponse<T>> {
    const { data } = await this.instance.get<ApiResponse<T>>(url, { params });
    return data;
  }

  async post<T>(
    url: string,
    body?: unknown,
    config?: any,
  ): Promise<ApiResponse<T>> {
    const { data } = await this.instance.post<ApiResponse<T>>(
      url,
      body,
      config,
    );
    return data;
  }

  async put<T>(url: string, body?: unknown): Promise<ApiResponse<T>> {
    const { data } = await this.instance.put<ApiResponse<T>>(url, body);
    return data;
  }

  async patch<T>(url: string, body?: unknown): Promise<ApiResponse<T>> {
    const { data } = await this.instance.patch<ApiResponse<T>>(url, body);
    return data;
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const { data } = await this.instance.delete<ApiResponse<T>>(url);
    return data;
  }

  // Get raw axios instance (for file downloads, etc.)
  getInstance(): AxiosInstance {
    return this.instance;
  }
}

export const api = new ApiClient();
export type { ApiResponse };
