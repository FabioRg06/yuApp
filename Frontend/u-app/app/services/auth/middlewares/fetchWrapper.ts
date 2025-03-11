import { API_BASE_URL } from "../../api/api";
import { refreshAccessToken } from "../auth";

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
  retry = true
): Promise<Response> {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      credentials: "include", // Importante para cookies HttpOnly
    });

    // Si el token expiró, intenta refrescar
    if (response.status === 401 && retry) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return await fetchWithAuth(url, options, false); // Reintenta una vez
      } else {
        window.location.href = "/"; // Redirigir a login si falla
      }
    }

    return response;
  } catch (error) {
    console.error("Error en fetchWithAuth:", error);
    throw error;
  }
}


