import { apiClient } from './client';

export interface IGrowthRecord {
    _id: string;
    date: Date;
    weight: number;
    height: number;
    notes?: string;
}

export interface CreateGrowthData {
    babyId: string;
    date: Date;
    weight: number;
    height: number;
    notes?: string;
}

interface GrowthResponse {
    success: boolean;
    records: Array<{
        _id: string;
        date: Date;
        weight: number;
        height: number;
        notes?: string;
    }>;
}

export const growthApi = {
    createRecord: async (data: any) => {
        return await apiClient.post('/growth/add', data);
    },

    getRecords: async (babyId: string) => {
        return await apiClient.get<GrowthResponse>(`/growth/${babyId}`);
    },

    deleteRecord: async (babyId: string, recordId: string) => {
        return await apiClient.delete(`/growth/${babyId}/${recordId}`);
    }
}; 