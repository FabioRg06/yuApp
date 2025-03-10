
import { WordPhrase } from "@/app/utils/interfaces/interfaces"
import { API_BASE_URL } from "../api"

export async function fetchQuestionsOfLesson(id:number,setQuestions:any) {
    try {
  
      const response = await fetch(`${API_BASE_URL}/api/lessons/${id}`, {
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
      setQuestions(data["questions"])
    } catch (error) {
      console.error("Error fetching lessons:", error)
    }
  }
  export async function deleteQuestionOption(id:number) {
    if(id==0){
        return
    }
    try { 
        const response = await fetch(`${API_BASE_URL}/api/questions/options/${id}/`, {
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
    } catch (error) {
        console.error("Error deleting option:", error)
    }
    
  }
  export async function updateOption(id:number,question_option: number,
    word_phrase: number,
    is_correct: boolean) {
    try { 
      const response = await fetch(`${API_BASE_URL}/api/questions/options/${id}/
        `, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
        },
        credentials:'include',
        body: JSON.stringify({question_option,word_phrase,is_correct})
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

    } catch (error) {
      console.error("Error updating progress:", error)
    }
  }
  export async function createOption(question_option: number, word_phrase:number,is_correct:boolean) { 
    const response = await fetch(`${API_BASE_URL}/api/questions/options/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials:'include',
      body: JSON.stringify({question_option,word_phrase,is_correct}),
    })
  
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Error en el registro")
    }
  
    const data= await response.json()
    return data
  }
  export async function createQuestion(lesson: number, question_type: number, text: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/questions/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials:'include',
        body: JSON.stringify({
          lesson, 
          question_type,
          text
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear la pregunta");
      }
  
      const data = await response.json();
      return data.id; // Devuelve el ID de la pregunta recién creada
    } catch (error) {
      console.error("Error creating question:", error);
      return null;
    }
  }
  export async function createQuestionWithOptions(
    lessonId: number,
    question_type: number,
    text: string,
    options: { word_phrase: WordPhrase; is_correct: boolean }[]
  ) {
    const questionId = await createQuestion(lessonId, question_type, text);
    if (!questionId) return;
    
    for (const option of options) {
      await createOption(questionId, option.word_phrase.id, option.is_correct);
    }
    return questionId
  }
  export async function updateQuestion(id:number,lesson:number,question_type:number,text:string) {
    try { 
      const response = await fetch(`${API_BASE_URL}/api/questions/${id}/
        `, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
        },
        credentials:'include',
        body: JSON.stringify({lesson,question_type,text})
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

    } catch (error) {
      console.error("Error updating progress:", error)
    }
  }  
  export async function deleteQuestion(id:number) { 
    const response = await fetch(`${API_BASE_URL}/api/questions/${id}/`, {
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