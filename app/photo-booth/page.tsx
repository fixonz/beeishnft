"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import PhotoBooth from "@/components/photo-booth-fullscreen"
import ForestBackground from "@/components/forest-background"
import { useAccount } from "wagmi"
import { useLoginWithAbstract } from "@abstract-foundation/agw-react"
// import { AbstractWalletProviderWrapper } from "@/components/abstract-wallet-provider"
import FontFixer from "@/components/font-fixer"
import FallbackFontLoader from "@/components/fallback-font-loader"
import CustomButton from "@/components/custom-button"

export default function PhotoBoothPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { isConnected } = useAccount()
  const { login } = useLoginWithAbstract()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    // Wrap in a fragment since AbstractWalletProviderWrapper is commented out
    <>
      <FontFixer />
      <FallbackFontLoader />
      <main className="relative h-screen overflow-hidden flex flex-col">
        {/* Forest Background */}
        <ForestBackground />

        {/* Static Header with Back Button and Logo */}
        <header className="bg-[#FFB949] py-2 px-4 z-20 relative shrink-0">
          <div className="relative">
            {/* Back Button - positioned absolutely on the left */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
              <CustomButton variant="blank" className="w-[120px] h-12" onClick={() => router.push("/")}>
                Back
              </CustomButton>
            </div>

            {/* Logo - centered */}
            <div className="flex justify-center">
              <div className="relative w-[280px] h-[70px]">
                <Image
                  src="/images/photo-booth-logo.png"
                  alt="BEE-ISH PhotoBooth"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content Container - flex-grow to fill available space */}
        <div className="flex-grow flex justify-center relative z-10">
          {/* Full-screen Photo Booth - Pass props */}
          <PhotoBooth isConnected={isConnected} login={login} />
        </div>

        {/* Add a yellow footer specific to this page */}
        <footer className="bg-[#FFB949] py-4 px-4 z-20 relative shrink-0">
          {/* You can add footer content here if needed, or leave it empty */}
          <div className="h-8"> {/* Placeholder height */} </div> 
        </footer>

      </main>
    </>
  )
}
