"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface ConfettiPiece {
  id: number
  x: number
  y: number
  rotation: number
  scale: number
  color: string
  delay: number
}

interface ConfettiAnimationProps {
  duration?: number
  pieces?: number
}

export default function ConfettiAnimation({ duration = 4000, pieces = 100 }: ConfettiAnimationProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])
  const [active, setActive] = useState(true)

  // Colors for the confetti pieces - bee-themed colors
  const colors = ["#FFB949", "#F7D154", "#3A1F16", "#FFF4D9", "#FFE082", "#FFECB3"]

  useEffect(() => {
    // Generate confetti pieces
    const newConfetti: ConfettiPiece[] = []
    for (let i = 0; i < pieces; i++) {
      newConfetti.push({
        id: i,
        x: Math.random() * 100, // random x position (0-100%)
        y: -20 - Math.random() * 10, // start above the viewport
        rotation: Math.random() * 360, // random rotation
        scale: 0.3 + Math.random() * 0.7, // random size
        color: colors[Math.floor(Math.random() * colors.length)], // random color
        delay: Math.random() * 0.5, // random delay for staggered animation
      })
    }
    setConfetti(newConfetti)

    // Set a timeout to remove the confetti after the duration
    const timer = setTimeout(() => {
      setActive(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, pieces])

  if (!active) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute"
          initial={{
            x: `${piece.x}vw`,
            y: `${piece.y}vh`,
            rotate: piece.rotation,
            scale: piece.scale,
          }}
          animate={{
            y: ["0vh", "100vh"],
            rotate: [piece.rotation, piece.rotation + Math.random() * 360],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            ease: "easeOut",
            delay: piece.delay,
          }}
          style={{
            width: "10px",
            height: "10px",
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "0%",
            zIndex: 9999,
          }}
        />
      ))}
    </div>
  )
}
