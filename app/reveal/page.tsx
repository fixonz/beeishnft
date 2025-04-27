'use client'

import React from 'react'
import RevealNFT from '@/components/reveal-nft' // Import the component
import { motion } from "framer-motion" // Import motion if needed for title animation

export default function RevealPage() {

  return (
    <div className="container mx-auto py-8 px-4 h-full overflow-y-auto">
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
  )
}
