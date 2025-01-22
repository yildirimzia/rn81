import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { babyApi } from '@/services/api/baby';
import { IBabyData } from '@/services/api/baby';

interface Baby {
  id: string;
  name: string;
  birthDate: Date;
  gender: 'male' | 'female';
  weight: number;
  height: number;
  photo?: { url: string };
  vaccine_information?: {
    _id: string;
    vaccine_name: string;
    vaccine_date: Date;
    vaccine_notes?: string;
  }[];
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
    amount: number;
    date: Date;
  }[];
}

export interface BabyContextType {
  babies: IBabyData[];
  activeChild?: IBabyData;
  setBabies: (babies: IBabyData[]) => void;
  selectedBaby: IBabyData | null;
  setSelectedBaby: (baby: IBabyData | null) => void;
  fetchBabies: () => Promise<void>;
  loading: boolean;
  deleteVaccine: (babyId: string, vaccineId: string) => Promise<void>;
  deleteAllergy: (babyId: string, allergyId: string) => Promise<void>;
  addTeeth: (babyId: string, teethData: {
    tooth_id: string;
    tooth_name: string;
    tooth_type: string;
    date: Date;
  }) => Promise<void>;
  deleteTeeth: (babyId: string, teethId: string) => Promise<void>;
}

const BabyContext = createContext<BabyContextType>({
  babies: [],
  setBabies: () => {},
  selectedBaby: null,
  setSelectedBaby: () => {},
  fetchBabies: async () => {},
  loading: false,
  deleteVaccine: async () => {},
  deleteAllergy: async () => {},
  addTeeth: async () => {},
  deleteTeeth: async () => {},
});

export function BabyProvider({ children }: { children: ReactNode }) {
  const [babies, setBabies] = useState<IBabyData[]>([]);
  const [selectedBaby, setSelectedBaby] = useState<IBabyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeChild, setActiveChild] = useState<IBabyData | undefined>(undefined);

  const fetchBabies = async () => {
    try {
      setLoading(true);
      const response = await babyApi.getBabies();
      console.log('API Response:', response.data); // Debug için

      if (response.data?.babies) {
        const mappedBabies = response.data.babies.map(baby => {
          console.log('Mapping baby:', baby); // Debug için
          return {
            id: baby._id,
            name: baby.name,
            birthDate: baby.birthDate,
            gender: baby.gender,
            weight: baby.weight,
            height: baby.height,
            photo: baby.photo,
            vaccine_information: baby.vaccine_information || [],
            allergy_information: baby.allergy_information || [],
            teeth_information: baby.teeth_information || [],
            breast_milk: baby.breast_milk || []
          };
        });
        
        console.log('Mapped babies:', mappedBabies); // Debug için
        setBabies(mappedBabies as IBabyData[]);
        
        if (mappedBabies.length > 0 && !activeChild) {
          setActiveChild(mappedBabies[0] as IBabyData);
        }
      }
    } catch (error) {
      console.error('Bebekler getirilemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteVaccine = async (babyId: string, vaccineId: string) => {
    try {
      setLoading(true);
      const response = await babyApi.deleteVaccine(babyId, vaccineId);
      if (response.success) {
        await fetchBabies(); // Listeyi yenile
      }
    } catch (error) {
      console.error('Error deleting vaccine:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteAllergy = async (babyId: string, allergyId: string) => {
    try {
      setLoading(true);
      const response = await babyApi.deleteAllergy(babyId, allergyId);
      if (response.success) {
        await fetchBabies();
      }
    } catch (error) {
      console.error('Error deleting allergy:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addTeeth = async (babyId: string, teethData: {
    tooth_id: string;
    tooth_name: string;
    tooth_type: string;
    date: Date;
  }) => {
    try {
      setLoading(true);
      const response = await babyApi.addTeeth(babyId, teethData);
      if (response.success) {
        await fetchBabies();
      }
    } catch (error) {
      console.error('Error adding teeth:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteTeeth = async (babyId: string, teethId: string) => {
    try {
      setLoading(true);
      const response = await babyApi.deleteTeeth(babyId, teethId);
      if (response.success) {
        await fetchBabies();
      }
    } catch (error) {
      console.error('Error deleting teeth:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBabies();
  }, []);

  return (
    <BabyContext.Provider value={{ 
      babies, 
      setBabies, 
      selectedBaby, 
      setSelectedBaby,
      fetchBabies,
      loading,
      deleteVaccine,
      deleteAllergy,
      addTeeth,
      deleteTeeth
    }}>
      {children}
    </BabyContext.Provider>
  );
}

export const useBabyContext = () => useContext(BabyContext);
