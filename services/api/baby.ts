import { apiClient } from './client';

export interface IBabyData {
    name: string;
    gender: 'male' | 'female';
    birthDate: Date;
    weight: number;
    height: number;
    photo?: string;
}

interface IBabiesResponse {
    success: boolean;
    babies: Array<IBabyData>;
}

interface BabyApiResponse {
    success: boolean;
    message?: string;
    baby?: any;
}

export const babyApi = {
    createBaby: async (data: IBabyData) => {
        return await apiClient.post('create', data);
    },

    getBabies: async () => {
        return await apiClient.get<IBabiesResponse>('list');
    },

    getBabyById: (id: string) => {
        return apiClient.get<BabyApiResponse>(`detail/${id}`);
    },

    deleteBaby: (id: string) => {
        return apiClient.delete<BabyApiResponse>(`${id}`);
    },
}; 