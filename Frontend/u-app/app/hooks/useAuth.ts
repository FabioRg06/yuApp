import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { login,register,validateToken } from "../services/auth/auth";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await login(email, password);
      toast.success("Inicio de sesión exitoso");
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      router.push("/home");
    } catch (error) {
      toast.error("Error: " + (error instanceof Error ? error.message : "Desconocido"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      await register(name, email, password);
      toast.success("Registro exitoso. Inicia sesión.");
    } catch (error) {
      toast.error("Error: " + (error instanceof Error ? error.message : "Desconocido"));
    } finally {
      setIsLoading(false);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    router.push("/")
  }
  const checkToken = async () => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      try {
        const isValid = await validateToken(token)
        if (isValid) {
          toast.success("Sesión activa, redirigiendo al inicio.")
          router.push("/pages/home")
        }
      } catch (error) {
        console.log("Token inválido o expirado:", error)
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
      }
    }
  }

  return { handleLogin, handleRegister,checkToken, isLoading, handleLogout};
}
