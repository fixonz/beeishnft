"use client"

import { useAccount } from "wagmi"
import { useEffect, useState } from "react"

export interface BeeishNFT {
  tokenId: string
  name: string
  image: string // Always the IPFS image
  owner?: string
  forSale?: boolean
  price?: string
  marketplaceUrl?: string
}

// BEEISH NFT contract address
export const BEEISH_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_BEEISH_CONTRACT_ADDRESS || "0xc2d1370017d8171a31bce6bc5206f86c4322362e"

// IPFS CID for BEEISH images
const BEEISH_IPFS_CID = "QmbgHF4KSzcrtTrRG9mVd4ApHVkwTujkXtRvf9e3Jhkzai"

// Function to fetch BEEISH NFTs owned by the connected wallet (paginated)
export async function fetchBeeishNFTs(walletAddress: string, page: number = 1, pageSize: number = 20): Promise<{ nfts: BeeishNFT[], total: number }> {
  try {
    const offset = (page - 1) * pageSize
    const response = await fetch(
      `https://api-abstract.reservoir.tools/users/${walletAddress}/tokens/v7?collection=${BEEISH_CONTRACT_ADDRESS}&limit=${pageSize}&offset=${offset}`,
      {
        headers: {
          accept: "*/*",
          "x-api-key": "74f316c2-ffb7-58f3-a06d-3d45333fe37c",
        },
      },
    )
    if (!response.ok) throw new Error(`API request failed with status ${response.status}`)
    const data = await response.json()
    const nfts: BeeishNFT[] = data.tokens.map((item: any) => ({
      tokenId: item.token.tokenId,
      name: item.token.name || `BEEISH #${item.token.tokenId}`,
      image: `https://ipfs.io/ipfs/${BEEISH_IPFS_CID}/${item.token.tokenId}.png`,
      owner: item.token.owner,
      forSale: !!item.market?.floorAsk?.price,
      price: item.market?.floorAsk?.price?.amount?.decimal ? `${item.market.floorAsk.price.amount.decimal} ${item.market.floorAsk.price.currency.symbol}` : undefined,
      marketplaceUrl: `https://magiceden.io/item-details/abstract/${BEEISH_CONTRACT_ADDRESS}/${item.token.tokenId}`,
    }))
    return { nfts, total: data.totalCount || nfts.length }
  } catch (error) {
    console.error("Error fetching BEEISH NFTs:", error)
    if (error instanceof Error && error.message.includes("429")) {
      throw new Error("Rate limit exceeded while fetching user NFTs.");
    }
    throw error;
  }
}

// Function to fetch a specific BEEISH NFT by ID
export async function fetchBeeishNFTById(tokenId: string): Promise<BeeishNFT | null> {
  try {
    // We use the IPFS image directly
    return {
      tokenId,
      name: `BEEISH #${tokenId}`,
      image: `https://ipfs.io/ipfs/${BEEISH_IPFS_CID}/${tokenId}.png`,
      forSale: false,
    }
  } catch (error) {
    console.error(`Error fetching BEEISH NFT by ID ${tokenId}:`, error)
    return getDefaultBeeishNFT()
  }
}

// Function to get a default BEEISH NFT when API fails or no NFTs are available
export function getDefaultBeeishNFT(): BeeishNFT {
  return {
    tokenId: "robot",
    name: "Robot Bee",
    image: "/images/bee-robot.svg",
    forSale: false,
  }
}

// Hook to get BEEISH NFTs for the connected wallet (paginated)
export function useBeeishNFTs(pageSize: number = 20) {
  const { address, isConnected } = useAccount();
  const [nfts, setNfts] = useState<BeeishNFT[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserNFTs = async () => {
      if (!isConnected || !address) {
        setNfts([]);
        setTotal(0);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const { nfts: userNFTs, total } = await fetchBeeishNFTs(address, page, pageSize);
        setNfts(userNFTs);
        setTotal(total);
      } catch (err: any) {
        setError("Failed to load your BEEISH NFTs. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadUserNFTs();
  }, [address, isConnected, page, pageSize]);

  return { nfts, total, page, setPage, loading, error };
} 