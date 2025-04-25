// API functions for fetching NFT data

export interface NFTToken {
  tokenId: string
  name: string
  image: string
  price?: {
    amount: {
      decimal: number
      usd: number
    }
    currency: {
      symbol: string
    }
  }
  owner?: string
  mintedAt?: string
}

export interface CollectionStats {
  tokenCount: number
  floorPrice: number
  floorPriceUsd: number
}

export async function fetchNFTs(limit = 12): Promise<NFTToken[]> {
  try {
    const response = await fetch(
      `https://api-abstract.reservoir.tools/tokens/v7?collection=0xc2d1370017d8171a31bce6bc5206f86c4322362e&limit=${limit}`,
      {
        headers: {
          accept: "*/*",
          "x-api-key": "74f316c2-ffb7-58f3-a06d-3d45333fe37c",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    return data.tokens.map((item: any) => ({
      tokenId: item.token.tokenId,
      name: item.token.name,
      image: item.token.image,
      price: item.market.floorAsk?.price
        ? {
            amount: {
              decimal: item.market.floorAsk.price.amount.decimal,
              usd: item.market.floorAsk.price.amount.usd,
            },
            currency: {
              symbol: item.market.floorAsk.price.currency.symbol,
            },
          }
        : undefined,
      owner: item.token.owner,
      mintedAt: item.token.mintedAt,
    }))
  } catch (error) {
    console.error("Error fetching NFTs:", error)
    return []
  }
}

export async function fetchCollectionStats(): Promise<CollectionStats> {
  try {
    const response = await fetch(
      "https://api-abstract.reservoir.tools/tokens/v7?collection=0xc2d1370017d8171a31bce6bc5206f86c4322362e&limit=1",
      {
        headers: {
          accept: "*/*",
          "x-api-key": "74f316c2-ffb7-58f3-a06d-3d45333fe37c",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    const collection = data.tokens[0].token.collection

    return {
      tokenCount: collection.tokenCount,
      floorPrice: collection.floorAskPrice.amount.decimal,
      floorPriceUsd: collection.floorAskPrice.amount.usd,
    }
  } catch (error) {
    console.error("Error fetching collection stats:", error)
    return {
      tokenCount: 852,
      floorPrice: 0.0189,
      floorPriceUsd: 29.64,
    }
  }
}
