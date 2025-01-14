import { ApiResponse, PasswordResetResponse, RegistrationResponse, UpdateUserInfoRequest } from './types';
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


interface UpdatePasswordRequest {
    oldPassword: string;
    newPassword: string;
}

interface UpdateEmailRequest {
    currentPassword: string;
    newEmail: string;
}

interface EmailChangeRequest {
    newEmail: string;
    password: string;
}

interface EmailChangeVerification {
    newEmail: string;
    activationCode: string;
}

export const authApi = {
    login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
        return apiClient.post<LoginResponse>('login', credentials);
    },

    register: async (data: {
        name: string;
        email: string;
        password: string;
        gender: 'male' | 'female' | 'not_specified'
    }): Promise<ApiResponse<RegistrationResponse>> => {
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
    },

    updateUserInfo: async (data: UpdateUserInfoRequest): Promise<ApiResponse<{ success: boolean }>> => {
        return apiClient.put<{ success: boolean }>('update-user-info', data);
    },

    updateUserPassword: async (data: UpdatePasswordRequest): Promise<ApiResponse<{ success: boolean; message: string }>> => {
        return apiClient.put<{ success: boolean; message: string }>('update-user-password', data);
    },

    requestEmailChange: async (data: EmailChangeRequest): Promise<ApiResponse<{ success: boolean; message: string }>> => {
        return apiClient.post<{ success: boolean; message: string }>('request-email-change', data);
    },

    verifyEmailChange: async (newEmail: string, activationCode: string): Promise<ApiResponse<any>> => {
        try {
            console.log('Gönderilen kod:', activationCode); // Debug için
            const response = await apiClient.post('verify-email-change', {
                newEmail,
                activationCode: activationCode.toString() // String'e çevir
            });
            return response;
        } catch (error: any) {
            if (error.message?.includes('token')) {
                throw new Error('Oturum süreniz doldu. Lütfen tekrar giriş yapın.');
            }
            throw error;
        }
    },

    updateUserAvatar: async (data: { avatar: string }): Promise<ApiResponse<{
        success: boolean;
        message: string;
        user: User;
    }>> => {
        return apiClient.put('update-user-avatar', data);
    },
}; 