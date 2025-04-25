"use client"

import { useAccount } from "wagmi"
import { useEffect, useState } from "react"

export interface BearishNFT {
  tokenId: string
  name: string
  image: string
  owner?: string
  forSale?: boolean
  price?: string
  marketplaceUrl?: string
}

// BEARISH NFT contract address
export const BEARISH_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_BEARISH_CONTRACT_ADDRESS || "0x516dc288e26b34557f68ea1c1ff13576eff8a168"

// Function to fetch BEARISH NFTs owned by the connected wallet
export async function fetchBearishNFTs(walletAddress: string): Promise<BearishNFT[]> {
  try {
    const response = await fetch(
      `https://api-abstract.reservoir.tools/users/${walletAddress}/tokens/v7?collection=${BEARISH_CONTRACT_ADDRESS}&limit=100`,
      {
        headers: {
          accept: "*/*",
          "x-api-key": "74f316c2-ffb7-58f3-a06d-3d45333fe37c",
        },
      },
    )
    if (!response.ok) throw new Error(`API request failed with status ${response.status}`)
    const data = await response.json()
    return data.tokens.map((item: any) => ({
      tokenId: item.token.tokenId,
      name: item.token.name || `BEARISH #${item.token.tokenId}`,
      image: item.token.image,
      owner: item.token.owner,
      forSale: !!item.market?.floorAsk?.price,
      price: item.market?.floorAsk?.price?.amount?.decimal ? `${item.market.floorAsk.price.amount.decimal} ${item.market.floorAsk.price.currency.symbol}` : undefined,
      marketplaceUrl: `https://magiceden.io/item-details/abstract/${BEARISH_CONTRACT_ADDRESS}/${item.token.tokenId}`,
    }))
  } catch (error) {
    console.error("Error fetching BEARISH NFTs:", error)
    if (error instanceof Error && error.message.includes("429")) {
      console.warn("Rate limit hit fetching user NFTs.")
      throw new Error("Rate limit exceeded while fetching user NFTs.");
    }
    throw error;
  }
}

// Function to fetch a specific BEARISH NFT by ID
export async function fetchBearishNFTById(tokenId: string): Promise<BearishNFT | null> {
  try {
    const response = await fetch(
      `https://api-abstract.reservoir.tools/tokens/v7?collection=${BEARISH_CONTRACT_ADDRESS}&tokenId=${tokenId}`,
      {
        headers: {
          accept: "*/*",
          "x-api-key": "74f316c2-ffb7-58f3-a06d-3d45333fe37c",
        },
      },
    )
    if (!response.ok) {
        // Return default if not found or rate limited
        if (response.status === 404 || response.status === 429) {
            console.warn(`NFT ${tokenId} not found or rate limit hit.`);
            return getDefaultNFT();
        }
        throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json()
    if (data.tokens && data.tokens.length > 0) {
      const token = data.tokens[0].token
      return {
        tokenId: token.tokenId,
        name: token.name || `BEARISH #${token.tokenId}`,
        image: token.image,
        owner: token.owner,
        forSale: !!data.tokens[0].market?.floorAsk?.price,
        price: data.tokens[0].market?.floorAsk?.price?.amount?.decimal ? `${data.tokens[0].market.floorAsk.price.amount.decimal} ${data.tokens[0].market.floorAsk.price.currency.symbol}` : undefined,
        marketplaceUrl: `https://magiceden.io/item-details/abstract/${BEARISH_CONTRACT_ADDRESS}/${token.tokenId}`,
      }
    }
    return getDefaultNFT() // Return default if token data is missing
  } catch (error) {
    console.error(`Error fetching BEARISH NFT by ID ${tokenId}:`, error)
    return getDefaultNFT()
  }
}

// Function to fetch BEARISH NFTs for sale (placeholder)
export async function fetchBearishNFTsForSale(limit = 5): Promise<BearishNFT[]> {
  console.warn("fetchBearishNFTsForSale not fully implemented/used, returning default.");
  return [await fetchBearishNFTById("1004") ?? getDefaultNFT()]; // Try fetching 1004 or use static default
}

// Function to get a default NFT when API fails or no NFTs are available
export function getDefaultNFT(): BearishNFT {
  return {
    tokenId: "default-1",
    name: "BEARISH Demo NFT",
    image: "/images/bee-mascot.png",
    forSale: false,
  }
}

// Hook to get BEARISH NFTs for the connected wallet and a default NFT
export function useBearishNFTs() {
  const { address, isConnected } = useAccount();
  const [nfts, setNfts] = useState<BearishNFT[]>([]);
  const [defaultNFT, setDefaultNFT] = useState<BearishNFT | null>(null);
  const [loading, setLoading] = useState(false); // Combined loading for user NFTs
  const [loadingDefaultNFT, setLoadingDefaultNFT] = useState(true); // Initially loading default
  const [error, setError] = useState<string | null>(null);

  // Fetch Default NFT on mount
  useEffect(() => {
    const loadDefault = async () => {
      console.log("[useBearishNFTs] Loading default NFT...");
      setLoadingDefaultNFT(true);
      try {
        console.log("[useBearishNFTs] Awaiting fetchBearishNFTById('1004')...");
        const defaultData = await fetchBearishNFTById("1004");
        console.log("[useBearishNFTs] Default NFT fetch complete:", defaultData ? defaultData.tokenId : 'null');
        setDefaultNFT(defaultData);
      } catch (err: any) {
        console.error("[useBearishNFTs] Error loading default BEARISH NFT:", err);
        setDefaultNFT(getDefaultNFT());
      } finally {
        console.log("[useBearishNFTs] Setting loadingDefaultNFT to false.");
        setLoadingDefaultNFT(false);
      }
    };
    loadDefault();
  }, []);

  // Fetch user's NFTs when connected
  useEffect(() => {
    const loadUserNFTs = async () => {
      if (!isConnected || !address) {
        console.log("[useBearishNFTs] Not connected/no address, clearing user NFTs.");
        setNfts([]);
        setLoading(false);
        return;
      }

      console.log(`[useBearishNFTs] Loading user NFTs for ${address}...`);
      setLoading(true);
      setError(null);
      try {
        console.log(`[useBearishNFTs] Awaiting fetchBearishNFTs(${address})...`);
        const userNFTs = await fetchBearishNFTs(address);
        console.log(`[useBearishNFTs] User NFT fetch complete: ${userNFTs.length} NFTs found.`);
        setNfts(userNFTs);
      } catch (err: any) {
        console.error("Error loading user BEARISH NFTs:", err);
        setError("Failed to load your NFTs. Please try again.");
      } finally {
        console.log("[useBearishNFTs] Setting loading to false.");
        setLoading(false);
      }
    };

    loadUserNFTs();
  }, [address, isConnected]);

  return { nfts, defaultNFT, loading, loadingDefaultNFT, error };
}
