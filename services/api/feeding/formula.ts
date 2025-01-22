import { apiClient } from '../client';
import { ApiResponse } from '../types';

export interface IFormulaFeeding {
    _id: string;
    babyId: string;
    startTime: Date;
    amount: number;
    brand: string;
    notes?: string;
}

export interface FormulaFeedingResponse {
    success: boolean;
    feedings: IFormulaFeeding[];
}

export interface CreateFormulaFeedingData {
    babyId: string;
    startTime: Date;
    amount: number;
    brand: string;
    notes?: string;
}

export const formulaApi = {
    createFeeding: async (data: CreateFormulaFeedingData): Promise<ApiResponse<{ success: boolean; feeding: IFormulaFeeding }>> => {
        return apiClient.post('feeding/formula/create', data);
    },

    getFeedings: async (params: { babyId: string }): Promise<ApiResponse<FormulaFeedingResponse>> => {
        const queryParams = new URLSearchParams({ babyId: params.babyId });
        return apiClient.get(`feeding/formula/list?${queryParams.toString()}`);
    },

    deleteFeeding: async (babyId: string, feedingId: string): Promise<ApiResponse<{ success: boolean; message: string }>> => {
        return apiClient.delete(`feeding/formula/${babyId}/${feedingId}`);
    }
}; 