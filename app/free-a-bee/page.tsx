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

export default function FreeABeePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    // Wrap in a fragment
    <>
      <FontFixer />
      <FallbackFontLoader />
      <main className="relative min-h-screen overflow-hidden flex flex-col">
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

        {/* Content Container: Centering content */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-4 md:p-6 overflow-hidden">
          {/* Apply negative margin (-mt-8) to nudge content up ~30px */}
          <div className="-mt-8">
            <RevealNFT />
          </div>
        </div>
      </main>
    </>
  )
}
