// This script patches the module system to provide a polyfill for useEffectEvent
// It needs to run before any React code is executed

;(function patchModules() {
  // Store the original require function
  const originalRequire = window.require

  // Create a patched require function
  if (typeof window !== "undefined" && window.require) {
    window.require = (path) => {
      // If trying to require 'react', return a patched version
      if (path === "react") {
        const originalReact = originalRequire(path)

        // Only add useEffectEvent if it doesn't exist
        if (!originalReact.useEffectEvent) {
          // Create a non-extensible copy with our addition
          const patchedReact = Object.create(originalReact)

          // Define the useEffectEvent function
          Object.defineProperty(patchedReact, "useEffectEvent", {
            value: function useEffectEvent(fn) {
              return fn
            },
            writable: false,
            enumerable: true,
            configurable: false,
          })

          return patchedReact
        }

        return originalReact
      }

      // Otherwise, use the original require
      return originalRequire(path)
    }
  }
})()
