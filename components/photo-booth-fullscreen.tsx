"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useAccount } from "wagmi"
// import { useLoginWithAbstract } from "@abstract-foundation/agw-react"
import { useBearishNFTs, type BearishNFT, getDefaultNFT } from "@/lib/bearish-api"
// import type { NFTToken } from "@/lib/api" // Remove NFTToken type import
import CustomButton from "./custom-button"
// import NFTCard from "./nft-card" // Remove NFTCard import
import {
  Loader2,
  Plus,
  Minus,
  RotateCw,
  RotateCcw,
  Move,
  Camera,
  ExternalLink,
  ImageIcon,
  ZoomIn,
  ZoomOut,
  FlipHorizontal,
} from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import Script from "next/script"

// Define bee types
type BeeType = "normal" | "zombie" | "robot"

interface BeeOverlay {
  id: number
  x: number
  y: number
  scale: number
  rotation: number
  type: BeeType
  flipped: boolean
}

interface NFTPosition {
  x: number
  y: number
  scale: number
}

// Bee image paths - using PNG images instead of SVG
const beeImages = {
  normal: "/images/normalsmall.png",
  zombie: "/images/zombeesmall.png",
  robot: "/images/b1000small.png",
}

// Update the background color options to match Bearish colors
const backgrounds = [
  { id: "none", name: "None", color: "transparent" },
  { id: "white", name: "White", color: "#ffffff" },
  { id: "yellow", name: "Yellow", color: "#FFD9B0" },
  { id: "blue", name: "Blue", color: "#B7C3FD" },
  { id: "red", name: "Red", color: "#EEA9AB" },
  { id: "green", name: "Green", color: "#ABCF91" },
  { id: "lightBlue", name: "Light Blue", color: "#92C2E6" },
  { id: "purple", name: "Purple", color: "#CCACFF" },
]

