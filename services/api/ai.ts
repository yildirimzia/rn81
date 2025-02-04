import { apiClient } from './client';

interface AIResponse {
    success: boolean;
    response: string;
}

export const aiApi = {
    getResponse: (data: { question: string; babyAge: number; babyGender: string }) =>
        apiClient.post<AIResponse>('/ai/response', data),
}; 