"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import type { NFTToken } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"
import CustomButton from "@/components/custom-button"
import { useMediaQuery } from "@/hooks/use-media-query"

interface NFTCardProps {
  nft: NFTToken
  onMint: () => void
}

export default function NFTCard({ nft, onMint }: NFTCardProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Font family based on device
  const fontFamily = isMobile
    ? "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif"
    : "'Super Lobster', cursive"

  const mintedDate = nft.mintedAt ? new Date(nft.mintedAt) : null
  const formattedDate = mintedDate ? formatDistanceToNow(mintedDate, { addSuffix: true }) : "Recently"

  const handleButtonClick = () => {
    // If the NFT has a price, it's listed for sale, so we can link to the marketplace
    if (nft.price) {
      // Open the NFT on Magic Eden/Reservoir marketplace
      window.open(
        `https://magiceden.io/item-details/abstract/0xc2d1370017d8171a31bce6bc5206f86c4322362e/${nft.tokenId}`,
        "_blank",
      )
    } else {
      // If not for sale, just show details
      window.open(
        `https://magiceden.io/item-details/abstract/0xc2d1370017d8171a31bce6bc5206f86c4322362e/${nft.tokenId}`,
        "_blank",
      )
    }
  }

  return (
    <Card className="bg-white border-4 border-[#3A1F16] rounded-xl overflow-hidden shadow-xl transition-all hover:shadow-2xl hover:scale-[1.02]">
      <div className="aspect-square bg-amber-100 relative">
        <Image
          src={nft.image || "/placeholder.svg"}
          alt={nft.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardContent className="p-4 bg-white">
        <h3
          className="font-bold text-xl mb-2"
          style={{
            fontFamily,
            color: "#FFB949",
            textShadow:
              "2px 0 0 #3A1F16, -2px 0 0 #3A1F16, 0 2px 0 #3A1F16, 0 -2px 0 #3A1F16, 1px 1px 0 #3A1F16, -1px 1px 0 #3A1F16, 1px -1px 0 #3A1F16, -1px -1px 0 #3A1F16",
          }}
        >
          {nft.name}
        </h3>
        <p
          className="mb-4 text-sm"
          style={{
            fontFamily,
            color: "#3A1F16",
            fontWeight: "500",
          }}
        >
          Minted {formattedDate}
        </p>
        <div className="flex justify-between items-center">
          <span
            className="font-bold"
            style={{
              fontFamily,
              color: "#FFB949",
              textShadow:
                "1px 0 0 #3A1F16, -1px 0 0 #3A1F16, 0 1px 0 #3A1F16, 0 -1px 0 #3A1F16, 0.5px 0.5px 0 #3A1F16, -0.5px 0.5px 0 #3A1F16, 0.5px -0.5px 0 #3A1F16, -0.5px -0.5px 0 #3A1F16",
            }}
          >
            {nft.price
              ? `${nft.price.amount.decimal} ${nft.price.currency.symbol} (${nft.price.amount.usd.toFixed(2)})`
              : "Not for sale"}
          </span>
          <div onClick={handleButtonClick} className="cursor-pointer">
            <CustomButton variant="blank" className="w-[120px] h-10">
              {nft.price ? "Buy" : "View"}
            </CustomButton>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
