import { apiClient } from '../client';
import { ApiResponse } from '../types';

export interface IBreastFeeding {
    _id: string;
    babyId: string;
    startTime: Date;
    duration: number;
    breast: 'left' | 'right';
    notes?: string;
}

export interface BreastFeedingStats {
    totalDuration: number;
    averageDuration: number;
    leftBreastCount: number;
    rightBreastCount: number;
    maxDuration: number;
    totalCount: number;
    dailyStats: {
        [key: string]: number;
    };
}

export interface BreastFeedingResponse {
    success: boolean;
    feedings: IBreastFeeding[];
    stats: BreastFeedingStats;
}

export interface CreateBreastFeedingData {
    babyId: string;
    startTime: Date;
    duration: number;
    breast: 'left' | 'right';
    feedingType: 'breast_milk';
}

export const breastMilkApi = {
    createFeeding: async (data: CreateBreastFeedingData): Promise<ApiResponse<{ success: boolean; feeding: IBreastFeeding }>> => {
        return apiClient.post('feeding/breast-milk/create', data);
    },

    getFeedings: async (params: {
        babyId: string;
        startDate?: string;
        endDate?: string;
    }): Promise<ApiResponse<BreastFeedingResponse>> => {
        const queryParams = new URLSearchParams({
            babyId: params.babyId,
            ...(params.startDate && { startDate: params.startDate }),
            ...(params.endDate && { endDate: params.endDate }),
        });

        return apiClient.get(`feeding/breast-milk/list?${queryParams.toString()}`);
    }
}; 