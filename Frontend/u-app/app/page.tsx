"use client"
import AuthForm from "./components/auth/AuthForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "./context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { useAuth } from "./hooks/useAuth";
import { useEffect } from "react"

export default function AuthPage() {
  const { theme, toggleTheme } = useTheme();
  const {checkToken,isLoading}= useAuth()
  useEffect(() => {
      
      checkToken();
    }, [])
  
  return (
    <div className="min-h-screen bg-wayuu-sand dark:bg-wayuu-dark-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 dark:bg-wayuu-dark-card backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold text-wayuu-red font-display">WayuuLingua</CardTitle>
            <Button variant="outline" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <AuthForm />
        </CardContent>
      </Card>
    </div>
  );
}
