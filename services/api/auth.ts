import { ApiResponse, PasswordResetResponse, RegistrationResponse } from './types';
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

interface GoogleLoginRequest {
    email: string;
    name: string;
    picture?: string;
    platform: 'web' | 'android' | 'ios';
}

interface VerifyEmailResponse {
    success: boolean;
    message: string;
    user?: User;
    isAlreadyActive?: boolean;
    accessToken?: string;
}

export const authApi = {
    login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
        return apiClient.post<LoginResponse>('login', credentials);
    },

    register: async (data: { name: string; email: string; password: string; gender: string }): Promise<ApiResponse<RegistrationResponse>> => {
        try {
            const response = await apiClient.post<RegistrationResponse>('registration', {
                name: data.name,
                email: data.email.trim().toLowerCase(),
                password: data.password,
                gender: data.gender
            });
            return response;
        } catch (error) {
            throw error;
        }
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

    googleLogin: async (data: GoogleLoginRequest): Promise<ApiResponse<LoginResponse>> => {
        console.log('Sending Google login request:', data);
        try {
            const response = await apiClient.post<LoginResponse>('google-login', data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    verifyEmail: async (data: { activationToken: string; code: string }): Promise<ApiResponse<VerifyEmailResponse>> => {
        return apiClient.post<VerifyEmailResponse>('activate-user', {
            activation_token: data.activationToken,
            activation_code: data.code
        });
    }
}; 
