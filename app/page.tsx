"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useRouter, usePathname } from "next/navigation"
import MintModal from "@/components/mint-modal"
import ForestBackground from "@/components/forest-background"
import { fetchNFTs, fetchCollectionStats, type NFTToken, type CollectionStats } from "@/lib/api"
import NFTCard from "@/components/nft-card"
import StatsCard from "@/components/collection-stats"
import TwitterButton from "@/components/twitter-button"
import MintButton from "@/components/mint-button"
import CustomButton from "@/components/custom-button"
import { useMediaQuery } from "@/hooks/use-media-query"
import MobileMenu from "@/components/mobile-menu"
import FontFixer from "@/components/font-fixer"
import FallbackFontLoader from "@/components/fallback-font-loader"
import { ConnectKitButton } from "connectkit"

export default function Home() {
  const router = useRouter()
  const pathname = usePathname()
  const [showMintModal, setShowMintModal] = useState(false)
  const [nfts, setNfts] = useState<NFTToken[]>([])
  const [stats, setStats] = useState<CollectionStats>({
    tokenCount: 852,
    floorPrice: 0.0189,
    floorPriceUsd: 29.64,
  })
  const [loading, setLoading] = useState(true)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Font family based on device
  const fontFamily = isMobile
    ? "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif"
    : "'Super Lobster', cursive, sans-serif"

  const { ref: heroRef, inView: heroInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [nftData, statsData] = await Promise.all([fetchNFTs(12), fetchCollectionStats()])
        setNfts(nftData)
        setStats(statsData)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Style for disabled buttons
  const disabledButtonStyle = "opacity-50 cursor-not-allowed"

  return (
    // Wrap in fragment since provider is commented out
    <>
      <FontFixer />
      <FallbackFontLoader />
      <main className="relative min-h-screen overflow-x-hidden" style={{ fontFamily }}>
        {/* Forest Background */}
        <ForestBackground />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
          {/* Header with wallet connection */}
          <header className="fixed top-0 left-0 right-0 h-[10vh] bg-[#FFB949] z-20 flex items-center justify-between px-2 md:px-6">
            <div className="flex items-center gap-2">
              <div className="relative h-12 w-12 md:h-16 md:w-16 transform hover:rotate-12 transition-transform">
                <Image
                  src="/images/bee-mascot.png"
                  alt="Bee Mascot"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
            </div>

            {isMobile ? (
              // Mobile hamburger menu only
              <MobileMenu
                onPhotoBoothClick={() => router.push("/photo-booth")}
                onFreeABeeClick={() => router.push("/free-a-bee")}
              />
            ) : (
              // Desktop header buttons
              <div className="flex items-center space-x-4 flex-wrap justify-end">
                <div className={disabledButtonStyle}>
                  <CustomButton variant="blank" className="w-[180px]">
                    Hive
                  </CustomButton>
                </div>
                <div onClick={() => router.push("/photo-booth")} className="cursor-pointer">
                  <CustomButton variant="photoBooth" className="w-[180px]" onClick={() => router.push("/photo-booth")}>
                    Photo booth
                  </CustomButton>
                </div>
                <div onClick={() => router.push("/free-a-bee")} className="cursor-pointer">
                  <CustomButton variant="mint" className="w-[180px]">
                    free-A-BeE
                  </CustomButton>
                </div>
                <div className={disabledButtonStyle}>
                  <CustomButton variant="blank" className="w-[180px]">
                    BeE-Dega
                  </CustomButton>
                </div>
                <ConnectKitButton.Custom>
                  {({ isConnected, show, truncatedAddress, ensName }) => {
                    return (
                      <CustomButton
                        variant={isConnected ? "blank" : "connect"}
                        className="w-auto min-w-[160px] px-4"
                        onClick={show}
                      >
                        {isConnected ? (ensName ?? truncatedAddress) : "Connect Wallet"}
                      </CustomButton>
                    )
                  }}
                </ConnectKitButton.Custom>
                <TwitterButton />
              </div>
            )}
          </header>

          {/* Hero Section */}
          <section
            ref={heroRef}
            className="min-h-screen flex flex-col items-center justify-center px-4 pt-[15vh] pb-[15vh]"
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-full max-w-md mx-auto mb-8">
                <Image
                  src="/images/beeish-new-logo.png"
                  alt="BEEISH NFT Collection"
                  width={500}
                  height={150}
                  className="w-full h-auto"
                  priority
                />
              </div>

              <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white" style={{ fontFamily }}>
                  Exclusive NFT Collection
                </h1>
                <p className="text-lg md:text-xl text-white max-w-2xl mx-auto" style={{ fontFamily }}>
                  Join the hive and collect unique bee-inspired digital art on the Abstract Chain Network
                </p>
              </div>

              <MintButton onClick={() => setShowMintModal(true)} />
            </motion.div>
          </section>

          {/* Stats Section */}
          <section className="py-10 px-4 bg-[#FFB949]">
            <div className="max-w-6xl mx-auto">
              <StatsCard stats={stats} />
            </div>
          </section>

          {/* Collection Section */}
          <section className="py-20 px-4 bg-[#3A1F16]">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2
                  className="text-3xl md:text-4xl font-bold mb-12 text-center text-primary"
                  style={{
                    fontFamily,
                    textShadow:
                      "4px 0 0 #3A1F16, -4px 0 0 #3A1F16, 0 4px 0 #3A1F16, 0 -4px 0 #3A1F16, 3px 3px 0 #3A1F16, -3px 3px 0 #3A1F16, 3px -3px 0 #3A1F16, -3px -3px 0 #3A1F16",
                  }}
                >
                  The Collection
                </h2>

                {loading ? (
                  <div className="flex justify-center items-center py-20">
                    <Loader className="w-10 h-10 animate-spin text-amber-500" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {nfts.length > 0
                      ? nfts.map((nft) => <NFTCard key={nft.tokenId} nft={nft} onMint={() => setShowMintModal(true)} />)
                      : Array.from({ length: 6 }).map((_, index) => (
                          <div
                            key={index}
                            className="bg-white border-4 border-[#3A1F16] rounded-xl overflow-hidden shadow-xl"
                          >
                            <div className="aspect-square bg-amber-100 relative">
                              <Image
                                src="/images/beeish-nft.gif"
                                alt={`BEEISH #${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="p-4 bg-white">
                              <h3
                                className="font-bold text-xl mb-2"
                                style={{
                                  fontFamily,
                                  color: "#FFB949",
                                  textShadow:
                                    "2px 0 0 #3A1F16, -2px 0 0 #3A1F16, 0 2px 0 #3A1F16, 0 -2px 0 #3A1F16, 1px 1px 0 #3A1F16, -1px 1px 0 #3A1F16, 1px -1px 0 #3A1F16, -1px -1px 0 #3A1F16",
                                }}
                              >
                                BEEISH #{index + 1}
                              </h3>
                              <p
                                className="mb-4"
                                style={{
                                  fontFamily,
                                  color: "#3A1F16",
                                  fontWeight: "500",
                                }}
                              >
                                Unique bee-inspired digital collectible
                              </p>
                              <div className="flex justify-between items-center">
                                <span
                                  className="font-bold"
                                  style={{
                                    fontFamily,
                                    color: "#FFB949",
                                    textShadow:
                                      "1px 0 0 #3A1F16, -1px 0 0 #3A1F16, 0 1px 0 #3A1F16, 0 -1px 0 #3A1F16, 0.5px 0.5px 0 #3A1F16, -0.5px 0.5px 0 #3A1F16, 0.5px -0.5px 0 #3A1F16, -0.5px -0.5px 0 #3A1F16",
                                  }}
                                >
                                  0.0189 ETH
                                </span>
                                <div
                                  onClick={() =>
                                    window.open(
                                      `https://magiceden.io/item-details/abstract/0xc2d1370017d8171a31bce6bc5206f86c4322362e/${
                                        index + 1
                                      }`,
                                      "_blank",
                                    )
                                  }
                                  className="cursor-pointer"
                                >
                                  <CustomButton variant="blank" className="w-[120px] h-10">
                                    View
                                  </CustomButton>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                  </div>
                )}
              </motion.div>
            </div>
          </section>

          {/* About Section */}
          <section className="py-20 px-4 bg-bee-yellow">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary" style={{ fontFamily }}>
                  About BEEISH
                </h2>

                <p className="text-lg text-solid-white mb-6" style={{ fontFamily }}>
                  BEEISH is a unique NFT collection on the Abstract Chain Network that celebrates the beauty and
                  importance of bees in our ecosystem. Each NFT is a one-of-a-kind digital asset with varying rarity and
                  unique attributes.
                </p>

                <p className="text-lg text-solid-white mb-6" style={{ fontFamily }}>
                  Our collection features hand-crafted digital art inspired by the fascinating world of bees, their
                  hives, and their natural habitats. By owning a BEEISH NFT, you're not just collecting digital art –
                  you're becoming part of a community dedicated to the appreciation of these incredible creatures.
                </p>

                <div className="mt-8 flex gap-4 items-center justify-center md:justify-start">
                  <MintButton onClick={() => setShowMintModal(true)} />
                  <TwitterButton />
                </div>
              </motion.div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-8 px-4 bg-[#FFB949]">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
              <p className="text-dark font-bold text-center md:text-left" style={{ fontFamily }}>
                © {new Date().getFullYear()} BEEISH NFT Collection. All rights reserved.
              </p>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <p className="text-dark font-bold" style={{ fontFamily }}>
                  Built on Abstract Chain Network
                </p>
                <TwitterButton />
              </div>
            </div>
          </footer>
        </div>

        {/* Mint Modal - using our custom dialog component */}
        <MintModal open={showMintModal} onClose={() => setShowMintModal(false)} />
      </main>
    </>
  )
}

function Loader({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}
