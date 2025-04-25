import Link from "next/link"
import Image from "next/image"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function TwitterButton() {
  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <Link
      href="https://x.com/BeeishNFT"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center"
    >
      <div className="relative" style={{ width: isMobile ? "40px" : "48px", height: isMobile ? "40px" : "48px" }}>
        <Image
          src="/images/x-button.png"
          alt="Follow BEEISH on X (Twitter)"
          width={48}
          height={48}
          className="w-full h-full"
        />
      </div>
      <span className="sr-only">Follow BEEISH on X (Twitter)</span>
    </Link>
  )
}
