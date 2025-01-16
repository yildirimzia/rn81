import { apiClient } from './client';

interface IVaccineData {
    babyId: string;
    name: string;
    date: Date;
    note?: string;
}

interface VaccineApiResponse {
    success: boolean;
    message?: string;
    vaccine?: any;
}

export const vaccineApi = {
    createVaccine: (data: IVaccineData) => {
        return apiClient.post<VaccineApiResponse>('vaccines/create', data);
    },
    getVaccines: () => {
        return apiClient.get<VaccineApiResponse>('vaccines/list');
    }
};