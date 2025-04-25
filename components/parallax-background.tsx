"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface ParallaxBackgroundProps {
  scrollY: number
}

export default function ParallaxBackground({ scrollY }: ParallaxBackgroundProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <>
      {/* Fixed background color */}
      <div className="fixed inset-0 bg-amber-100 z-0" />

      {/* Parallax layers */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* Background layer - gold background */}
        <div className="absolute inset-0 w-full h-full" style={{ transform: `translateY(${scrollY * 0.05}px)` }}>
          <div className="absolute inset-0 w-full h-full bg-amber-200">
            <Image
              src="/images/background-1.png"
              alt="Background"
              fill
              priority
              sizes="100vw"
              style={{
                objectFit: "cover",
                objectPosition: "bottom",
              }}
            />
          </div>
        </div>

        {/* Far trees layer */}
        <div className="absolute inset-0 w-full h-full" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/images/trees-1.png"
              alt="Far trees"
              fill
              priority
              sizes="100vw"
              style={{
                objectFit: "contain",
                objectPosition: "bottom",
              }}
            />
          </div>
        </div>

        {/* Mid trees layer */}
        <div className="absolute inset-0 w-full h-full" style={{ transform: `translateY(${scrollY * 0.15}px)` }}>
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/images/trees-2.png"
              alt="Mid trees"
              fill
              priority
              sizes="100vw"
              style={{
                objectFit: "contain",
                objectPosition: "bottom",
              }}
            />
          </div>
        </div>

        {/* Scene elements layer */}
        <div className="absolute inset-0 w-full h-full" style={{ transform: `translateY(${scrollY * 0.2}px)` }}>
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/images/scene.png"
              alt="Scene elements"
              fill
              priority
              sizes="100vw"
              style={{
                objectFit: "contain",
                objectPosition: "bottom",
              }}
            />
          </div>
        </div>

        {/* Close trees layer */}
        <div className="absolute inset-0 w-full h-full" style={{ transform: `translateY(${scrollY * 0.25}px)` }}>
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/images/trees-3.png"
              alt="Close trees"
              fill
              priority
              sizes="100vw"
              style={{
                objectFit: "contain",
                objectPosition: "bottom",
              }}
            />
          </div>
        </div>

        {/* Ground layer */}
        <div className="absolute inset-0 w-full h-full" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/images/ground.png"
              alt="Ground"
              fill
              priority
              sizes="100vw"
              style={{
                objectFit: "contain",
                objectPosition: "bottom",
              }}
            />
          </div>
        </div>

        {/* Foreground layer */}
        <div className="absolute inset-0 w-full h-full" style={{ transform: `translateY(${scrollY * 0.35}px)` }}>
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/images/background-2.png"
              alt="Foreground"
              fill
              priority
              sizes="100vw"
              style={{
                objectFit: "contain",
                objectPosition: "bottom",
              }}
            />
          </div>
        </div>
      </div>

      {/* Gradient overlay for better text readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent to-amber-900/10 z-0" />
    </>
  )
}
