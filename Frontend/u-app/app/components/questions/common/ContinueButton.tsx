"use client"

import { Button } from "@/components/ui/button"

interface ContinueButtonProps {
  onClick: () => void
  className?: string
}

export default function ContinueButton({ onClick, className }: ContinueButtonProps) {
  return (
    <div className={`mt-4 text-center ${className || ""}`}>
      <Button onClick={onClick} className="bg-wayuu-red hover:bg-wayuu-red/80 text-white">
        Continuar
      </Button>
    </div>
  )
}

