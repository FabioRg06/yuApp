import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { login,register,validateToken,logout } from "../services/auth/auth";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await login(email, password);
      toast.success("Inicio de sesión exitoso");
      router.push("/pages/home");
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
  const handleLogout = async () => {
    await logout()
    router.push("/")
  }
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

  return { handleLogin, handleRegister,checkToken, isLoading, handleLogout};
}
