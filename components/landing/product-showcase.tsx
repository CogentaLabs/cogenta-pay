"use client"

import { useState, useEffect } from "react"

const SHOWCASE_CARDS = [
  {
    id: 0,
    title: "Agent checkout",
    description: "Autonomous agents negotiate HTTP 402 invoices and settle without human clicks.",
    image: "/section-image/checkout.png",
    alt: "Agent checkout flow showing autonomous HTTP 402 negotiation and settlement",
  },
  {
    id: 1,
    title: "Multi-chain settlement",
    description: "Accept payment from 37+ blockchains, settled instantly into merchant USDC via Moove.",
    image: "/section-image/multi-chain.png",
    alt: "Multi-chain settlement via Moove rails across 37+ blockchains",
  },
  {
    id: 2,
    title: "Merchant analytics",
    description: "Track agent traffic, settled volume, and machine commerce conversions in real time.",
    image: "/section-image/analytics.png",
    alt: "Merchant analytics dashboard with live agent volume and transaction metrics",
  },
]

export function FeatureCard({
  title,
  description,
  isActive,
  progress,
  onClick,
}: {
  title: string
  description: string
  isActive: boolean
  progress: number
  onClick: () => void
}) {
  return (
    <div
      className={`w-full md:flex-1 self-stretch px-6 py-5 overflow-hidden flex flex-col justify-start items-start gap-2 cursor-pointer relative border-b md:border-b-0 last:border-b-0 transition-all duration-200 select-none ${
        isActive
          ? "bg-white shadow-[0px_0px_0px_0.75px_#E0DEDB_inset]"
          : "border-l-0 border-r-0 md:border border-[#E0DEDB]/80 hover:bg-[#FAF8F6]"
      }`}
      onClick={onClick}
    >
      {isActive && (
        <div className="absolute top-0 left-0 w-full h-0.5 bg-[rgba(50,45,43,0.08)]">
          <div
            className="h-full bg-[#322D2B] transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="self-stretch flex justify-center flex-col text-[#49423D] text-sm md:text-sm font-semibold leading-6 md:leading-6 font-sans">
        {title}
      </div>
      <div className="self-stretch text-[#605A57] text-[13px] md:text-[13px] font-normal leading-[22px] md:leading-[22px] font-sans">
        {description}
      </div>
    </div>
  )
}

export default function ProductShowcase() {
  const [activeCard, setActiveCard] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setProgress(0)
    const intervalMs = 50 // 50ms * 100 = 5000ms (5 seconds)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveCard((curr) => (curr + 1) % SHOWCASE_CARDS.length)
          return 0
        }
        return prev + 1
      })
    }, intervalMs)

    return () => clearInterval(interval)
  }, [activeCard])

  const handleCardClick = (index: number) => {
    setActiveCard(index)
    setProgress(0)
  }

  return (
    <>
      <div id="products" className="w-full max-w-[960px] lg:w-[960px] pt-2 sm:pt-4 pb-6 sm:pb-8 md:pb-10 px-2 sm:px-4 md:px-6 lg:px-11 flex flex-col justify-center items-center gap-2 relative z-5 my-8 sm:my-12 md:my-16 lg:my-16 mb-0 lg:pb-0 scroll-mt-20">
        <div
          onClick={() => handleCardClick((activeCard + 1) % SHOWCASE_CARDS.length)}
          className="w-full max-w-[960px] lg:w-[960px] h-[220px] sm:h-[320px] md:h-[480px] lg:h-[650px] bg-white shadow-[0px_0px_0px_0.9056603908538818px_rgba(0,0,0,0.08)] overflow-hidden rounded-[6px] sm:rounded-[8px] lg:rounded-[9.06px] flex flex-col justify-start items-start cursor-pointer transition-transform duration-200 active:scale-[0.998]"
          title="Click to cycle next view"
        >
          {/* Dashboard Content */}
          <div className="self-stretch flex-1 flex justify-start items-start w-full h-full">
            {/* Main Content */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="relative w-full h-full overflow-hidden bg-white">
                {SHOWCASE_CARDS.map((card, idx) => (
                  <div
                    key={card.id}
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out ${
                      activeCard === idx
                        ? "opacity-100 scale-100 blur-0 z-10"
                        : "opacity-0 scale-95 blur-sm pointer-events-none z-0"
                    }`}
                  >
                    <img
                      src={card.image}
                      alt={card.alt}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="self-stretch border-t border-[#E0DEDB] border-b border-[#E0DEDB] flex justify-center items-start">
        <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
          {/* Left decorative pattern */}
          <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
              ></div>
            ))}
          </div>
        </div>

        <div className="flex-1 px-0 sm:px-2 md:px-0 flex flex-col md:flex-row justify-center items-stretch gap-0">
          {SHOWCASE_CARDS.map((card, idx) => (
            <FeatureCard
              key={card.id}
              title={card.title}
              description={card.description}
              isActive={activeCard === idx}
              progress={activeCard === idx ? progress : 0}
              onClick={() => handleCardClick(idx)}
            />
          ))}
        </div>

        <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
          {/* Right decorative pattern */}
          <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
