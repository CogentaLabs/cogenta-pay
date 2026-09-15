"use client"

import type React from "react"
import Badge from "./badge"

function DecorativePattern() {
  return (
    <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
      {Array.from({ length: 200 }).map((_, i) => (
        <div
          key={i}
          className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
        />
      ))}
    </div>
  )
}

function BentoHeader() {
  return (
    <div className="self-stretch px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] py-8 sm:py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
      <div className="w-full max-w-[616px] lg:w-[616px] px-4 sm:px-6 py-4 sm:py-5 shadow-[0px_2px_4px_rgba(50,45,43,0.06)] overflow-hidden rounded-lg flex flex-col justify-start items-center gap-3 sm:gap-4 shadow-none">
        <Badge
          icon={
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
              <rect x="7" y="1" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
              <rect x="1" y="7" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
              <rect x="7" y="7" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
            </svg>
          }
          text="Why agents fail today"
        />
        <div className="w-full max-w-[598.06px] lg:w-[598.06px] text-center flex justify-center flex-col text-[#49423D] text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
          Traditional checkouts were built for human clicks
        </div>
        <div className="self-stretch text-center text-[#605A57] text-sm sm:text-base font-normal leading-6 sm:leading-7 font-sans">
          When an autonomous AI shopping agent arrives at a store,
          <br />
          the existing fintech stack treats it as a cyber attack.
        </div>
      </div>
    </div>
  )
}

