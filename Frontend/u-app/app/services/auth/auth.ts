import { API_BASE_URL } from "../api/api";

export async function validateToken(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/token/validate-token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      });
  
      return response.ok; // Devuelve true si el token es válido
    } catch (error) {
      console.error("Error al validar el token", error);
      return false;
    }
  }

export async function refreshAccessToken(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
        method: "POST",
        credentials: "include", 
      });

      if (!response.ok) {
        throw new Error("No se pudo renovar el token");
      }

      
    } catch (error) {
      console.error("Error al renovar el token de acceso", error);
      throw error;
    }
  }
  
export async function register(username: string, email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/api/user/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    })
    if (!response.ok) {
      
      const errorData = await response.json()
      for(let error in errorData.errors){
        throw new Error(errorData.errors[error])
      }
    }
  
    return response.json()
  }
  
export async function login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/api/user/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    })
  
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Error en el inicio de sesión")
    }
  
    return response.json()
  }
  export async function logout(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/token/logout/`, {
        method: "POST",
        credentials: "include", // Mandar cookies
      });
  
      if (!response.ok) {
        throw new Error("Error al cerrar sesión");
      }
    } catch (error) {
      console.error("Logout falló", error);
    }
  }
  
