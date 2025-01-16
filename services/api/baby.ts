import { apiClient } from './client';

interface PhotoType {
    url: string;
}

export interface IBabyData {
    id?: string;
    name: string;
    birthDate: string | Date;
    gender: 'male' | 'female';
    weight: number;
    height: number;
    photo?: PhotoType;
}

interface IBabyResponse {
    success: boolean;
    babies: Array<{
        _id: string;
        name: string;
        birthDate: string;
        gender: 'male' | 'female';
        weight: number;
        height: number;
        photo?: PhotoType;
    }>;
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
        const response = await apiClient.get<IBabyResponse>('list');
        return response;
    },

    getBabyById: (id: string) => {
        return apiClient.get<BabyApiResponse>(`detail/${id}`);
    },

    deleteBaby: (id: string) => {
        return apiClient.delete<BabyApiResponse>(`${id}`);
    },
}; 