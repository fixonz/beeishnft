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
  const [showRevealedModal, setShowRevealedModal] = useState(false)

  // Overlay GIFs for each step (corrected paths)
  const overlayGifs = [
    "/images/1reveal.gif",
    "/images/2reveal.gif",
    "/images/3reveal.gif"
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
          // Fetch fresh metadata from external API
          const metaRes = await fetch(`https://api.beeish.xyz/metadata/${tokenId}`)
          const meta = await metaRes.json()
          setRevealedImage(meta.image)
          setShowRevealedModal(true)
          setTimeout(() => {
            onComplete(meta.image)
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
    setShowRevealedModal(false)
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
          {/* Overlay GIF with improved visibility */}
          {showOverlay && step <= 2 && (
            <div className="absolute inset-0 z-20 flex items-end justify-center pointer-events-none">
              <Image
                src={overlayGifs[step]}
                alt={`Reveal overlay ${step + 1}`}
                fill
                className="object-contain"
                priority={true}
              />
            </div>
          )}
        </motion.div>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30">
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

      {/* Modal for revealed NFT */}
      {showRevealedModal && revealedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center max-w-xs w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setShowRevealedModal(false)}
            >
              ×
            </button>
            <Image
              src={revealedImage}
              alt="Revealed NFT"
              width={320}
              height={320}
              className="object-contain rounded-lg mb-4"
            />
            <p className="text-lg font-bold text-[#3A1F16] text-center">Your Bee is Revealed!</p>
          </div>
        </div>
      )}
    </div>
  )
}
