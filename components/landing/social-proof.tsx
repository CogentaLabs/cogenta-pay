"use client"

import type React from "react"
import Badge from "./badge"

function MooveBadge() {
  return (
    <div className="w-8 h-8 rounded-lg bg-[#37322F] flex items-center justify-center text-white font-bold font-mono text-sm shadow-xs">
      M
    </div>
  )
}

function GoogleBadge() {
  return (
    <div className="w-8 h-8 rounded-lg bg-white border border-[#D5D2CD] flex items-center justify-center shadow-xs p-1.5">
      <svg viewBox="0 0 24 24" className="w-5 h-5">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        />
      </svg>
    </div>
  )
}

function CoinbaseBadge() {
  return (
    <div className="w-8 h-8 rounded-lg bg-[#0052FF] flex items-center justify-center shadow-xs p-1">
      <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white">
        <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32ZM11.5 16C11.5 13.5147 13.5147 11.5 16 11.5C18.4853 11.5 20.5 13.5147 20.5 16C20.5 18.4853 18.4853 20.5 16 20.5C13.5147 20.5 11.5 18.4853 11.5 16Z" />
      </svg>
    </div>
  )
}

function ACPBadge() {
  return (
    <div className="w-8 h-8 rounded-lg bg-[#EFECE8] border border-[#D5D2CD] flex items-center justify-center text-[#37322F] font-mono font-bold text-xs shadow-xs">
      ACP
    </div>
  )
}

function ErcBadge() {
  return (
    <div className="w-8 h-8 rounded-lg bg-[#627EEA] flex items-center justify-center shadow-xs p-1">
      <svg viewBox="0 0 32 32" className="w-5 h-5">
        <path d="M16 4L15.86 4.46V20.27L16 20.41L23.41 16.03L16 4Z" fill="#C0CBF6" />
        <path d="M16 4L8.59 16.03L16 20.41V4Z" fill="white" />
        <path d="M16 21.69L15.91 21.8V27.76L16 28.02L23.42 17.31L16 21.69Z" fill="#C0CBF6" />
        <path d="M16 28.02V21.69L8.59 17.31L16 28.02Z" fill="white" />
        <path d="M16 20.41L23.41 16.03L16 12.66V20.41Z" fill="#8197EE" />
        <path d="M8.59 16.03L16 20.41V12.66L8.59 16.03Z" fill="#C0CBF6" />
      </svg>
    </div>
  )
}

function RFCBadge() {
  return (
    <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center text-[#16A34A] font-mono font-bold text-[11px] shadow-xs">
      RFC
    </div>
  )
}

function ElizaBadge() {
  return (
    <div className="w-8 h-8 rounded-lg bg-[#18181B] flex items-center justify-center text-emerald-400 font-mono text-xs font-bold border border-zinc-700 shadow-xs">
      &gt;_
    </div>
  )
}

function LangChainBadge() {
  return (
    <div className="w-8 h-8 rounded-lg bg-[#1C3C3C] flex items-center justify-center text-[#2DD4BF] font-mono text-xs font-bold border border-[#2DD4BF]/30 shadow-xs">
      🦜
    </div>
  )
}

export const standards = [
  { name: "Moove Rails", description: "Cross-Chain Settlement", badge: <MooveBadge /> },
  { name: "Google A2A Protocol", description: "Agent-to-Agent Payment", badge: <GoogleBadge /> },
  { name: "x402 Protocol", description: "Coinbase HTTP 402", badge: <CoinbaseBadge /> },
  { name: "ACP Standard", description: "Agentic Commerce", badge: <ACPBadge /> },
  { name: "ERC-4337", description: "Session Key Mandates", badge: <ErcBadge /> },
  { name: "RFC 9110", description: "HTTP Web Standard", badge: <RFCBadge /> },
  { name: "ElizaOS", description: "Agent Runtime", badge: <ElizaBadge /> },
  { name: "LangChain", description: "Agent Orchestration", badge: <LangChainBadge /> },
]

function DecorativePattern() {
  return (
    <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
        />
      ))}
    </div>
  )
}

