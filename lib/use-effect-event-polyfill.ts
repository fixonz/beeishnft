// This file provides a polyfill for useEffectEvent without modifying React
export function useEffectEvent<T extends (...args: any[]) => any>(fn: T): T {
  // Simply return the function as-is
  return fn
}

// Export a mock React object that includes useEffectEvent
// This can be used by components that need it
export const ReactPolyfill = {
  useEffectEvent,
}
