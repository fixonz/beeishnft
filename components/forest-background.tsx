"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export default function ForestBackground() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Main forest scene container */}
      <div className="relative w-full h-full">
        {/* Top bar with specific hex color */}
        <div className="absolute top-0 left-0 right-0 h-[10vh] bg-[#FFB949] z-10" />

        {/* Bottom bar with specific hex color */}
        <div className="absolute bottom-0 left-0 right-0 h-[10vh] bg-[#FFB949] z-10" />
        {/* Layer 1: Amber background (furthest) */}
        <div className="absolute inset-0 bg-[#FFB949]">
          <Image
            src="/images/background-1.png"
            alt="Background"
            fill
            priority
            sizes="100vw"
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </div>

        {/* Layer 2: Tree trunks */}
        <div className="absolute inset-0">
          <Image
            src="/images/trees-1.png"
            alt="Tree trunks"
            fill
            priority
            sizes="100vw"
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </div>

        {/* Layer 3: More detailed trees */}
        <div className="absolute inset-0">
          <Image
            src="/images/trees-2.png"
            alt="Detailed trees"
            fill
            priority
            sizes="100vw"
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </div>

        {/* Layer 4: Additional trees and ground elements */}
        <div className="absolute inset-0">
          <Image
            src="/images/trees-3.png"
            alt="Additional trees"
            fill
            priority
            sizes="100vw"
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </div>

        {/* Layer 5: Ground/hill silhouette */}
        <div className="absolute inset-0">
          <Image
            src="/images/ground.png"
            alt="Ground"
            fill
            priority
            sizes="100vw"
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </div>

        {/* Layer 6: Ground with bear silhouette */}
        <div className="absolute inset-0">
          <Image
            src="/images/background-2.png"
            alt="Bear silhouette"
            fill
            priority
            sizes="100vw"
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </div>

        {/* Layer 7: Scene with beehive (closest) */}
        <div className="absolute inset-0">
          <Image
            src="/images/scene.png"
            alt="Scene with beehive"
            fill
            priority
            sizes="100vw"
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </div>
      </div>
    </div>
  )
}
