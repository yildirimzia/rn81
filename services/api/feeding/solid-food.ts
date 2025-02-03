import { apiClient } from '../client';
import { ApiResponse } from '../types';

export interface ISolidFoodFeeding {
    _id: string;
    startTime: Date;
    foodType: {
        category: 'fruit' | 'vegetable' | 'grain' | 'protein' | 'milk' | 'food' | 'drink' | 'other';
        name: string;
    };
    amount: number;
    reaction?: {
        hasAllergy: boolean;
        symptoms?: string;
    };
    notes?: string;
}

export interface CreateSolidFoodData {
    babyId: string;
    startTime: Date;
    foodType: {
        category: 'fruit' | 'vegetable' | 'grain' | 'protein' | 'milk' | 'food' | 'drink' | 'other';
        name: string;
    };
    amount: number | string;
    reaction?: {
        hasAllergy: boolean;
        symptoms?: string;
    };
    notes?: string;
}

export const solidFoodApi = {
    createFeeding: async (data: CreateSolidFoodData) => {
        return await apiClient.post('feeding/solid-food/create', data);
    },

    getFeedings: async ({ babyId }: { babyId: string }) => {
        return await apiClient.get(`feeding/solid-food/list?babyId=${babyId}`);
    },

    deleteFeeding: async (babyId: string, feedingId: string) => {
        return await apiClient.delete(`feeding/solid-food/${babyId}/${feedingId}`);
    }
}; 