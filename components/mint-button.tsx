"use client"
import CustomButton from "@/components/custom-button"
import { useMediaQuery } from "@/hooks/use-media-query"

interface MintButtonProps {
  onClick: () => void
}

export default function MintButton({ onClick }: MintButtonProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const buttonWidth = isMobile ? "w-[150px]" : "w-[180px]"

  return (
    <div onClick={onClick} className="cursor-pointer">
      <CustomButton variant="mint" className={buttonWidth}>
        minT a bEE
      </CustomButton>
    </div>
  )
}
