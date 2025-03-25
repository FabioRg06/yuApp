"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type MascotMessage = {
  text: string
  duration?: number
  position?: "left" | "right"
}

type MascotContextType = {
  showMascot: boolean
  currentMessage: MascotMessage | null
  showMessage: (message: MascotMessage) => void
  hideMascot: () => void
}

const MascotContext = createContext<MascotContextType | undefined>(undefined)

export function MascotProvider({ children }: { children: ReactNode }) {
  const [showMascot, setShowMascot] = useState(false)
  const [currentMessage, setCurrentMessage] = useState<MascotMessage | null>(null)
  const [messageQueue, setMessageQueue] = useState<MascotMessage[]>([])

  // Procesar la cola de mensajes
  useEffect(() => {
    if (messageQueue.length > 0 && !currentMessage) {
      const nextMessage = messageQueue[0]
      setCurrentMessage(nextMessage)
      setShowMascot(true)
      setMessageQueue((prev) => prev.slice(1))

      // Auto-ocultar después de la duración especificada
      if (nextMessage.duration) {
        const timer = setTimeout(() => {
          setCurrentMessage(null)
          setShowMascot(false)
        }, nextMessage.duration)
        return () => clearTimeout(timer)
      }
    }
  }, [messageQueue, currentMessage])

  const showMessage = (message: MascotMessage) => {
    if (!currentMessage) {
      setCurrentMessage(message)
      setShowMascot(true)
    } else {
      setMessageQueue((prev) => [...prev, message])
    }
  }

  const hideMascot = () => {
    setCurrentMessage(null)
    setShowMascot(false)
  }

  return (
    <MascotContext.Provider value={{ showMascot, currentMessage, showMessage, hideMascot }}>
      {children}
    </MascotContext.Provider>
  )
}

export function useMascot() {
  const context = useContext(MascotContext)
  if (context === undefined) {
    throw new Error("useMascot must be used within a MascotProvider")
  }
  return context
}

