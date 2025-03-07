import { useState, useEffect } from "react"

export default function useWindowWidth() {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const updateWidth = () => setWidth(window.innerWidth)

    updateWidth()
    window.addEventListener("resize", updateWidth)

    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  return width
}
