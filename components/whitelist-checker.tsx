"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import CustomButton from "@/components/custom-button"
import { checkWhitelistedAddress } from "@/lib/whitelist-service"

export default function WhitelistChecker() {
  const [address, setAddress] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [isWhitelisted, setIsWhitelisted] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCheck = async () => {
    if (!address) {
      setError("Please enter an Ethereum address")
      return
    }

    setIsChecking(true)
    setError(null)

    try {
      const result = await checkWhitelistedAddress(address)
      setIsWhitelisted(result)
    } catch (err) {
      console.error("Error checking whitelist:", err)
      setError("Failed to check whitelist status")
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-[#FFB949] border-4 border-[#3A1F16] rounded-xl">
      <h2 className="text-xl font-bold text-primary mb-4">Whitelist Checker</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-dark font-medium mb-1">Enter Ethereum Address</label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0x..."
            className="border-[#3A1F16] bg-bee-light-yellow"
          />
        </div>

        {error && (
          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
            <div className="flex items-start">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
              <p className="text-red-800 font-medium text-sm">{error}</p>
            </div>
          </div>
        )}

        {isWhitelisted !== null && !error && (
          <div className={`p-3 rounded-lg border ${isWhitelisted ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-start">
              {isWhitelisted ? (
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
              )}
              <p className={`font-medium text-sm ${isWhitelisted ? 'text-green-800' : 'text-red-800'}`}>
                {isWhitelisted ? 'Address is whitelisted!' : 'Address is not on the whitelist'}
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <div onClick={handleCheck} className={`cursor-pointer ${isChecking ? 'opacity-70' : ''}`}>
            {isChecking ? (
              <div className="flex items-center justify-center w-[120px] h-10 bg-[#FFB949] border-4 border-[#3A1F16] rounded-full">
                <Loader2 className="h-5 w-5 animate-spin text-[#3A1F16]" />
              </div>
            ) : (
              <CustomButton variant="mint" className="w-[120px]">
                Check
              </CustomButton>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 