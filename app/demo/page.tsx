"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"

interface Product {
  id: string
  sku: string
  title: string
  description: string
  price_usdc: number
  stock: number
  requires_shipping: boolean
  badge: string
}

const PRODUCTS: Product[] = [
  {
    id: "prod_h100_gpu",
    sku: "COMPUTE-H100-1HR",
    title: "On-Demand H100 GPU Cluster (1 Hour)",
    description: "Direct autonomous compute allocation with instant API token release upon settlement.",
    price_usdc: 3.85,
    stock: 128,
    requires_shipping: false,
    badge: "Instant API Access",
  },
  {
    id: "prod_agent_key",
    sku: "HW-SEC-ENCLAVE",
    title: "Autonomous Agent HSM Security Key",
    description: "Hardware enclave for delegated session key signing and human mandate spend isolation.",
    price_usdc: 89.0,
    stock: 42,
    requires_shipping: true,
    badge: "Hardware Delivery",
  },
  {
    id: "prod_data_oracle",
    sku: "DATA-FIN-STREAM",
    title: "Real-Time Financial Oracle Stream",
    description: "Sub-millisecond market feed access for algorithmic trading agents.",
    price_usdc: 15.0,
    stock: 999,
    requires_shipping: false,
    badge: "WebSocket Stream",
  },
]

const CHAINS = [
  { id: "base", name: "Base", icon: "https://cdn.simpleicons.org/coinbase/0052FF", fee: "~$0.002" },
  { id: "solana", name: "Solana", icon: "https://cdn.simpleicons.org/solana/14F195", fee: "~$0.001" },
  { id: "ethereum", name: "Ethereum", icon: "https://cdn.simpleicons.org/ethereum/3C3C3D", fee: "~$0.85" },
  { id: "arbitrum", name: "Arbitrum", icon: "https://cdn.simpleicons.org/arbitrum/28A0F0", fee: "~$0.01" },
  { id: "polygon", name: "Polygon", icon: "https://cdn.simpleicons.org/polygon/7B3FE4", fee: "~$0.005" },
]

interface LogEntry {
  timestamp: string
  type: "info" | "warn" | "success" | "error" | "code"
  message: string
  payload?: any
}

interface LedgerEntry {
  orderId: string
  buyerAgent: string
  itemTitle: string
  sourceChain: string
  amountUsdc: string
  mooveProof: string
  timestamp: string
  status: "SETTLED"
}

const INITIAL_LEDGER: LedgerEntry[] = [
  {
    orderId: "ord_a7f9_x102",
    buyerAgent: "agent_elizaos_402",
    itemTitle: "On-Demand H100 GPU Cluster (1 Hour)",
    sourceChain: "base",
    amountUsdc: "3.85",
    mooveProof: "0x8fa1b49e2a384b...71c2",
    timestamp: "2 mins ago",
    status: "SETTLED",
  },
  {
    orderId: "ord_b4e2_m991",
    buyerAgent: "agent_langchain_sol",
    itemTitle: "Real-Time Financial Oracle Stream",
    sourceChain: "solana",
    amountUsdc: "15.00",
    mooveProof: "0x39dc44a1e9b27f...0fa8",
    timestamp: "11 mins ago",
    status: "SETTLED",
  },
]

