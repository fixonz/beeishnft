"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import WhitelistChecker from "@/components/whitelist-checker"
import CustomButton from "@/components/custom-button"
import ForestBackground from "@/components/forest-background"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useAccount } from "wagmi"
import { ConnectKitButton } from "connectkit"
import { checkWhitelistedAddress } from "@/lib/whitelist-service"

export default function WhitelistCheckPage() {
  const [isWhitelisted, setIsWhitelisted] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const { isConnected, address } = useAccount()
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Font family based on device
  const fontFamily = isMobile
    ? "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif"
    : "'Super Lobster', cursive, sans-serif"

  useEffect(() => {
    const checkWalletStatus = async () => {
      if (isConnected && address) {
        setIsChecking(true);
        try {
          const result = await checkWhitelistedAddress(address);
          setIsWhitelisted(result);
        } catch (err) {
          console.error("Error checking whitelist:", err);
        } finally {
          setIsChecking(false);
        }
      } else {
        setIsWhitelisted(null);
      }
    };

    checkWalletStatus();
  }, [isConnected, address]);

  return (
    <main className="relative min-h-screen overflow-x-hidden" style={{ fontFamily }}>
      {/* Forest Background */}
      <ForestBackground />

      {/* Content Container */}
      <div className="relative z-10">
        {/* Header with wallet connection */}
        <header className="fixed top-0 left-0 right-0 h-[10vh] bg-[#FFB949] z-20 flex items-center justify-between px-2 md:px-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-12 w-12 md:h-16 md:w-16 transform hover:rotate-12 transition-transform">
                <Image
                  src="/images/bee-mascot.png"
                  alt="Bee Mascot"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <ConnectKitButton.Custom>
              {({ isConnected, show, truncatedAddress, ensName }) => (
                <CustomButton
                  variant={isConnected ? "blank" : "connect"}
                  className="w-auto min-w-[120px] md:min-w-[160px] px-4"
                  onClick={show}
                >
                  {isConnected ? (ensName ?? truncatedAddress) : "Connect Wallet"}
                </CustomButton>
              )}
            </ConnectKitButton.Custom>
          </div>
        </header>

        {/* Main Content */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-[15vh] pb-[10vh]">
          <div className="w-full max-w-4xl mx-auto bg-[#FEE8B7] p-6 md:p-10 rounded-2xl border-4 border-[#3A1F16] shadow-xl">
            <div className="mb-6 flex items-center">
              <Link href="/" className="flex items-center gap-2 text-[#3A1F16] hover:text-amber-600 transition-colors">
                <ArrowLeft size={20} />
                <span className="font-medium">Back to Home</span>
              </Link>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-primary text-center">BEEISH Whitelist Check</h1>

            <div className="mb-8 text-center">
              <p className="text-lg text-[#3A1F16] mb-4">
                Check if your wallet address is on the BEEISH NFT whitelist
              </p>
              {isConnected && (
                <div className="bg-[#FFB949] p-4 rounded-lg border-2 border-[#3A1F16] inline-block">
                  <p className="font-bold text-[#3A1F16]">
                    Your wallet: {address?.slice(0, 6)}...{address?.slice(-4)}
                  </p>
                  {isChecking ? (
                    <p className="text-[#3A1F16] mt-2">Checking whitelist status...</p>
                  ) : (
                    isWhitelisted !== null && (
                      <p className={`font-bold mt-2 ${isWhitelisted ? 'text-green-700' : 'text-red-700'}`}>
                        {isWhitelisted
                          ? '✅ Your wallet is whitelisted!'
                          : '❌ Your wallet is not on the whitelist'}
                      </p>
                    )
                  )}
                </div>
              )}
            </div>

            <WhitelistChecker />

            <div className="mt-8 text-center">
              <p className="text-sm text-[#3A1F16] mb-2">
                If you believe your address should be on the whitelist, please contact us
              </p>
              <p className="text-xs text-[#3A1F16] opacity-75">
                © {new Date().getFullYear()} BEEISH NFT Collection
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
} 