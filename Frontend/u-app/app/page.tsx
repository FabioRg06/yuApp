"use client"

import { useState,useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sun, Moon } from "lucide-react"
import Link from "next/link"
import { register, login } from "./utils/auth"
import { validateToken } from "./utils/auth"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useTheme } from "./context/ThemeContext"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  // Validar token al cargar la página
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("accessToken")
      if (token) {
        try {
          const isValid = await validateToken(token)
          if (isValid) {
            toast.success("Sesión activa, redirigiendo al inicio.")
            router.push("/home")
          }
        } catch (error) {
          console.log("Token inválido o expirado:", error)
          localStorage.removeItem("accessToken")
          localStorage.removeItem("refreshToken")
        }
      }
    }
    checkToken()
  }, [router])
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const data = await login(email, password)
      toast.success("Inicio de sesión exitoso")
      // Aquí puedes guardar el token de autenticación si el backend lo proporciona
      localStorage.setItem("accessToken", data.access)
      localStorage.setItem("refreshToken", data.refresh)
      router.push("/home")
    } catch (error) {
      toast.error(
        "Are you sure?" + (error instanceof Error ? error.message : "Unkwon Error"),
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
   
    
    try {
      await register(name, email, password)
      toast.success("Registro exitoso. Por favor, inicia sesión.")
      setActiveTab("login")
    } catch (error) {
      toast.error("Error en el registro: " + (error instanceof Error ? error.message : "Ocurrió un error desconocido"))
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-wayuu-sand dark:bg-wayuu-dark-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 dark:bg-wayuu-dark-card backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold text-wayuu-red font-display">WayuuLingua</CardTitle>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="bg-wayuu-teal text-wayuu-navy hover:bg-wayuu-blue hover:text-wayuu-sand dark:bg-wayuu-red dark:text-wayuu-dark-text dark:hover:bg-wayuu-red/80"
            >
              {theme === "light" ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
              <span className="sr-only">Cambiar tema</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input id="email" name="email" type="email" placeholder="tu@email.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input id="password" name="password" type="password" required />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-wayuu-red hover:bg-wayuu-red/80 text-white dark:bg-wayuu-red dark:hover:bg-wayuu-red/80 dark:text-wayuu-dark-text"
                    disabled={isLoading}
                  >
                    {isLoading ? "Cargando..." : "Iniciar sesión"}
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input id="name" name="name" type="text" placeholder="Tu nombre" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input id="email" name="email" type="email" placeholder="tu@email.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input id="password" name="password" type="password" required />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-wayuu-red hover:bg-wayuu-red/80 text-white dark:bg-wayuu-red dark:hover:bg-wayuu-red/80 dark:text-wayuu-dark-text"
                    disabled={isLoading}
                  >
                    {isLoading ? "Cargando..." : "Registrarse"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

