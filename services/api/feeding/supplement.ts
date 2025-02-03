import { apiClient } from '../client';

export interface ISupplementFeeding {
    _id: string;
    startTime: Date;
    supplementType: {
        category: string;
        name: string;
    };
    amount: string;
    notes?: string;
}

export interface CreateSupplementData {
    babyId: string;
    startTime: Date;
    supplementType: {
        category: string;
        name: string;
    };
    amount: string;
    notes?: string;
}

export const supplementApi = {
    createFeeding: async (data: CreateSupplementData) => {
        return await apiClient.post('feeding/supplement/create', data);
    },

    getFeedings: async ({ babyId }: { babyId: string }) => {
        return await apiClient.get(`feeding/supplement/list?babyId=${babyId}`);
    },

    deleteFeeding: async (babyId: string, feedingId: string) => {
        return await apiClient.delete(`feeding/supplement/${babyId}/${feedingId}`);
    }
}; 