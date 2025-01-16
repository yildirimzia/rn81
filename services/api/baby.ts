import { apiClient } from './client';

interface PhotoType {
    url: string;
}

interface VaccineInfo {
    vaccine_name: string;
    vaccine_date: Date;
    vaccine_notes?: string;
}

export interface IBabyData {
    id?: string;
    name: string;
    birthDate: string | Date;
    gender: 'male' | 'female';
    weight: number;
    height: number;
    photo?: PhotoType;
    vaccine_information?: VaccineInfo[];
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
        vaccine_information?: VaccineInfo[];
    }>;
}

interface BabyApiResponse {
    success: boolean;
    message?: string;
    baby?: any;
}

interface VaccineApiResponse {
    success: boolean;
    baby?: {
        vaccine_information: VaccineInfo[];
    };
    error?: {
        message: string;
    };
}

export const babyApi = {
    createBaby: async (data: IBabyData) => {
        return await apiClient.post('create', data);
    },

    getBabies: async () => {
        const response = await apiClient.get<IBabyResponse>('list');
        console.log('API Response in service:', response);
        return response;
    },

    getBabyById: (id: string) => {
        return apiClient.get<BabyApiResponse>(`detail/${id}`);
    },

    deleteBaby: (id: string) => {
        return apiClient.delete<BabyApiResponse>(`${id}`);
    },
    addVaccine: async (babyId: string, vaccineData: VaccineInfo): Promise<VaccineApiResponse> => {
        const response = await apiClient.post<VaccineApiResponse>(`${babyId}/add-vaccine`, vaccineData);

        if (!response.data) {
            throw new Error('Response data is undefined');
        }

        return response.data;
    }
}; 