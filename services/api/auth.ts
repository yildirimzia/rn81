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
    password: string;
};

type LoginResponse = {
    success: boolean;
    message: string;
    user: User;
    accessToken: string;
};

type LoginRequest = {
    email: string;
    password: string;
};

interface ResetPasswordResponse {
    success: boolean;
    message: string;
    data?: {
        success: boolean;
        message: string;
    };
}

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

    resetPassword: async (data: { token: string; newPassword: string }): Promise<ApiResponse<ResetPasswordResponse>> => {
        return apiClient.post<ResetPasswordResponse>('reset-password', data);
    },
}; 
