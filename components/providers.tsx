'use client'

import React from 'react'
import { WagmiProvider } from 'wagmi' 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider } from "connectkit"
import { ThemeProvider } from "@/components/theme-provider"
import { config } from '@/lib/wagmi' // Import the new Wagmi config

// Create a React Query client
const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  // ConnectKit theme options
  const connectKitTheme = {
    '--ck-font-family': 'Super Lobster, cursive',
    '--ck-border-radius': '8px',
    
    // Set custom button colors within the modal
    // These variables target the wallet buttons inside the list
    '--ck-secondary-button-background': '#FFB949', // Yellow background for wallet buttons
    '--ck-secondary-button-color': '#3A1F16', // Brown text for wallet buttons
    '--ck-secondary-button-border-color': '#3A1F16', // Brown border
    '--ck-secondary-button-hover-background': '#ffe0a6', // Lighter yellow on hover
    '--ck-secondary-button-active-background': '#ffd68a', // Slightly darker yellow when active
    
    // General Modal styling (keep previous refinements)
    '--ck-modal-background': '#FFB949',
    '--ck-overlay-background': 'rgba(0, 0, 0, 0.7)',
    '--ck-modal-box-shadow': 'none',
    '--ck-modal-shadow': 'none',
    '--ck-overlay-box-shadow': 'none',
    '--ck-body-background': '#FFB949',
    '--ck-body-color': '#3A1F16',
    '--ck-body-color-muted': '#5a3a2f',
    '--ck-body-header-color': '#3A1F16',
    '--ck-border-color': '#3A1F16',
    
    // Try reducing modal padding slightly
    '--ck-modal-padding': '16px',
    
    // Connect Button in Header (If NOT using Custom) - keeping our brown style
    '--ck-connectbutton-background': '#3A1F16',
    '--ck-connectbutton-color': '#FFFFFF',
    '--ck-connectbutton-hover-background': '#5a3a2f',
    // Custom modal width (compact)
    '--ck-modal-max-width': '420px',
    '--ck-modal-width': '100%',
    
    // Additional shadow removal for all components
    '--ck-body-box-shadow': 'none',
    '--ck-connectbutton-box-shadow': 'none',
    '--ck-connectbutton-hover-box-shadow': 'none',
    '--ck-connectbutton-active-box-shadow': 'none',
    '--ck-secondary-button-box-shadow': 'none',
    '--ck-secondary-button-hover-box-shadow': 'none',
    '--ck-focus-box-shadow': 'none',
    '--ck-overlay-backdrop-filter': 'none',
    '--ck-overlay-background-blur': '0px',
    '--ck-dropdown-box-shadow': 'none',
    '--ck-dropdown-active-box-shadow': 'none',
    
    // Ensure flat borders and no rounded edges
    '--ck-secondary-button-border-radius': '8px',
    '--ck-primary-button-border-radius': '8px',
    '--ck-connectbutton-border-radius': '8px',
    
    // More shadow overrides
    '--ck-default-box-shadow': 'none',
    '--ck-graphic-box-shadow': 'none',
    '--ck-graphic-hover-box-shadow': 'none',
    '--ck-qr-dot-box-shadow': 'none',
    '--ck-qr-background-box-shadow': 'none',
    '--ck-qr-container-box-shadow': 'none',
    '--ck-body-disclaimer-background-box-shadow': 'none',
    '--ck-body-disclaimer-box-shadow': 'none',
    '--ck-body-disclaimer-font-family': 'Super Lobster, cursive',
    
    // Force flat transparent background
    '--ck-body-background-transparent': 'transparent',
    '--ck-body-background-secondary': '#FFB949',
    '--ck-body-background-tertiary': '#FFB949',
    
    // Remove any dropdown shadows
    '--ck-dropdown-shadow': 'none',
    '--ck-dropdown-active-shadow': 'none',
  };

  // Custom CSS to ensure modal is compact and centered
  // This will be injected into the page
  const modalCss = `
    /* Completely remove all shadows and side elements */
    .sc-dhKdcB, 
    .jXJXoi, 
    [class*="sc-"].sc-dhKdcB,
    div[style*="pointer-events: none"][style*="position: absolute"][style*="transform: translateX(-50%)"],
    div[style*="pointer-events: none"] {
      display: none !important;
      opacity: 0 !important;
      visibility: hidden !important;
    }
    
    /* Make modal container have solid background with no shadows */
    .sc-gFqAkR, 
    .cMtGuS, 
    [style*="--height"],
    [style*="--width"],
    .sc-kpDqfm,
    div[class^="sc-"] {
      box-shadow: none !important;
      -webkit-box-shadow: none !important;
      filter: none !important;
      -webkit-filter: none !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      border: 4px solid #3A1F16 !important;
      background-color: #FFB949 !important;
      overflow: hidden !important;
    }
    
    /* Target wallet buttons to ensure they have proper styling */
    button[class*="sc-hIUJlX"] {
      box-shadow: none !important;
      filter: none !important;
    }
    
    /* Make the background completely solid */
    div[class*="sc-"] {
      background: #FFB949 !important;
    }
    
    /* Hide any text about additional wallets */
    div[class*="sc-kAkpmW"],
    span:has(svg[width="11"][height="12"]) {
      display: none !important;
    }
    
    /* Force hide any wallets we don't want */
    button[class*="sc-hIUJlX"]:not(:nth-child(1)):not(:nth-child(2)) {
      display: none !important;
    }
    
    /* Keep only the first two wallet buttons (Metamask and Abstract) */
    div.sc-gFVvzn > div.sc-ggpjZQ {
      display: flex;
      flex-direction: column;
    }
    
    div.sc-gFVvzn > div.sc-ggpjZQ > button:nth-child(n+3) {
      display: none !important;
    }
  `;

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <style>{modalCss}</style>
        <ConnectKitProvider
          theme="custom"
          customTheme={connectKitTheme}
          options={{
            hideNoWalletCTA: true,
            hideQuestionMarkCTA: true,
            hideRecentBadge: true,
            // Using CSS to enforce showing only two wallets since the
            // API options don't seem to be working correctly
          }}
        >
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
} 