export default function DemoPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0])
  const [quantity, setQuantity] = useState(1)
  const [selectedChain, setSelectedChain] = useState(CHAINS[0].id)
  const [spendLimit, setSpendLimit] = useState(150)
  const [isRunning, setIsRunning] = useState(false)
  const [activeTab, setActiveTab] = useState<"logs" | "payload402" | "receipt" | "moove_http" | "curl">("logs")
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [latest402, setLatest402] = useState<any>(null)
  const [latestReceipt, setLatestReceipt] = useState<any>(null)
  const [stepState, setStepState] = useState<number>(0) // 0: Idle, 1: Catalog, 2: 402 Quote, 3: Mandate Check, 4: Moove Settle, 5: Done
  const [ledger, setLedger] = useState<LedgerEntry[]>(INITIAL_LEDGER)
  const [copiedCurl, setCopiedCurl] = useState(false)

  const totalCost = (selectedProduct.price_usdc * quantity).toFixed(2)

  const addLog = (type: LogEntry["type"], message: string, payload?: any) => {
    const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false })
    setLogs((prev) => [...prev, { timestamp, type, message, payload }])
  }

  const runSimulation = async (forcedSpendLimit?: number) => {
    if (isRunning) return
    setIsRunning(true)
    setLogs([])
    setLatest402(null)
    setLatestReceipt(null)
    setStepState(1)

    const effectiveLimit = forcedSpendLimit !== undefined ? forcedSpendLimit : spendLimit

    // Step 1: Query Machine Catalog
    addLog("info", `[Agent] Querying machine-readable catalog from /.well-known/agent-catalog.json...`)
    await new Promise((r) => setTimeout(r, 600))

    try {
      const catRes = await fetch("/api/agent-catalog")
      const catalog = await catRes.json()
      addLog("success", `[Discovery] Manifest resolved! Store: "${catalog.store.name}" | Moove Vault: ${catalog.store.moove_handle}`)
      addLog("code", `[Discovery] Selected SKU: ${selectedProduct.sku} (${selectedProduct.title}) - Unit: $${selectedProduct.price_usdc} USDC`)
      setStepState(2)

      // Step 2: Request Quote & Receive HTTP 402
      await new Promise((r) => setTimeout(r, 700))
      addLog("info", `[Negotiation] Submitting order intent for ${quantity}x item(s) on chain: ${selectedChain.toUpperCase()}...`)

      const checkoutRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: selectedProduct.id,
          quantity,
          source_chain: selectedChain,
          agent_id: "agent_elizaos_402",
        }),
      })

      const checkoutData = await checkoutRes.json()
      setLatest402(checkoutData)

      if (checkoutRes.status === 402) {
        addLog("warn", `< HTTP/1.1 402 Payment Required | Order ID: ${checkoutData.order_id}`)
        addLog("code", `[Moove Rail] Dynamic Link: ${checkoutData.moove_rail.payment_link}`)
        addLog("info", `[Price Lock] Amount Due: $${checkoutData.amount_due_usdc} USDC | TTL: 15 minutes`)
      } else {
        throw new Error("Expected HTTP 402 challenge, received status " + checkoutRes.status)
      }

      setStepState(3)
      await new Promise((r) => setTimeout(r, 650))

      // Step 3: Human Spending Mandate Validation
      const costNum = parseFloat(checkoutData.amount_due_usdc)
      addLog("info", `[Mandate Engine] Evaluating spending policy (Total: $${costNum} USDC vs Session Cap: $${effectiveLimit} USDC)...`)

      if (costNum > effectiveLimit) {
        addLog(
          "error",
          `[POLICY REFUSAL] Transaction blocked! Order amount ($${costNum}) exceeds authorized spend cap ($${effectiveLimit}). Execution halted safely.`
        )
        setIsRunning(false)
        setStepState(0)
        return
      }

      addLog("success", `[Mandate Approved] $${costNum} USDC is within authorized spend cap of $${effectiveLimit} USDC. Proceeding to settle...`)
      setStepState(4)
      await new Promise((r) => setTimeout(r, 800))

      // Step 4: Settle on Moove Rails Non-Interactively
      addLog("info", `[Moove Solver] Signing transaction from agent wallet via ${selectedChain.toUpperCase()} liquidity bridge...`)
      addLog("code", `[Moove Receive Agent] Linking order to Moove link ID: ${checkoutData.moove_rail?.payment_link_id || "pl_default"}`)
      addLog("info", `[Settlement] Converting source asset into guaranteed merchant USDC at zero slippage...`)

      const verifyRes = await fetch("/api/verify-settlement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: checkoutData.order_id,
          amount_paid_usdc: checkoutData.amount_due_usdc,
          source_chain: selectedChain,
          agent_signature: checkoutData.signature,
          moove_link_id: checkoutData.moove_rail?.payment_link_id,
        }),
      })

      const verifyData = await verifyRes.json()
      setLatestReceipt(verifyData)

      await new Promise((r) => setTimeout(r, 600))
      setStepState(5)
      addLog("success", `< HTTP/1.1 200 OK | Settlement Confirmed on Moove! Latency: ${verifyData.settlement.latency_ms}ms`)
      if (verifyData.moove_verified_live) {
        addLog("success", `[Moove Live] Verified on-chain through live Moove Receive Agent endpoint!`)
      }
      addLog("code", `[Receipt Hash] ${verifyData.settlement.tx_hash}`)
      addLog("success", `[Fulfillment] Order finalized for @cogentapay. Token: ${verifyData.fulfillment.release_token}`)

      // Update Merchant Ledger
      setLedger((prev) => [
        {
          orderId: checkoutData.order_id,
          buyerAgent: "agent_elizaos_402",
          itemTitle: selectedProduct.title,
          sourceChain: selectedChain,
          amountUsdc: checkoutData.amount_due_usdc,
          mooveProof: verifyData.settlement.tx_hash.slice(0, 14) + "..." + verifyData.settlement.tx_hash.slice(-4),
          timestamp: "Just now",
          status: "SETTLED",
        },
        ...prev,
      ])
    } catch (err: any) {
      addLog("error", `Simulation Error: ${err.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  const sampleCurl = `curl -i -X POST https://pay.cogentalabs.com/api/checkout \\
  -H "Content-Type: application/json" \\
  -d '{"product_id":"${selectedProduct.id}","quantity":${quantity},"source_chain":"${selectedChain}"}'`

  const copyCurlToClipboard = () => {
    navigator.clipboard.writeText(sampleCurl)
    setCopiedCurl(true)
    setTimeout(() => setCopiedCurl(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#F7F5F3] text-[#37322F] flex flex-col items-center">
      {/* Top Navigation */}
      <header className="w-full max-w-[1280px] px-4 sm:px-8 py-4 flex justify-between items-center border-b border-[rgba(55,50,47,0.1)]">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-[#37322F] font-sans hover:opacity-80 transition-opacity">
              CogentaPay
            </span>
            <span className="text-[10px] text-[rgba(55,50,47,0.6)] font-sans">by Cogenta Labs</span>
          </Link>
          <span className="text-gray-300">/</span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white border border-[#E0DEDB] text-[#37322F] shadow-xs">
            Interactive Agent Simulator
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/.well-known/agent-catalog.json"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-[#605A57] hover:text-[#37322F] underline hidden sm:inline"
          >
            /.well-known/agent-catalog.json
          </a>
          <a
            href="/openapi.json"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-[#605A57] hover:text-[#37322F] underline hidden md:inline"
          >
            /openapi.json
          </a>
          <Link
            href="/"
            className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white hover:bg-[#F2F0ED] border border-[#E0DEDB] text-[#37322F] transition-colors"
          >
            ← Back to Overview
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-[1280px] px-4 sm:px-8 py-8 flex-1 flex flex-col gap-8">
        {/* Banner */}
        <div className="w-full bg-white border border-[#E0DEDB] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h1 className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-[#37322F]">
                Autonomous Agent Commerce Simulator
              </h1>
            </div>
            <p className="text-sm text-[#605A57] font-sans max-w-[680px]">
              Test real machine-to-machine checkout: The agent parses the standard catalog, negotiates an HTTP 402 invoice, checks human spending limits, and settles via Moove non-custodial rails without human clicks.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#FBF9F8] border border-[#E0DEDB] px-3.5 py-2 rounded-xl text-xs font-sans">
            <span className="text-[#847E79]">Merchant Settlement:</span>
            <span className="font-semibold text-[#37322F] font-mono">@cogentapay</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">100% USDC</span>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Storefront & SKU Configuration (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white border border-[#E0DEDB] rounded-2xl p-6 shadow-xs flex flex-col gap-5">
              <div className="flex justify-between items-center border-b border-[#F0EEEB] pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#847E79] font-sans">
                  1. Select Storefront SKU
                </span>
                <span className="text-[11px] text-[#605A57] font-mono">Catalog: 3 SKUs</span>
              </div>

              {/* Product List */}
              <div className="flex flex-col gap-3">
                {PRODUCTS.map((prod) => {
                  const isSelected = selectedProduct.id === prod.id
                  return (
                    <div
                      key={prod.id}
                      onClick={() => !isRunning && setSelectedProduct(prod)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${isSelected
                        ? "bg-[#FAF8F5] border-[#37322F] shadow-sm ring-1 ring-[#37322F]"
                        : "border-[#E0DEDB] hover:bg-[#FAF9F7]"
                        }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-sm font-bold font-sans text-[#37322F] leading-tight">
                          {prod.title}
                        </span>
                        <span className="text-sm font-bold font-mono text-[#37322F] whitespace-nowrap">
                          ${prod.price_usdc.toFixed(2)} USDC
                        </span>
                      </div>
                      <p className="text-xs text-[#605A57] font-sans line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>
                      <div className="flex justify-between items-center pt-2 mt-1 border-t border-[rgba(55,50,47,0.06)] text-[11px]">
                        <span className="font-mono text-[#847E79]">{prod.sku}</span>
                        <span className="px-2 py-0.5 rounded-full bg-white border border-[#E0DEDB] text-[#37322F] font-medium">
                          {prod.badge}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Quantity & Spend Policy Controls */}
              <div className="border-t border-[#F0EEEB] pt-4 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-[#37322F] font-sans">Quantity</label>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={quantity <= 1 || isRunning}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-7 h-7 rounded-lg bg-[#F5F3EF] hover:bg-[#EBE7E1] disabled:opacity-40 flex items-center justify-center font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-mono font-bold text-sm">{quantity}</span>
                    <button
                      disabled={isRunning}
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-7 h-7 rounded-lg bg-[#F5F3EF] hover:bg-[#EBE7E1] disabled:opacity-40 flex items-center justify-center font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Source Chain Selector */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[#37322F] font-sans flex justify-between">
                    <span>Agent Source Chain (Moove Inbound)</span>
                    <span className="text-[#847E79] font-normal">37+ chains supported</span>
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                    {CHAINS.map((chain) => (
                      <button
                        key={chain.id}
                        type="button"
                        disabled={isRunning}
                        onClick={() => setSelectedChain(chain.id)}
                        className={`px-2 py-2 rounded-lg border text-xs font-medium flex flex-col items-center gap-1 transition-all ${selectedChain === chain.id
                          ? "bg-[#37322F] text-white border-[#37322F] shadow-xs"
                          : "bg-white text-[#605A57] border-[#E0DEDB] hover:bg-[#F8F6F4]"
                          }`}
                      >
                        <img
                          src={chain.icon}
                          alt={chain.name}
                          className={`w-4 h-4 object-contain ${selectedChain === chain.id ? "brightness-0 invert" : ""}`}
                        />
                        <span className="text-[11px] leading-none">{chain.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Human Mandate Limit Slider */}
                <div className="flex flex-col gap-2 bg-[#FAF9F7] p-3.5 rounded-xl border border-[#EBE8E3]">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[#37322F] font-sans">Human Spending Mandate Cap</span>
                    <span className="font-mono font-bold text-[#37322F]">${spendLimit}.00 USDC</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    step="10"
                    value={spendLimit}
                    disabled={isRunning}
                    onChange={(e) => setSpendLimit(Number(e.target.value))}
                    className="w-full accent-[#37322F] cursor-pointer"
                  />
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[10px] text-[#847E79] font-sans">
                      Enforces cryptographic stop-loss limit.
                    </span>
                    <button
                      type="button"
                      disabled={isRunning}
                      onClick={() => runSimulation(1.0)}
                      className="text-[10px] font-mono text-amber-700 hover:text-amber-800 underline cursor-pointer"
                    >
                      ⚡ Test Policy Refusal ($1.00 Cap)
                    </button>
                  </div>
                </div>

                {/* Total Summary */}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-[#605A57] font-sans">Order Total:</span>
                  <span className="text-xl font-mono font-bold text-[#37322F]">${totalCost} USDC</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Autonomous Agent Console & Telemetry (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-[#18181B] text-zinc-200 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col gap-4">
              {/* Terminal Title Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
                  </div>
                  <span className="text-xs font-mono font-medium text-zinc-400 pl-2">
                    agent-runtime://session_402.ts
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => runSimulation()}
                    disabled={isRunning}
                    className="px-5 py-2 rounded-full text-xs font-bold font-sans bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRunning ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full border-2 border-zinc-950 border-t-transparent animate-spin"></span>
                        Executing...
                      </>
                    ) : (
                      <>
                        <span>▶</span>
                        Run Autonomous Agent Checkout
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Progress Stepper Indicator */}
              <div className="grid grid-cols-4 gap-2 pt-1 pb-2">
                {[
                  { label: "1. Discover", active: stepState >= 1 },
                  { label: "2. HTTP 402", active: stepState >= 2 },
                  { label: "3. Mandate", active: stepState >= 3 },
                  { label: "4. Settle", active: stepState >= 4 },
                ].map((st, i) => (
                  <div
                    key={i}
                    className={`text-[11px] font-mono py-1 px-2 rounded text-center border transition-all ${st.active
                      ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-400 font-semibold"
                      : "bg-zinc-900 border-zinc-800 text-zinc-600"
                      }`}
                  >
                    {st.label}
                  </div>
                ))}
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-3 text-xs font-mono border-b border-zinc-800 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("logs")}
                  className={`pb-2 border-b-2 transition-all whitespace-nowrap ${activeTab === "logs"
                    ? "border-emerald-400 text-emerald-400 font-semibold"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                    }`}
                >
                  Live Logs ({logs.length})
                </button>
                <button
                  onClick={() => setActiveTab("payload402")}
                  className={`pb-2 border-b-2 transition-all whitespace-nowrap ${activeTab === "payload402"
                    ? "border-emerald-400 text-emerald-400 font-semibold"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                    }`}
                >
                  HTTP 402 Payload {latest402 ? "✓" : ""}
                </button>
                <button
                  onClick={() => setActiveTab("receipt")}
                  className={`pb-2 border-b-2 transition-all whitespace-nowrap ${activeTab === "receipt"
                    ? "border-emerald-400 text-emerald-400 font-semibold"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                    }`}
                >
                  Settlement Receipt {latestReceipt ? "✓" : ""}
                </button>
                <button
                  onClick={() => setActiveTab("moove_http")}
                  className={`pb-2 border-b-2 transition-all whitespace-nowrap ${activeTab === "moove_http"
                    ? "border-emerald-400 text-emerald-400 font-semibold"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                    }`}
                >
                  Moove Receive Agent (HTTP)
                </button>
                <button
                  onClick={() => setActiveTab("curl")}
                  className={`pb-2 border-b-2 transition-all whitespace-nowrap ${activeTab === "curl"
                    ? "border-emerald-400 text-emerald-400 font-semibold"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                    }`}
                >
                  cURL / API Test
                </button>
              </div>

              {/* Terminal Viewport */}
              <div className="h-[360px] sm:h-[420px] bg-zinc-950/80 rounded-xl p-4 overflow-y-auto font-mono text-xs leading-relaxed border border-zinc-900">
                {activeTab === "logs" && (
                  <div className="flex flex-col gap-2">
                    {logs.length === 0 ? (
                      <div className="text-zinc-600 h-full flex flex-col items-center justify-center pt-24 text-center">
                        <p className="text-zinc-500 mb-1">Agent is waiting for instructions.</p>
                        <p className="text-[11px] text-zinc-600">
                          Click &quot;Run Autonomous Agent Checkout&quot; to begin the 4-step negotiation.
                        </p>
                      </div>
                    ) : (
                      logs.map((log, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-zinc-600 text-[10px] select-none">{log.timestamp}</span>
                          <span
                            className={
                              log.type === "success"
                                ? "text-emerald-400"
                                : log.type === "warn"
                                  ? "text-amber-400"
                                  : log.type === "error"
                                    ? "text-red-400 font-bold"
                                    : log.type === "code"
                                      ? "text-cyan-300 pl-2 border-l border-zinc-800"
                                      : "text-zinc-300"
                            }
                          >
                            {log.message}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === "payload402" && (
                  <div>
                    {latest402 ? (
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                          <span className="text-xs text-zinc-400">HTTP/1.1 402 Payment Required</span>
                          {latest402.moove_rail?.payment_link && (
                            <a
                              href={latest402.moove_rail.payment_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-emerald-400 hover:text-emerald-300 underline"
                            >
                              Open Moove Pay Link ↗
                            </a>
                          )}
                        </div>
                        <pre className="text-cyan-300 text-[11px] overflow-x-auto whitespace-pre-wrap">
                          {JSON.stringify(latest402, null, 2)}
                        </pre>
                      </div>
                    ) : (
                      <p className="text-zinc-600 pt-20 text-center">No HTTP 402 challenge recorded yet.</p>
                    )}
                  </div>
                )}

                {activeTab === "receipt" && (
                  <div>
                    {latestReceipt ? (
                      <pre className="text-emerald-300 text-[11px] overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(latestReceipt, null, 2)}
                      </pre>
                    ) : (
                      <p className="text-zinc-600 pt-20 text-center">No completed settlement receipt yet.</p>
                    )}
                  </div>
                )}

                {activeTab === "moove_http" && (
                  <div className="flex flex-col gap-4">
                    <div className="bg-amber-950/40 border border-amber-800/50 p-3.5 rounded-lg flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-xs">
                        <span>⚡</span>
                        <span>Moove Receive Agent Specification (Plain HTTP)</span>
                      </div>
                      <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                        Per Moove docs (<a href="https://docs.moove.xyz/sdks/introduction" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline font-mono">docs.moove.xyz/sdks/introduction</a>): There is no npm package yet. The API is plain HTTP and works from any language. CogentaPay implements the official Moove Receive Agent endpoints:
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-zinc-300 font-bold">1. POST $MOOVE_API_BASE_URL/v1/payment-link</span>
                        <span className="text-[10px] text-zinc-500">Create one-off hosted link</span>
                      </div>
                      <pre className="text-cyan-300 bg-zinc-900/90 p-3 rounded-lg border border-zinc-800 text-[11px] overflow-x-auto whitespace-pre-wrap">
{`curl -sS -X POST "https://api.moove.xyz/v1/payment-link" \\
  -H "X-API-Key: $MOOVE_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
        "toAmount": "${totalCost}",
        "description": "${latest402?.order_id || 'ord_agent_session'}",
        "maxUsage": 1,
        "expirationDate": null
      }'`}
                      </pre>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-zinc-300 font-bold">2. GET $MOOVE_API_BASE_URL/v1/payment-link/$LINK_ID</span>
                        <span className="text-[10px] text-zinc-500">Poll payment settlement</span>
                      </div>
                      <pre className="text-emerald-300 bg-zinc-900/90 p-3 rounded-lg border border-zinc-800 text-[11px] overflow-x-auto whitespace-pre-wrap">
{`curl -sS "https://api.moove.xyz/v1/payment-link/${latest402?.moove_rail?.payment_link_id || '$LINK_ID'}" \\
  -H "X-API-Key: $MOOVE_API_KEY"`}
                      </pre>
                    </div>

                    {latest402?.moove_rail && (
                      <div className="bg-zinc-900/80 border border-zinc-800 p-3 rounded-lg flex flex-col gap-1 text-[11px]">
                        <div className="text-zinc-400 font-sans">Active Moove Link for Current Session:</div>
                        <div className="text-emerald-400 font-mono break-all">{latest402.moove_rail.payment_link}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">Link ID: {latest402.moove_rail.payment_link_id} | Live Moove: {latest402.moove_rail.is_live_moove ? "YES" : "SANDBOX/SIMULATED"}</div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "curl" && (
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-zinc-400 font-sans">
                        Test this live API endpoint in your terminal:
                      </span>
                      <button
                        onClick={copyCurlToClipboard}
                        className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] flex items-center gap-1.5 transition-colors"
                      >
                        <span>{copiedCurl ? "✓ Copied!" : "📋 Copy cURL"}</span>
                      </button>
                    </div>

                    <pre className="text-amber-300 bg-zinc-900/90 p-3 rounded-lg border border-zinc-800 text-[11px] overflow-x-auto whitespace-pre-wrap">
                      {sampleCurl}
                    </pre>

                    <div className="flex flex-col gap-2 pt-2 border-t border-zinc-800">
                      <span className="text-[11px] text-zinc-400">Step 2 Settlement Verification Command:</span>
                      <pre className="text-emerald-300 bg-zinc-900/90 p-3 rounded-lg border border-zinc-800 text-[11px] overflow-x-auto whitespace-pre-wrap">
{`curl -i -X POST https://pay.cogentalabs.com/api/verify-settlement \\
  -H "Content-Type: application/json" \\
  -d '{"order_id":"ord_demo_test","amount_paid_usdc":"${totalCost}","source_chain":"${selectedChain}","agent_signature":"0x706179"}'`}
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              {/* Terminal Footer Status Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-center text-[11px] text-zinc-500 font-mono pt-1 gap-2">
                <span className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${stepState === 5 ? "bg-emerald-400" : isRunning ? "bg-amber-400 animate-ping" : "bg-zinc-600"
                      }`}
                  ></span>
                  Status: {stepState === 5 ? "Completed" : isRunning ? "Processing Agent Negotiation..." : "Idle"}
                </span>
                <span>Moove Rails (Non-Custodial) • Zero Human Clicks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Merchant Settlement Ledger Section */}
        <div className="w-full bg-white border border-[#E0DEDB] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0EEEB] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              <h2 className="text-base sm:text-lg font-bold font-sans text-[#37322F]">
                Merchant Settlement Ledger (@cogentapay USDC Vault)
              </h2>
            </div>
            <span className="text-xs text-[#847E79] font-mono">
              Live Inbound Stream • Moove Cross-Chain Rails
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-[#F0EEEB] text-[#847E79] font-mono text-[11px]">
                  <th className="py-2.5 px-3 font-semibold">Time</th>
                  <th className="py-2.5 px-3 font-semibold">Order ID</th>
                  <th className="py-2.5 px-3 font-semibold">Buyer Agent</th>
                  <th className="py-2.5 px-3 font-semibold">Item Purchased</th>
                  <th className="py-2.5 px-3 font-semibold">Inbound Chain</th>
                  <th className="py-2.5 px-3 font-semibold">Net Settled</th>
                  <th className="py-2.5 px-3 font-semibold">Moove Tx Proof</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F6F4F1] font-mono text-[11px]">
                {ledger.map((item, i) => (
                  <tr key={i} className="hover:bg-[#FAF9F7] transition-colors">
                    <td className="py-3 px-3 text-[#847E79]">{item.timestamp}</td>
                    <td className="py-3 px-3 font-bold text-[#37322F]">{item.orderId}</td>
                    <td className="py-3 px-3 text-[#605A57]">{item.buyerAgent}</td>
                    <td className="py-3 px-3 font-sans text-[#37322F] font-medium max-w-[200px] truncate">
                      {item.itemTitle}
                    </td>
                    <td className="py-3 px-3">
                      <span className="uppercase px-2 py-0.5 rounded bg-[#F2F0ED] text-[#37322F] text-[10px] font-semibold">
                        {item.sourceChain}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-700">${item.amountUsdc} USDC</td>
                    <td className="py-3 px-3 text-cyan-800 underline cursor-pointer">{item.mooveProof}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
