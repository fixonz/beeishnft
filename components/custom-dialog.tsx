"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { createPortal } from "react-dom"

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  // Only render in the browser
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)

    // Handle escape key to close dialog
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEscape)
      // Prevent scrolling
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [open, onOpenChange])

  // Don't render on the server
  if (!mounted) return null

  // Don't render if not open
  if (!open) return null

  // Use createPortal to render at the root level
  return createPortal(<div className="fixed inset-0 z-50">{children}</div>, document.body)
}

export function DialogContent({
  className,
  children,
  onClose,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { onClose?: () => void }) {
  return (
    <>
      {/* Re-introduce Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/80 animate-in fade-in-0" onClick={onClose} />

      {/* Content: Use inset-0 + m-auto for centering */}
      <div
        className={cn(
          // Positioning: Fixed, inset-0, m-auto
          "fixed inset-0 z-50 m-auto",
          // Size and appearance:
          "max-h-[90vh] w-[90vw] max-w-lg h-fit", // Use h-fit for height, ensure max-w is set
          "overflow-auto rounded-lg border bg-background p-6 shadow-lg animate-in fade-in-0 zoom-in-95",
          className, // Allow overriding
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
        {onClose && (
          <button
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
      </div>
    </>
  )
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
}

export function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />
}
