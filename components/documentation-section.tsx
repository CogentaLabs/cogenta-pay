"use client"

import { useState, useEffect } from "react"
import type React from "react"

// Badge component for consistency
function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="px-[14px] py-[6px] bg-white shadow-[0px_0px_0px_4px_rgba(55,50,47,0.05)] overflow-hidden rounded-[90px] flex justify-start items-center gap-[8px] border border-[rgba(2,6,23,0.08)] shadow-xs">
      <div className="w-[14px] h-[14px] relative overflow-hidden flex items-center justify-center">{icon}</div>
      <div className="text-center flex justify-center flex-col text-[#37322F] text-xs font-medium leading-3 font-sans">
        {text}
      </div>
    </div>
  )
}

export default function DocumentationSection() {
  const [activeCard, setActiveCard] = useState(0)
  const [animationKey, setAnimationKey] = useState(0)

  const cards = [
    {
      title: "Machine-readable catalogs",
      description: "Stores expose standardized JSON endpoints so\nAI agents discover items and pricing directly.",
    },
    {
      title: "Multi-chain settlement",
      description: "Accept stablecoins from 37+ chains, settled\ninstantly into merchant USDC via Moove.",
    },
    {
      title: "Agentic payment with x402",
      description: "Respond to requests with HTTP 402, negotiate a\nprice, and settle programmatically over the wire.",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % cards.length)
      setAnimationKey((prev) => prev + 1)
    }, 6000)

    return () => clearInterval(interval)
  }, [cards.length])

  const handleCardClick = (index: number) => {
    setActiveCard(index)
    setAnimationKey((prev) => prev + 1)
  }

  return (
    <div id="protocol" className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center scroll-mt-20">
      {/* Header Section */}
      <div className="self-stretch px-6 md:px-24 py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
        <div className="w-full max-w-[586px] px-6 py-5 shadow-[0px_2px_4px_rgba(50,45,43,0.06)] overflow-hidden rounded-lg flex flex-col justify-start items-center gap-4 shadow-none">
          <Badge
            icon={
              <div className="w-[10.50px] h-[10.50px] outline outline-[1.17px] outline-[#37322F] outline-offset-[-0.58px] rounded-full"></div>
            }
            text="Autonomous Rails"
          />
          <div className="self-stretch text-center flex justify-center flex-col text-[#49423D] text-3xl md:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
            How agents interact and settle
          </div>
          <div className="self-stretch text-center text-[#605A57] text-base font-normal leading-7 font-sans">
            Machine catalogs, multi-chain liquidity aggregation, and HTTP 402 protocols —
            <br />
            one unified architecture built from the ground up for software that shops.
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="self-stretch px-4 md:px-9 overflow-hidden flex justify-start items-center">
        <div className="flex-1 py-8 md:py-11 flex flex-col md:flex-row justify-start items-center gap-6 md:gap-12">
          {/* Left Column - Feature Cards */}
          <div className="w-full md:w-auto md:max-w-[400px] flex flex-col justify-center items-center gap-4 order-2 md:order-1">
            {cards.map((card, index) => {
              const isActive = index === activeCard

              return (
                <div
                  key={index}
                  onClick={() => handleCardClick(index)}
                  className={`w-full overflow-hidden flex flex-col justify-start items-start transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-white shadow-[0px_0px_0px_0.75px_#E0DEDB_inset]"
                      : "border border-[rgba(2,6,23,0.08)] hover:bg-[rgba(55,50,47,0.02)]"
                  }`}
                >
                  <div
                    className={`w-full h-0.5 bg-[rgba(50,45,43,0.08)] overflow-hidden ${isActive ? "opacity-100" : "opacity-0"}`}
                  >
                    <div
                      key={animationKey}
                      className="h-0.5 bg-[#322D2B] animate-[progressBar_6s_linear_forwards] will-change-transform"
                    />
                  </div>
                  <div className="px-6 py-5 w-full flex flex-col gap-2">
                    <div className="self-stretch flex justify-center flex-col text-[#49423D] text-sm font-semibold leading-6 font-sans">
                      {card.title}
                    </div>
                    <div className="self-stretch text-[#605A57] text-[13px] font-normal leading-[22px] font-sans whitespace-pre-line">
                      {card.description}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Column - Dedicated Visual Display (Tailored per Capability) */}
          <div className="w-full md:w-auto rounded-lg flex flex-col justify-center items-center gap-2 order-1 md:order-2 md:px-0 px-0">
            <div className="w-full md:w-[580px] h-[320px] sm:h-[360px] md:h-[420px] bg-[#FAFAF9] shadow-[0px_0px_0px_0.9056603908538818px_rgba(0,0,0,0.08)] overflow-hidden rounded-xl flex flex-col justify-center items-center relative border border-[rgba(55,50,47,0.06)]">
              
              {/* Visual 0: Machine-Readable Catalog & Session Mandate Inspector */}
              <div
                className={`absolute inset-0 p-6 md:p-8 flex flex-col justify-between items-center transition-all duration-500 ease-in-out ${
                  activeCard === 0 ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-95 blur-sm pointer-events-none"
                }`}
              >
                {/* Catalog Card Preview */}
                <div className="w-full max-w-[440px] rounded-xl p-5 bg-[#18181B] text-zinc-300 shadow-md border border-zinc-800 flex flex-col justify-between font-mono text-xs">
                  <div className="flex justify-between items-center pb-2.5 border-b border-zinc-800">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span>/.well-known/agent-catalog.json</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Machine Endpoint</span>
                  </div>

                  <div className="py-3 space-y-1 text-[11px] leading-relaxed">
                    <div className="text-zinc-500">// Machine-readable product spec</div>
                    <div><span className="text-blue-400">&quot;sku&quot;</span>: <span className="text-amber-300">&quot;cloud-gpu-instance-h100&quot;</span>,</div>
                    <div><span className="text-blue-400">&quot;price&quot;</span>: <span className="text-emerald-400">&quot;4.50 USDC&quot;</span>,</div>
                    <div><span className="text-blue-400">&quot;settlement&quot;</span>: <span className="text-amber-300">&quot;moove-cross-chain-rails&quot;</span></div>
                  </div>

                  <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-[10px] text-zinc-400">
                    <span>Zero HTML scraping</span>
                    <span className="text-emerald-400 font-semibold">Live Machine Quote</span>
                  </div>
                </div>

                {/* Session Mandate Policy Spec Box */}
                <div className="w-full max-w-[440px] bg-white border border-[#E0DEDB] rounded-xl p-3.5 shadow-sm flex justify-between items-center text-xs">
                  <div className="flex flex-col">
                    <span className="text-[#37322F] font-semibold font-sans">Session Mandate: 0x8fB9...3a91</span>
                    <span className="text-[11px] text-[#605A57] font-sans">Bounded spend limit: $50.00 max • Ephemeral ERC-4337</span>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full font-medium text-[11px] font-sans">
                    Machine Signed
                  </span>
                </div>
              </div>

              {/* Visual 1: Agentic Payment with Crypto (Moove Multi-chain Settlement) */}
              <div
                className={`absolute inset-0 p-6 md:p-8 flex flex-col justify-between items-center transition-all duration-500 ease-in-out ${
                  activeCard === 1 ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-95 blur-sm pointer-events-none"
                }`}
              >
                {/* Source Chains Row */}
                <div className="w-full max-w-[440px] flex flex-col gap-2">
                  <div className="text-[11px] font-medium text-[#605A57] uppercase tracking-wider text-center font-sans">
                    Inbound Agent Liquidity (37+ Blockchains)
                  </div>
                  <div className="flex justify-center items-center gap-2 flex-wrap">
                    {[
                      { name: "Base", icon: "https://cdn.simpleicons.org/coinbase/0052FF" },
                      { name: "Solana", icon: "https://cdn.simpleicons.org/solana/14F195" },
                      { name: "Ethereum", icon: "https://cdn.simpleicons.org/ethereum/3C3C3D" },
                      { name: "Arbitrum", icon: "https://cdn.simpleicons.org/arbitrum/28A0F0" },
                      { name: "Polygon", icon: "https://cdn.simpleicons.org/polygon/7B3FE4" },
                    ].map((chain, i) => (
                      <div
                        key={i}
                        className="px-2.5 py-1.5 bg-white border border-[#E0DEDB] rounded-full flex items-center gap-1.5 shadow-xs text-xs font-medium text-[#37322F]"
                      >
                        <img src={chain.icon} alt={chain.name} className="w-3.5 h-3.5 object-contain" />
                        <span>{chain.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Central Moove Solver Bridge */}
                <div className="w-full max-w-[440px] p-4 bg-white border border-[#E0DEDB] rounded-xl shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#37322F] flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-lg font-mono">M</span>
                    </div>
                    <div className="flex flex-col text-left">
                      <div className="text-xs font-semibold text-[#37322F] font-sans">Moove Liquidity Engine</div>
                      <div className="text-[11px] text-[#605A57] font-sans">Non-custodial cross-chain solver & aggregator</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-medium px-2 py-1 bg-[#F7F5F3] border border-[rgba(55,50,47,0.1)] rounded text-[#37322F]">
                    ~850ms finality
                  </span>
                </div>

                {/* Settlement Outcome Card */}
                <div className="w-full max-w-[440px] p-4 bg-[#F2F8F4] border border-[#BDE0C7] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <img src="https://cdn.simpleicons.org/usdc/2775CA" alt="USDC" className="w-4 h-4 object-contain" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-semibold text-[#1D6C3E] font-sans">Merchant Guaranteed Settlement</span>
                      <span className="text-[11px] text-[#2E8540] font-sans">Auto-converted to 100% USDC • Zero slippage</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold text-[#1D6C3E] font-mono">+185.00 USDC</div>
                    <div className="text-[10px] text-[#2E8540] font-sans">Settled on-chain</div>
                  </div>
                </div>
              </div>

              {/* Visual 2: Agentic Payment with x402 (HTTP 402 Wire Protocol) */}
              <div
                className={`absolute inset-0 p-5 sm:p-6 md:p-7 flex flex-col justify-between transition-all duration-500 ease-in-out ${
                  activeCard === 2 ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-95 blur-sm pointer-events-none"
                }`}
              >
                {/* Terminal Window Mockup */}
                <div className="w-full h-full bg-[#18181B] rounded-xl shadow-lg border border-zinc-800 flex flex-col overflow-hidden font-mono text-left">
                  {/* Terminal Header */}
                  <div className="px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></div>
                    </div>
                    <div className="text-[11px] text-zinc-400 font-sans font-medium">
                      HTTP 402 Autonomous Machine Handshake
                    </div>
                    <div className="w-8"></div>
                  </div>

                  {/* Terminal Content */}
                  <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between text-[11px] sm:text-[12px] leading-relaxed text-zinc-300 overflow-y-auto">
                    <div className="space-y-1.5">
                      <div className="text-zinc-500"># 1. Agent requests paywalled API / storefront item</div>
                      <div className="text-blue-400">&gt; GET /api/v1/resource/compute-quote HTTP/1.1</div>
                      
                      <div className="text-zinc-500 pt-1"># 2. Server responds with native HTTP 402 Payment Required</div>
                      <div className="text-amber-400">&lt; HTTP/1.1 402 Payment Required</div>
                      <div className="text-zinc-400 pl-3">&lt; X-402-Invoice: inv_0x8f19e2...</div>
                      <div className="text-zinc-400 pl-3">&lt; X-402-Price: 0.25 USDC (Moove Rail)</div>

                      <div className="text-zinc-500 pt-1"># 3. Agent programmatically signs &amp; settles invoice</div>
                      <div className="text-blue-400">&gt; POST /api/v1/settle/inv_0x8f19e2</div>
                      <div className="text-zinc-400 pl-3">&gt; Authorization: Moove-Sig 0x9c44...</div>

                      <div className="text-emerald-400 font-semibold pt-1">&lt; HTTP/1.1 200 OK (Settlement Finalized)</div>
                    </div>

                    <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[10px] sm:text-[11px] text-zinc-400">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        RFC 9110 Compliant
                      </span>
                      <span>Zero human interaction needed</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progressBar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0%);
          }
        }
      `}</style>
    </div>
  )
}
