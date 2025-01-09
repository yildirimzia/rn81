import { authApi } from './auth';
import { ApiResponse, ApiError } from './types';

// IP adresi üzerinden HTTPS URL
const API_URL = 'http://localhost:8000';

// Production için
// const API_URL = 'https://api.yourapp.com';

type RequestConfig = {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: any;
};

class ApiClient {
    private static instance: ApiClient;
    private token: string | null = null;
    private isRefreshing = false;

    private constructor() { }

    static getInstance(): ApiClient {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient();
        }
        return ApiClient.instance;
    }

    setToken(token: string | null): void {
        if (token) {
            localStorage.setItem('accessToken', token);
        } else {
            localStorage.removeItem('accessToken');
        }
    }

    private async request<T>(endpoint: string, config: RequestConfig): Promise<ApiResponse<T>> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(`${API_URL}/api/v1/${endpoint}`, {
                ...config,
                headers,
                credentials: 'include',
                mode: 'cors',
                body: config.body ? JSON.stringify(config.body) : undefined,
            });

            const cookies = response.headers.get('set-cookie');
            console.log('Response cookies:', cookies);

            const data = await response.json();

            if (endpoint === 'login' && data.success && data.accessToken) {
                this.token = data.accessToken;
                console.log('Token saved:', this.token);
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

    getToken(): string | null {
        return localStorage.getItem('accessToken');
    }
}

export const apiClient = ApiClient.getInstance(); 