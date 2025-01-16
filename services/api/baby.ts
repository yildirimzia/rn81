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

export const babyApi = {
    createBaby: async (data: IBabyData) => {
        return await apiClient.post('baby/create', data);
    },

    getBabies: async () => {
        return await apiClient.get<IBabiesResponse>('baby/list');
    }
}; 