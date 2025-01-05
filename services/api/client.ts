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

    private constructor() { }

    static getInstance(): ApiClient {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient();
        }
        return ApiClient.instance;
    }

    setToken(token: string) {
        this.token = token;
    }

    private async request<T>(endpoint: string, config: RequestConfig): Promise<ApiResponse<T>> {
        const headers = {
            'Content-Type': 'application/json',
            ...(config.headers || {}),
        } as Record<string, string>;

        try {
            const response = await fetch(`${API_URL}/api/v1/${endpoint}`, {
                ...config,
                headers,
                credentials: 'include',
                body: config.body ? JSON.stringify(config.body) : undefined,
            });

            const data = await response.json();

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