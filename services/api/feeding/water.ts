import { apiClient } from '../client';

export interface IWaterFeeding {
    _id: string;
    startTime: Date;
    amount: number;
    notes?: string;
}

export interface CreateWaterData {
    babyId: string;
    startTime: Date;
    amount: number;
    notes?: string;
}

export const waterApi = {
    createFeeding: async (data: CreateWaterData) => {
        return await apiClient.post('feeding/water/create', data);
    },

    getFeedings: async ({ babyId }: { babyId: string }) => {
        return await apiClient.get(`feeding/water/list?babyId=${babyId}`);
    },

    deleteFeeding: async (babyId: string, feedingId: string) => {
        return await apiClient.delete(`feeding/water/${babyId}/${feedingId}`);
    }
}; 