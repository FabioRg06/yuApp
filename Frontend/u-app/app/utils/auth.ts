

export async function validateToken(accessToken: string): Promise<boolean> {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/validate-token/", {
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
      const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
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
  
  
