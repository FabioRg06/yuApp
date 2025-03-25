"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useRef } from "react"

type MascotMessage = {
  text: string
  duration?: number
  position?: "left" | "right"
}

// Mensajes motivacionales predefinidos
const MOTIVATIONAL_MESSAGES = [
  "¡Sigue así! Estás aprendiendo muy bien.",
  "¿Sabías que el wayuunaiki es hablado por más de 400,000 personas?",
  "Recuerda practicar un poco cada día, ¡la constancia es clave!",
  "¡Qué bien lo estás haciendo! Estoy orgulloso de ti.",
  "Cada palabra nueva que aprendes es un tesoro cultural.",
  "¡Ánimo! El aprendizaje de idiomas abre muchas puertas.",
  "La cultura wayuu tiene una rica tradición oral. ¡Sigue aprendiendo!",
  "¿Necesitas un descanso? Recuerda hidratarte mientras estudias.",
]

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
  const [lastAppearance, setLastAppearance] = useState(Date.now())
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Limpiar el temporizador cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  // Procesar la cola de mensajes
  useEffect(() => {
    if (messageQueue.length > 0 && !currentMessage) {
      const nextMessage = messageQueue[0]
      setCurrentMessage(nextMessage)
      setShowMascot(true)
      setMessageQueue((prev) => prev.slice(1))
      setLastAppearance(Date.now())

      // Auto-ocultar después de la duración especificada
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      timerRef.current = setTimeout(() => {
        setCurrentMessage(null)
        setShowMascot(false)
        timerRef.current = null
      }, nextMessage.duration || 5000) // Duración predeterminada de 5 segundos
    }
  }, [messageQueue, currentMessage])

  // Aparición periódica de la mascota
  useEffect(() => {
    // Mostrar la mascota cada 2-5 minutos si no está visible
    const checkInterval = setInterval(() => {
      const now = Date.now()
      const timeSinceLastAppearance = now - lastAppearance

      // Si han pasado entre 2 y 5 minutos desde la última aparición y no está visible
      // y no hay mensajes en cola
      if (timeSinceLastAppearance > 2 * 60 * 1000 && !showMascot && messageQueue.length === 0) {
        // 30% de probabilidad de aparecer en cada intervalo
        if (Math.random() < 0.3) {
          const randomMessage = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)]
          const position = Math.random() > 0.5 ? "right" : "left"

          showMessage({
            text: randomMessage,
            duration: 8000, // 8 segundos
            position,
          })
        }
      }
    }, 30000) // Comprobar cada 30 segundos

    return () => clearInterval(checkInterval)
  }, [lastAppearance, showMascot, messageQueue.length])

  const showMessage = (message: MascotMessage) => {
    // Asegurarse de que la duración esté establecida
    const messageWithDuration = {
      ...message,
      duration: message.duration || 5000,
    }

    // Verificar si es un mensaje crítico (como el de modo repaso)
    const isCriticalMessage =
      message.text.includes("repasar") || message.text.includes("Felicidades") || message.text.includes("Bienvenido")

    // Evitar mensajes duplicados en la cola, excepto los críticos
    const isDuplicate =
      !isCriticalMessage &&
      (messageQueue.some((m) => m.text === message.text) || (currentMessage && currentMessage.text === message.text))

    if (isDuplicate) return

    if (!currentMessage) {
      setCurrentMessage(messageWithDuration)
      setShowMascot(true)
      setLastAppearance(Date.now())

      // Configurar el temporizador para ocultar el mensaje
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      timerRef.current = setTimeout(() => {
        setCurrentMessage(null)
        setShowMascot(false)
        timerRef.current = null
      }, messageWithDuration.duration)
    } else {
      // Si es un mensaje crítico, ponerlo al principio de la cola
      if (isCriticalMessage) {
        setMessageQueue((prev) => [messageWithDuration, ...prev])
      } else {
        setMessageQueue((prev) => [...prev, messageWithDuration])
      }
    }
  }

  const hideMascot = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
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

