import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authApi } from '../services/api/auth';
import { apiClient } from '../services/api/client';

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (data: { user: User; accessToken: string }) => void;
  signOut: () => void;
  isInitialized: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState({
    isAuthenticated: false,
    user: null as User | null,
    isInitialized: false
  });

  // State güncellemelerini tek bir fonksiyonda yapalım
  const updateState = useCallback((updates: Partial<typeof state>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const signIn = useCallback(async (data: { user: User; accessToken: string }) => {
    try {
        // Sadece ApiClient'ta tut ve state'i güncelle
        apiClient.setToken(data.accessToken);
        updateState({
            user: data.user,
            isAuthenticated: true
        });
    } catch (error) {
        console.error('SignIn error:', error);
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
        } else {
            console.error('Logout failed:', response.error);
        }
    } catch (error) {
        console.error('Logout error:', error);
        // Hata durumunda da state'i temizle
        apiClient.setToken(null);
        updateState({
            user: null,
            isAuthenticated: false
        });
    }
  }, [updateState]);

  useEffect(() => {
    // İlk yükleme kontrolü
    updateState({ isInitialized: true });
  }, [updateState]);

  const value = useMemo(() => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    signIn,
    signOut,
    isInitialized: state.isInitialized
  }), [state.isAuthenticated, state.user, state.isInitialized, signIn, signOut]);

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