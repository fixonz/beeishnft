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
    /* Extremely aggressive shadow removal - target all possible elements */
    .connectkit-modal,
    .connectkit-overlay,
    .connectkit-portal,
    .connectkit-drawer,
    .connectkit-card,
    .connectkit-walletlist,
    .connectkit-walletlist div,
    .connectkit-walletlist button,
    .connectkit-walletlist-scroll,
    .connectkit-wallet-detector button,
    .connectkit-button,
    .connectkit-wallet,
    div[class*="connectkit-"],
    button[class*="connectkit-"],
    span[class*="connectkit-"],
    ul[class*="connectkit-"],
    li[class*="connectkit-"],
    .ck-overlay,
    .ck-modal,
    .ck-* {
      box-shadow: none !important;
      -webkit-box-shadow: none !important;
      -moz-box-shadow: none !important;
      filter: none !important;
      -webkit-filter: none !important;
      -moz-filter: none !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      -moz-backdrop-filter: none !important;
      text-shadow: none !important;
      border-shadow: none !important;
      outline-shadow: none !important;
      drop-shadow: none !important;
      -webkit-drop-shadow: none !important;
      -moz-drop-shadow: none !important;
    }

    /* Target the main modal container and ensure flat edges */
    .connectkit-modal,
    div[class*="connectkit-modal"] {
      max-width: 420px !important;
      width: 100% !important;
      margin: 0 auto !important;
      border-radius: 12px !important;
      overflow: hidden !important;
      border: 4px solid #3A1F16 !important;
      background-color: #FFB949 !important;
    }

    /* Target buttons to remove any shadow effects */
    .connectkit-modal button,
    div[class*="connectkit-"] button {
      box-shadow: none !important;
      filter: none !important;
      text-shadow: none !important;
    }

    /* Reset overlay */
    .connectkit-overlay,
    div[class*="connectkit-overlay"] {
      background: rgba(0,0,0,0.7) !important;
    }
    
    /* Make sure all elements have a flat border */
    .connectkit-modal * {
      border-radius: 8px !important;
    }
    
    /* Override any SVG styles that might create shadows */
    .connectkit-modal svg,
    div[class*="connectkit-"] svg {
      filter: none !important;
      drop-shadow: none !important;
    }
    
    /* Use !important to override any shadow styles */
    *[style*="box-shadow"] {
      box-shadow: none !important;
    }
    
    *[style*="filter"] {
      filter: none !important;
    }
    
    /* Final guarantee - apply to every descendant */
    .connectkit-modal *,
    .connectkit-modal * *,
    .connectkit-modal * * *,
    .connectkit-modal * * * * {
      box-shadow: none !important;
      filter: none !important;
      border-radius: 8px !important;
    }
    
    /* Add a custom border to the main modal instead of shadows */
    .connectkit-modal {
      border: 4px solid #3A1F16 !important;
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
            // Only show the connectors we want (Abstract and Metamask)
            hideNoWalletCTA: true,
            hideQuestionMarkCTA: true,
            hideRecentBadge: true,
            // Modal is dismissible by clicking outside by default
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