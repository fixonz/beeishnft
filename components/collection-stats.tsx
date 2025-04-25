import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { CollectionStats } from "@/lib/api"

interface StatsCardProps {
  stats: CollectionStats
}

export default function StatsCard({ stats }: StatsCardProps) {
  return (
    <Card className="bg-[#FFB949] border-4 border-[#3A1F16] backdrop-blur-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl text-primary">Collection Stats</CardTitle>
        <CardDescription className="text-solid-white">BEEISH on Abstract Chain Network</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-solid-white">Total Supply</span>
            <span className="text-2xl font-bold text-primary">{stats.tokenCount}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-solid-white">Floor Price</span>
            <span className="text-2xl font-bold text-primary">{stats.floorPrice} ETH</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-solid-white">USD Value</span>
            <span className="text-2xl font-bold text-primary">${stats.floorPriceUsd.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
