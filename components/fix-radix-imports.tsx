"use client"

import { useEffect } from "react"

// This component will patch the Radix UI dependency that's causing the build error
export default function FixRadixImports() {
  useEffect(() => {
    // Only run in the browser
    if (typeof window !== "undefined") {
      try {
        // Check if the problematic module is loaded
        const radixModules = window.__RADIX_UI_MODULES__ || {}

        // Create a polyfill for useEffectEvent if it doesn't exist
        if (!window.React?.useEffectEvent) {
          // Define useEffectEvent as a function that simply returns its input function
          // This mimics the basic behavior of useEffectEvent
          window.React = window.React || {}
          window.React.useEffectEvent = function useEffectEventPolyfill(fn) {
            return fn
          }
          console.log("Added polyfill for Radix UI's useEffectEvent dependency")
        }

        // Store that we've patched the modules
        window.__RADIX_UI_MODULES__ = { ...radixModules, patched: true }
      } catch (error) {
        console.error("Failed to patch Radix UI modules:", error)
      }
    }
  }, [])

  return null
}
