import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { babyApi } from '@/services/api/baby';
import { IBabyData } from '@/services/api/baby';

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
      
      console.log('Raw API response:', JSON.stringify(response.data, null, 2)); // Debug için

      if (response.data?.babies) {
        const mappedBabies = response.data.babies.map(baby => {
          console.log('Mapping baby formula:', baby.formula); // Debug için
          return {
            id: baby._id,
            name: baby.name,
            birthDate: baby.birthDate,
            gender: baby.gender,
            weight: baby.weight,
            height: baby.height,
            photo: baby.photo,
            formula: Array.isArray(baby.formula) ? baby.formula.map(formula => ({
              _id: formula._id,
              startTime: new Date(formula.startTime),
              amount: formula.amount,
              brand: formula.brand,
              notes: formula.notes
            })) : [],
            teeth_information: baby.teeth_information?.map(teeth => ({
              _id: teeth._id,
              tooth_id: teeth.tooth_id,
              tooth_name: teeth.tooth_name,
              tooth_type: teeth.tooth_type,
              date: new Date(teeth.date)
            })) || [],
            vaccine_information: baby.vaccine_information?.map(vaccine => ({
              _id: vaccine._id,
              vaccine_name: vaccine.vaccine_name,
              vaccine_date: new Date(vaccine.vaccine_date),
              vaccine_notes: vaccine.vaccine_notes
            })) || [],
            allergy_information: baby.allergy_information?.map(allergy => ({
              _id: allergy._id,
              allergy_name: allergy.allergy_name,
              discovery_date: new Date(allergy.discovery_date),
              symptoms: allergy.symptoms
            })) || [],
            breast_milk: baby.breast_milk?.map(milk => ({
              _id: milk._id,
              startTime: new Date(milk.startTime),
              duration: milk.duration,
              breast: milk.breast
            })) || []
          };
        });

        console.log('Mapped babies formula:', mappedBabies.map(b => b.formula)); // Debug için
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
