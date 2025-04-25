"use client"

import { useEffect } from "react"

export default function FallbackFontLoader() {
  useEffect(() => {
    // Create a function to check if the font is loaded
    const checkFontLoaded = () => {
      // Create a span with the font we want to check
      const span = document.createElement("span")
      span.style.fontFamily = "'Super Lobster', cursive"
      span.style.fontSize = "0px"
      span.textContent = "Font load test"
      document.body.appendChild(span)

      // Get the width with our test font
      const testWidth = span.offsetWidth

      // Change to a fallback font
      span.style.fontFamily = "'Comic Sans MS', sans-serif"

      // If the width changed, the custom font didn't load
      const fallbackWidth = span.offsetWidth
      const fontLoaded = testWidth === fallbackWidth

      // Clean up
      document.body.removeChild(span)

      if (!fontLoaded) {
        console.warn("Custom font not loaded, using fallback")
        document.documentElement.classList.add("font-fallback")
      }
    }

    // Check after a delay to allow font loading
    const timer = setTimeout(checkFontLoaded, 1000)

    return () => clearTimeout(timer)
  }, [])

  return null
}
