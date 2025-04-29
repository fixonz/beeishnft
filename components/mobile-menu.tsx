"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { MenuIcon } from "lucide-react"
import { ConnectKitButton } from "connectkit"
import TwitterButton from "./twitter-button"
import CustomButton from "./custom-button"
import Link from "next/link"

interface MobileMenuProps {
  onPhotoBoothClickAction: () => void
  onFreeABeeClick: () => void
}

export default function MobileMenu({ onPhotoBoothClickAction, onFreeABeeClick }: MobileMenuProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <MenuIcon className="h-6 w-6 text-[#3A1F16]" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-[#FFB949] border-l-4 border-[#3A1F16] w-[280px]">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-primary mb-6 custom-button-text">Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 items-center">
          <ConnectKitButton.Custom>
            {({ isConnected, show, truncatedAddress, ensName }: {
              isConnected?: boolean;
              show?: () => void;
              truncatedAddress?: string;
              ensName?: string;
            }) => {
              return (
                <CustomButton
                  variant={isConnected ? "blank" : "connect"}
                  className="w-full px-4"
                  onClick={show}
                >
                  {isConnected ? (ensName ?? truncatedAddress) : "Connect Wallet"}
                </CustomButton>
              );
            }}
          </ConnectKitButton.Custom>
          <div className="w-full">
            <CustomButton variant="photoBooth" className="w-full" onClick={onPhotoBoothClickAction}>
              Photo booth
            </CustomButton>
          </div>
          <div className="w-full">
            <CustomButton variant="mint" className="w-full" onClick={onFreeABeeClick}>
              free-A-BeE
            </CustomButton>
          </div>
          <Link href="/whitelist-check" className="w-full">
            <CustomButton variant="blank" className="w-full">
              Whitelist Check
            </CustomButton>
          </Link>
          <div className="w-full opacity-50">
            <CustomButton variant="blank" className="w-full" disabled>
              Hive (Soon)
            </CustomButton>
          </div>
          <div className="w-full opacity-50">
            <CustomButton variant="blank" className="w-full" disabled>
              BeE-Dega (Soon)
            </CustomButton>
          </div>
          <div className="mt-4">
            <TwitterButton />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
