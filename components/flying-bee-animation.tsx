"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

interface FlyingBeeProps {
  duration?: number
  count?: number
}

export default function FlyingBeeAnimation({ duration = 5000, count = 5 }: FlyingBeeProps) {
  const [bees, setBees] = useState<{ id: number; delay: number; path: number; scale: number }[]>([])
  const [active, setActive] = useState(true)

  useEffect(() => {
    // Generate bees
    const newBees = Array.from({ length: count }, (_, i) => ({
      id: i,
      delay: Math.random() * 0.5,
      path: Math.floor(Math.random() * 3), // 3 different flight paths
      scale: 0.5 + Math.random() * 0.5, // random size
    }))
    setBees(newBees)

    // Set a timeout to remove the bees after the duration
    const timer = setTimeout(() => {
      setActive(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [count, duration])

  if (!active) return null

  // Define different flight paths
  const getPath = (pathIndex: number) => {
    switch (pathIndex) {
      case 0:
        return {
          x: ["-10%", "110%"],
          y: ["10%", "30%", "20%", "40%", "30%"],
        }
      case 1:
        return {
          x: ["-10%", "110%"],
          y: ["50%", "30%", "60%", "40%", "50%"],
        }
      case 2:
        return {
          x: ["-10%", "110%"],
          y: ["80%", "60%", "70%", "50%", "70%"],
        }
      default:
        return {
          x: ["-10%", "110%"],
          y: ["50%", "40%", "60%", "30%", "50%"],
        }
    }
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {bees.map((bee) => {
        const path = getPath(bee.path)
        return (
          <motion.div
            key={bee.id}
            className="absolute"
            initial={{ x: "-10%", scale: bee.scale }}
            animate={{
              x: path.x,
              y: path.y,
              rotate: [0, 5, -5, 5, 0, -5, 5, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              ease: "linear",
              delay: bee.delay,
              rotate: {
                duration: 0.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              },
            }}
            style={{
              width: "60px",
              height: "60px",
            }}
          >
            <Image
              src="/images/bee-mascot-flying.png"
              alt="Flying Bee"
              width={60}
              height={60}
              className="object-contain"
            />
          </motion.div>
        )
      })}
    </div>
  )
}
