export type ApiError = {
    message: string;
    statusCode: number;
};

export type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: ApiError;
};

// Update the ApiResponse type to include message for specific cases
export type PasswordResetResponse = {
    success: boolean;
    message: string;
};

export interface RegistrationResponse {
    success: boolean;
    message: string;
    activationToken: string;
    remainingTime?: number;
    gender?: 'male' | 'female' | 'not_specified';
}

export interface UpdateUserInfoRequest {
    name: string;
    email?: string;
    gender: string;
    password?: string;
}