export default function BentoGrid() {
  const chains = [
    { name: "Base", color: "#0052FF", letter: "B" },
    { name: "Solana", color: "#14F195", letter: "S" },
    { name: "Ethereum", color: "#627EEA", letter: "Ξ" },
    { name: "Polygon", color: "#8247E5", letter: "P" },
    { name: "Arbitrum", color: "#28A0F0", letter: "A" },
    { name: "Optimism", color: "#FF0420", letter: "O" },
  ]

  return (
    <div className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center">
      {/* Header Section */}
      <BentoHeader />

      {/* Bento Grid Content */}
      <div className="self-stretch flex justify-center items-start">
        <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
          {/* Left decorative pattern */}
          <DecorativePattern />
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 border-l border-r border-[rgba(55,50,47,0.12)]">
          {/* Top Left - Non-interactive settlement */}
          <div className="border-b border-r-0 md:border-r border-[rgba(55,50,47,0.12)] p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-between items-start gap-4 sm:gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-[#37322F] text-lg sm:text-xl font-semibold leading-tight font-sans">
                Non-interactive settlement
              </h3>
              <p className="text-[#605A57] text-sm font-normal leading-relaxed font-sans">
                No CAPTCHAs, SMS OTPs, or 3D Secure. Agents sign bounded spend mandates with ephemeral session
                keys and settle programmatically.
              </p>
            </div>
            <div className="w-full h-[220px] sm:h-[250px] rounded-xl flex items-center justify-center overflow-hidden bg-[#FAFAF9] border border-[rgba(55,50,47,0.08)] p-4 shadow-xs">
              <div className="flex flex-col gap-2.5 w-full max-w-[360px]">
                <div className="flex justify-between items-center bg-white px-3.5 py-2.5 rounded-lg shadow-xs border border-[#E0DEDB]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span className="text-xs font-mono font-medium text-[#37322F]">HTTP 402</span>
                  </div>
                  <span className="text-[11px] font-mono bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                    Payment Required
                  </span>
                </div>

                <div className="flex justify-between items-center bg-white px-3.5 py-2.5 rounded-lg shadow-xs border border-[#E0DEDB]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span className="text-xs font-mono font-medium text-[#37322F]">Sign Mandate</span>
                  </div>
                  <span className="text-[11px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                    0x8f...3a9 (Auth OK)
                  </span>
                </div>

                <div className="flex justify-between items-center bg-white px-3.5 py-2.5 rounded-lg shadow-xs border border-[#BDE0C7]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-mono font-medium text-[#1D6C3E]">Execute Settlement</span>
                  </div>
                  <span className="text-[11px] font-mono bg-emerald-50 text-[#1D6C3E] px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                    Settled • 0 Clicks
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Right - A machine-readable catalog */}
          <div className="border-b border-[rgba(55,50,47,0.12)] p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-between items-start gap-4 sm:gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-[#37322F] font-semibold leading-tight font-sans text-lg sm:text-xl">
                A machine-readable catalog
              </h3>
              <p className="text-[#605A57] text-sm font-normal leading-relaxed font-sans">
                A standardized agent-catalog.json endpoint exposes products, live inventory, and quote
                endpoints in clean JSON — no HTML parsing.
              </p>
            </div>
            <div className="w-full h-[220px] sm:h-[250px] rounded-xl flex overflow-hidden items-center justify-center bg-[#18181B] border border-zinc-800 shadow-md">
              <div className="text-left w-full h-full p-4 overflow-hidden font-mono">
                <div className="text-[10px] text-zinc-500 mb-1">// GET /.well-known/agent-catalog.json</div>
                <pre className="text-[11px] text-[#D4D4D4] leading-relaxed overflow-x-auto">
{`{
  "protocol": "cogenta-catalog-v1",
  "name": "Cloud Compute API",
  "endpoint": "/v1/order/quote",
  "price": { "amount": "12.00", "currency": "USDC" },
  "settlement": "moove-cross-chain-rail",
  "supported_chains": [1, 8453, 137, 42161]
}`}
                </pre>
              </div>
            </div>
          </div>

          {/* Bottom Left - One rail, 37+ chains (Rich Multi-Chain Liquidity Map) */}
          <div className="border-r-0 md:border-r border-[rgba(55,50,47,0.12)] p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-between items-start gap-4 sm:gap-6 bg-transparent">
            <div className="flex flex-col gap-2">
              <h3 className="text-[#37322F] text-lg sm:text-xl font-semibold leading-tight font-sans">
                One rail, 37+ chains
              </h3>
              <p className="text-[#605A57] text-sm font-normal leading-relaxed font-sans">
                Multi-chain liquidity aggregation powered by Moove. Agents pay in any supported asset;
                merchants receive guaranteed USDC.
              </p>
            </div>

            <div className="w-full h-[220px] sm:h-[250px] rounded-xl flex flex-col justify-between overflow-hidden relative bg-white border border-[#E0DEDB] shadow-xs p-4 sm:p-5">
              {/* Inbound Chains Grid */}
              <div className="flex flex-col gap-1.5">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#847E79] flex justify-between">
                  <span>Inbound Agent Chains (37+)</span>
                  <span className="text-[#605A57] font-mono">Cross-Chain Solver</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {chains.map((c, i) => (
                    <div
                      key={i}
                      className="px-2 py-1 bg-[#FBF9F8] border border-[#E0DEDB] rounded flex items-center justify-center gap-1 text-[11px] font-mono font-medium text-[#37322F]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color }}></span>
                      <span>{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Central Moove Solver Bridge Graphic */}
              <div className="flex items-center justify-between p-3 bg-[#F7F5F3] border border-[rgba(55,50,47,0.1)] rounded-xl my-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#37322F] flex items-center justify-center text-white font-bold font-mono text-sm shadow-sm">
                    M
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#37322F] font-sans">Moove Liquidity Engine</span>
                    <span className="text-[10px] text-[#605A57] font-sans">Non-custodial cross-chain solver</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono font-bold text-[#1D6C3E] bg-[#E8F5E9] px-2 py-0.5 rounded border border-[#C8E6C9]">
                    ~850ms finality
                  </span>
                </div>
              </div>

              {/* Guaranteed Merchant Output */}
              <div className="flex items-center justify-between px-3 py-2 bg-[#F2F8F4] border border-[#BDE0C7] rounded-lg text-xs">
                <span className="text-[#1D6C3E] font-medium font-sans flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Merchant Guaranteed Settlement
                </span>
                <span className="font-mono font-bold text-[#1D6C3E]">100% USDC</span>
              </div>
            </div>
          </div>

          {/* Bottom Right - Verifiable trust & receipts (High Fidelity Cryptographic Inspector) */}
          <div className="p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-between items-start gap-4 sm:gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-[#37322F] text-lg sm:text-xl font-semibold leading-tight font-sans">
                Verifiable trust & receipts
              </h3>
              <p className="text-[#605A57] text-sm font-normal leading-relaxed font-sans">
                Every transaction produces a cryptographic receipt, so both merchant and agent hold provable,
                on-chain proof of settlement.
              </p>
            </div>

            <div className="w-full h-[220px] sm:h-[250px] rounded-xl flex flex-col justify-between overflow-hidden bg-white border border-[#E0DEDB] shadow-xs p-4 sm:p-5 font-mono text-xs">
              {/* Receipt Header */}
              <div className="flex justify-between items-center pb-2 border-b border-[#E0DEDB]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="font-semibold text-[#37322F]">RECEIPT #0x4a9f2...8b1c</span>
                </div>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                  Verified On-Chain
                </span>
              </div>

              {/* Receipt Details */}
              <div className="space-y-1.5 text-[11px] text-[#605A57] py-1">
                <div className="flex justify-between">
                  <span>Settlement Rail:</span>
                  <span className="font-medium text-[#37322F]">Moove Cross-Chain USDC</span>
                </div>
                <div className="flex justify-between">
                  <span>Spend Mandate:</span>
                  <span className="font-medium text-[#37322F]">MND-8402-AUTH (Session Key)</span>
                </div>
                <div className="flex justify-between">
                  <span>Merchant Net:</span>
                  <span className="font-bold text-[#1D6C3E]">+142.50 USDC</span>
                </div>
                <div className="flex justify-between">
                  <span>Block Hash:</span>
                  <span className="text-[#847E79]">0x9e3f...a28c (Finalized)</span>
                </div>
              </div>

              {/* Zero Chargeback Badge */}
              <div className="pt-2 border-t border-[#E0DEDB] flex items-center justify-between text-[11px]">
                <span className="text-[#37322F] font-sans font-medium">Non-Reversible Machine Settlement</span>
                <span className="text-emerald-700 font-semibold font-sans">0% Chargeback Risk</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
          {/* Right decorative pattern */}
          <DecorativePattern />
        </div>
      </div>
    </div>
  )
}
