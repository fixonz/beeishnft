// This is a patched version of the Radix UI useEffectEvent hook
// It provides a simple implementation that doesn't rely on React.useEffectEvent

export function useEffectEvent<T extends (...args: any[]) => any>(fn: T): T {
  // Simply return the function as-is
  return fn
}
