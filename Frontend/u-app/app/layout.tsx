import "@/app/styles/globals.css"
import type { Metadata } from "next"
import { Poppins, Baloo_2 } from "next/font/google"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Link from "next/link"
import type React from "react"
import { ThemeProvider } from "./context/ThemeContext"
import { AuthProvider } from "./context/AuthContext"
import { MascotProvider } from "./context/MascotContext"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-poppins",
})

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-baloo",
})

export const metadata: Metadata = {
  title: "YU-Learn new dialects",
  description: "Aprende el hermoso idioma Wayuu con lecciones interactivas y divertidas.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${poppins.variable} ${baloo.variable} font-sans`}>
        <AuthProvider>
          <ThemeProvider>
            <MascotProvider>
              <main>{children}</main>
              <ToastContainer />
            </MascotProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

