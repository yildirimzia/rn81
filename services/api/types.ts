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
