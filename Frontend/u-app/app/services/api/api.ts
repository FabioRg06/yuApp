export const API_BASE_URL = "http://127.0.0.1:8000"

// src/api/lesson.ts

import { fetchWithAuth } from "../auth/middlewares/fetchWrapper";

export async function fetchChapters(setChapters: any) {
  try {
    const response = await fetchWithAuth("/api/chapters", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    setChapters(data);
  } catch (error) {
    console.error("Error fetching chapters:", error);
  }
}

export async function fetchLessons(setLesson: any, id: string) {
  try {
    const response = await fetchWithAuth(`/api/lessons/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    setLesson(data);
  } catch (error) {
    console.error("Error fetching lessons:", error);
  }
}

export async function updateProgress(id: string, progress: number) {
  try {
    const response = await fetchWithAuth(`/api/lessons/${id}/update-progress/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ progress }),
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  } catch (error) {
    console.error("Error updating progress:", error);
  }
}
