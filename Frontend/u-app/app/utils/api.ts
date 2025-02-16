export const API_BASE_URL = "http://127.0.0.1:8000"

export async function fetchChapters(setChapters:any) {
  try {
    const token = localStorage.getItem("accessToken") // Obtener el token desde localStorage

    const response = await fetch(`${API_BASE_URL}/api/chapters`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, // Enviar el token en el header
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    setChapters(data)
  } catch (error) {
    console.error("Error fetching lessons:", error)
  }
}
export async function fetchLessons(setLesson:any,id:string) {
  try {
    const token = localStorage.getItem("accessToken") // Obtener el token desde localStorage
    const response = await fetch(`${API_BASE_URL}/api/lessons/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, // Enviar el token en el header
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    setLesson(data)
  } catch (error) {
    console.error("Error fetching lessons:", error)
  }
}
export async function updateProgress(id:string,progress:number) {
    try {
      const token = localStorage.getItem("accessToken") // Obtener el token desde localStorage
      const response = await fetch(`${API_BASE_URL}/api/lessons/${id}/progress/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`, // Enviar el token en el header
          "Content-Type": "application/json",
        },
        body: JSON.stringify({progress})
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

    } catch (error) {
      console.error("Error updating progress:", error)
    }
  }