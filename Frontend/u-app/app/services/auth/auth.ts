import { API_BASE_URL } from "../api/api";

export async function validateToken(accessToken: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/token/validate-token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      return response.ok; // Devuelve true si el token es válido
    } catch (error) {
      console.error("Error al validar el token", error);
      return false;
    }
  }

export async function refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
  
      if (!response.ok) {
        throw new Error("No se pudo renovar el token");
      }
  
      const data = await response.json();
      const newAccessToken = data.access;
  
      // Guarda el nuevo token de acceso en localStorage
      localStorage.setItem("accessToken", newAccessToken);
  
      return newAccessToken;
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
      body: JSON.stringify({ email, password }),
    })
  
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Error en el inicio de sesión")
    }
  
    return response.json()
  }
