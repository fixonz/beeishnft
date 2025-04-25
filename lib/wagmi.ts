import { createConfig, http } from 'wagmi'
import { abstract as abstractMainnet, mainnet, sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
import { abstractWalletConnector } from "@abstract-foundation/agw-react/connectors"

// Retrieve WalletConnect Project ID from environment variables
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

if (!projectId) {
  console.warn("WalletConnect Project ID not found. WalletConnect connections may fail.")
  // Optionally throw an error if WalletConnect is critical
  // throw new Error("WalletConnect Project ID is missing from environment variables.");
}

export const config = createConfig({
  chains: [abstractMainnet, mainnet, sepolia], // Include Abstract mainnet and standard chains
  connectors: [
    abstractWalletConnector(), // AGW Connector
    injected(),               // Metamask, etc.
    // Add walletConnect, coinbaseWallet etc. if needed, using the projectId
  ],
  transports: {
    [abstractMainnet.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: true, // Enable SSR for Next.js
}); 