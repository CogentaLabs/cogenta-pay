"use client"

import { useState } from "react"
import Badge from "./landing/badge"

const CODE_SNIPPETS = {
  agent: {
    language: "typescript",
    title: "AI Agent Client (ElizaOS / LangChain / Node)",
    filename: "agent-checkout.ts",
    code: `import { CogentaAgentClient } from "@cogenta/agent-sdk";

// 1. Initialize autonomous agent with ephemeral session key
const agent = new CogentaAgentClient({
  privateKey: process.env.AGENT_SESSION_KEY,
  preferredAsset: "SOL", // Agent can pay in SOL, ETH, ARB, etc.
  spendLimitUsdc: 50.00
});

// 2. Query machine catalog & negotiate HTTP 402 quote
const quote = await agent.getQuote("https://store.brand.com/agent-catalog.json", {
  sku: "compute-instance-v2",
  quantity: 1
});

// 3. Execute non-interactive settlement via Moove cross-chain solver
const receipt = await agent.settle402(quote);
console.log("Settled on Moove rails. Receipt:", receipt.txHash);
// Output: Guaranteed merchant settlement: 12.00 USDC in ~850ms`,
  },
  merchant: {
    language: "typescript",
    title: "Storefront Middleware (Next.js / Express / WooCommerce)",
    filename: "middleware.ts",
    code: `import { withCogentaPay } from "@cogenta/pay-middleware";

export default withCogentaPay({
  merchantAddress: "0x8fB92C...3a91", // Merchant receiving USDC
  settlementNetwork: "base",           // Base, Ethereum, Solana, Polygon
  settlementAsset: "USDC",
  mooveApiKey: process.env.MOOVE_API_KEY,
  
  // Auto-exposes RFC 9110 HTTP 402 endpoints & agent-catalog.json
  catalogEndpoint: "/agent-catalog.json",
  webhookUrl: "https://store.brand.com/api/webhooks/cogenta"
});

// Any incoming AI agent request is automatically issued an HTTP 402 invoice,
// routed through Moove solvers, and fulfilled with zero human clicks.`,
  },
  spec: {
    language: "json",
    title: "HTTP 402 Machine Handshake Specification",
    filename: "x402-handshake.json",
    code: `{
  "protocol": "cogenta-x402-v1",
  "status": 402,
  "invoice_id": "inv_0x7e29a9bf4",
  "amount": "24.50",
  "currency": "USDC",
  "settlement": {
    "engine": "moove-cross-chain-solver",
    "accepted_chains": [1, 8453, 137, 42161, 101],
    "recipient": "0x8fB92C7027B9f4a0c8B983361E42a3a91",
    "slippage_tolerance_bps": 0,
    "finality_guarantee": "immediate_merchant_credit"
  },
  "mandate_policy": {
    "max_duration_seconds": 300,
    "3ds_required": false,
    "machine_signature_type": "ERC4337_SESSION_KEY"
  }
}`,
  },
}

