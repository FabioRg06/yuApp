export const API_BASE_URL = "http://127.0.0.1:8000"

export async function fetchChapters(setChapters:any) {
  try {

    const response = await fetch(`${API_BASE_URL}/api/chapters`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
      },
      credentials: "include"
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
    const response = await fetch(`${API_BASE_URL}/api/lessons/${id}`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
      },
      credentials: "include"
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
      const response = await fetch(`${API_BASE_URL}/api/lessons/${id}/update-progress/`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({progress})
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

    } catch (error) {
      console.error("Error updating progress:", error)
    }
  }