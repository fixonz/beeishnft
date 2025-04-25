'use client'

import React from 'react'
import { WagmiProvider } from 'wagmi' 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider } from 'connectkit'
import { ThemeProvider } from "@/components/theme-provider"
import { config } from '@/lib/wagmi' // Import the new Wagmi config
import { abstractWalletConnector } from '@abstract-foundation/agw-react/connectors'
import { injected } from 'wagmi/connectors'

// Create a React Query client
const queryClient = new QueryClient()

// Explicitly define the connectors we want ConnectKit to use
const connectors = [
  abstractWalletConnector(),
  injected(),
];

export function Providers({ children }: { children: React.ReactNode }) {
  // ConnectKit theme options
  const connectKitTheme = {
    '--ck-font-family': 'Super Lobster, cursive',
    '--ck-border-radius': '12px',
    
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
    '--ck-modal-box-shadow': '0px 8px 24px rgba(0, 0, 0, 0.3)',
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
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          theme="custom"
          customTheme={connectKitTheme}
          options={{
            // connectors: connectors, // Pass only our desired connectors (Might not be the correct option name, check ConnectKit docs if needed)
            // Or maybe filter wallets here - consult ConnectKit documentation for exact filtering options
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