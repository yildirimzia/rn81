import { ApiResponse } from './types';
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

    forgotPassword: async (email: string): Promise<ApiResponse<{ message: string }>> => {
        return apiClient.post('/auth/forgot-password', { email });
    },
}; 