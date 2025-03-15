"use client"
import type React from "react"
import { AdminSidebar } from "@/app/components/admin/AdminSidebar"
import Header from "@/app/components/layout/Header"
import { useTheme } from "@/app/context/ThemeContext"
import { useAuth } from "@/app/context/AuthContext"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) 
{
    const { theme, toggleTheme } = useTheme()
    const {logout}= useAuth()  
  return (
    <div className="min-h-screen bg-wayuu-sand dark:bg-wayuu-dark-bg">
        <Header theme={theme} toggleTheme={toggleTheme} handleLogout={logout}/>
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}

