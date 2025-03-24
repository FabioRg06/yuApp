"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { validateToken, refreshAccessToken, logout as apiLogout,login as apiLogin,register as apiRegister,fetchProfile } from '../services/auth/auth'; // Reutilizas tus funciones de API
import { fetchUserStats } from '../services/api/stats/api';
import { useRouter } from 'next/navigation';
import { User } from '../utils/interfaces/interfaces';
import { toast } from 'react-toastify';


interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  stats: { lives: number, lessons_completed: number, streak: number };
  login: (email: string, password: string) => Promise<void>;
  register:(email: string, password: string,username:string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  checkToken: ()=> void;
}

// Creación del Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el Context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};

// Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({ lives: 5, lessons_completed: 0, streak: 0 });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await apiLogin(email, password);
      toast.success("Inicio de sesión exitoso");
      router.push("/pages/home");
    } catch (error) {
      toast.error("Error: " + (error instanceof Error ? error.message : "Desconocido"));
    } finally {
      setLoading(false);
    }
  };
  const register = async (name: string, email: string, password: string) => {
      setLoading(true);
      try {
        await apiRegister(name, email, password);
        toast.success("Registro exitoso. Inicia sesión.");
      } catch (error) {
        toast.error("Error: " + (error instanceof Error ? error.message : "Desconocido"));
      } finally {
        setLoading(false);
      }
    };

  // Función para hacer logout
  const logout = async () => {
    await apiLogout(); // Llama a la API que elimina las cookies
    setUser(null);
    router.push('/'); // Redirige a login
  };

  const checkAuth = async () => {
    setLoading(true);
    const valid = await validateToken();
    if (valid) {
      const profile = await fetchProfile(); // <-- Esta función debes implementarla para obtener info
      setUser(profile);
    } else {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        const profile = await fetchProfile();
        setUser(profile);
      } else {
        setUser(null);
        router.push("/");
      }
    }
    setLoading(false);
  };
  const checkToken = async () => {
    try {
      const isValid = await validateToken()
      if (isValid) {
        router.push("/pages/home")
      }
    } catch (error) {
      console.log("Token inválido o expirado:", error)
    }
  }
  const getStats= async ()=>{
    try {
      const stats= await fetchUserStats()
      setStats(stats);
    } catch (error) {
      toast.error("Error: " + (error instanceof Error ? error.message : "Desconocido"));
    }
  }

  // Cargar autenticación al montar
  useEffect(() => {
    checkAuth();
    getStats();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, stats,isAuthenticated: !!user, login, logout, checkAuth,checkToken,register }}>
      {children}
    </AuthContext.Provider>
  );
};

