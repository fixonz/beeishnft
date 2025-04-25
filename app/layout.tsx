import type React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Providers } from "@/components/providers"

export const metadata: Metadata = {
  title: "BEEISH NFT Collection | Abstract Chain Network",
  description: "Exclusive bee-inspired NFT collection on the Abstract Chain Network",
  icons: {
    icon: "/images/bee-mascot.png",
    apple: "/images/bee-mascot.png",
  },
  generator: 'v0.dev'
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body className={cn("font-super-lobster")}>
        {/* Use the single Providers component */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
