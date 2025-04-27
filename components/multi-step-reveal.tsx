"use client"

import { useState, useRef } from "react"
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
  const [showStepModal, setShowStepModal] = useState(false)
  const [showRevealedModal, setShowRevealedModal] = useState(false)
  const [modalStep, setModalStep] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

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
    console.log("handleStep called, step:", step)
    setModalStep(step)
    setShowStepModal(true)
    console.log("Modal should be showing now")
    
    // Play sound
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
    }, 100)
    
    setTimeout(async () => {
      setShowStepModal(false)
      if (step < 2) {
        setStep(step + 1)
      } else {
        // Final step: trigger reveal
        setIsLoading(true)
        setError(null)
        try {
          console.log("Starting reveal API call")
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
          console.log("Got revealed image:", meta.image)
          
          // Store the revealed NFT token ID and image in localStorage
          const revealedTokens = JSON.parse(localStorage.getItem('beeish-revealed-tokens') || '[]')
          if (!revealedTokens.includes(tokenId)) {
            revealedTokens.push(tokenId)
            localStorage.setItem('beeish-revealed-tokens', JSON.stringify(revealedTokens))
          }
          
          const revealedNFTs = JSON.parse(localStorage.getItem('beeish-revealed-nfts') || '[]')
          const nftEntry = {
            tokenId,
            image: meta.image
          }
          const existingIndex = revealedNFTs.findIndex((nft: any) => nft.tokenId === tokenId)
          if (existingIndex >= 0) {
            revealedNFTs[existingIndex] = nftEntry
          } else {
            revealedNFTs.push(nftEntry)
          }
          localStorage.setItem('beeish-revealed-nfts', JSON.stringify(revealedNFTs))
          
          // Show the reveal modal
          setShowRevealedModal(true)
          console.log("Revealed modal should be showing now")
          
          // Complete the reveal process
          setTimeout(() => {
            onComplete(meta.image)
          }, 1500)
        } catch (err: any) {
          console.error("Error during reveal:", err)
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
    setShowStepModal(false)
    setRevealedImage(null)
    setShowRevealedModal(false)
    setError(null)
    onCancel()
  }

  return (
    <div className="flex flex-col items-center">
      <audio ref={audioRef} src="/sound/shot.mp3" preload="auto" />
      <h2 className="text-2xl font-bold text-center mb-4 text-[#3A1F16]">Free Your Bee!</h2>
      
      {/* Main container - using the exact format from the screenshot */}
      <div className="flex w-full max-w-[600px] mx-auto justify-center">
        {/* NFT Container - left side */}
        <div className="w-[220px] h-[220px] mr-4 border-4 border-[#3A1F16] rounded-lg bg-white overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              src={revealedImage || unrevealedImageUrl}
              alt="NFT to reveal"
              fill
              className="object-contain"
              priority={true}
            />
          </div>
        </div>
        
        {/* Buttons Container - right side */}
        <div className="w-[220px] border-4 border-[#3A1F16] rounded-lg p-4 bg-[#FFF8E1]">
          <h3 className="text-center font-bold text-lg text-[#3A1F16] mb-4">Step {step + 1} of 3: {buttonLabels[step]}</h3>
          
          {/* Vertically stacked buttons */}
          <div className="flex flex-col gap-3">
            <CustomButton
              variant="mint"
              className={`py-2 font-bold ${step === 0 ? "" : "opacity-50"}`}
              onClick={handleStep}
              disabled={step !== 0 || isLoading || !!revealedImage}
            >
              Shoot the Hive
            </CustomButton>
            
            <CustomButton
              variant="blank"
              className={`py-2 font-bold ${step === 1 ? "" : "opacity-50"}`}
              onClick={handleStep}
              disabled={step !== 1 || isLoading || !!revealedImage}
            >
              SHooT
            </CustomButton>
            
            <CustomButton
              variant="blank"
              className={`py-2 font-bold ${step === 2 ? "" : "opacity-50"}`}
              onClick={handleStep}
              disabled={step !== 2 || isLoading || !!revealedImage}
            >
              Reveal
            </CustomButton>
            
            <CustomButton
              variant="blank"
              className="py-2 mt-2"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </CustomButton>
          </div>
          
          {error && <p className="text-red-500 mt-4 font-bold text-center">{error}</p>}
        </div>
      </div>

      {/* Loading indicator shown on top of NFT when loading */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30">
          <Loader2 className="h-12 w-12 animate-spin text-amber-400" />
        </div>
      )}

      {/* Modal for each reveal step */}
      {showStepModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative w-[85vw] h-[85vw] sm:w-[70vw] sm:h-[70vw] md:w-[50vw] md:h-[50vw] lg:w-[40vw] lg:h-[40vw] max-w-[90vw] max-h-[90vh] bg-[#FFB949] border-8 border-[#3A1F16] rounded-lg shadow-2xl">
            <Image
              src={revealedImage || unrevealedImageUrl}
              alt="NFT to reveal"
              fill
              className="object-contain p-4"
              priority={true}
            />
            <Image
              src={overlayGifs[modalStep]}
              alt={`Reveal overlay ${modalStep + 1}`}
              fill
              className="object-contain p-4"
              priority={true}
            />
          </div>
        </div>
      )}

      {/* Modal for revealed NFT */}
      {showRevealedModal && revealedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-[#FFB949] border-8 border-[#3A1F16] rounded-lg shadow-2xl p-4 text-center w-[80vw] sm:w-[60vw] md:w-[40vw] lg:w-[30vw] max-w-[90vw] max-h-[90vh] relative">
            <button
              className="absolute top-2 right-2 text-[#FFB949] bg-[#3A1F16] hover:bg-[#5a3a2f] w-8 h-8 rounded-full flex items-center justify-center"
              onClick={() => {
                setShowRevealedModal(false);
                // Force page refresh to update the "Freed Bees" section
                window.location.reload();
              }}
            >
              ×
            </button>
            <h3 className="text-xl font-bold text-[#3A1F16] mb-3">Your Bee is Revealed!</h3>
            <div className="bg-white border-4 border-[#3A1F16] rounded-lg p-2 mx-auto">
              <Image
                src={revealedImage}
                alt="Revealed NFT"
                width={300}
                height={300}
                className="object-contain mx-auto"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Debug buttons for development */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="mt-6 border-t-2 border-[#3A1F16] pt-4 w-full">
          <p className="text-sm text-[#3A1F16] mb-2">Debug Controls (dev only):</p>
          <div className="flex gap-2 flex-wrap">
            <button 
              className="px-2 py-1 bg-amber-200 border border-[#3A1F16] rounded text-xs"
              onClick={() => {
                setModalStep(0);
                setShowStepModal(true);
              }}
            >
              Test Step 1 Modal
            </button>
            <button 
              className="px-2 py-1 bg-amber-200 border border-[#3A1F16] rounded text-xs"
              onClick={() => {
                setModalStep(1);
                setShowStepModal(true);
              }}
            >
              Test Step 2 Modal
            </button>
            <button 
              className="px-2 py-1 bg-amber-200 border border-[#3A1F16] rounded text-xs"
              onClick={() => {
                setRevealedImage(unrevealedImageUrl);
                setShowRevealedModal(true);
              }}
            >
              Test Revealed Modal
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

