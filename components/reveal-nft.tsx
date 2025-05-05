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

// IPFS Base URL and CID for revealed images - Using Pinata Gateway
const IPFS_REVEALED_BASE_URL = "https://gateway.pinata.cloud/ipfs/QmX2f9ykSYMtJmdhbXPf326GbUJC1rWR4hQAV5ZLGjy9x2";

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
  const [isRevealing, setIsRevealing] = useState(false)
  const [showRevealedNFT, setShowRevealedNFT] = useState(false)
  const [activeTab, setActiveTab] = useState<"unrevealed" | "revealed">("unrevealed")
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [isMintModalOpen, setIsMintModalOpen] = useState(false)
  // Add state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  // Add state for revealed NFTs pagination
  const [revealedPage, setRevealedPage] = useState(1);

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

  // Reset revealed page when revealed NFTs change
  useEffect(() => {
    setRevealedPage(1);
  }, [revealedNFTs]);

  // Extract token ID from NFT name regardless of format
  const extractTokenId = (name: string): string => {
    // If it's already just the ID, return it
    if (/^\d+$/.test(name)) return name;
    
    // Try to extract ID from format "BEEISH #123" or "BEEISH # 123"
    const match = name.match(/BEEISH\s*#\s*(\d+)/i);
    return match ? match[1] : name;
  }

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
      }))

      // Create a set of normalized revealed token IDs for faster lookup
      const normalizedRevealedIds = new Set(
        revealedTokenIds.map(id => extractTokenId(id))
      );

      // Check if a token has been revealed using normalized IDs
      const isRevealed = (nft: BeeishNFT) => {
        const normalizedId = extractTokenId(nft.tokenId);
        return normalizedRevealedIds.has(normalizedId);
      };

      // Filter out already revealed NFTs using normalized comparison
      const unrevealed = userNFTs.filter((nft: BeeishNFT) => !isRevealed(nft));

      setNfts(unrevealed)

      if (unrevealed.length === 0) {
        if (userNFTs.length > 0) {
          setStatus("")
          if (isMobile && revealedNFTs.length > 0) {
            setActiveTab("revealed")
          }
        } else {
          setStatus("You don't own any Bee Hives currently.")
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

  // Handle reveal completion - simplified, no polling
  const handleRevealComplete = (/* oldImageUrl: string - no longer needed */) => {
    // Just show the success animation, the final image URL will be constructed later
    setShowSuccessAnimation(true)
  }

  // Handle success animation completion
  const handleSuccessAnimationComplete = () => {
    if (!selectedNFT) return; // Should not happen, but safety check

    // Construct the final IPFS URL
    const finalImageUrl = `${IPFS_REVEALED_BASE_URL}/${selectedNFT.tokenId}.png`;

    setShowSuccessAnimation(false)
    setShowRevealedNFT(true) // Show the modal displaying the revealed NFT

    // Add the token ID to the revealed list
    setRevealedTokenIds((prev) => [...prev, selectedNFT!.tokenId])

    // Add to revealed NFTs list with the constructed IPFS image URL
    setRevealedNFTs((prev) => [
      ...prev,
      {
        tokenId: selectedNFT!.tokenId,
        image: finalImageUrl, // Store the constructed URL
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
    setSelectedNFT(null)

    // If no more unrevealed NFTs, switch to revealed tab on mobile
    if (isMobile && nfts.length === 0 && revealedNFTs.length > 0) {
      setActiveTab("revealed")
    }
  }

  // Render mobile tabs for switching between unrevealed and revealed NFTs
  const renderTabs = () => {
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

  // Fixed container component for consistent sizing
  const FixedContainer = ({ children }: { children: React.ReactNode }) => (
    <div 
      className="bg-bee-light-yellow rounded-lg border-4 border-[#3A1F16] flex flex-col p-4 overflow-y-auto"
      style={{ maxHeight: 'calc(100vh - 220px)', minHeight: '450px' }}
    >
      {children}
    </div>
  );

  // Render the unrevealed NFTs section
  const renderUnrevealedSection = () => {
    if (!isConnected) {
      return (
        <FixedContainer>
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-[#3A1F16] mb-4 text-center font-semibold text-lg">
              Please connect your wallet
            </p>
            <p className="text-[#3A1F16] text-center text-sm">
              (Use the button in the header to connect and free your bees!)
            </p>
          </div>
        </FixedContainer>
      )
    }

    if (isRevealing) {
      return (
        <FixedContainer>
          <MultiStepReveal
            tokenId={selectedNFT!.tokenId}
            address={address!}
            unrevealedImageUrl={selectedNFT!.image || "/placeholder.jpg"}
            onComplete={handleRevealComplete}
            onCancel={cancelReveal}
          />
        </FixedContainer>
      )
    }

    if (showRevealedNFT) {
      return (
        <FixedContainer>
          <div className="flex-1 flex flex-col items-center">
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
                <Image src={selectedNFT ? `${IPFS_REVEALED_BASE_URL}/${selectedNFT.tokenId}.png` : "/placeholder.svg"} alt="Revealed NFT" fill className="object-contain" />
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
        </FixedContainer>
      )
    }

    if (loading) {
      return (
        <FixedContainer>
          <div className="flex-1 flex justify-center items-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#3A1F16]" />
          </div>
        </FixedContainer>
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
        <FixedContainer>
          <h2 
            className="text-center text-3xl font-bold text-[#3A1F16] mb-4 shrink-0"
            style={{ fontFamily: "Super Lobster, cursive, sans-serif", textShadow: "none" }}
          >
            Free Your Bee!
          </h2>
          <div className="flex-grow flex flex-col h-[450px]">
            {/* Grid for displayed NFTs */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 mb-4 overflow-y-auto" style={{ height: "330px" }}>
              {displayedNfts.map((nft: BeeishNFT) => (
                <div
                  key={nft.tokenId}
                  className={`w-full border-2 rounded-lg cursor-pointer overflow-hidden flex flex-col ${
                    selectedNFT?.tokenId === nft.tokenId ? 'border-amber-600 bg-amber-200' : 'border-[#3A1F16] bg-amber-100 hover:border-amber-500'
                  }`}
                  onClick={() => setSelectedNFT(nft)}
                  style={{ aspectRatio: "1/1.15" }}
                >
                  <div className="relative w-full flex-1">
                    <Image
                      src={nft.image || "/placeholder.jpg"}
                      alt={nft.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="bg-[#3A1F16] p-1 w-full shrink-0">
                    <p className="text-white text-center font-medium truncate text-xs w-full">
                      {nft.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* --- Pagination Controls --- */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mb-4 shrink-0">
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

            <div className="mt-auto flex flex-col items-center pt-2 shrink-0">
              <CustomButton
                variant="mint"
                className="w-full md:w-[200px] relative overflow-hidden group mb-2"
                onClick={startReveal}
                disabled={!selectedNFT}
              >
                <span className="relative z-10 group-hover:text-white">Free This Bee</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/30 to-transparent shimmer-effect"></div>
              </CustomButton>
              {!selectedNFT && <p className="text-xs text-[#3A1F16]">Select a Hive above to free!</p>}
            </div>
          </div>
        </FixedContainer>
      )
    }

    return (
      <FixedContainer>
        <div className="flex-1 flex flex-col items-center justify-center">
          {revealedNFTs.length > 0 ? (
            // Case: Owned bees, but all are revealed
            <p className="text-center text-[#3A1F16] font-medium mb-4">
              You've already freed all your bees!
            </p>
          ) : (
            // Case: Owns no bees OR hasn't revealed any yet
            <p className="text-center text-[#3A1F16] font-medium mb-4">
              {status || "No unrevealed BEEISH NFTs found in your wallet."}
            </p>
          )}
          {/* Add Mint Button in both cases */}
          <div className="mt-2">
             <MintButton onClick={() => setIsMintModalOpen(true)} />
          </div>
        </div>
      </FixedContainer>
    )
  }

  // Render the revealed NFTs section
  const renderRevealedSection = () => {
    if (!isConnected) {
      return (
        <FixedContainer>
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-[#3A1F16] mb-4 text-center font-semibold">Connect your wallet to see your freed bees!</p>
            <p>(Connect Button Removed)</p>
          </div>
        </FixedContainer>
      )
    }

    return (
      <FixedContainer>
        <h2
          className="text-center text-3xl font-bold text-[#3A1F16] mb-4 shrink-0"
          style={{
            fontFamily: "Super Lobster, cursive, sans-serif",
            textShadow: "none",
          }}
        >
          Your Freed Bees
        </h2>

        {revealedNFTs.length > 0 ? (
          <>
            {/* --- Pagination Logic for Revealed NFTs --- */}
            {(() => {
              const totalRevealedPages = Math.ceil(revealedNFTs.length / ITEMS_PER_PAGE);
              const startRevealedIndex = (revealedPage - 1) * ITEMS_PER_PAGE;
              const endRevealedIndex = startRevealedIndex + ITEMS_PER_PAGE;
              const displayedRevealedNfts = revealedNFTs.slice(startRevealedIndex, endRevealedIndex);
              
              return (
                <>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 mb-4 overflow-y-auto" style={{ height: "330px" }}>
                    {displayedRevealedNfts.map((nft: RevealedNftData) => (
                      <div
                        key={nft.tokenId}
                        className="w-full border-2 border-[#3A1F16] rounded-lg overflow-hidden bg-white hover:border-amber-600 flex flex-col"
                        style={{ aspectRatio: "1/1.15" }}
                      >
                        <div className="relative w-full flex-1">
                          <Image
                             src={`${IPFS_REVEALED_BASE_URL}/${nft.tokenId}.png` || "/placeholder.svg"}
                             alt={`NFT #${nft.tokenId}`}
                             fill
                             className="object-contain"
                           />
                        </div>
                        <div className="bg-[#3A1F16] p-1 w-full shrink-0">
                          <p
                            className="text-white text-center font-medium truncate text-xs w-full"
                            style={{ fontFamily: "Super Lobster, cursive, sans-serif", textShadow: "none" }}
                          >
                            BEEISH #{nft.tokenId}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* --- Pagination Controls for Revealed NFTs --- */}
                  {totalRevealedPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-auto pt-4 shrink-0">
                      <CustomButton 
                        variant="blank" 
                        onClick={() => setRevealedPage((prev) => Math.max(1, prev - 1))} 
                        disabled={revealedPage === 1}
                        className="w-auto px-4 h-10"
                      >
                        Previous
                      </CustomButton>
                      <span className="text-[#3A1F16] font-semibold">
                        Page {revealedPage} of {totalRevealedPages}
                      </span>
                      <CustomButton 
                        variant="blank" 
                        onClick={() => setRevealedPage((prev) => Math.min(totalRevealedPages, prev + 1))} 
                        disabled={revealedPage === totalRevealedPages}
                        className="w-auto px-4 h-10"
                      >
                        Next
                      </CustomButton>
                    </div>
                  )}
                </>
              );
            })()}
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center">
            <p className="text-center text-[#3A1F16]">You haven't freed any bees yet!</p>
            <p className="text-center text-[#3A1F16] mt-2">
              {isMobile
                ? 'Go to the "Free a Bee" tab to get started.'
                : "Select a BEEISH NFT and free it to see it here."}
            </p>
          </div>
        )}
      </FixedContainer>
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
      {/* Always show tabs for both mobile and desktop */}
      {renderTabs()}

      <div className="space-y-8 pb-8">
        {activeTab === "unrevealed" && renderUnrevealedSection()}
        {activeTab === "revealed" && renderRevealedSection()}
      </div>

      {status && !loading && !isRevealing && !showRevealedNFT && (
        <p className="mt-6 text-center text-lg font-semibold text-red-700">{status}</p>
      )}

      {showRevealedNFT && selectedNFT && renderRevealedNFTDisplay(selectedNFT, selectedNFT.image)}

      <MintModal open={isMintModalOpen} onClose={() => setIsMintModalOpen(false)} />
    </div>
  )
}
