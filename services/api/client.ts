import { authApi } from './auth';
import { ApiResponse, ApiError } from './types';

const API_URL = 'http://192.168.1.100:8000';

type RequestConfig = {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: any;
};

class ApiClient {
    private static instance: ApiClient;
    private token: string | null = null;
    private isRefreshing = false;
    private failedQueue: any[] = [];

    private constructor() { }

    static getInstance(): ApiClient {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient();
        }
        return ApiClient.instance;
    }

    setToken(token: string | null) {
        console.log('Token being set in ApiClient:', token);
        this.token = token;
    }

    private async request<T>(endpoint: string, config: RequestConfig): Promise<ApiResponse<T>> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            console.log('Adding token to request headers:', this.token);
            headers['Authorization'] = `Bearer ${this.token}`;
        } else {
            console.log('No token available for request');
        }

        Object.assign(headers, config.headers || {});

        try {
            console.log('Request details:', {
                url: `${API_URL}/api/v1/${endpoint}`,
                method: config.method,
                headers: headers,
                body: config.body
            });

            const response = await fetch(`${API_URL}/api/v1/${endpoint}`, {
                ...config,
                headers,
                credentials: 'include',
                body: config.body ? JSON.stringify(config.body) : undefined,
            });

            const data = await response.json();
            console.log('Response details:', {
                status: response.status,
                data: data
            });

            if (response.status === 401 && !this.isRefreshing) {
                this.isRefreshing = true;

                try {
                    const refreshResponse = await authApi.refreshToken();

                    if (refreshResponse.success && refreshResponse.data) {
                        this.token = refreshResponse.data.accessToken;

                        return this.request<T>(endpoint, config);
                    }
                } catch (error) {
                    console.error('Token refresh failed:', error);
                    this.token = null;
                    throw new Error('Authentication failed');
                } finally {
                    this.isRefreshing = false;
                }
            }

            if (!response.ok) {
                return {
                    success: false,
                    error: {
                        message: data.message || 'Bir hata oluştu',
                        statusCode: response.status
                    }
                };
            }

            return {
                success: true,
                data: data as T
            };
        } catch (error: any) {
            console.error('Request error:', error);
            return {
                success: false,
                error: {
                    message: error.message || 'Bir hata oluştu',
                    statusCode: 500
                }
            };
        }
    }

    get<T>(endpoint: string, config: Omit<RequestConfig, 'method'> = {}) {
        return this.request<T>(endpoint, { ...config, method: 'GET' });
    }

    post<T>(endpoint: string, data?: any, config: Omit<RequestConfig, 'method' | 'body'> = {}) {
        return this.request<T>(endpoint, { ...config, method: 'POST', body: data });
    }

    put<T>(endpoint: string, data?: any, config: Omit<RequestConfig, 'method' | 'body'> = {}) {
        return this.request<T>(endpoint, { ...config, method: 'PUT', body: data });
    }

    delete<T>(endpoint: string, config: Omit<RequestConfig, 'method'> = {}) {
        return this.request<T>(endpoint, { ...config, method: 'DELETE' });
    }
}

export const apiClient = ApiClient.getInstance(); 