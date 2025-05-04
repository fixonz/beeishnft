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

// 1. Set sensible default scale and position for NFT
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
  const controlsPanelRef = useRef<HTMLDivElement>(null)
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

  // Effect to match panel height to canvas height - runs on NFT, tab, or bee changes
  useEffect(() => {
    const setPanelHeight = () => {
      if (canvasDisplayRef.current && controlsPanelRef.current) {
        const canvasHeight = canvasDisplayRef.current.offsetHeight;
        // Only set height if canvasHeight is positive to avoid issues during render
        if (canvasHeight > 0) {
           controlsPanelRef.current.style.height = `${canvasHeight}px`;
        }
      }
    }

    // Set height initially and whenever dependencies change
    if (selectedNFT) {
      // Use requestAnimationFrame for potentially smoother updates after render
      const id = requestAnimationFrame(setPanelHeight);
      // Add resize listener
      window.addEventListener("resize", setPanelHeight);

      // Cleanup
      return () => {
        cancelAnimationFrame(id);
        window.removeEventListener("resize", setPanelHeight);
      };
    }
  }, [selectedNFT]); // Rerun when NFT changes

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
        <div className="flex flex-row w-full max-w-[1400px] px-4 mx-auto h-full gap-4">
          {/* Left: BEARISH NFT Selection */}
          <div className="w-[250px] flex-shrink-0 flex flex-col items-center">
            <h4 className="font-bold mb-2">Choose your BEARISH NFT</h4>
            <div className="grid grid-cols-1 gap-4">
              {(nfts.length > 0 ? nfts : [defaultNFT]).filter((nft): nft is BearishNFT => nft !== null && nft !== undefined).map((nft) => (
                <div
                  key={nft.tokenId}
                  className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-4 ${selectedNFT?.tokenId === nft.tokenId ? "border-amber-500 ring-4 ring-amber-500" : "border-[#3A1F16]"}`}
                  onClick={() => selectNFT(nft)}
                >
                  <Image src={nft.image || "/images/bee-mascot.png"} alt={nft.name} fill className="object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-[#3A1F16] p-2">
                    <p className="text-white text-sm truncate text-center">{nft.name}</p>
                  </div>
                </div>
              ))}
            </div>
            {isDemoMode && (
              <div className="bg-yellow-100 text-yellow-900 p-2 rounded mt-2 text-center">
                You don't own any BEARISH NFTs. Customizing the demo BEARISH NFT below!
              </div>
            )}
          </div>

          {/* Center: Main Canvas */}
          <div className="flex-grow flex flex-col items-center justify-center">
            {/* Place your main canvas and overlay controls here */}
            {selectedNFT ? (
              // Make this container fill the height provided by the parent and stretch items
              <div className="flex flex-row w-full justify-center gap-4 h-full items-stretch">
                {/* Canvas for editing - Assign ref */}
                <div
                  ref={canvasDisplayRef}
                  className="aspect-square border-4 border-[#3A1F16] rounded-xl overflow-hidden"
                  style={{
                    backgroundColor: selectedBackground.color,
                    position: "relative",
                  }}
                >
                  {/* Inner canvas with fixed positioning - Assign renamed ref for capture */}
                  <div
                    ref={canvasCaptureRef}
                    className="w-full relative"
                    style={{
                      height: "calc(100% + 50px)",
                      marginTop: "-25px", // Center the extra height
                      position: "relative",
                      overflow: "visible", // Allow content to overflow
                      paddingTop: "50px",
                      paddingBottom: "50px",
                    }}
                  >
                    {/* Base NFT image - draggable and scalable */}
                    <div
                      className={`absolute cursor-move ${isMovingNFT ? "ring-2 ring-amber-500" : ""}`}
                      style={{
                        left: `${nftPosition.x}%`,
                        top: `${nftPosition.y}%`,
                        width: 0,
                        height: 0,
                        zIndex: 0,
                        display: "block",
                        visibility: "visible",
                      }}
                      onMouseDown={handleNFTMouseDown}
                      onTouchStart={handleNFTMouseDown}
                    >
                      <div
                        style={{
                          position: "absolute",
                          transform: `translate(-50%, -50%) scale(${nftPosition.scale})`,
                          transformOrigin: "center",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "100%",
                          height: "100%",
                          maxWidth: "100%",
                          maxHeight: "100%",
                          visibility: "visible",
                        }}
                      >
                        <Image
                          src={selectedNFT.image || "/images/bee-mascot.png"}
                          alt={selectedNFT.name}
                          width={400}
                          height={400}
                          className="pointer-events-none"
                          style={{
                            maxWidth: "none",
                            objectFit: "contain",
                            display: "block",
                            visibility: "visible",
                          }}
                        />
                      </div>
                    </div>

                    {/* Bee overlays - using SVG for better scaling */}
                    {bees.map(renderBee)}

                    {/* Flash effect */}
                    {showFlash && (
                      <div
                        className="absolute inset-0 bg-white opacity-80 z-10"
                        style={{
                          animation: "flash 0.3s ease-out forwards",
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center w-full h-full">
                  <div className="bg-bee-light-yellow p-6 rounded-lg border-4 border-[#3A1F16] max-w-4xl w-[95%] mx-auto overflow-y-auto max-h-[80vh]">
                    <h3 className="text-2xl font-bold mb-4 text-primary text-center" style={{ fontFamily }}>
                      Your BEARISH NFTs
                    </h3>

                    <div className="bg-white p-6 rounded-lg border-4 border-[#3A1F16] overflow-y-auto">
                      <p className="text-dark font-medium text-lg mb-6 text-center" style={{ fontFamily }}>
                        {revealedBeeishNFTs.length === 0 ? "You don't own any BEARISH NFTs yet." : "Choose an NFT to customize:"}
                      </p>
                      {revealedBeeishNFTs.length === 0 && (
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                          <div className="flex flex-col items-center">
                            <p className="text-dark font-medium text-lg mb-3 text-center" style={{ fontFamily }}>
                              Try with our demo BEARISH NFT:
                            </p>
                            <div className="flex justify-center">
                              <div
                                className="aspect-square w-64 max-w-full bg-white border-4 border-[#3A1F16] rounded-lg overflow-hidden cursor-pointer hover:border-amber-500 transition-all"
                                onClick={handleUseDefaultNFT}
                              >
                                <div className="relative w-full h-full">
                                  <Image
                                    src={defaultNFT?.image || "/images/bee-mascot.png"}
                                    alt={defaultNFT?.name || "BEARISH Demo NFT"}
                                    fill
                                    className="object-contain brightness-110 p-2"
                                  />
                                  <div className="absolute bottom-0 left-0 right-0 bg-[#3A1F16] p-2">
                                    <p className="text-white text-sm truncate text-center" style={{ fontFamily }}>
                                      {defaultNFT?.name || "BEARISH Demo NFT"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-center">
                            <p className="text-dark font-medium text-lg mb-3 text-center" style={{ fontFamily }}>
                              Or use our BEEISH mascot:
                            </p>
                            <div className="flex justify-center">
                              <div
                                className="aspect-square w-64 max-w-full bg-white border-4 border-[#3A1F16] rounded-lg overflow-hidden cursor-pointer hover:border-amber-500 transition-all"
                                onClick={handleUseBeeInstead}
                              >
                                <div className="relative w-full h-full">
                                  <Image
                                    src="/images/bee-mascot.png"
                                    alt="BEEISH Mascot"
                                    fill
                                    className="object-contain brightness-110 p-2"
                                  />
                                  <div className="absolute bottom-0 left-0 right-0 bg-[#3A1F16] p-2">
                                    <p className="text-white text-sm truncate text-center" style={{ fontFamily }}>
                                      BEEISH Mascot
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                        {revealedBeeishNFTs.map((nft: BeeishNFT) => (
                          <div
                            key={nft.tokenId}
                            className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:ring-4 hover:ring-amber-500 transition-all border-4 border-[#3A1F16]"
                            onClick={() => setBees([...bees, { id: Date.now(), x: 50, y: 50, scale: 1, rotation: 0, flipped: false, beeishNFT: nft }])}
                          >
                            <div className="relative w-full h-full">
                              <Image
                                src={nft.image || "/images/bee-mascot.png"}
                                alt={nft.name}
                                fill
                                className="object-cover brightness-110"
                                style={{ objectFit: "contain", padding: "4px", backgroundColor: "#ffffff" }}
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-[#3A1F16] p-2">
                                <p className="text-white text-sm truncate text-center" style={{ fontFamily }}>
                                  {nft.name}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right: BEEISH NFT Selection */}
          <div className="w-[250px] flex-shrink-0 flex flex-col items-center">
            <h4 className="font-bold mb-2">Add your BEEISH bees</h4>
            <div className="grid grid-cols-2 gap-2">
              {(revealedBeeishNFTs.length > 0 ? revealedBeeishNFTs : defaultBees).map((nft: BeeishNFT) => (
                <button
                  key={nft.tokenId}
                  type="button"
                  onClick={() => setBees([...bees, { id: Date.now(), x: 50, y: 50, scale: 1, rotation: 0, flipped: false, beeishNFT: nft }])}
                  className="aspect-square rounded-lg overflow-hidden border-2 border-[#3A1F16] bg-[#FFB949] hover:bg-amber-400"
                >
                  <Image src={nft.image || "/images/bee-mascot.png"} alt={nft.name} fill className="object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-[#3A1F16] p-1">
                    <p className="text-white text-xs truncate text-center">{nft.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {selectedNFT && (
        <div className="flex justify-center mt-4">
          <CustomButton variant="blank" className="w-[160px]" onClick={centerNFT}>
            Center NFT
          </CustomButton>
        </div>
      )}
      <style jsx global>{`
        @keyframes flash {
          0% { opacity: 0.8; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
