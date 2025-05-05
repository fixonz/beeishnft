"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import ForestBackground from "@/components/forest-background"
// import { AbstractWalletProviderWrapper } from "@/components/abstract-wallet-provider"
import FontFixer from "@/components/font-fixer"
import FallbackFontLoader from "@/components/fallback-font-loader"
import CustomButton from "@/components/custom-button"
import RevealNFT from "@/components/reveal-nft"
// Import MintButton and MintModal
import MintButton from "@/components/mint-button"
import MintModal from "@/components/mint-modal"

export default function FreeABeePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  // Add state for Mint Modal visibility
  const [isMintModalOpen, setIsMintModalOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Functions to open/close modal
  const openMintModal = () => setIsMintModalOpen(true)
  const closeMintModal = () => setIsMintModalOpen(false)

  return (
    // Wrap in a fragment
    <>
      <FontFixer />
      <FallbackFontLoader />
      <main className="relative h-screen overflow-hidden flex flex-col">
        {/* Forest Background */}
        <ForestBackground />

        {/* Static Header */}
        <header className="bg-[#FFB949] py-2 px-4 z-20 relative shrink-0">
          <div className="relative">
            {/* Back Button */}
            <div className="absolute left-0 min-h-0 top-1/2 transform -translate-y-1/2">
              <CustomButton variant="blank" className="w-[120px] h-12" onClick={() => router.push("/")}>
                Back
              </CustomButton>
            </div>

            {/* Logo */}
            <div className="flex justify-center">
              <div className="relative w-[280px] h-[70px]">
                <Image
                  src="/images/beeish-new-logo.png"
                  alt="BEEISH NFT Collection"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content Container */}
        {/* Add vertical padding py-6 */} 
        <div className="flex-grow flex items-center justify-center relative z-10 py-6">
          <div className="flex flex-col items-center justify-center">
            <RevealNFT />
            {/* Replace placeholder button with functional MintButton */}
            {/* Remove this MintButton - Logic is handled inside RevealNFT */}
            {/* <div className="mt-4">
              <MintButton onClick={openMintModal} />
            </div> */}
          </div>
        </div>

        {/* Add the footer back */}
        <footer className="bg-[#FFB949] py-4 px-4 z-20 relative shrink-0">
          <div className="h-8"> {/* Placeholder height */} </div> 
        </footer>
      </main>

      {/* Render the MintModal, controlled by state */}
      <MintModal open={isMintModalOpen} onClose={closeMintModal} />
    </>
  )
}
