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

export default function DemoPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0])
  const [quantity, setQuantity] = useState(1)
  const [selectedChain, setSelectedChain] = useState(CHAINS[0].id)
  const [spendLimit, setSpendLimit] = useState(150)
  const [isRunning, setIsRunning] = useState(false)
  const [activeTab, setActiveTab] = useState<"logs" | "payload402" | "receipt">("logs")
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [latest402, setLatest402] = useState<any>(null)
  const [latestReceipt, setLatestReceipt] = useState<any>(null)
  const [stepState, setStepState] = useState<number>(0) // 0: Idle, 1: Catalog, 2: 402 Quote, 3: Mandate Check, 4: Moove Settle, 5: Done

  const totalCost = (selectedProduct.price_usdc * quantity).toFixed(2)

  const addLog = (type: LogEntry["type"], message: string, payload?: any) => {
    const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false })
    setLogs((prev) => [...prev, { timestamp, type, message, payload }])
  }

  const runSimulation = async () => {
    if (isRunning) return
    setIsRunning(true)
    setLogs([])
    setLatest402(null)
    setLatestReceipt(null)
    setStepState(1)

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
      addLog("info", `[Mandate Engine] Evaluating spending policy (Total: $${costNum} USDC vs Session Cap: $${spendLimit} USDC)...`)

      if (costNum > spendLimit) {
        addLog(
          "error",
          `[POLICY REFUSAL] Transaction blocked! Order amount ($${costNum}) exceeds human mandate limit ($${spendLimit}). Execution halted safely.`
        )
        setIsRunning(false)
        setStepState(0)
        return
      }

      addLog("success", `[Mandate Approved] $${costNum} USDC is within authorized spend cap of $${spendLimit} USDC. Proceeding to settle...`)
      setStepState(4)
      await new Promise((r) => setTimeout(r, 800))

      // Step 4: Settle on Moove Rails Non-Interactively
      addLog("info", `[Moove Solver] Signing transaction from agent wallet via ${selectedChain.toUpperCase()} liquidity bridge...`)
      addLog("info", `[Settlement] Converting source asset into guaranteed merchant USDC at zero slippage...`)

      const verifyRes = await fetch("/api/verify-settlement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: checkoutData.order_id,
          amount_paid_usdc: checkoutData.amount_due_usdc,
          source_chain: selectedChain,
          agent_signature: checkoutData.signature,
        }),
      })

      const verifyData = await verifyRes.json()
      setLatestReceipt(verifyData)

      await new Promise((r) => setTimeout(r, 600))
      setStepState(5)
      addLog("success", `< HTTP/1.1 200 OK | Settlement Confirmed on Moove! Latency: ${verifyData.settlement.latency_ms}ms`)
      addLog("code", `[Receipt Hash] ${verifyData.settlement.tx_hash}`)
      addLog("success", `[Fulfillment] Order finalized for @cogentalabs. Token: ${verifyData.fulfillment.release_token}`)
    } catch (err: any) {
      addLog("error", `Simulation Error: ${err.message}`)
    } finally {
      setIsRunning(false)
    }
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
            <span className="font-semibold text-[#37322F] font-mono">@cogentalabs</span>
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
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                        isSelected
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
                        className={`px-2 py-2 rounded-lg border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                          selectedChain === chain.id
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
                <div className="flex flex-col gap-1.5 bg-[#FAF9F7] p-3.5 rounded-xl border border-[#EBE8E3]">
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
                  <span className="text-[10px] text-[#847E79] font-sans">
                    Agent will block any quote above this cap before signing Moove transaction.
                  </span>
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
                    onClick={runSimulation}
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
                    className={`text-[11px] font-mono py-1 px-2 rounded text-center border transition-all ${
                      st.active
                        ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-400 font-semibold"
                        : "bg-zinc-900 border-zinc-800 text-zinc-600"
                    }`}
                  >
                    {st.label}
                  </div>
                ))}
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-4 text-xs font-mono border-b border-zinc-800">
                <button
                  onClick={() => setActiveTab("logs")}
                  className={`pb-2 border-b-2 transition-all ${
                    activeTab === "logs"
                      ? "border-emerald-400 text-emerald-400 font-semibold"
                      : "border-transparent text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Live Logs ({logs.length})
                </button>
                <button
                  onClick={() => setActiveTab("payload402")}
                  className={`pb-2 border-b-2 transition-all ${
                    activeTab === "payload402"
                      ? "border-emerald-400 text-emerald-400 font-semibold"
                      : "border-transparent text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  HTTP 402 Payload {latest402 ? "✓" : ""}
                </button>
                <button
                  onClick={() => setActiveTab("receipt")}
                  className={`pb-2 border-b-2 transition-all ${
                    activeTab === "receipt"
                      ? "border-emerald-400 text-emerald-400 font-semibold"
                      : "border-transparent text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Settlement Receipt {latestReceipt ? "✓" : ""}
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
                      <pre className="text-cyan-300 text-[11px] overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(latest402, null, 2)}
                      </pre>
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
              </div>

              {/* Terminal Footer Status Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-center text-[11px] text-zinc-500 font-mono pt-1 gap-2">
                <span className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      stepState === 5 ? "bg-emerald-400" : isRunning ? "bg-amber-400 animate-ping" : "bg-zinc-600"
                    }`}
                  ></span>
                  Status: {stepState === 5 ? "Completed" : isRunning ? "Processing Agent Negotiation..." : "Idle"}
                </span>
                <span>Moove Rails (Non-Custodial) • Zero Human Clicks</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
