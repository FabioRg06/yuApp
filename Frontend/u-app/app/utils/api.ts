export const API_BASE_URL = "http://127.0.0.1:8000"

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
    throw new Error(errorData.message || "Error en el registro")
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

