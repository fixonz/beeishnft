"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/custom-dialog"
import { Input } from "@/components/ui/input"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
// Comment out the unused import
// import { useLoginWithAbstract, useAbstractClient } from "@abstract-foundation/agw-react"
import { useAccount } from "wagmi"
import CustomButton from "@/components/custom-button"
import { useMintNFT } from "@/lib/mint-service"
import Image from "next/image"
import { useMediaQuery } from "@/hooks/use-media-query"

interface MintModalProps {
  open: boolean
  onClose: () => void
}

export default function MintModal({ open, onClose }: MintModalProps) {
  const [minting, setMinting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [price, setPrice] = useState<bigint>(BigInt(0))
  // Comment out Abstract hooks
  // const { login } = useLoginWithAbstract()
  const { isConnected } = useAccount()
  // const { data: client } = useAbstractClient() // Assuming client is not strictly needed or obtained differently
  const { mintNFT, getPrice, pricePerNFT } = useMintNFT()
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    if (open) {
      // Defer state updates slightly to avoid updates during render
      setTimeout(() => {
        const newPrice = getPrice(quantity)
        setPrice(newPrice)
        setError(null)
        setSuccess(false)
      }, 0); // Delay of 0 pushes execution after current render cycle
    }
  }, [quantity, open, getPrice])

  const handleMint = async () => {
    if (!isConnected) {
      // Cannot automatically log in without the hook - prompt user
      setError("Please connect your wallet first."); 
      // await login()
      return
    }

    // Commented out client check - Proceed with caution if client was essential
    // if (!client) {
    //   setError("Wallet client not available.");
    //   return
    // }

    setMinting(true)
    setError(null)

    try {
      // Ensure mintNFT doesn't strictly require the Abstract client
      const result = await mintNFT({ quantity })

      if (result.success) {
        setMinting(false)
        setSuccess(true)

        // Reset after showing success
        setTimeout(() => {
          setSuccess(false)
          onClose()
          setQuantity(1)
        }, 3000)
      } else {
        console.error("Mint failed:", result.error)
        setMinting(false)
        setError(result.error || "Transaction failed")
      }
    } catch (error: any) {
      console.error("Error minting:", error)
      setMinting(false)
      setError(error.message || "An unexpected error occurred")
    }
  }

  // Format price to ETH
  const formatPrice = (wei: bigint): string => {
    return (Number(wei) / 1e18).toFixed(3)
  }

  // Format price per NFT
  const formatPricePerNFT = (wei: bigint): string => {
    return (Number(wei) / 1e18).toFixed(3)
  }

  const buttonWidth = isMobile ? "w-[100px]" : "w-[120px]"

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="bg-[#FFB949] border-4 border-[#3A1F16] rounded-xl p-0 overflow-visible w-[95%] max-w-md mx-auto"
        onClose={onClose}
      >
        <div className="absolute right-2 top-2 z-10">
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center">
            <Image src="/images/x-button.png" alt="Close" width={32} height={32} className="w-8 h-8" />
          </button>
        </div>

        <div className="p-4 md:p-6 flex flex-col items-center">
          <DialogHeader className="mb-4 w-full text-center">
            <DialogTitle className="text-xl md:text-2xl font-bold text-primary custom-button-text">
              Mint Your BEEISH NFT
            </DialogTitle>
            <DialogDescription className="text-dark font-medium text-sm md:text-base">
              Connect your Abstract Global Wallet and mint your unique BEEISH NFT on the Abstract Chain Network.
            </DialogDescription>
          </DialogHeader>

          {!success ? (
            <div className="grid gap-4 py-2 md:py-4">
              {!isConnected && (
                <div className="bg-bee-light-yellow p-3 md:p-4 rounded-lg border border-[#3A1F16] mb-2 md:mb-4">
                  <p className="text-dark font-medium text-sm md:text-base">
                    Please connect your wallet to mint
                  </p>
                  <p className="text-xs text-center mt-1">(Connect using header button)</p> 
                </div>
              )}

              {error && (
                <div className="bg-red-50 p-3 md:p-4 rounded-lg border border-red-200 mb-2 md:mb-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-red-500 mr-2 mt-0.5" />
                    <p className="text-red-800 font-medium text-sm md:text-base">{error}</p>
                  </div>
                </div>
              )}

              {isConnected && (
                <>
                  <div className="grid gap-2">
                    <label className="text-dark font-bold text-sm md:text-base">Quantity</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border-4 border-[#3A1F16] bg-[#FFB949] rounded-full text-[#3A1F16] font-bold text-xl"
                      >
                        -
                      </button>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={quantity}
                        onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                        className="text-center border-[#3A1F16] bg-bee-light-yellow"
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                        className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border-4 border-[#3A1F16] bg-[#FFB949] rounded-full text-[#3A1F16] font-bold text-xl"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="bg-bee-light-yellow p-3 md:p-4 rounded-lg border border-[#3A1F16]">
                    <div className="flex justify-between mb-2">
                      <span className="text-dark font-medium text-sm md:text-base">Price per NFT:</span>
                      <span className="font-bold text-primary text-sm md:text-base">
                        {formatPricePerNFT(pricePerNFT)} ETH
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-dark font-medium text-sm md:text-base">Quantity:</span>
                      <span className="font-bold text-primary text-sm md:text-base">{quantity}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#3A1F16]">
                      <span className="text-dark font-bold text-sm md:text-base">Total:</span>
                      <span className="font-bold text-primary text-sm md:text-base">{formatPrice(price)} ETH</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="py-4 md:py-6 flex flex-col items-center justify-center w-full">
              <CheckCircle2 className="h-12 w-12 md:h-16 md:w-16 text-green-500 mb-4" />
              <h3 className="text-lg md:text-xl font-bold text-primary mb-2 custom-button-text">Minting Successful!</h3>
              <p className="text-center text-dark font-medium text-sm md:text-base">
                Your BEEISH NFT has been successfully minted and will appear in your wallet shortly.
              </p>
            </div>
          )}

          <div className="flex justify-between mt-4 md:mt-6 w-full">
            {!success ? (
              <>
                <div onClick={onClose} className="cursor-pointer">
                  <CustomButton variant="blank" className={buttonWidth}>
                    Cancel
                  </CustomButton>
                </div>
                <div onClick={handleMint} className={`cursor-pointer ${minting ? "opacity-70" : ""}`}>
                  {minting ? (
                    <div
                      className={`flex items-center justify-center ${buttonWidth} h-12 bg-[#FFB949] border-4 border-[#3A1F16] rounded-full`}
                    >
                      <Loader2 className="h-5 w-5 md:h-6 md:w-6 animate-spin text-[#3A1F16]" />
                    </div>
                  ) : (
                    <CustomButton variant="mint" className={buttonWidth} />
                  )}
                </div>
              </>
            ) : (
              <div onClick={onClose} className="cursor-pointer mx-auto">
                <CustomButton variant="blank" className={buttonWidth}>
                  Close
                </CustomButton>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