export default function SocialProof() {
  return (
    <div className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center">
      <div className="self-stretch px-4 sm:px-6 md:px-24 py-8 sm:py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
        <div className="w-full max-w-[620px] px-4 sm:px-6 py-4 sm:py-5 shadow-[0px_2px_4px_rgba(50,45,43,0.06)] overflow-hidden rounded-lg flex flex-col justify-start items-center gap-3 sm:gap-4 shadow-none">
          <Badge
            icon={
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="3" width="4" height="6" stroke="#37322F" strokeWidth="1" fill="none" />
                <rect x="7" y="1" width="4" height="8" stroke="#37322F" strokeWidth="1" fill="none" />
                <rect x="2" y="4" width="1" height="1" fill="#37322F" />
                <rect x="3.5" y="4" width="1" height="1" fill="#37322F" />
                <rect x="2" y="5.5" width="1" height="1" fill="#37322F" />
                <rect x="3.5" y="5.5" width="1" height="1" fill="#37322F" />
                <rect x="8" y="2" width="1" height="1" fill="#37322F" />
                <rect x="9.5" y="2" width="1" height="1" fill="#37322F" />
                <rect x="8" y="3.5" width="1" height="1" fill="#37322F" />
                <rect x="9.5" y="3.5" width="1" height="1" fill="#37322F" />
                <rect x="8" y="5" width="1" height="1" fill="#37322F" />
                <rect x="9.5" y="5" width="1" height="1" fill="#37322F" />
              </svg>
            }
            text="Interoperability"
          />
          <div className="w-full text-center flex justify-center flex-col text-[#49423D] text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold leading-tight md:leading-[56px] font-sans tracking-tight">
            Built for emerging agentic standards
          </div>
          <div className="self-stretch text-center text-[#605A57] text-sm sm:text-base font-normal leading-relaxed font-sans">
            Engineered for universal compatibility with the open protocols and frameworks powering the machine economy.
          </div>
        </div>
      </div>

      {/* Protocol Standards Grid */}
      <div className="self-stretch border-[rgba(55,50,47,0.12)] flex justify-center items-start border-t border-b-0">
        <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
          {/* Left decorative pattern */}
          <DecorativePattern />
        </div>

        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-0 border-l border-r border-[rgba(55,50,47,0.12)]">
          {standards.map((item, index) => {
            const isMobileFirstColumn = index % 2 === 0
            const isDesktopFirstColumn = index % 4 === 0
            const isDesktopLastColumn = index % 4 === 3
            const isDesktopTopRow = index < 4
            const isDesktopBottomRow = index >= 4

            return (
              <div
                key={index}
                className={`
                  h-24 xs:h-28 sm:h-32 md:h-36 lg:h-40 flex flex-col justify-center items-center gap-1.5 sm:gap-2
                  border-b border-[rgba(227,226,225,0.5)]
                  ${index < 6 ? "sm:border-b-[0.5px]" : "sm:border-b"}
                  ${index >= 6 ? "border-b" : ""}
                  ${isMobileFirstColumn ? "border-r-[0.5px]" : ""}
                  sm:border-r-[0.5px] sm:border-l-0
                  ${isDesktopFirstColumn ? "md:border-l" : "md:border-l-[0.5px]"}
                  ${isDesktopLastColumn ? "md:border-r" : "md:border-r-[0.5px]"}
                  ${isDesktopTopRow ? "md:border-b-[0.5px]" : ""}
                  ${isDesktopBottomRow ? "md:border-t-[0.5px] md:border-b" : ""}
                  border-[#E3E2E1] hover:bg-[rgba(55,50,47,0.02)] transition-colors p-2
                `}
              >
                <div className="flex justify-center items-center shrink-0">
                  {item.badge}
                </div>
                <div className="text-center flex flex-col items-center">
                  <div className="text-[#37322F] text-xs xs:text-sm sm:text-base font-semibold leading-tight font-sans">
                    {item.name}
                  </div>
                  <div className="text-[#847E79] text-[10px] sm:text-[11px] font-sans font-normal hidden sm:block">
                    {item.description}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
          {/* Right decorative pattern */}
          <DecorativePattern />
        </div>
      </div>
    </div>
  )
}
