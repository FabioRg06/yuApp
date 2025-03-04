
import { API_BASE_URL } from "../api"

export async function fetchWords(setWords:any) {
    try {
      const token = localStorage.getItem("accessToken") 
  
      const response = await fetch(`${API_BASE_URL}/api/word-phrases`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`, 
          "Content-Type": "application/json",
        },
      })
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
  
      const data = await response.json()
      setWords(data)
    } catch (error) {
      console.error("Error fetching lessons:", error)
    }
  }
export async function updateWord(id:number,
    text_wayuunaiki:string,
    text_spanish:string,
    type:string,
    is_known:boolean) {
    try {
      const token = localStorage.getItem("accessToken") 
      const response = await fetch(`${API_BASE_URL}/api/word-phrases/${id}/
        `, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`, 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({text_wayuunaiki,text_spanish,type,is_known})
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

    } catch (error) {
      console.error("Error updating progress:", error)
    }
  }

  export async function createWord(
    text_wayuunaiki:string,
    text_spanish:string,
    type:string,
    is_known:boolean
  ) {
    const token = localStorage.getItem("accessToken") 
    const response = await fetch(`${API_BASE_URL}/api/word-phrases/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({text_wayuunaiki,text_spanish,type,is_known}),
    })
  
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Error en el registro")
    }
  
    return response.json()
  }
  export async function deleteWord(id:number) {
    const token = localStorage.getItem("accessToken") 
    const response = await fetch(`${API_BASE_URL}/api/word-phrases/${id}/`, {
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
  
  