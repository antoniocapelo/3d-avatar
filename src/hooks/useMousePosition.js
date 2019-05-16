import { useState, useEffect, useRef } from "react"

export default function useMousePosition() {
  const [mousePosition, setMousePosition] = useState([0, 0])
  const [hasMoved, setHasMoved] = useState(false)

  const handleMousePosition = e => {
    setMousePosition([e.pageX, e.pageY])
    setHasMoved(true)
  }

  useEffect(
    () => {
      window.addEventListener("mousemove", handleMousePosition)

      return () => {
        window.removeEventListener("mousemove", handleMousePosition)
      }
    }, [] // Recall only if ref changes
  )

  return { mousePosition, hasMoved}
}