// Bee preset arrangements - using percentages for better positioning
const beePresets = [
  {
    id: "circle",
    name: "Circle",
    bees: Array.from({ length: 8 }, (_, i) => ({
      x: 50 + 30 * Math.cos((i * Math.PI) / 4),
      y: 50 + 30 * Math.sin((i * Math.PI) / 4),
      scale: 0.8,
      rotation: i * 45,
      type: (i % 3 === 0 ? "zombie" : i % 3 === 1 ? "robot" : "normal") as BeeType,
      flipped: false,
    })),
  },
  {
    id: "crown",
    name: "Crown",
    bees: Array.from({ length: 5 }, (_, i) => ({
      x: 30 + i * 10,
      y: 15,
      scale: 0.7 + (i === 2 ? 0.3 : 0),
      rotation: i === 2 ? 0 : i < 2 ? -20 : 20,
      type: (i % 3 === 0 ? "zombie" : i % 3 === 1 ? "robot" : "normal") as BeeType,
      flipped: false,
    })),
  },
  {
    id: "swarm",
    name: "Swarm",
    bees: Array.from({ length: 12 }, (_, i) => ({
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
      scale: 0.5 + Math.random() * 0.5,
      rotation: Math.random() * 360,
      type: (i % 3 === 0 ? "zombie" : i % 3 === 1 ? "robot" : "normal") as BeeType,
      flipped: false,
    })),
  },
  {
    id: "heart",
    name: "Heart",
    bees: Array.from({ length: 10 }, (_, i) => {
      const t = (i * Math.PI) / 5
      const x = 50 + ((16 * Math.pow(Math.sin(t), 3)) / 16) * 20
      const y = 40 - ((13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 16) * 20
      return {
        x,
        y,
        scale: 0.7,
        rotation: (t * 180) / Math.PI,
        type: (i % 3 === 0 ? "zombie" : i % 3 === 1 ? "robot" : "normal") as BeeType,
        flipped: false,
      }
    }),
  },
]

// Fixed bee size in pixels - increased for better quality
const BEE_SIZE = 60

// Remove the adapter function
/*
const adaptBearishToNFTToken = (nft: BearishNFT): NFTToken => {
  return {
    tokenId: nft.tokenId,
    name: nft.name,
    image: nft.image,
    owner: nft.owner,
    price: undefined, 
  };
};
*/

// --- END HELPER --- 

export default function PhotoBoothFullscreen() {
  const { isConnected } = useAccount()
  // const { login } = useLoginWithAbstract()
  const { nfts, defaultNFT, loading, loadingDefaultNFT, error } = useBearishNFTs()
  const [selectedNFT, setSelectedNFT] = useState<BearishNFT | null>(null)
  const [bees, setBees] = useState<BeeOverlay[]>([])
  const [activeBeeId, setActiveBeeId] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [nftPosition, setNftPosition] = useState<NFTPosition>({ x: 50, y: 50, scale: 1.2 })
  const [isMovingNFT, setIsMovingNFT] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [usingDefaultNFT, setUsingDefaultNFT] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [showFlash, setShowFlash] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)
  const [html2canvasLoaded, setHtml2canvasLoaded] = useState(false)
  const [selectedBackground, setSelectedBackground] = useState(backgrounds[1]) // White background
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [activeTab, setActiveTab] = useState<"nft" | "bees">("nft")
  const [selectedBeeType, setSelectedBeeType] = useState<BeeType>("normal")

  // Font family based on device
  const fontFamily = isMobile
    ? "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif"
    : "'Super Lobster', cursive"

  // Update canvas size when container size changes
  useEffect(() => {
    if (canvasContainerRef.current && selectedNFT) {
      const updateCanvasSize = () => {
        const container = canvasContainerRef.current
        if (container) {
          const width = container.clientWidth
          const height = container.clientHeight
          setCanvasSize({ width, height })
        }
      }

      // Initial update
      updateCanvasSize()

      // Add resize listener
      window.addEventListener("resize", updateCanvasSize)

      // Cleanup
      return () => {
        window.removeEventListener("resize", updateCanvasSize)
      }
    }
  }, [selectedNFT, canvasContainerRef.current])

  // Add a new bee to the canvas
  const addBee = () => {
    const newBee: BeeOverlay = {
      id: Date.now(),
      x: 50, // center of canvas
      y: 50, // center of canvas
      scale: 1,
      rotation: 0,
      type: selectedBeeType,
      flipped: false, // Initialize as not flipped
    }
    setBees([...bees, newBee])
    setActiveBeeId(newBee.id)
    setActiveTab("bees")
  }

  // Remove the active bee
  const removeBee = () => {
    if (activeBeeId !== null) {
      setBees(bees.filter((bee) => bee.id !== activeBeeId))
      setActiveBeeId(null)
    }
  }

  // Scale the active bee
  const scaleBee = (increase: boolean) => {
    if (activeBeeId === null) return

    setBees(
      bees.map((bee) => {
        if (bee.id === activeBeeId) {
          // Set minimum scale to 0.4 (equivalent to 6 zoom out clicks from 1.0)
          // No upper limit for maximum scale
          const newScale = increase ? bee.scale + 0.1 : Math.max(bee.scale - 0.1, 0.4)
          return { ...bee, scale: newScale }
        }
        return bee
      }),
    )
  }

  // Flip the active bee horizontally
  const flipBee = () => {
    if (activeBeeId === null) return

    setBees(
      bees.map((bee) => {
        if (bee.id === activeBeeId) {
          return { ...bee, flipped: !bee.flipped }
        }
        return bee
      }),
    )
  }

  // Scale the NFT
  const scaleNFT = (increase: boolean) => {
    setNftPosition((prev) => ({
      ...prev,
      scale: increase ? prev.scale + 0.1 : Math.max(prev.scale - 0.1, 0.3),
    }))
  }

  // Rotate the active bee
  const rotateBee = (clockwise: boolean) => {
    if (activeBeeId === null) return

    setBees(
      bees.map((bee) => {
        if (bee.id === activeBeeId) {
          const newRotation = clockwise ? bee.rotation + 15 : bee.rotation - 15
          return { ...bee, rotation: newRotation }
        }
        return bee
      }),
    )
  }

  // Change the type of the active bee
  const changeBeeType = (type: BeeType) => {
    if (activeBeeId === null) return

    setBees(
      bees.map((bee) => {
        if (bee.id === activeBeeId) {
          return { ...bee, type }
        }
        return bee
      }),
    )
  }

  // Apply a bee preset
  const applyBeePreset = (presetId: string) => {
    const preset = beePresets.find((p) => p.id === presetId)
    if (!preset) return

    // Create new bees with unique IDs
    const newBees = preset.bees.map((beeTemplate) => ({
      id: Date.now() + Math.random() * 1000,
      ...beeTemplate,
    }))

    setBees(newBees)
    setActiveBeeId(null)
    setActiveTab("bees")
  }

  // Handle mouse/touch down on a bee
  const handleBeeMouseDown = (e: React.MouseEvent | React.TouchEvent, beeId: number) => {
    e.stopPropagation()
    setActiveBeeId(beeId)
    setIsDragging(true)
    setIsMovingNFT(false)
    setActiveTab("bees")

    // Get client coordinates for both mouse and touch events
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY

    setStartPos({ x: clientX, y: clientY })
  }

  // Handle mouse/touch down on the NFT
  const handleNFTMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    setIsMovingNFT(true)
    setIsDragging(false)
    setActiveBeeId(null)
    setActiveTab("nft")

    // Get client coordinates for both mouse and touch events
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY

    setStartPos({ x: clientX, y: clientY })
  }

  // Handle mouse/touch move
  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if ((!isDragging && !isMovingNFT) || !canvasSize.width || !canvasSize.height) return

    // Get client coordinates for both mouse and touch events
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY

    const deltaX = clientX - startPos.x
    const deltaY = clientY - startPos.y

    // Convert pixel deltas to percentage deltas
    const deltaXPercent = (deltaX / canvasSize.width) * 100
    const deltaYPercent = (deltaY / canvasSize.height) * 100

    if (isDragging && activeBeeId !== null) {
      // Moving a bee
      setBees(
        bees.map((bee) => {
          if (bee.id === activeBeeId) {
            // Calculate new position in percentages
            const newX = Math.max(0, Math.min(100, bee.x + deltaXPercent))
            const newY = Math.max(0, Math.min(100, bee.y + deltaYPercent))

            return {
              ...bee,
              x: newX,
              y: newY,
            }
          }
          return bee
        }),
      )
    } else if (isMovingNFT) {
      // Moving the NFT
      setNftPosition((prev) => ({
        ...prev,
        x: Math.max(0, Math.min(100, prev.x + deltaXPercent)),
        y: Math.max(0, Math.min(100, prev.y + deltaYPercent)),
      }))
    }

    setStartPos({ x: clientX, y: clientY })
  }

  // Handle mouse/touch up
  const handleMouseUp = () => {
    setIsDragging(false)
    setIsMovingNFT(false)
  }

  // Add event listeners for mouse/touch move and up
  useEffect(() => {
    if (isDragging || isMovingNFT) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("touchmove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      window.addEventListener("touchend", handleMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchmove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("touchend", handleMouseUp)
    }
  }, [isDragging, isMovingNFT, activeBeeId, bees, startPos, canvasSize, nftPosition])

  // Handle NFT selection
  const selectNFT = (nft: BearishNFT) => {
    setSelectedNFT(nft)
    setBees([]) // Reset bees when selecting a new NFT
    setActiveBeeId(null)
    setNftPosition({ x: 50, y: 50, scale: 1.2 }) // Center the NFT with larger scale
    setActiveTab("nft")
  }

  // Use default NFT
  useEffect(() => {
    if (defaultNFT && usingDefaultNFT) {
      selectNFT(defaultNFT)
    }
  }, [defaultNFT, usingDefaultNFT])

  const handleUseDefaultNFT = () => {
    setUsingDefaultNFT(true)
    if (defaultNFT) {
      selectNFT(defaultNFT)
    } else {
      // If for some reason defaultNFT is not available, use a hardcoded one
      selectNFT(getDefaultNFT())
    }
  }

  // Center the NFT
  const centerNFT = () => {
    setNftPosition({ x: 50, y: 50, scale: 1.2 })
  }

  // Use bee mascot instead of BEARISH NFT
  const handleUseBeeInstead = () => {
    // Create a custom NFT object using the bee mascot
    const beeMascotNFT: BearishNFT = {
      tokenId: "bee-mascot",
      name: "BEEISH Mascot",
      image: "/images/bee-mascot.png",
      marketplaceUrl: undefined,
    }

    selectNFT(beeMascotNFT)
  }

  // Download with html2canvas (static image)
  const downloadImage = () => {
    if (!selectedNFT || !canvasRef.current || !html2canvasLoaded) {
      setDownloadError("Cannot capture image. Please try again.")
      return
    }

    try {
      setIsDownloading(true)
      setShowFlash(true)
      setDownloadError(null)

      // Use the global html2canvas function
      const html2canvas = (window as any).html2canvas
      if (!html2canvas) {
        setDownloadError("Image capture library not loaded. Please refresh and try again.")
        setIsDownloading(false)
        setShowFlash(false)
        return
      }

      // Prepare the canvas for capture by creating a temporary version with all elements positioned absolutely
      const tempCanvas = canvasRef.current.cloneNode(true) as HTMLDivElement
      tempCanvas.style.position = "absolute"
      tempCanvas.style.top = "0"
      tempCanvas.style.left = "0"
      tempCanvas.style.width = `${canvasSize.width}px`
      tempCanvas.style.height = `${canvasSize.height}px`
      tempCanvas.style.backgroundColor = selectedBackground.color
      tempCanvas.style.visibility = "hidden"
      document.body.appendChild(tempCanvas)

      // Capture the canvas element
      html2canvas(canvasRef.current, {
        allowTaint: true,
        useCORS: true,
        backgroundColor: selectedBackground.color,
        scale: 2, // Higher quality
        imageTimeout: 0,
        logging: false,
        ignoreElements: (element: Element) => {
          // Don't ignore any elements to ensure everything is captured
          return false
        },
        onclone: (clonedDoc: Document) => {
          // Fix aspect ratios in the cloned document before capture
          const clonedCanvas = clonedDoc.querySelector('[ref="canvasRef"]')
          if (clonedCanvas instanceof HTMLElement) { // Check if it's an HTMLElement
            // Make sure all images maintain aspect ratio
            const images = clonedCanvas.querySelectorAll("img")
            images.forEach((img: HTMLImageElement) => {
              img.style.objectFit = "contain"
              img.style.width = "auto"
              img.style.height = "auto"
              img.style.maxWidth = "100%"
              img.style.maxHeight = "100%"
            })

            // Ensure the NFT is visible
            const nftContainer = clonedCanvas.querySelector('[class*="cursor-move"]')
            if (nftContainer instanceof HTMLElement) { // Check if it's an HTMLElement
              nftContainer.style.display = "block"
              nftContainer.style.visibility = "visible"
              nftContainer.style.opacity = "1"

              // Make sure the NFT image is visible
              const nftImage = nftContainer.querySelector("img")
              if (nftImage instanceof HTMLImageElement) { // Check if it's an HTMLImageElement
                nftImage.style.display = "block"
                nftImage.style.visibility = "visible"
                nftImage.style.opacity = "1"
              }
            }
          }
        },
      })
        .then((canvas: HTMLCanvasElement) => {
          // Remove the temporary canvas
          if (tempCanvas && tempCanvas.parentNode) {
            tempCanvas.parentNode.removeChild(tempCanvas)
          }

          // Convert to data URL and trigger download
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
        })
        .catch((err: any) => {
          console.error("Error capturing image:", err)
          setDownloadError("Failed to capture image. Please try again.")
          setIsDownloading(false)
          setShowFlash(false)

          // Remove the temporary canvas if it exists
          if (tempCanvas && tempCanvas.parentNode) {
            tempCanvas.parentNode.removeChild(tempCanvas)
          }
        })
    } catch (error) {
      console.error("Error in download setup:", error)
      setDownloadError("Failed to set up download. Please try again.")
      setIsDownloading(false)
      setShowFlash(false)
    }
  }

  // Render PNG bee directly using Image component for better quality
  const renderBee = (bee: BeeOverlay) => {
    return (
      <div
        key={bee.id}
        className={`absolute ${activeBeeId === bee.id ? "ring-2 ring-amber-500" : ""}`}
        style={{
          left: `${bee.x}%`,
          top: `${bee.y}%`,
          width: 0,
          height: 0,
          zIndex: activeBeeId === bee.id ? 10 : 1,
        }}
      >
        <div
          className="cursor-move"
          style={{
            position: "absolute",
            width: `${BEE_SIZE * 2}px`, // Double the size for better quality
            height: `${BEE_SIZE * 2}px`, // Double the size for better quality
            transform: `translate(-50%, -50%) scale(${bee.flipped ? -bee.scale : bee.scale}, ${bee.scale}) rotate(${bee.rotation}deg)`,
            transformOrigin: "center",
          }}
          onMouseDown={(e) => handleBeeMouseDown(e, bee.id)}
          onTouchStart={(e) => handleBeeMouseDown(e, bee.id)}
        >
          <Image
            src={beeImages[bee.type] || "/placeholder.svg"}
            alt={`${bee.type} Bee`}
            width={BEE_SIZE * 2}
            height={BEE_SIZE * 2}
            className="pointer-events-none w-full h-full"
          />
        </div>
      </div>
    )
  }

  // --- DEBUG LOGS --- 
  console.log("PhotoBooth Render State:", {
    isConnected,
    loading,
    loadingDefaultNFT,
    error,
    html2canvasLoaded,
    selectedNFT: !!selectedNFT, // Log if selectedNFT exists
    nftsCount: nfts?.length,
    defaultNFTExists: !!defaultNFT
  });
  // --- END DEBUG LOGS --- 

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Load html2canvas library */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
        onLoad={() => {
          console.log("html2canvas script loaded successfully!");
          setHtml2canvasLoaded(true)
        }}
        onError={(e: Error) => {
          console.error("html2canvas script FAILED to load:", e);
          // Optionally set an error state here to show a message to the user
        }}
        strategy="lazyOnload"
      />

      {/* --- Start Conditional Rendering --- */}
      {!isConnected ? (
        () => { 
           console.log("Rendering: Connect Wallet Message"); // DEBUG LOG
           return (
        <div className="bg-bee-light-yellow p-4 rounded-lg border-4 border-[#3A1F16] mb-4 max-w-md mx-auto mt-[-50px]">
          <p className="text-dark font-medium text-lg mb-3" style={{ fontFamily }}>
                  Connect your wallet to use the Photo Booth
          </p>
          <div className="flex justify-center">
                   {/* Removed Abstract login button - Need a generic connect button */}
                   <p>(Connect Button Removed)</p>
          </div>
        </div>
           );
         }
      )() : loading || loadingDefaultNFT ? (
         () => { 
           console.log("Rendering: Loading NFTs Message"); // DEBUG LOG
           return (
        <div className="bg-bee-light-yellow p-4 rounded-lg border-4 border-[#3A1F16] mb-4 max-w-md mx-auto mt-[-50px] flex items-center justify-center">
                {/* ... loading message ... */}
        </div>
           );
         }
      )() : error ? (
         () => { 
           console.log("Rendering: Error Message", error); // DEBUG LOG
           return (
        <div className="bg-red-100 p-4 rounded-lg border-4 border-red-300 text-red-700 mb-4 max-w-md mx-auto mt-[-50px]">
              <p className="font-bold text-center">Error Loading NFTs</p>
              <p className="text-sm text-center mt-1">Could not fetch your BEEISH NFTs at this time. Please try again later.</p>
              {/* Display technical error details for debugging if needed */}
              {/* <p className="text-xs mt-2 text-center">Details: {error.message || 'Unknown error'}</p> */}
          </div>
           );
         }
      )() : (
         () => { 
           console.log("Rendering: Main Content Block"); // DEBUG LOG
           // Log the state value right before the check
           console.log(`[PhotoBooth] Checking html2canvasLoaded state: ${html2canvasLoaded}`);
           return (
            <>
              {html2canvasLoaded ? (
                selectedNFT ? (
                   () => { 
                     console.log("Rendering: Canvas/Controls"); // DEBUG LOG
                     return (
                      <div className="flex flex-col md:flex-row gap-4 w-full max-w-7xl mx-auto p-4 bg-bee-light-yellow rounded-lg border-4 border-[#3A1F16] overflow-hidden">
                        {/* ... Left Side: Canvas Area ... */}
                        {/* ... Right Side: Controls Area ... */}
        </div>
                     );
                   }
                )() : (
                   () => { 
                     console.log("[PhotoBooth] Rendering NFT Selection. NFTs available:", nfts?.length); // DEBUG LOG
                     return (
                      <div className="bg-bee-light-yellow p-6 rounded-lg border-4 border-[#3A1F16] max-w-4xl w-[95%] mx-auto overflow-y-auto max-h-[80vh]">
                        <h3 className="text-xl font-bold text-center mb-4 text-[#3A1F16]">Select Your BEEISH</h3>
                        {nfts && nfts.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {nfts.map((nft) => {
                               console.log("[PhotoBooth] Mapping NFT:", nft?.tokenId); // DEBUG LOG
                               return (
                                // Replace NFTCard with a simpler div structure
                                <div 
                                  key={nft.tokenId} 
                                  onClick={() => selectNFT(nft)}
                                  className="bg-white border-2 border-[#3A1F16] rounded-lg overflow-hidden shadow hover:shadow-md hover:border-amber-500 cursor-pointer transition-all aspect-square flex flex-col"
                                >
                                  <div className="relative w-full flex-grow">
                                    <Image 
                                      src={nft.image || "/placeholder.svg"}
                                      alt={nft.name}
                                      fill
                                      className="object-cover"
                                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                    />
                                  </div>
                                  <p className="text-xs text-center p-1 bg-[#3A1F16] text-white truncate font-semibold" style={{ fontFamily }}>
                                    {nft.name}
                                  </p>
                                </div>
                               );
                            })}
                          </div>
                        ) : (
                          <p className="text-center text-[#3A1F16]">No BEEISH NFTs found in your connected wallet.</p>
                        )}
                        {/* Option to use Default NFT */}
                        {defaultNFT && (
                          <div className="mt-6 pt-4 border-t-2 border-[#3A1F16]/50 flex flex-col items-center">
                            <p className="mb-2 text-center text-[#3A1F16]">Or use the default Bee:</p>
                            {/* Replace NFTCard with a simpler div structure */}
                            <div 
                              onClick={handleUseDefaultNFT}
                              className="bg-white border-2 border-[#3A1F16] rounded-lg overflow-hidden shadow hover:shadow-md hover:border-amber-500 cursor-pointer transition-all aspect-square flex flex-col w-32 md:w-40"
                            >
                              <div className="relative w-full flex-grow">
                                <Image 
                                  src={defaultNFT.image || "/placeholder.svg"}
                                  alt={defaultNFT.name}
                                  fill
                                  className="object-cover"
                                  sizes="160px"
                                />
                              </div>
                              <p className="text-xs text-center p-1 bg-[#3A1F16] text-white truncate font-semibold" style={{ fontFamily }}>
                                {defaultNFT.name}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                     );
                   }
                )()
              ) : (
                 () => { 
                   console.log("Rendering: Loading html2canvas Message"); // DEBUG LOG
                   return (
                    <div className="flex items-center justify-center w-full h-64">
                      {/* ... Loading Photo Booth message ... */}
                    </div>
                   );
                 }
              )()
              }

              {/* Flash Effect Overlay */} 
                  {showFlash && (
                <div className="absolute inset-0 bg-white animate-ping pointer-events-none z-50" />
              )}
            </>
           );
         }
      )()
      }
    </div>
  )
}
