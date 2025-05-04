"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useBearishNFTs, type BearishNFT, getDefaultNFT } from "@/lib/bearish-api"
import { useBeeishNFTs, type BeeishNFT, getDefaultBeeishNFT } from "@/lib/beeish-api"
import CustomButton from "./custom-button"
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

// Define component props
interface PhotoBoothFullscreenProps {
  isConnected: boolean;
  login: () => void;
}

// Define bee types
type BeeType = "normal" | "zombie" | "robot"

// Update BeeOverlay type
type BeeOverlay = {
  id: number
  x: number
  y: number
  scale: number
  rotation: number
  flipped: boolean
  beeishNFT?: BeeishNFT // If present, use this NFT's image
  type?: BeeType // Fallback to default bee type
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

// Define defaultBees for fallback in BEEISH NFT selection
const defaultBees: BeeishNFT[] = [
  {
    tokenId: "robot",
    name: "Robot Bee",
    image: beeImages.robot,
  },
  {
    tokenId: "zombie",
    name: "Zombie Bee",
    image: beeImages.zombie,
  },
  {
    tokenId: "normal",
    name: "Original Bee",
    image: beeImages.normal,
  },
];

// 1. Set sensible default scale and position for NFT - try smaller scale
const DEFAULT_NFT_POSITION: NFTPosition = { x: 50, y: 50, scale: 1.0 };

export default function PhotoBoothFullscreen({ isConnected, login }: PhotoBoothFullscreenProps) {
  const { nfts, defaultNFT, loading, loadingDefaultNFT, error } = useBearishNFTs()
  const [selectedNFT, setSelectedNFT] = useState<BearishNFT | null>(null)
  const [bees, setBees] = useState<BeeOverlay[]>([])
  const [activeBeeId, setActiveBeeId] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [nftPosition, setNftPosition] = useState<NFTPosition>({ x: 50, y: 50, scale: 1.2 })
  const [isMovingNFT, setIsMovingNFT] = useState(false)
  const canvasCaptureRef = useRef<HTMLDivElement>(null)
  const canvasDisplayRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [usingDefaultNFT, setUsingDefaultNFT] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [showFlash, setShowFlash] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)
  const [html2canvasLoaded, setHtml2canvasLoaded] = useState(false)
  const [selectedBackground, setSelectedBackground] = useState(backgrounds[1]) // White background
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [selectedBeeType, setSelectedBeeType] = useState<BeeType>("normal")
  const [selectedBeeishNFTs, setSelectedBeeishNFTs] = useState<BeeishNFT[]>([])
  const {
    nfts: beeishNFTs,
    total: beeishTotal,
    page: beeishPage,
    setPage: setBeeishPage,
    loading: beeishLoading,
    error: beeishError
  } = useBeeishNFTs(20)

  // Font family based on device
  const fontFamily = isMobile
    ? "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif"
    : "'Super Lobster', cursive"

  // Update canvas size when container size changes
  useEffect(() => {
    if (canvasCaptureRef.current && selectedNFT) {
      const updateCanvasSize = () => {
        const container = canvasCaptureRef.current
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
  }, [selectedNFT])

  // Add a new bee to the canvas
  const addBee = () => {
    const newBee: BeeOverlay = {
      id: Date.now(),
      x: 50, // center of canvas
      y: 50, // center of canvas
      scale: 0.5, // Start bees smaller
      rotation: 0,
      type: selectedBeeType,
      flipped: false, // Initialize as not flipped
    }
    setBees([...bees, newBee])
    setActiveBeeId(newBee.id)
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
      scale: increase ? Math.min(prev.scale + 0.1, 1.5) : Math.max(prev.scale - 0.1, 0.5),
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
    const newBees = getPatternBees(preset)

    setBees(newBees)
    setActiveBeeId(null)
  }

  // Handle mouse/touch down on a bee
  const handleBeeMouseDown = (e: React.MouseEvent | React.TouchEvent, beeId: number) => {
    e.stopPropagation()
    setActiveBeeId(beeId)
    setIsDragging(true)
    setIsMovingNFT(false)

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
    setNftPosition(DEFAULT_NFT_POSITION) // Center the NFT with default scale
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
    setNftPosition(DEFAULT_NFT_POSITION)
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
    if (!selectedNFT || !canvasCaptureRef.current || !html2canvasLoaded) {
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
      const tempCanvas = canvasCaptureRef.current.cloneNode(true) as HTMLDivElement
      tempCanvas.style.position = "absolute"
      tempCanvas.style.top = "0"
      tempCanvas.style.left = "0"
      tempCanvas.style.width = `${canvasSize.width}px`
      tempCanvas.style.height = `${canvasSize.height}px`
      tempCanvas.style.backgroundColor = selectedBackground.color
      tempCanvas.style.visibility = "hidden"
      document.body.appendChild(tempCanvas)

      // Capture the canvas element
      html2canvas(canvasCaptureRef.current, {
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
          const clonedCanvas = clonedDoc.querySelector('[ref="canvasCaptureRef"]')
          if (clonedCanvas instanceof HTMLElement) {
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
            if (nftContainer instanceof HTMLElement) {
              nftContainer.style.display = "block"
              nftContainer.style.visibility = "visible"
              nftContainer.style.opacity = "1"

              // Make sure the NFT image is visible
              const nftImage = nftContainer.querySelector("img")
              if (nftImage instanceof HTMLImageElement) {
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
            src={bee.beeishNFT?.image || beeImages[bee.type || "normal"] || "/placeholder.svg"}
            alt={`${bee.type || "normal"} Bee`}
            width={BEE_SIZE * 2}
            height={BEE_SIZE * 2}
            className="pointer-events-none w-full h-full"
          />
        </div>
      </div>
    )
  }

  // 1. On photo booth load, if the user has no BEARISH NFTs, automatically select the demo BEARISH NFT as the base (and show a message if in demo mode).
  useEffect(() => {
    if (!selectedNFT && !loading && !loadingDefaultNFT) {
      if (nfts.length > 0) {
        selectNFT(nfts[0]);
      } else if (defaultNFT) {
        selectNFT(defaultNFT);
      }
    }
  }, [selectedNFT, nfts, defaultNFT, loading, loadingDefaultNFT]);

  // 6. Add a message if the user is in demo mode (no BEARISH NFTs, using demo NFT as base).
  const isDemoMode = nfts.length === 0 && selectedNFT && selectedNFT.tokenId === (defaultNFT?.tokenId || '1004');

  // Filter revealed BEEISH NFTs (not hives)
  const revealedBeeishNFTs = beeishNFTs.filter(nft => /^BEEISH # \d+/.test(nft.name));

  // 3. Update bee pattern logic: for each slot in a pattern, use the user's BEEISH NFTs in order, fill the rest with default bees, and allow override.
  function getPatternBees(pattern: { bees: any[] }) {
    // pattern.bees is an array of positions
    const userBees = revealedBeeishNFTs.slice(0, pattern.bees.length);
    const defaultTypes = ["normal", "robot", "zombie"];
    return pattern.bees.map((bee: any, i: number) => {
      if (userBees[i]) {
        return {
          id: Date.now() + Math.random() * 1000,
          ...bee,
          beeishNFT: userBees[i],
        };
      } else {
        return {
          id: Date.now() + Math.random() * 1000,
          ...bee,
          type: defaultTypes[i % 3] as BeeType,
        };
      }
    });
  }

  return (
    <div className="w-full h-full">
      {/* Load html2canvas library */}
      <Script
        src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"
        onLoad={() => setHtml2canvasLoaded(true)}
        strategy="lazyOnload"
      />

      {!isConnected ? (
        <div className="bg-bee-light-yellow p-4 rounded-lg border-4 border-[#3A1F16] mb-4 max-w-md mx-auto">
          <p className="text-dark font-medium text-lg mb-3" style={{ fontFamily }}>
            Connect your wallet to use the Photo Booth with your NFTs
          </p>
          <div className="flex justify-center">
            <CustomButton variant="connect" className="w-[180px]" onClick={login} />
          </div>
        </div>
      ) : loading || loadingDefaultNFT ? (
        <div className="bg-bee-light-yellow p-4 rounded-lg border-4 border-[#3A1F16] mb-4 max-w-md mx-auto flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#3A1F16] mr-3" />
          <p className="text-dark font-medium text-lg" style={{ fontFamily }}>
            Loading BEARISH NFTs...
          </p>
        </div>
      ) : error ? (
        <div className="bg-red-100 p-4 rounded-lg border-4 border-red-300 mb-4 max-w-md mx-auto">
          <p className="text-red-800 font-medium text-lg" style={{ fontFamily }}>
            {error}
          </p>
          <div className="mt-3 flex justify-center">
            <CustomButton variant="blank" className="w-[150px]" onClick={() => window.location.reload()}>
              Retry
            </CustomButton>
          </div>
        </div>
      ) : (
        // Main 3-Column Layout Container
        <div className="flex flex-row w-full max-w-[1600px] px-4 mx-auto h-[calc(100vh-100px)] gap-4"> {/* Adjusted height */}

          {/* === Left Column: BEARISH + BEEISH Selection === */}
          <div className="w-[280px] flex-shrink-0 flex flex-col pt-4 overflow-y-auto space-y-6"> {/* Width adjusted, space added */}
             {/* BEARISH Section */}
             <div>
               <h4 className="font-bold mb-3 text-lg text-[#3A1F16] sticky top-0 bg-white py-1 z-10" style={{ fontFamily }}>Choose BEARISH</h4>
               <div className="grid grid-cols-2 gap-3 w-full"> {/* Changed to 2 columns */}
                 {(nfts.length > 0 ? nfts : [defaultNFT]).filter((nft): nft is BearishNFT => nft !== null && nft !== undefined).map((nft) => (
                   <div
                     key={nft.tokenId}
                     className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-4 ${selectedNFT?.tokenId === nft.tokenId ? "border-amber-500 ring-4 ring-amber-500" : "border-[#3A1F16]"}`}
                     onClick={() => selectNFT(nft)}
                   >
                     <div className="relative w-full h-full">
                       <Image src={nft.image || "/images/bee-mascot.png"} alt={nft.name} fill className="object-contain p-1 bg-white" />
                       <div className="absolute bottom-0 left-0 right-0 bg-[#3A1F16] p-1">
                         <p className="text-white text-[10px] truncate text-center" style={{ fontFamily }}>{nft.name}</p>
                       </div>
                     </div>
                   </div>
                 ))}
                 {/* Bee Mascot option */}
                 <div
                   key="bee-mascot-selector"
                   className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-4 ${selectedNFT?.tokenId === 'bee-mascot' ? "border-amber-500 ring-4 ring-amber-500" : "border-[#3A1F16]"}`}
                   onClick={handleUseBeeInstead}
                  >
                    <div className="relative w-full h-full">
                      <Image src="/images/bee-mascot.png" alt="BEEISH Mascot" fill className="object-contain p-1 bg-white"/>
                      <div className="absolute bottom-0 left-0 right-0 bg-[#3A1F16] p-1">
                        <p className="text-white text-[10px] truncate text-center" style={{ fontFamily }}>BEEISH Mascot</p>
                      </div>
                    </div>
                  </div>
               </div>
               {isDemoMode && (
                 <div className="bg-yellow-100 text-yellow-900 p-2 rounded mt-3 text-center text-xs w-full">
                   Using demo BEARISH NFT!
                 </div>
               )}
            </div>

            {/* Divider */}
            <hr className="border-t-2 border-[#3A1F16] w-full"/>

            {/* BEEISH Section */}
            <div>
               <h4 className="font-bold mb-3 text-lg text-[#3A1F16] sticky top-0 bg-white py-1 z-10" style={{ fontFamily }}>Add BEEISH</h4>
               {beeishLoading && <Loader2 className="animate-spin my-4 mx-auto" />}
               {beeishError && <p className="text-red-500 text-sm">{beeishError}</p>}
               <div className="grid grid-cols-2 gap-3 w-full">
                 {(revealedBeeishNFTs.length > 0 ? revealedBeeishNFTs : defaultBees).map((nft: BeeishNFT) => (
                   <button
                     key={nft.tokenId}
                     type="button"
                     title={`Add ${nft.name}`}
                     onClick={() => setBees([...bees, { id: Date.now(), x: Math.random()*10 + 45, y: Math.random()*10 + 45, scale: 0.4, rotation: 0, flipped: false, beeishNFT: nft }])}
                     className="aspect-square rounded-lg overflow-hidden border-2 border-[#3A1F16] bg-[#FFB949] hover:bg-amber-400 active:bg-amber-500 relative p-1"
                   >
                      <div className="relative w-full h-full">
                        <Image src={nft.image || "/images/bee-mascot.png"} alt={nft.name} fill className="object-contain" />
                        <div className="absolute bottom-0 left-0 right-0 bg-[#3A1F16] bg-opacity-80 p-0.5">
                          <p className="text-white text-[10px] truncate text-center" style={{ fontFamily }}>{nft.name}</p>
                        </div>
                      </div>
                   </button>
                 ))}
               </div>
                {/* BEEISH Pagination */}
                {revealedBeeishNFTs.length > 0 && beeishTotal > revealedBeeishNFTs.length && (
                   <div className="mt-4 flex justify-center items-center gap-2 w-full">
                      <CustomButton variant="blank" onClick={() => setBeeishPage(beeishPage - 1)} disabled={beeishPage === 1}>Prev</CustomButton>
                      <span className="text-sm text-[#3A1F16]">Page {beeishPage}</span>
                      <CustomButton variant="blank" onClick={() => setBeeishPage(beeishPage + 1)} disabled={beeishNFTs.length < 20}>Next</CustomButton>
                   </div>
                )}
             </div>
          </div>

          {/* === Center Column: Fixed Canvas === */}
          <div className="flex-grow flex items-center justify-center"> {/* Center the canvas */}
            {selectedNFT ? (
                <div
                  ref={canvasDisplayRef}
                  className="border-4 border-[#3A1F16] rounded-xl overflow-hidden flex-shrink-0" // Fixed size, remove aspect-square
                  style={{
                    width: '600px', // Fixed width
                    height: '600px', // Fixed height
                    backgroundColor: selectedBackground.color,
                    position: "relative",
                  }}
                >
                  {/* Inner canvas for capture */}
                  <div
                    ref={canvasCaptureRef}
                    className="w-full h-full"
                    style={{ position: "relative", overflow: "hidden" }}
                  >
                    {/* Base NFT image - Now fits perfectly */}
                    <div
                      className={`absolute cursor-move ${isMovingNFT ? "ring-2 ring-amber-500" : ""}`}
                      style={{
                        left: `${nftPosition.x}%`,
                        top: `${nftPosition.y}%`,
                        width: '100%',
                        height: '100%',
                        zIndex: 0,
                        display: "block",
                        visibility: "visible",
                        transform: `translate(-50%, -50%) scale(${nftPosition.scale})`,
                        transformOrigin: "center",
                      }}
                      onMouseDown={handleNFTMouseDown}
                      onTouchStart={handleNFTMouseDown}
                    >
                        <Image
                          src={selectedNFT.image || "/images/bee-mascot.png"}
                          alt={selectedNFT.name}
                          width={600} // Match canvas size for base
                          height={600}
                          className="pointer-events-none"
                          style={{
                            position: "absolute",
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain", // This will fit the image within the 600x600 box
                            display: "block",
                            visibility: "visible",
                            width: "auto",
                            height: "auto",
                          }}
                          priority
                        />
                    </div>
                    {/* Bee overlays */}
                    {bees.map(renderBee)}
                    {/* Flash effect */}
                    {showFlash && ( <div className="absolute inset-0 bg-white opacity-80 z-10" style={{ animation: "flash 0.3s ease-out forwards" }} /> )}
                  </div>
                </div>
            ) : (
              // Initial State: No NFT Selected
              <div className="flex items-center justify-center w-full h-full">
                 <div className="bg-bee-light-yellow p-6 rounded-lg border-4 border-[#3A1F16] text-center max-w-md">
                    <h3 className="text-2xl font-bold mb-4 text-[#3A1F16]" style={{ fontFamily }}>
                      Welcome to the Photo Booth!
                    </h3>
                    <p className="text-lg text-[#3A1F16]" style={{ fontFamily }}>
                       Select a BEARISH NFT or Mascot from the left to begin.
                    </p>
                 </div>
              </div>
            )}
          </div>

          {/* === Right Column: Controls === */}
          <div className="w-[280px] flex-shrink-0 flex flex-col pt-4 overflow-y-auto"> {/* Width adjusted */}
            {selectedNFT && (
                 <div className="w-full p-4 bg-bee-light-yellow rounded-lg border-4 border-[#3A1F16]">
                   <h4 className="font-bold mb-3 text-center text-lg text-[#3A1F16]" style={{ fontFamily }}>Customize</h4>
                   {/* NFT Controls */}
                   <div className="grid grid-cols-2 gap-2 mb-3"> {/* Changed to 2 columns */}
                     <CustomButton title="Move NFT" variant="blank" onClick={() => setIsMovingNFT(!isMovingNFT)}> <Move size={18}/> Move </CustomButton>
                     <CustomButton title="Zoom In NFT" variant="blank" onClick={() => scaleNFT(true)}> <ZoomIn size={18}/> Zoom + </CustomButton>
                     <CustomButton title="Zoom Out NFT" variant="blank" onClick={() => scaleNFT(false)}> <ZoomOut size={18}/> Zoom - </CustomButton>
                     <CustomButton title="Center NFT" variant="blank" onClick={centerNFT}> <ImageIcon size={18}/> Center </CustomButton>
                   </div>

                   {/* Placeholder for Bee Controls to prevent layout shift */}
                   <div className="min-h-[160px]"> {/* Adjust min-height as needed based on actual control height */}
                     {activeBeeId !== null && (
                        <div className="mb-3 p-3 border-2 border-[#3A1F16] rounded-md bg-white">
                           <h5 className="font-semibold mb-2 text-center text-md text-[#3A1F16]" style={{ fontFamily }}>Selected Bee</h5>
                           <div className="grid grid-cols-2 gap-2"> {/* Changed to 2 columns */}
                              <CustomButton title="Move Bee" variant="blank" onClick={() => { /* Dragging handled by mouse down */ }}> <Move size={18}/> Move </CustomButton>
                              <CustomButton title="Zoom In Bee" variant="blank" onClick={() => scaleBee(true)}> <ZoomIn size={18}/> + </CustomButton>
                              <CustomButton title="Zoom Out Bee" variant="blank" onClick={() => scaleBee(false)}> <ZoomOut size={18}/> - </CustomButton>
                              <CustomButton title="Rotate Clockwise" variant="blank" onClick={() => rotateBee(true)}> <RotateCw size={18}/> Rot + </CustomButton>
                              <CustomButton title="Rotate Counter-Clockwise" variant="blank" onClick={() => rotateBee(false)}> <RotateCcw size={18}/> Rot - </CustomButton>
                              <CustomButton title="Flip Bee" variant="blank" onClick={flipBee}> <FlipHorizontal size={18}/> Flip </CustomButton>
                              <CustomButton title="Remove Bee" variant="blank" className="text-red-600 hover:text-red-800 col-span-2" onClick={removeBee}> Remove Bee </CustomButton> {/* Span 2 cols */}
                           </div>
                        </div>
                     )}
                   </div>

                   {/* General Controls */}
                   <div className="grid grid-cols-1 gap-3">
                      {/* Background Selector */}
                      <div>
                        <label className="block font-semibold mb-1 text-sm text-[#3A1F16]" style={{ fontFamily }}>Background:</label>
                        <select
                          value={selectedBackground.id}
                          onChange={(e) => setSelectedBackground(backgrounds.find(bg => bg.id === e.target.value) || backgrounds[0])}
                          className="w-full p-2 border-2 border-[#3A1F16] rounded-md bg-white"
                        >
                          {backgrounds.map(bg => <option key={bg.id} value={bg.id}>{bg.name}</option>)}
                        </select>
                      </div>
                      {/* Bee Presets */}
                      <div>
                        <label className="block font-semibold mb-1 text-sm text-[#3A1F16]" style={{ fontFamily }}>Bee Patterns:</label>
                        <div className="grid grid-cols-2 gap-2">
                           {beePresets.map((preset) => (
                              <CustomButton key={preset.id} variant="blank" onClick={() => applyBeePreset(preset.id)}>
                                {preset.name}
                              </CustomButton>
                           ))}
                        </div>
                      </div>
                      {/* Download Button */}
                      <CustomButton
                       variant="blank"
                       className="w-full mt-2 bg-[#FFB949] hover:bg-amber-400 text-[#3A1F16] font-bold"
                       onClick={downloadImage}
                       disabled={isDownloading || !html2canvasLoaded}
                     >
                       {isDownloading ? <Loader2 className="animate-spin mr-2"/> : <Camera size={18} className="mr-2"/>}
                       {isDownloading ? "Downloading..." : "Download Image"}
                     </CustomButton>
                     {!html2canvasLoaded && <p className="text-xs text-center text-red-600 mt-1">Capture library loading...</p>}
                     {downloadError && <p className="text-xs text-center text-red-600 mt-1">{downloadError}</p>}
                   </div>
                 </div>
             )}
          </div>

        </div>
      )}
      <style jsx global>{`
        @keyframes flash {
          0% { opacity: 0.8; }
          100% { opacity: 0; }
        }
        /* Improved Scrollbars */
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #FFF7ED; /* Lighter yellow */
          border-radius: 4px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #FFD9B0; /* Medium yellow */
          border-radius: 4px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #e1a135; /* Darker hover */
        }
      `}</style>
    </div>
  )
}
