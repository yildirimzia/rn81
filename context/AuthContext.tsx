import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authApi } from '../services/api/auth';
import { apiClient } from '../services/api/client';
import { useRouter } from 'expo-router';

export type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  gender?: 'female' | 'male' | 'not_specified';
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (data: { user: User; accessToken: string }) => void;
  signOut: () => void;
  isInitialized: boolean;
  successMessage: string | null;
  setSuccessMessage: (message: string | null) => void;
  updateUser: (userData: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState({
    isAuthenticated: false,
    user: null as User | null,
    isInitialized: false,
    successMessage: null as string | null
  });

  // State güncellemelerini tek bir fonksiyonda yapalım
  const updateState = useCallback((updates: Partial<typeof state>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const signIn = useCallback(async (data: { user: User; accessToken: string }) => {
    try {
        apiClient.setToken(data.accessToken);
        updateState({
            user: data.user,
            isAuthenticated: true
        });
    } catch (error) {
        console.error('SignIn error:', error);
        apiClient.setToken(null);
        updateState({
            user: null,
            isAuthenticated: false
        });
    }
  }, [updateState]);

  const signOut = useCallback(async () => {
    try {
        const response = await authApi.logout();
        
        if (response.success) {
            // Önce local state'i temizle
            apiClient.setToken(null);
            updateState({
                user: null,
                isAuthenticated: false
            });
            // Ana sayfaya yönlendir
            router.replace('/');
        } else {
            console.error('Logout failed:', response.error);
        }
    } catch (error) {
        console.error('Logout error:', error);
        // Hata durumunda da state'i temizle ve yönlendir
        apiClient.setToken(null);
        updateState({
            user: null,
            isAuthenticated: false
        });
        router.replace('/');
    }
  }, [updateState]);

  const setSuccessMessage = useCallback((message: string | null) => {
    updateState({ successMessage: message });
  }, [updateState]);

  const updateUser = useCallback((userData: Partial<User>) => {
    setState(prev => {
      const newUser = prev.user ? { ...prev.user, ...userData } : null;
      // User güncellendiğinde state'i hemen güncelle
      return {
        ...prev,
        user: newUser,
        isAuthenticated: !!newUser
      };
    });
  }, []);

  useEffect(() => {
    // İlk yükleme kontrolü
    updateState({ isInitialized: true });
  }, [updateState]);

  useEffect(() => {
    // Token'ı yenileme işlemi
    const refreshTokenInterval = setInterval(async () => {
      try {
        if (state.isAuthenticated) {
          const response = await authApi.refreshToken();
          if (response?.data?.accessToken) {
            apiClient.setToken(response.data.accessToken);
          }
        }
      } catch (error) {
        // Token yenileme başarısız olursa oturumu sonlandır
        await signOut();
      }
    }, 4 * 60 * 1000); // 4 dakikada bir token yenile

    return () => clearInterval(refreshTokenInterval);
  }, [state.isAuthenticated, signOut]);

  const value = useMemo(() => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    signIn,
    signOut,
    isInitialized: state.isInitialized,
    successMessage: state.successMessage,
    setSuccessMessage,
    updateUser
  }), [state.isAuthenticated, state.user, state.isInitialized, state.successMessage, signIn, signOut, setSuccessMessage, updateUser]);

  if (!state.isInitialized) {
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 