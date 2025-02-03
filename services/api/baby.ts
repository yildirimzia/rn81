import { apiClient } from './client';

interface PhotoType {
    url: string;
}

interface VaccineInfo {
    _id: string;
    vaccine_name: string;
    vaccine_date: Date;
    vaccine_notes?: string;
}

interface AddVaccineData {
    vaccine_name: string;
    vaccine_date: Date;
    vaccine_notes?: string;
}

interface AllergyInfo {
    _id: string;
    allergy_name: string;
    discovery_date: Date;
    symptoms?: string;
}

interface AllergyApiResponse {
    success: boolean;
    message?: string;
    allergy?: any;
    error?: {
        message: string;
    };
}

interface TeethInfo {
    _id: string;
    tooth_id: string;
    tooth_name: string;
    tooth_type: string;
    date: Date;
}

interface TeethApiResponse {
    success: boolean;
    message?: string;
    tooth?: any;
    error?: {
        message: string;
    };
}

interface AddTeethData {
    tooth_id: string;
    tooth_name: string;
    tooth_type: string;
    date: Date;
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
    allergy_information?: {
        _id: string;
        allergy_name: string;
        discovery_date: Date;
        symptoms?: string;
    }[];
    teeth_information?: {
        _id: string;
        tooth_id: string;
        tooth_name: string;
        tooth_type: string;
        date: Date;
    }[];
    breast_milk?: {
        _id: string;
        startTime: Date;
        duration: number;
        breast: 'left' | 'right';
    }[];
    formula?: Array<{
        _id: string;
        startTime: Date;
        amount: number;
        brand: string;
        notes?: string;
    }>;
    solid_food?: Array<{
        _id: string;
        startTime: Date;
        foodType: { category: string; name: string };
        amount: string;
        notes?: string;
    }>;
    water?: Array<{
        _id: string;
        startTime: Date;
        amount: number;
        notes?: string;
    }>;
    supplement?: Array<{
        _id: string;
        startTime: Date;
        supplementType: {
            category: string;
            name: string;
        };
        amount: string;
        notes?: string;
    }>;
    snacks: Array<{
        _id: string;
        startTime: Date;
        snackType: {
            category: string;
            name: string;
        };
        amount: string;
        notes?: string;
    }>;
    growth_tracking?: Array<{
        _id: string;
        date: Date;
        weight: number;
        height: number;
        notes?: string;
    }>;
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
        allergy_information?: AllergyInfo[];
        teeth_information?: TeethInfo[];
        breast_milk?: {
            _id: string;
            startTime: Date;
            duration: number;
            breast: 'left' | 'right';
        }[];
        formula?: Array<{
            _id: string;
            startTime: Date;
            amount: number;
            brand: string;
            notes?: string;
        }>;
        water?: Array<{
            _id: string;
            startTime: Date;
            amount: number;
            notes?: string;
        }>;
        supplement?: Array<{
            _id: string;
            startTime: Date;
            supplementType: {
                category: string;
                name: string;
            };
            amount: string;
            notes?: string;
        }>;
        solid_food?: Array<{
            _id: string;
            startTime: Date;
            foodType: {
                category: string;
                name: string;
            };
            amount: string;
            notes?: string;
        }>;
        snacks: Array<{
            _id: string;
            startTime: Date;
            snackType: {
                category: string;
                name: string;
            };
            amount: string;
            notes?: string;
        }>;
        growth_tracking?: Array<{
            _id: string;
            date: Date;
            weight: number;
            height: number;
            notes?: string;
        }>;
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
        console.log('Baby API Response:', response.data);
        return response;
    },

    getBabyById: (id: string) => {
        return apiClient.get<BabyApiResponse>(`detail/${id}`);
    },

    deleteBaby: (id: string) => {
        return apiClient.delete<BabyApiResponse>(`${id}`);
    },
    addVaccine: async (babyId: string, vaccineData: AddVaccineData): Promise<VaccineApiResponse> => {
        const response = await apiClient.post<VaccineApiResponse>(`${babyId}/add-vaccine`, vaccineData);

        if (!response.data) {
            throw new Error('Response data is undefined');
        }

        return response.data;
    },
    deleteVaccine: async (babyId: string, vaccineId: string) => {
        const response = await apiClient.delete<VaccineApiResponse>(
            `${babyId}/delete-vaccine/${vaccineId}`
        );
        if (!response.data) {
            throw new Error('Response data is undefined');
        }
        return response.data;
    },
    addAllergy: async (babyId: string, allergyData: AllergyInfo): Promise<AllergyApiResponse> => {
        const response = await apiClient.post<AllergyApiResponse>(`${babyId}/add-allergy`, allergyData);
        if (!response.data) {
            throw new Error('Response data is undefined');
        }
        return response.data;
    },
    deleteAllergy: async (babyId: string, allergyId: string) => {
        const response = await apiClient.delete<AllergyApiResponse>(
            `${babyId}/delete-allergy/${allergyId}`
        );
        if (!response.data) {
            throw new Error('Response data is undefined');
        }
        return response.data;
    },
    addTeeth: async (babyId: string, teethData: AddTeethData): Promise<TeethApiResponse> => {
        const response = await apiClient.post<TeethApiResponse>(`${babyId}/add-teeth`, teethData);
        if (!response.data) throw new Error('Response data is undefined');
        return response.data;
    },
    deleteTeeth: async (babyId: string, teethId: string) => {
        const response = await apiClient.delete<TeethApiResponse>(
            `${babyId}/delete-teeth/${teethId}`
        );
        if (!response.data) {
            throw new Error('Response data is undefined');
        }
        return response.data;
    }
}; 