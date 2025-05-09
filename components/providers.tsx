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
    /* Fixed Shadow Box Styles - Completely Override - Only in the wallet selection menu */
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
    
    /* Remove the shadow container completely - Only in the wallet selection menu */
    .sc-dhKdcB {
      display: none !important;
    }
    
    /* Hide the transform container causing shadows - Only in the wallet selection menu */
    div[style*="pointer-events: none"][style*="transform: translateX(-50%)"] {
      display: none !important;
    }
    
    /* Reset any unwanted borders or elements - Only in the wallet selection menu */
    .sc-gFqAkR::before,
    .sc-gFqAkR::after,
    .sc-kpDqfm::before,
    .sc-kpDqfm::after {
      display: none !important;
      content: none !important;
    }
    
    /* Fix the inner container - Only in the wallet selection menu */
    .sc-kpDqfm {
      border-radius: 8px !important;
      overflow: hidden !important;
      box-shadow: none !important;
    }
    
    /* Target additional wallets text - Only in the wallet selection menu */
    .sc-kAkpmW {
      display: none !important;
    }
    
    /* ONLY hide wallet buttons beyond the first two in the wallet selection dialog */
    div[class*="cwHptR"] button:nth-child(n+3),  /* Target the wallet list container */
    .sc-ggpjZQ button:nth-child(n+3) {
      display: none !important;
    }
    
    /* Important: Preserve connected wallet menu and disconnect button */
    /* This ensures the disconnect functionality remains available */
    div[class*="connectkit-address"],
    div[class*="connectkit-connected-container"],
    button[class*="connectkit-disconnect"],
    div[class*="connectkit-account"] {
      display: flex !important;
      visibility: visible !important;
      opacity: 1 !important;
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