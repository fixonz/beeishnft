import { createConfig, http } from 'wagmi'
import { abstract as abstractMainnet, mainnet, sepolia } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'
import { abstractWalletConnector } from "@abstract-foundation/agw-react/connectors"

// Retrieve WalletConnect Project ID from environment variables
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID'

if (!projectId || projectId === 'YOUR_PROJECT_ID') {
  console.warn("WalletConnect Project ID not found or not set. WalletConnect connections may fail.")
  // Optionally throw an error if WalletConnect is critical
  // throw new Error("WalletConnect Project ID is missing from environment variables.");
}

export const config = createConfig({
  chains: [abstractMainnet, mainnet, sepolia], // Include Abstract mainnet and standard chains
  connectors: [
    abstractWalletConnector(), // AGW Connector
    injected(),                // Browser extension wallets (MetaMask, etc)
    walletConnect({ projectId }), // WalletConnect
  ],
  transports: {
    [abstractMainnet.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: true, // Enable SSR for Next.js
}); 