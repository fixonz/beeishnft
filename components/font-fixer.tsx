"use client"

import { useEffect } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function FontFixer() {
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    // Apply the appropriate font based on device type
    const applyFontToAllElements = () => {
      const fontFamily = isMobile
        ? "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif"
        : "'Super Lobster', cursive, sans-serif"

      // Check if the Super Lobster font is loaded
      document.fonts.ready.then(() => {
        const fontLoaded = Array.from(document.fonts).some(
          (font) => font.family.includes("Super Lobster") && font.status === "loaded",
        )

        if (!fontLoaded && !isMobile) {
          console.warn("Super Lobster font not loaded, using fallback")
          document.documentElement.classList.add("font-fallback")
        }
      })

      document.querySelectorAll("*").forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.fontFamily = fontFamily
        }
      })
    }

    // Apply immediately
    applyFontToAllElements()

    // Apply again after a short delay to catch any dynamically added elements
    const timeout = setTimeout(() => {
      applyFontToAllElements()
    }, 500)

    return () => clearTimeout(timeout)
  }, [isMobile])

  return null
}
