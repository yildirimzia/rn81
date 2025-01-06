import { ApiResponse, PasswordResetResponse } from './types';
import { apiClient } from './client';

type User = {
    _id: string;
    name: string;
    email: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
};

type LoginResponse = {
    success: boolean;
    user: User;
    accessToken: string;
};

type LoginRequest = {
    email: string;
    password: string;
};

export const authApi = {
    login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
        return apiClient.post<LoginResponse>('login', credentials);
    },

    register: async (data: { name: string; email: string; password: string }): Promise<ApiResponse<LoginResponse>> => {
        return apiClient.post<LoginResponse>('register', data);
    },

    logout: async (): Promise<ApiResponse<{ success: boolean }>> => {
        return apiClient.post('logout');
    },

    refreshToken: async (): Promise<ApiResponse<{ accessToken: string }>> => {
        return apiClient.get('refresh');
    },

    requestPasswordReset: async (data: { email: string }): Promise<ApiResponse<PasswordResetResponse>> => {
        return apiClient.post<PasswordResetResponse>('request-password-reset', data);
    },
}; 