export default function ArchitectureSection() {
  const [activeTab, setActiveTab] = useState<"agent" | "merchant" | "spec">("agent")
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(CODE_SNIPPETS[activeTab].code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div id="developers" className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center scroll-mt-20">
      {/* Header Section */}
      <div className="self-stretch px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] py-8 sm:py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
        <div className="w-full max-w-[660px] px-4 sm:px-6 py-4 sm:py-5 shadow-[0px_2px_4px_rgba(50,45,43,0.06)] overflow-hidden rounded-lg flex flex-col justify-start items-center gap-3 sm:gap-4 shadow-none">
          <Badge
            icon={
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 18L22 12L16 6M8 6L2 12L8 18" stroke="#37322F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            text="Architecture & Developer Specs"
          />
          <div className="w-full text-center flex justify-center flex-col text-[#49423D] text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
            Powered by Moove cross-chain settlement rails
          </div>
          <div className="self-stretch text-center text-[#605A57] text-sm sm:text-base font-normal leading-6 sm:leading-7 font-sans">
            Autonomous agents hold funds across diverse chains. CogentaPay leverages Moove&apos;s
            non-custodial solver network to aggregate liquidity and guarantee instant merchant USDC.
          </div>
        </div>
      </div>

      {/* 3-Step Moove Architecture Flow */}
      <div className="self-stretch border-b border-[rgba(55,50,47,0.12)] bg-[#FAFAF9] flex justify-center items-center py-10 px-4 sm:px-6">
        <div className="w-full max-w-[960px] grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Step 1 */}
          <div className="bg-white border border-[#E0DEDB] rounded-xl p-5 flex flex-col justify-between gap-4 shadow-xs">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-[#F7F5F3] border border-[rgba(55,50,47,0.08)] rounded text-[#37322F]">
                Step 01
              </span>
              <span className="text-[11px] text-[#605A57] font-mono">Agent Side</span>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#37322F] mb-1 font-sans">
                HTTP 402 Mandate Execution
              </h4>
              <p className="text-xs text-[#605A57] leading-relaxed font-sans">
                Agent receives machine invoice, authorizes transaction with session key, and initiates multi-chain payment.
              </p>
            </div>
            <div className="pt-3 border-t border-[rgba(55,50,47,0.06)] flex items-center gap-2 text-[11px] text-[#37322F] font-mono">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              37+ Inbound Blockchains
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white border border-[#37322F] rounded-xl p-5 flex flex-col justify-between gap-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full pointer-events-none -mr-8 -mt-8"></div>
            <div className="flex justify-between items-center relative z-10">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-[#37322F] text-white rounded">
                Step 02 • Moove Core
              </span>
              <span className="text-[11px] text-amber-700 font-mono font-semibold">~850ms</span>
            </div>
            <div className="relative z-10">
              <h4 className="text-sm font-semibold text-[#37322F] mb-1 font-sans flex items-center gap-1.5">
                <span>Moove Solver Aggregation</span>
              </h4>
              <p className="text-xs text-[#605A57] leading-relaxed font-sans">
                Non-custodial solver quotes and bridges cross-chain liquidity with zero merchant slippage or escrow risk.
              </p>
            </div>
            <div className="pt-3 border-t border-[rgba(55,50,47,0.06)] flex items-center gap-2 text-[11px] text-[#1D6C3E] font-mono font-medium relative z-10">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Atomic Non-Custodial Fill
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white border border-[#E0DEDB] rounded-xl p-5 flex flex-col justify-between gap-4 shadow-xs">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-[#F7F5F3] border border-[rgba(55,50,47,0.08)] rounded text-[#37322F]">
                Step 03
              </span>
              <span className="text-[11px] text-[#605A57] font-mono">Merchant Side</span>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#37322F] mb-1 font-sans">
                Guaranteed USDC Settlement
              </h4>
              <p className="text-xs text-[#605A57] leading-relaxed font-sans">
                Merchant receives 100% USDC on Base / Solana / Ethereum with cryptographic on-chain receipt and automated order release.
              </p>
            </div>
            <div className="pt-3 border-t border-[rgba(55,50,47,0.06)] flex items-center gap-2 text-[11px] text-[#37322F] font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              100% USDC • Zero Volatility
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Developer Code Sandbox */}
      <div className="self-stretch flex justify-center items-center py-10 sm:py-14 px-4 sm:px-6">
        <div className="w-full max-w-[960px] flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-[#37322F] font-sans">
                Developer Integration Sandbox
              </h3>
              <p className="text-xs sm:text-sm text-[#605A57] font-sans">
                Explore the reference implementation for agents, storefronts, and HTTP 402 protocols.
              </p>
            </div>

            {/* Tab Switches */}
            <div className="flex items-center bg-[#EFECE8] p-1 rounded-lg self-start sm:self-auto">
              <button
                onClick={() => setActiveTab("agent")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === "agent"
                  ? "bg-white text-[#37322F] shadow-xs"
                  : "text-[#605A57] hover:text-[#37322F]"
                  }`}
              >
                AI Agent SDK
              </button>
              <button
                onClick={() => setActiveTab("merchant")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === "merchant"
                  ? "bg-white text-[#37322F] shadow-xs"
                  : "text-[#605A57] hover:text-[#37322F]"
                  }`}
              >
                Storefront Middleware
              </button>
              <button
                onClick={() => setActiveTab("spec")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === "spec"
                  ? "bg-white text-[#37322F] shadow-xs"
                  : "text-[#605A57] hover:text-[#37322F]"
                  }`}
              >
                HTTP 402 Spec
              </button>
            </div>
          </div>

          {/* Code Window */}
          <div className="w-full bg-[#18181B] rounded-xl border border-zinc-800 overflow-hidden shadow-md flex flex-col font-mono">
            {/* Window Header */}
            <div className="px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                </div>
                <span className="text-xs text-zinc-400 pl-2 border-l border-zinc-700">
                  {CODE_SNIPPETS[activeTab].filename}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-zinc-500 hidden sm:inline">
                  {CODE_SNIPPETS[activeTab].title}
                </span>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copied ? (
                    <span className="text-emerald-400">Copied!</span>
                  ) : (
                    <span>Copy code</span>
                  )}
                </button>
              </div>
            </div>

            {/* Code Body */}
            <div className="p-4 sm:p-6 overflow-x-auto text-[12px] sm:text-[13px] leading-relaxed text-zinc-300">
              <pre>
                <code>{CODE_SNIPPETS[activeTab].code}</code>
              </pre>
            </div>

            {/* Window Footer */}
            <div className="px-4 py-2 bg-zinc-900/60 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400 font-sans">
              <span className="flex items-center gap-1.5 text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80"></span>
                Testnet in progress • Moove solver rails
              </span>
              <span className="font-mono text-[10px]">v0.0.1-alpha • MIT License</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
