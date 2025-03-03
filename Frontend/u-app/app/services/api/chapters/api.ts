
import { API_BASE_URL } from "../api"

export async function updateChapter(id:number,title:string,description:string) {
    try {
      const token = localStorage.getItem("accessToken") 
      const response = await fetch(`${API_BASE_URL}/api/chapters/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`, 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({title,description})
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

    } catch (error) {
      console.error("Error updating progress:", error)
    }
  }

  export async function createChapter(title: string, description:string) {
    const token = localStorage.getItem("accessToken") 
    const response = await fetch(`${API_BASE_URL}/api/chapters/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({title,description }),
    })
  
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Error en el registro")
    }
  
    return response.json()
  }
  export async function deleteChapter(id:number) {
    const token = localStorage.getItem("accessToken") 
    const response = await fetch(`${API_BASE_URL}/api/chapters/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      }
    })
  
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Error en el registro")
    }
  }
  
  