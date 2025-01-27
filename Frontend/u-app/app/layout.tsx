import "./globals.css"
import type { Metadata } from "next"
import { Poppins, Baloo_2 } from "next/font/google"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

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
  title: "WayuuLingua - Aprende el idioma Wayuu de forma divertida",
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
        {children}
        <ToastContainer />
      </body>
    </html>
  )
}

