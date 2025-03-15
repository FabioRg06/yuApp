"use client"
import { useState, useEffect } from "react"
import { fetchChapters } from "@/app/services/api/api"
import { Chapter } from "@/app/utils/interfaces/interfaces"
import { useTheme } from "@/app/context/ThemeContext"
import Header from "@/app/components/layout/Header"
import WelcomeCard from "@/app/components/home/WelcomeCard"
import ChapterList from "@/app/components/home/ChapterList"
import { useAuth } from "@/app/context/AuthContext"

function Home() {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const { theme, toggleTheme } = useTheme()
  const {logout}= useAuth()
  useEffect(() => {
    fetchChapters(setChapters)

  }, [])

  

  return (
    <div className="min-h-screen bg-wayuu-sand dark:bg-wayuu-dark-bg text-wayuu-navy dark:text-wayuu-dark-text">
      <Header theme={theme} toggleTheme={toggleTheme} handleLogout={logout} />
      <main className="container mx-auto px-4 py-8">
        <WelcomeCard />
        <ChapterList chapters={chapters} />
      </main>
    </div>
  )
}

export default Home
