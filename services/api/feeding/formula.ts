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

interface FormulaFeedingData {
    babyId: string;
    startTime: Date;
    amount: number;
    brand: string;
    notes?: string;
}

export const formulaApi = {
    createFeeding: async (data: FormulaFeedingData) => {
        console.log('Sending data to API:', data);
        const response = await apiClient.post('feeding/formula/create', data);
        console.log('API Response:', response.data);
        return response.data;
    },

    getFeedings: async ({ babyId }: { babyId: string }) => {
        console.log('Fetching feedings for baby:', babyId);
        const response = await apiClient.get(`feeding/formula/list?babyId=${babyId}`);
        console.log('Get Feedings Response:', response.data);
        return response.data;
    },

    deleteFeeding: async (babyId: string, feedingId: string) => {
        return await apiClient.delete(`feeding/formula/${babyId}/${feedingId}`);
    }
}; 