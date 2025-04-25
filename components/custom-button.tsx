"use client"

import type React from "react"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "blank" | "connect" | "mint" | "photoBooth" | "reveal" | "free"
  size?: "default" | "sm" | "lg"
  asChild?: boolean
}

const CustomButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? "a" : "button"

    const baseStyles =
      "inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none data-[state=open]:bg-secondary/50"

    const variantStyles = {
      blank: "bg-[#fff8e1] text-[#3A1F16] border-4 border-[#3A1F16] hover:bg-amber-400",
      connect: "bg-[#fff8e1] text-[#3A1F16] border-4 border-[#3A1F16] hover:bg-amber-400",
      mint: "bg-[#FFB949] text-[#3A1F16] border-4 border-[#3A1F16] hover:bg-[#3A1F16] hover:text-white",
      photoBooth: "bg-[#FFB949] text-[#3A1F16] border-4 border-[#3A1F16] hover:bg-[#3A1F16] hover:text-white",
      reveal:
        "bg-[#FFB949] text-[#3A1F16] border-4 border-[#3A1F16] hover:bg-[#3A1F16] hover:text-white relative overflow-hidden group",
      free: "bg-[#FFB949] text-[#3A1F16] border-4 border-[#3A1F16] hover:bg-[#3A1F16] hover:text-white",
    }

    const sizeStyles = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
    }

    return (
      <Comp
        className={cn(baseStyles, variantStyles[variant || "blank"], sizeStyles[size || "default"], className)}
        ref={ref}
        {...props}
      >
        {/* No image components here to avoid the pill-shaped labels */}
        <span className={`custom-button-text ${variant === "reveal" ? "relative z-10 group-hover:text-white" : ""}`}>
          {children || (variant ? variant.toUpperCase() : "BUTTON")}
        </span>
        {variant === "reveal" && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/30 to-transparent animate-shimmer"></div>
        )}
      </Comp>
    )
  },
)
CustomButton.displayName = "CustomButton"

export default CustomButton

// Add shimmer animation keyframes
const shimmerAnimation = `
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
  background-size: 200% 100%;
}
`

// Add the animation to the document
if (typeof document !== "undefined") {
  const style = document.createElement("style")
  style.textContent = shimmerAnimation
  document.head.appendChild(style)
}
