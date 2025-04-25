"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/custom-dialog"
import { useBearishNFTs, type BearishNFT, getDefaultNFT } from "@/lib/bearish-api"
import CustomButton from "./custom-button"
import { Loader2, Camera } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

interface SimplePhotoBoothProps {
  open: boolean
  onClose: () => void
}

export default function SimplePhotoBooth({ open, onClose }: SimplePhotoBoothProps) {
  const { defaultNFT, loadingDefaultNFT } = useBearishNFTs()
  const [selectedNFT, setSelectedNFT] = useState<BearishNFT | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [isDownloading, setIsDownloading] = useState(false)
  const [showFlash, setShowFlash] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  // Font family based on device
  const fontFamily = isMobile
    ? "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif"
    : "'Super Lobster', cursive"

  // Use default NFT
  const handleUseDefaultNFT = () => {
    if (defaultNFT) {
      setSelectedNFT(defaultNFT)
    } else {
      // If for some reason defaultNFT is not available, use a hardcoded one
      setSelectedNFT(getDefaultNFT())
    }
  }

  // Simple screenshot function
  const takeSimpleScreenshot = () => {
    if (!selectedNFT || !canvasRef.current) {
      setDownloadError("Cannot capture image. Please try again.")
      return
    }

    try {
      setIsDownloading(true)
      setShowFlash(true)
      setDownloadError(null)

      // Create a simple image from the NFT
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.src = selectedNFT.image || "/images/bee-mascot.png"

      img.onload = () => {
        // Create a canvas
        const canvas = document.createElement("canvas")
        canvas.width = 500
        canvas.height = 500
        const ctx = canvas.getContext("2d")

        if (!ctx) {
          setDownloadError("Could not create image. Please try again.")
          setIsDownloading(false)
          setShowFlash(false)
          return
        }

        // Fill with white background
        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw the NFT image centered
        const size = 400
        const x = (canvas.width - size) / 2
        const y = (canvas.height - size) / 2
        ctx.drawImage(img, x, y, size, size)

        // Add a watermark
        ctx.font = "20px Arial"
        ctx.fillStyle = "rgba(0,0,0,0.5)"
        ctx.fillText("BEEISH Photo Booth", 10, 30)

        // Convert to data URL and trigger download
        try {
          const dataUrl = canvas.toDataURL("image/png")
          const downloadLink = document.createElement("a")
          downloadLink.href = dataUrl
          downloadLink.download = `beeish-bearish-${selectedNFT.tokenId || "creation"}.png`
          document.body.appendChild(downloadLink)
          downloadLink.click()
          document.body.removeChild(downloadLink)

          // Hide flash effect after a short delay
          setTimeout(() => {
            setShowFlash(false)
            setIsDownloading(false)
          }, 300)
        } catch (err) {
          console.error("Error creating download:", err)
          setDownloadError("Failed to create download. Please try again.")
          setIsDownloading(false)
          setShowFlash(false)
        }
      }

      img.onerror = () => {
        console.error("Failed to load NFT image")
        setDownloadError("Failed to load NFT image. Please try again.")
        setIsDownloading(false)
        setShowFlash(false)
      }
    } catch (error) {
      console.error("Error in download setup:", error)
      setDownloadError("Failed to set up download. Please try again.")
      setIsDownloading(false)
      setShowFlash(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="bg-[#FFB949] border-4 border-[#3A1F16] rounded-xl p-4 md:p-6 max-w-4xl w-[95%] mx-auto overflow-y-auto max-h-[90vh]"
        onClose={onClose}
      >
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-primary" style={{ fontFamily }}>
            Simple BEEISH Photo Booth
          </DialogTitle>
          <DialogDescription className="text-dark font-medium" style={{ fontFamily }}>
            Take a photo of your BEARISH NFT!
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {loadingDefaultNFT ? (
            <div className="bg-bee-light-yellow p-4 rounded-lg border border-[#3A1F16] mb-4 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#3A1F16] mr-2" />
              <p className="text-dark font-medium" style={{ fontFamily }}>
                Loading BEARISH NFT...
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {selectedNFT ? (
                <div className="grid md:grid-cols-5 gap-4">
                  {/* Canvas for display */}
                  <div
                    className="md:col-span-3 bg-white border-4 border-[#3A1F16] rounded-xl p-2 relative"
                    ref={canvasRef}
                  >
                    <div className="aspect-square relative">
                      {/* Base NFT image */}
                      <Image
                        src={selectedNFT.image || "/images/bee-mascot.png"}
                        alt={selectedNFT.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    {showFlash && (
                      <div
                        className="absolute inset-0 bg-white opacity-80 z-10 rounded-xl"
                        style={{
                          animation: "flash 0.3s ease-out forwards",
                        }}
                      />
                    )}
                  </div>

                  {/* Controls */}
                  <div className="md:col-span-2">
                    <div className="bg-bee-light-yellow p-4 rounded-lg border border-[#3A1F16] mb-4">
                      <h3 className="text-xl font-bold mb-3 text-primary" style={{ fontFamily }}>
                        {selectedNFT.name}
                      </h3>

                      <div className="grid gap-4">
                        {downloadError && (
                          <div className="bg-red-100 p-2 rounded-lg border border-red-300">
                            <p className="text-red-800 font-medium text-sm" style={{ fontFamily }}>
                              {downloadError}
                            </p>
                          </div>
                        )}

                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={takeSimpleScreenshot}
                            disabled={isDownloading}
                            className="flex items-center justify-center p-2 bg-[#FFB949] border-4 border-[#3A1F16] rounded-lg hover:bg-amber-400 disabled:opacity-50 text-lg font-bold animate-pulse w-full"
                          >
                            {isDownloading ? (
                              <Loader2 className="h-6 w-6 animate-spin text-[#3A1F16] mr-2" />
                            ) : (
                              <Camera className="h-6 w-6 text-[#3A1F16] mr-2" />
                            )}
                            <span className="text-[#3A1F16] font-bold" style={{ fontFamily }}>
                              Take Photo
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between gap-2">
                      <CustomButton variant="blank" className="w-[120px]" onClick={() => setSelectedNFT(null)}>
                        Back
                      </CustomButton>

                      <CustomButton variant="blank" className="w-[120px]" onClick={onClose}>
                        Close
                      </CustomButton>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-bee-light-yellow p-4 rounded-lg border border-[#3A1F16]">
                    <h3 className="text-xl font-bold mb-3 text-primary" style={{ fontFamily }}>
                      Simple Photo Booth
                    </h3>

                    <div className="bg-white p-4 rounded-lg border border-[#3A1F16]">
                      <p className="text-dark font-medium mb-4" style={{ fontFamily }}>
                        Try our simple photo booth with a demo NFT:
                      </p>
                      <div className="flex justify-center">
                        <div
                          className="aspect-square w-40 bg-white border-2 border-[#3A1F16] rounded-lg overflow-hidden cursor-pointer hover:border-amber-500 transition-all"
                          onClick={handleUseDefaultNFT}
                        >
                          <div className="relative w-full h-full">
                            <Image
                              src={defaultNFT?.image || "/images/bee-mascot.png"}
                              alt={defaultNFT?.name || "BEARISH Demo NFT"}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-[#3A1F16]/80 p-2">
                              <p className="text-white text-sm truncate text-center" style={{ fontFamily }}>
                                {defaultNFT?.name || "BEARISH Demo NFT"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 mt-4">
                    <div onClick={onClose} className="cursor-pointer">
                      <CustomButton variant="blank" className="w-[120px]">
                        Close
                      </CustomButton>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </DialogContent>
      <style jsx global>{`
        @keyframes flash {
          0% { opacity: 0.8; }
          100% { opacity: 0; }
        }
      `}</style>
    </Dialog>
  )
}
