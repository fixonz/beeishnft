"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import confetti from "canvas-confetti"

interface SuccessAnimationProps {
  show: boolean
  tokenId: string
  onComplete: () => void
}

export default function SuccessAnimation({ show, tokenId, onComplete }: SuccessAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)

      // Trigger confetti
      const duration = 3000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min
      }

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        // Use yellow and gold colors for the confetti
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ["#FFD700", "#FFC107", "#FFEB3B", "#F9A825"],
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ["#FFD700", "#FFC107", "#FFEB3B", "#F9A825"],
        })
      }, 250)

      // Complete the animation after a delay
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onComplete, 500) // Give time for exit animation
      }, 3000)

      return () => {
        clearInterval(interval)
        clearTimeout(timer)
      }
    }
  }, [show, onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-transparent p-8 rounded-lg text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 12 }}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <Image
                src="/images/bee-mascot-flying.png"
                alt="Bee freed!"
                width={200}
                height={200}
                className="mx-auto"
              />
            </motion.div>

            <motion.h2
              className="text-3xl font-bold text-yellow-400 mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Bee Freed!
            </motion.h2>

            <motion.p
              className="text-xl text-white mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Token #{tokenId} has been revealed
            </motion.p>

            <motion.div
              className="text-yellow-300 text-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p>Your bee is now free from the honey!</p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
