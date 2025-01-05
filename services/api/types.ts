export type ApiError = {
    message: string;
    statusCode: number;
};

export type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: ApiError;
}; 