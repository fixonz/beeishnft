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
    /* Fixed Shadow Box Styles - Completely Override */
    .sc-gFqAkR {
      box-shadow: none !important;
      -webkit-box-shadow: none !important;
      filter: none !important;
      border: 4px solid #3A1F16 !important;
      overflow: hidden !important;
      border-radius: 12px !important;
      margin: 0 auto !important;
      max-width: 420px !important;
      background: #FFB949 !important;
    }
    
    /* Remove the shadow container completely */
    .sc-dhKdcB {
      display: none !important;
    }
    
    /* Hide the transform container causing shadows */
    div[style*="pointer-events: none"][style*="transform: translateX(-50%)"] {
      display: none !important;
    }
    
    /* Reset any unwanted borders or elements */
    .sc-gFqAkR::before,
    .sc-gFqAkR::after,
    .sc-kpDqfm::before,
    .sc-kpDqfm::after {
      display: none !important;
      content: none !important;
    }
    
    /* Fix the inner container */
    .sc-kpDqfm {
      border-radius: 8px !important;
      overflow: hidden !important;
      box-shadow: none !important;
    }
    
    /* Target additional wallets text */
    .sc-kAkpmW {
      display: none !important;
    }
    
    /* Hide wallet buttons beyond the first two */
    .sc-ggpjZQ button:nth-child(n+3) {
      display: none !important;
    }
    
    /* Explicitly hide unwanted wallets by name/logo */
    button:has(span:contains("Phantom")),
    button:has(img[alt="Phantom"]),
    button:has(img[alt*="phantom"]),
    button:has(img[src*="phantom"]),
    button:has(span:contains("Trust")),
    button:has(span:contains("Trust Wallet")),
    button:has(img[alt="Trust Wallet"]),
    button:has(img[alt*="Trust"]),
    button:has(img[src*="trust"]),
    button:has(span:contains("Brave")),
    button:has(span:contains("Brave Wallet")),
    button:has(img[alt="Brave Wallet"]),
    button:has(img[alt*="Brave"]),
    button:has(img[src*="brave"]) {
      display: none !important;
    }
    
    /* Hide by button text content directly */
    button span:contains("Trust"),
    button span:contains("Brave"),
    button span:contains("Phantom") {
      display: none !important;
    }
    
    /* Hide browser wallet if it appears */
    button:has(span:contains("Browser")),
    button:has(span:contains("browser")),
    button:has(img[alt="Browser Wallet"]),
    button:has(img[alt*="Browser"]) {
      display: none !important;
    }
    
    /* Ensure MetaMask and Abstract are visible */
    button:has(img[alt="MetaMask"]),
    button:has(span:contains("MetaMask")),
    button:has(img[alt="Abstract"]),
    button:has(span:contains("Abstract")) {
      display: flex !important;
    }
    
    /* Style wallet buttons with brown theme */
    .sc-hIUJlX,
    button[class*="sc-hIUJlX"] {
      background-color: #3A1F16 !important;
      color: white !important;
      border: 2px solid #3A1F16 !important;
      transition: all 0.2s ease-in-out !important;
    }
    
    /* Hover effect for buttons */
    .sc-hIUJlX:hover,
    button[class*="sc-hIUJlX"]:hover {
      background-color: #5a3a2f !important;
      transform: translateY(-2px) !important;
    }
    
    /* Active effect for buttons */
    .sc-hIUJlX:active,
    button[class*="sc-hIUJlX"]:active {
      transform: translateY(1px) !important;
    }

    /* Target wallet buttons to ensure proper styling */
    div.sc-gFVvzn button,
    div.sc-ggpjZQ button {
      background-color: #3A1F16 !important;
      color: white !important;
      border: 2px solid #3A1F16 !important;
      margin-bottom: 8px !important;
    }
    
    /* Style the close button */
    button.sc-dLMFU,
    button[aria-label="Close"] {
      color: #3A1F16 !important;
      background: transparent !important;
      border: none !important;
    }
    
    /* Ensure clean text styling */
    div.sc-jlZhew {
      color: #3A1F16 !important;
      font-family: 'Super Lobster', cursive !important;
    }
    
    /* NUCLEAR APPROACH: Hide all wallets except Abstract and MetaMask */
    div.sc-gFVvzn > div.sc-ggpjZQ > button {
      display: none !important; 
    }
    
    /* Only show Abstract */
    div.sc-gFVvzn > div.sc-ggpjZQ > button:first-child {
      display: flex !important;
    }
    
    /* Display MetaMask as the second option if present */
    div.sc-gFVvzn > div.sc-ggpjZQ > button:has(span:contains("MetaMask")) {
      display: flex !important;
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