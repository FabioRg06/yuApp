import { Button } from "@/components/ui/button"
import { Sun, Moon, Volume2, LogOut, ShieldAlert } from "lucide-react"
import Link from "next/link"
import ProgressStats from "./ProgressStats"
import { useAuth } from "@/app/context/AuthContext"
import { useEffect } from "react"

interface HeaderProps {
  theme: string
  toggleTheme: () => void
  handleLogout: () => void
}

export default function Header({ theme, toggleTheme, handleLogout }: HeaderProps) {
  const {user,stats} =useAuth()
  return (
      <div className="sticky top-0 z-50">
        <header className="bg-white dark:bg-wayuu-dark-card shadow-md">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
            
            <Link href="/pages/home">
              <h1 className="text-3xl font-bold font-display text-wayuu-red">YU</h1>
            </Link>
              <div className="flex space-x-2">
                {
                  (user?.role.name == "admin") &&
                  <Link href="/pages/admin">
                    <Button
                      variant="outline"
                      className="bg-wayuu-red text-white hover:bg-wayuu-red/80 dark:bg-wayuu-red dark:text-white dark:hover:bg-wayuu-red/80 flex items-center gap-2"
                      >
                      <ShieldAlert className="h-4 w-4" />
                      <span className="hidden sm:inline">Panel Admin</span>
                    </Button>
                  </Link>
                } 
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
                
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-wayuu-teal text-wayuu-navy hover:bg-wayuu-blue hover:text-wayuu-sand dark:bg-wayuu-red dark:text-wayuu-dark-text dark:hover:bg-wayuu-red/80"
                  onClick={handleLogout}
                >
                  <LogOut className="h-[1.2rem] w-[1.2rem]" />
                  <span className="sr-only">Cerrar sesión</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div
          className={`bg-white dark:bg-wayuu-dark-card border-t border-wayuu-teal/20 dark:border-wayuu-red/20 py-2 shadow-sm transition-all duration-300 `}>
          <div className="container mx-auto px-4 flex justify-center">
            <ProgressStats hearts={stats.lives} points={stats.lessons_completed} streak={stats.streak} />
          </div>
        </div>
    </div>
  )
}
