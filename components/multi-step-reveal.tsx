"use client"

import { useState } from "react"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import CustomButton from "./custom-button"
import { motion, AnimatePresence } from "framer-motion"

interface MultiStepRevealProps {
  tokenId: string
  address: string
  unrevealedImageUrl: string
  onComplete: (imageUrl: string) => void
  onCancel: () => void
}

export default function MultiStepReveal({ tokenId, address, unrevealedImageUrl, onComplete, onCancel }: MultiStepRevealProps) {
  const [step, setStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pressCount, setPressCount] = useState(0)
  const [showAnimation, setShowAnimation] = useState(false)
  const [revealedImage, setRevealedImage] = useState<string | null>(null)

  // Get the appropriate image based on press count
  const getRevealImage = () => {
    if (revealedImage) return revealedImage
    if (pressCount === 2 && !showAnimation) return unrevealedImageUrl
    if (showAnimation) return "/images/reveal-press1.png"
    if (pressCount === 0) return "/images/reveal-press1.png"
    if (pressCount === 1) return "/images/reveal-press1.png"
    return "/images/reveal-press1.png"
  }

  // Handle the reveal button press
  const handleRevealPress = async () => {
    // First two presses just update the image
    if (pressCount < 2) {
      setPressCount(pressCount + 1)
      return
    }
    // On third (final) press, show the NFT image, then trigger the reveal animation
    setShowAnimation(true)
    setTimeout(() => {
      startRevealProcess()
    }, 1500)
  }

  // Start the actual reveal process
  const startRevealProcess = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/reveal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tokenId,
          address,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to reveal NFT")
      }

      const data = await response.json()
      setRevealedImage(data.imageUrl)
      
      // Wait for the animation to complete before calling onComplete
      setTimeout(() => {
        onComplete(data.imageUrl)
      }, 2000)
    } catch (err: any) {
      console.error("Error during reveal:", err)
      setError(err.message || "An error occurred during the reveal process")
      setShowAnimation(false)
      setPressCount(0)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold text-center mb-4 text-[#3A1F16]">Free Your Bee!</h2>

      <div className="relative w-full max-w-md mx-auto mb-6">
        <motion.div
          className="relative aspect-square bg-white border-4 border-[#3A1F16] rounded-lg overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 12 }}
        >
          <AnimatePresence mode="wait">
            {revealedImage ? (
              <motion.div
                key="revealed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                className="absolute inset-0"
              >
                <Image
                  src={revealedImage}
                  alt="Your revealed bee"
                  fill
                  className="object-contain"
                  priority={true}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-400/20 to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="unrevealed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <Image
                  src={getRevealImage() || "/placeholder.svg"}
                  alt="Reveal your bee"
                  fill
                  className="object-contain"
                  priority={true}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="h-12 w-12 animate-spin text-amber-400" />
            </div>
          )}
        </motion.div>

        {/* Honey drip animation overlay */}
        {!revealedImage && (
          <motion.div 
            className="absolute top-0 left-0 right-0 pointer-events-none"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image src="/images/honey-drip.png" alt="" width={400} height={100} className="w-full object-contain" />
          </motion.div>
        )}
      </div>

      <p className="text-center text-[#3A1F16] mb-6 max-w-md">
        {revealedImage ? "Your bee has been freed!" : (
          pressCount === 0 ? "Press the button to free your bee from the honey!" :
          pressCount === 1 ? "Press again! The honey is starting to break..." :
          pressCount === 2 ? "One more press to free your bee!" :
          showAnimation ? "Your bee is breaking free!" : ""
        )}
      </p>

      <div className="flex gap-4 justify-center">
        {!isLoading ? (
          <>
            <CustomButton
              variant="blank"
              className="w-[120px]"
              onClick={onCancel}
              disabled={isLoading || showAnimation || !!revealedImage}
            >
              Cancel
            </CustomButton>

            {!revealedImage && (
              <motion.div whileTap={{ scale: 0.95 }} className="relative">
                <CustomButton
                  variant="mint"
                  className="w-[180px] relative overflow-hidden"
                  onClick={handleRevealPress}
                  disabled={isLoading}
                >
                  <span className="relative z-10">
                    {pressCount === 0 && "Press to Free"}
                    {pressCount === 1 && "Press Again"}
                    {pressCount === 2 && "Final Press!"}
                    {showAnimation && "Freeing..."}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/30 to-transparent shimmer-effect"></div>
                </CustomButton>
              </motion.div>
            )}
          </>
        ) : (
          <div className="text-center">
            <p className="text-[#3A1F16] font-bold animate-pulse">Freeing your bee...</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-800 text-sm">
          {error}
          <div className="mt-2 flex justify-center">
            <CustomButton variant="blank" className="w-[120px]" onClick={() => setError(null)}>
              Try Again
            </CustomButton>
          </div>
        </div>
      )}
    </div>
  )
}
