"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
// import { useLoginWithAbstract } from "@abstract-foundation/agw-react"
import Image from "next/image"
import CustomButton from "./custom-button"
import { Loader2 } from "lucide-react"
import MultiStepReveal from "./multi-step-reveal"
import { useMediaQuery } from "@/hooks/use-media-query"
import { motion } from "framer-motion"
import SuccessAnimation from "./success-animation"
import MintButton from "./mint-button"
import MintModal from "./mint-modal"

// Define items per page
const ITEMS_PER_PAGE = 20;

interface BeeishNFT {
  tokenId: string
  name: string
  image: string
  revealed?: boolean
}

interface RevealedNftData {
  tokenId: string
  image: string
}

export default function RevealNFT() {
  const { isConnected, address } = useAccount()
  // const { login } = useLoginWithAbstract()
  const [nfts, setNfts] = useState<BeeishNFT[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedNFT, setSelectedNFT] = useState<BeeishNFT | null>(null)
  const [status, setStatus] = useState("")
  const [revealedImage, setRevealedImage] = useState("")
  const [isRevealing, setIsRevealing] = useState(false)
  const [showRevealedNFT, setShowRevealedNFT] = useState(false)
  const [activeTab, setActiveTab] = useState<"unrevealed" | "revealed">("unrevealed")
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [isMintModalOpen, setIsMintModalOpen] = useState(false)
  // Add state for pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Check if we're on mobile
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Add state to track revealed token IDs (persisted in localStorage)
  const [revealedTokenIds, setRevealedTokenIds] = useState<string[]>([])
  const [revealedNFTs, setRevealedNFTs] = useState<RevealedNftData[]>([])

  // Load revealed tokens from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRevealedTokens = localStorage.getItem("beeish-revealed-tokens")
      if (savedRevealedTokens) {
        try {
          setRevealedTokenIds(JSON.parse(savedRevealedTokens))
        } catch (e) {
          console.error("Error parsing revealed tokens from localStorage:", e)
        }
      }

      const savedRevealedNFTs = localStorage.getItem("beeish-revealed-nfts")
      if (savedRevealedNFTs) {
        try {
          setRevealedNFTs(JSON.parse(savedRevealedNFTs))
        } catch (e) {
          console.error("Error parsing revealed NFTs from localStorage:", e)
        }
      }
    }
  }, [])

  // Save revealed tokens to localStorage whenever the list changes
  useEffect(() => {
    if (revealedTokenIds.length > 0) {
      localStorage.setItem("beeish-revealed-tokens", JSON.stringify(revealedTokenIds))
    }

    if (revealedNFTs.length > 0) {
      localStorage.setItem("beeish-revealed-nfts", JSON.stringify(revealedNFTs))
    }
  }, [revealedTokenIds, revealedNFTs])

  // Fetch user's BEEISH NFTs when connected
  useEffect(() => {
    if (isConnected && address) {
      fetchUserNFTs(address)
    } else {
      setNfts([])
      setSelectedNFT(null)
    }
  }, [isConnected, address, revealedTokenIds])

  // Reset current page when NFTs change
  useEffect(() => {
    setCurrentPage(1);
  }, [nfts]);

  // Fetch user's BEEISH NFTs from the Abstract API
  const fetchUserNFTs = async (walletAddress: string) => {
    setLoading(true)
    setStatus("Loading your Bee Boxes...")
    try {
      const BEEISH_CONTRACT_ADDRESS = "0xc2d1370017d8171a31bce6bc5206f86c4322362e"
      const API_LIMIT = 200

      const response = await fetch(
        `https://api-abstract.reservoir.tools/users/${walletAddress}/tokens/v7?collection=${BEEISH_CONTRACT_ADDRESS}&limit=${API_LIMIT}`,
        {
          headers: {
            accept: "*/*",
            "x-api-key": "74f316c2-ffb7-58f3-a06d-3d45333fe37c",
          },
        },
      )

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()

      // Map the response to our BeeishNFT interface
      const userNFTs = data.tokens.map((item: any) => ({
        tokenId: item.token.tokenId,
        name: item.token.name || `BEEISH #${item.token.tokenId}`,
        image: item.token.image,
        revealed: revealedTokenIds.includes(item.token.tokenId),
      }))

      // Filter out already revealed NFTs - Add BeeishNFT type here
      const unrevealed = userNFTs.filter((nft: BeeishNFT) => !revealedTokenIds.includes(nft.tokenId))

      setNfts(unrevealed)

      if (unrevealed.length === 0) {
        if (userNFTs.length > 0) {
          setStatus("All your owned Bee Boxes have been revealed!")
          if (isMobile && revealedNFTs.length > 0) {
            setActiveTab("revealed")
          }
        } else {
          setStatus("You don't own any Bee Boxes currently.")
        }
      } else {
        setStatus("")
      }
    } catch (error: any) {
      console.error("Error fetching NFTs:", error)
      setStatus(`Error fetching NFTs: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Start the reveal process
  const startReveal = () => {
    if (!selectedNFT) {
      setStatus("Please select an NFT to reveal")
      return
    }

    setIsRevealing(true)
  }

  // Handle reveal completion
  const handleRevealComplete = (imageUrl: string) => {
    setRevealedImage(imageUrl)

    // Show the success animation first
    setShowSuccessAnimation(true)

    // The rest of the process will continue after the animation completes
  }

  // Handle success animation completion
  const handleSuccessAnimationComplete = () => {
    setShowSuccessAnimation(false)
    setShowRevealedNFT(true)

    // Add the token ID to the revealed list
    setRevealedTokenIds((prev) => [...prev, selectedNFT!.tokenId])

    // Add to revealed NFTs with image
    setRevealedNFTs((prev) => [
      ...prev,
      {
        tokenId: selectedNFT!.tokenId,
        image: revealedImage,
      },
    ])

    // Remove the revealed NFT from the selection
    setNfts((prev) => prev.filter((nft) => nft.tokenId !== selectedNFT!.tokenId))

    // Reset revealing state
    setIsRevealing(false)
  }

  // Cancel reveal process
  const cancelReveal = () => {
    setIsRevealing(false)
  }

  // Close revealed NFT view
  const closeRevealedNFT = () => {
    setShowRevealedNFT(false)
    setRevealedImage("")
    setSelectedNFT(null)

    // If no more unrevealed NFTs, switch to revealed tab on mobile
    if (isMobile && nfts.length === 0 && revealedNFTs.length > 0) {
      setActiveTab("revealed")
    }
  }

  // Render mobile tabs for switching between unrevealed and revealed NFTs
  const renderMobileTabs = () => {
    return (
      <div className="flex w-full mb-4 border-4 border-[#3A1F16] rounded-lg overflow-hidden">
        <button
          className={`flex-1 py-3 text-center font-bold ${
            activeTab === "unrevealed" ? "bg-[#3A1F16] text-[#FFB949]" : "bg-[#FFB949] text-[#3A1F16]"
          }`}
          onClick={() => setActiveTab("unrevealed")}
        >
          Free a Bee
        </button>
        <button
          className={`flex-1 py-3 text-center font-bold ${
            activeTab === "revealed" ? "bg-[#3A1F16] text-[#FFB949]" : "bg-[#FFB949] text-[#3A1F16]"
          }`}
          onClick={() => setActiveTab("revealed")}
        >
          Freed Bees ({revealedNFTs.length})
        </button>
      </div>
    )
  }

  // Render the unrevealed NFTs section
  const renderUnrevealedSection = () => {
    if (!isConnected) {
      return (
        <div className="flex flex-col items-center justify-center p-6 bg-bee-light-yellow rounded-lg border-4 border-[#3A1F16] min-h-[200px]">
          <p className="text-[#3A1F16] mb-4 text-center font-semibold text-lg">
            Please connect your wallet
          </p>
          <p className="text-[#3A1F16] text-center text-sm">
            (Use the button in the header to connect and free your bees!)
          </p>
        </div>
      )
    }

    if (isRevealing) {
      return (
        <div className="bg-bee-light-yellow p-4 rounded-lg border-4 border-[#3A1F16]">
          <MultiStepReveal
            tokenId={selectedNFT!.tokenId}
            address={address!}
            unrevealedImageUrl={selectedNFT!.image || "/placeholder.jpg"}
            onComplete={handleRevealComplete}
            onCancel={cancelReveal}
          />
        </div>
      )
    }

    if (showRevealedNFT) {
      return (
        <div className="bg-bee-light-yellow p-4 rounded-lg border-4 border-[#3A1F16]">
          <div className="flex flex-col items-center">
            <motion.h3
              className="text-2xl font-bold text-center mb-4 text-[#3A1F16]"
              style={{ fontFamily: "Super Lobster, cursive, sans-serif", textShadow: "none" }}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", damping: 12 }}
            >
              Your Bee is Free!
            </motion.h3>
            <motion.div
              className="border-4 border-[#3A1F16] rounded-lg overflow-hidden w-full max-w-md mx-auto mb-4 relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 12, delay: 0.2 }}
            >
              {/* Decorative honeycomb border */}
              <div className="absolute inset-0 border-8 border-[#FFB949] opacity-0 hover:opacity-20 transition-opacity duration-300"></div>

              {/* Glowing effect */}
              <div className="absolute inset-0 pulse-glow"></div>

              <div className="relative aspect-square bg-white">
                <Image src={revealedImage || "/placeholder.svg"} alt="Revealed NFT" fill className="object-contain" />
              </div>
            </motion.div>
            <motion.div
              className="mb-4 relative"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {/* Decorative elements */}
              <div className="absolute -left-6 top-1/2 transform -translate-y-1/2">
                <Image
                  src="/images/bee-mascot-normal.png"
                  alt="Bee"
                  width={30}
                  height={30}
                  className="float-animation"
                />
              </div>
              <div className="absolute -right-6 top-1/2 transform -translate-y-1/2">
                <Image
                  src="/images/bee-mascot-normal.png"
                  alt="Bee"
                  width={30}
                  height={30}
                  className="float-animation"
                  style={{ animationDelay: "1s" }}
                />
              </div>

              <p
                className="text-center text-lg font-bold text-[#3A1F16] px-10"
                style={{ fontFamily: "Super Lobster, cursive, sans-serif", textShadow: "none" }}
              >
                Token #{selectedNFT?.tokenId} revealed successfully!
              </p>
            </motion.div>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
              <CustomButton variant="blank" className="w-full md:w-[150px]" onClick={closeRevealedNFT}>
                Continue
              </CustomButton>
            </motion.div>
          </div>
        </div>
      )
    }

    if (loading) {
      return (
        <div className="flex justify-center items-center h-64 bg-bee-light-yellow p-4 rounded-lg border-4 border-[#3A1F16]">
          <Loader2 className="h-12 w-12 animate-spin text-[#3A1F16]" />
        </div>
      )
    }

    if (nfts.length > 0) {
      // --- Pagination Logic ---
      const totalPages = Math.ceil(nfts.length / ITEMS_PER_PAGE);
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const displayedNfts = nfts.slice(startIndex, endIndex);

      const goToPreviousPage = () => setCurrentPage((prev) => Math.max(1, prev - 1));
      const goToNextPage = () => setCurrentPage((prev) => Math.min(totalPages, prev + 1));
      // --- End Pagination Logic ---

      return (
        <motion.div 
          layout
          className="bg-bee-light-yellow p-6 rounded-lg border-4 border-[#3A1F16]"
        >
          <h2 className="text-center text-3xl font-bold text-[#3A1F16] mb-6 custom-button-text">
            Free Your Bee!
          </h2>
          {/* Grid for displayed NFTs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6 overflow-y-auto max-h-[400px]">
            {displayedNfts.map((nft: BeeishNFT) => (
              <motion.div
                key={nft.tokenId}
                className={`p-2 border-4 rounded-lg cursor-pointer transition-all duration-200 ease-in-out ${selectedNFT?.tokenId === nft.tokenId ? 'border-amber-600 bg-amber-200 scale-105 shadow-lg' : 'border-[#3A1F16] bg-amber-100 hover:border-amber-500 hover:scale-102'}`}
                onClick={() => setSelectedNFT(nft)}
                whileHover={{ scale: selectedNFT?.tokenId === nft.tokenId ? 1.05 : 1.02 }}
                layout
              >
                <Image
                  src={nft.image || "/placeholder.jpg"}
                  alt={nft.name}
                  width={200}
                  height={200}
                  className="w-full h-auto object-cover rounded-md mb-2"
                  unoptimized
                />
                <p className="text-center text-sm font-semibold text-[#3A1F16]">{nft.name}</p>
                <p className="text-center text-xs text-gray-600">Click to Select</p>
              </motion.div>
            ))}
          </div>

          {/* --- Pagination Controls --- */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mb-6">
              <CustomButton 
                variant="blank" 
                onClick={goToPreviousPage} 
                disabled={currentPage === 1}
                className="w-auto px-4 h-10" // Adjust size
              >
                Previous
              </CustomButton>
              <span className="text-[#3A1F16] font-semibold">
                Page {currentPage} of {totalPages}
              </span>
              <CustomButton 
                variant="blank" 
                onClick={goToNextPage} 
                disabled={currentPage === totalPages}
                className="w-auto px-4 h-10" // Adjust size
              >
                Next
              </CustomButton>
            </div>
          )}
          {/* --- End Pagination Controls --- */}

          <div className="flex justify-center">
            <CustomButton
              variant="mint"
              className="w-full md:w-[200px] relative overflow-hidden group"
              onClick={startReveal}
              disabled={!selectedNFT}
            >
              <span className="relative z-10 group-hover:text-white">Free This Bee</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/30 to-transparent shimmer-effect"></div>
            </CustomButton>
          </div>

          {selectedNFT && !isRevealing && (
            <div className="mt-8 flex flex-col items-center gap-4">
              <p className="text-center text-[#3A1F16]">
                Press the button to free your bee from the honey!
              </p>
              <div className="flex items-center gap-4">
                  <CustomButton variant="blank" onClick={() => setSelectedNFT(null)}>
                      Cancel
                  </CustomButton>
                  <CustomButton variant="free" onClick={startReveal}>
                      Press to free
                  </CustomButton>
              </div>
            </div>
          )}
        </motion.div>
      )
    }

    return (
      <div className="bg-bee-light-yellow p-6 rounded-lg border-4 border-[#3A1F16] flex flex-col items-center justify-center min-h-[200px]">
        <p className="text-center text-[#3A1F16] font-medium mb-4">
          {status || "No unrevealed BEEISH NFTs found in your wallet"}
        </p>
        {revealedNFTs.length > 0 && (
          <p className="text-center text-[#3A1F16]">
            You've already freed all your bees! {isMobile && 'Check the "Freed Bees" tab.'}
          </p>
        )}
      </div>
    )
  }

  // Render the revealed NFTs section
  const renderRevealedSection = () => {
    if (!isConnected) {
      return (
        <div className="flex flex-col items-center justify-center p-6 bg-bee-light-yellow rounded-lg border-4 border-[#3A1F16]">
          <p className="text-[#3A1F16] mb-4 text-center font-semibold">Connect your wallet to see your freed bees!</p>
          <p>(Connect Button Removed)</p>
        </div>
      )
    }

    return (
      <div className="bg-bee-light-yellow p-4 rounded-lg border-4 border-[#3A1F16] h-full">
        <h2
          className="text-xl font-bold text-center mb-4"
          style={{
            color: "#3A1F16",
            fontFamily: "Super Lobster, cursive, sans-serif",
            textShadow: "none",
          }}
        >
          Your Freed Bees
        </h2>

        {revealedNFTs.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[500px] pr-2 -webkit-overflow-scrolling-touch">
            {revealedNFTs.map((nft: RevealedNftData) => (
              <motion.div
                key={nft.tokenId}
                className="border-4 border-[#3A1F16] rounded-lg overflow-hidden bg-white"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", damping: 15 }}
                whileHover={{ scale: 1.03, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              >
                <div className="relative aspect-square">
                  <Image
                    src={nft.image || "/placeholder.svg"}
                    alt={`NFT #${nft.tokenId}`}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="bg-[#3A1F16] p-2">
                  <p
                    className="text-white text-center font-medium truncate text-sm"
                    style={{ fontFamily: "Super Lobster, cursive, sans-serif", textShadow: "none" }}
                  >
                    BEEISH #{nft.tokenId}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-center text-[#3A1F16]">You haven't freed any bees yet!</p>
            <p className="text-center text-[#3A1F16] mt-2">
              {isMobile
                ? 'Go to the "Free a Bee" tab to get started.'
                : "Select a BEEISH NFT and free it to see it here."}
            </p>
          </div>
        )}

        {revealedNFTs.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-[#3A1F16] text-sm">
              Your freed bees are saved in your browser. They will appear here when you return.
            </p>
          </div>
        )}
      </div>
    )
  }

  // Renders the single NFT that was just revealed
  const renderRevealedNFTDisplay = (nft: BeeishNFT, imageUrl: string) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-[10vh] bottom-0 left-0 right-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-hidden"
            onClick={closeRevealedNFT}
        >
            <div 
              className="bg-bee-yellow p-6 rounded-lg border-4 border-[#3A1F16] text-center max-w-md w-full relative max-h-[85vh] overflow-y-auto flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            > 
                <h2 className="text-3xl font-bold text-[#3A1F16] mb-4 shrink-0">Bee Freed!</h2>
                <div className="w-full max-w-[300px] mb-4 shrink-0">
                  <Image
                      src={imageUrl}
                      alt={`Revealed ${nft.name}`}
                      width={400}
                      height={400}
                      className="w-full h-auto object-contain rounded-lg border-2 border-[#3A1F16] shadow-lg"
                      unoptimized
                  />
                </div>
                <p className="text-xl font-semibold text-[#3A1F16] mb-4 shrink-0">{`You revealed ${nft.name}!`}</p>
                
                <div className="mt-auto pt-4 flex flex-col items-center gap-2 shrink-0">
                  <MintButton onClick={() => setIsMintModalOpen(true)} />
                  <CustomButton
                      variant="blank"
                      onClick={closeRevealedNFT}
                  >
                      Close
                  </CustomButton>
                </div>
            </div>
        </motion.div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {isMobile && renderMobileTabs()}

      <div className="space-y-8">
        {!isMobile && !isRevealing && !showRevealedNFT && (
          <>
            {renderUnrevealedSection()}
            {revealedNFTs.length > 0 && renderRevealedSection()}
          </>
        )}

        {isMobile && activeTab === "unrevealed" && renderUnrevealedSection()}
        {isMobile && activeTab === "revealed" && renderRevealedSection()}

        {!isMobile && (isRevealing || showRevealedNFT) && renderUnrevealedSection()}
      </div>

      {status && !loading && !isRevealing && !showRevealedNFT && (
        <p className="mt-6 text-center text-lg font-semibold text-red-700">{status}</p>
      )}

      {showRevealedNFT && selectedNFT && revealedImage && renderRevealedNFTDisplay(selectedNFT, revealedImage)}

      <MintModal open={isMintModalOpen} onClose={() => setIsMintModalOpen(false)} />
    </div>
  )
}
