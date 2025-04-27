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
  const [revealedImage, setRevealedImage] = useState<string | null>(null)
  const [showOverlay, setShowOverlay] = useState(false)

  // Overlay GIFs for each step
  const overlayGifs = [
    "/1reveal.gif",
    "/2reveal.gif",
    "/3reveal.gif"
  ]

  // Button labels
  const buttonLabels = [
    "Shoot the Hive",
    "SHooT",
    "Reveal"
  ]

  // Handle each step
  const handleStep = async () => {
    setShowOverlay(true)
    setTimeout(async () => {
      setShowOverlay(false)
      if (step < 2) {
        setStep(step + 1)
      } else {
        // Final step: trigger reveal
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
          setTimeout(() => {
            onComplete(data.imageUrl)
          }, 1000)
        } catch (err: any) {
          setError(err.message || "An error occurred during the reveal process")
        } finally {
          setIsLoading(false)
        }
      }
    }, 1200)
  }

  // Reset on cancel or new NFT
  const handleCancel = () => {
    setStep(0)
    setShowOverlay(false)
    setRevealedImage(null)
    setError(null)
    onCancel()
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
          <Image
            src={revealedImage || unrevealedImageUrl}
            alt="NFT to reveal"
            fill
            className="object-contain"
            priority={true}
          />
          {/* Overlay GIF */}
          {showOverlay && step <= 2 && (
            <Image
              src={overlayGifs[step]}
              alt={`Reveal overlay ${step + 1}`}
              fill
              className="object-contain absolute inset-0 z-10 pointer-events-none"
              priority={true}
            />
          )}
        </motion.div>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader2 className="h-12 w-12 animate-spin text-amber-400" />
          </div>
        )}
      </div>
      <div className="flex gap-4 justify-center mb-4">
        {buttonLabels.map((label, idx) => (
          <CustomButton
            key={label}
            variant={idx === step ? "mint" : "blank"}
            className="w-[140px]"
            onClick={handleStep}
            disabled={step !== idx || isLoading || !!revealedImage}
          >
            {label}
          </CustomButton>
        ))}
      </div>
      <CustomButton
        variant="blank"
        className="w-[120px]"
        onClick={handleCancel}
        disabled={isLoading}
      >
        Cancel
      </CustomButton>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}
