'use client'

import React from 'react'
import RevealNFT from '@/components/reveal-nft'
import { motion } from "framer-motion"
import ForestBackground from '@/components/forest-background'
import FontFixer from '@/components/font-fixer'
import FallbackFontLoader from '@/components/fallback-font-loader'
import { useRouter } from 'next/navigation'
import CustomButton from '@/components/custom-button'
import Image from "next/image"

export default function RevealPage() {
  const router = useRouter()

  return (
    <>
      <FontFixer />
      <FallbackFontLoader />
      <main className="relative min-h-screen flex flex-col overflow-y-auto">
        {/* Forest Background */}
        <ForestBackground />

        {/* Static Header */}
        <header className="bg-[#FFB949] py-2 px-4 z-20 relative shrink-0">
          <div className="relative">
            {/* Back Button */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
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
        <div className="flex-grow relative z-10 py-6 overflow-y-auto">
          <div className="container mx-auto px-4">
            <motion.h1
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-6 text-center text-[#3A1F16] tracking-wider"
            >
              Manage Your Bees
            </motion.h1>
            
            {/* Render the RevealNFT component which now contains the logic and mint button */}
            <RevealNFT />
          </div>
        </div>
        
        {/* Footer */}
        <footer className="bg-[#FFB949] py-4 px-4 z-20 relative shrink-0">
          <div className="h-8"> {/* Placeholder height */} </div> 
        </footer>
      </main>
    </>
  )
}
