"use client"

import { useEffect } from "react"

// This component will run on the client side and fix any useEffectEvent imports
export default function FixImports() {
  useEffect(() => {
    // Check if window.React exists and if it has useEffectEvent
    if (typeof window !== "undefined" && window.React && !window.React.useEffectEvent) {
      // Add a dummy implementation to prevent errors
      window.React.useEffectEvent = function useEffectEventPolyfill(fn: any) {
        return fn
      }
      console.log("Added polyfill for useEffectEvent")
    }
  }, [])

  return null
}
