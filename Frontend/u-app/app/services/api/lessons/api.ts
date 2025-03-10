
import { API_BASE_URL } from "../api"

export async function fetchLessons(setLessons:any) {
    try {
  
      const response = await fetch(`${API_BASE_URL}/api/lessons`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials:'include'
      })
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
  
      const data = await response.json()
      setLessons(data)
    } catch (error) {
      console.error("Error fetching lessons:", error)
    }
  }
export async function updateLesson(id:number,title:string,description:string,chapter:number,icon:string) {
    try { 
      const response = await fetch(`${API_BASE_URL}/api/lessons/${id}/
        `, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
        },
        credentials:'include',
        body: JSON.stringify({title,description,chapter,icon})
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

    } catch (error) {
      console.error("Error updating progress:", error)
    }
  }

  export async function createLesson(title: string, description:string,chapter:number,icon:string) { 
    const response = await fetch(`${API_BASE_URL}/api/lessons/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials:'include',
      body: JSON.stringify({title,description,chapter,icon}),
    })
  
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Error en el registro")
    }
  
    return response.json()
  }
  export async function deleteLesson(id:number) {
    const response = await fetch(`${API_BASE_URL}/api/lessons/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials:'include'
    })
  
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Error en el registro")
    }
  }
  
  