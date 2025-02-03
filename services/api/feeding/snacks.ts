import { apiClient } from '../client';

export interface ISnackFeeding {
    _id: string;
    startTime: Date;
    snackType: {
        category: string;
        name: string;
    };
    amount: string;
    notes?: string;
}

export interface CreateSnackData {
    babyId: string;
    startTime: Date;
    snackType: {
        category: string;
        name: string;
    };
    amount: string;
    notes?: string;
}

export const snacksApi = {
    createFeeding: async (data: CreateSnackData) => {
        return await apiClient.post('feeding/snacks/create', data);
    },

    getFeedings: async ({ babyId }: { babyId: string }) => {
        return await apiClient.get(`feeding/snacks/list?babyId=${babyId}`);
    },

    deleteFeeding: async (babyId: string, feedingId: string) => {
        return await apiClient.delete(`feeding/snacks/${babyId}/${feedingId}`);
    }
}; 