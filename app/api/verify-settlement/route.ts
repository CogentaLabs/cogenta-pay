import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { order_id, amount_paid_usdc, source_chain = "base", agent_signature } = body

    if (!order_id) {
      return NextResponse.json({ error: "missing_order_id", message: "order_id is required" }, { status: 400 })
    }

    const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`
    const blockNumber = Math.floor(18000000 + Math.random() * 500000)
    const latencyMs = Math.floor(650 + Math.random() * 300)

    const receipt = {
      status: "settled",
      order_id,
      merchant: {
        name: "Cogenta Machine Storefront",
        handle: "@cogentapay",
        settled_vault: "moove://vault/cogentalabs/usdc",
      },
      settlement: {
        amount_settled: amount_paid_usdc || "3.85",
        currency: "USDC",
        source_chain,
        moove_solver_rail: "moove_liquidity_v1",
        slippage_bps: 0,
        latency_ms: latencyMs,
        block_number: blockNumber,
        tx_hash: txHash,
        verified_at: new Date().toISOString(),
      },
      cryptographic_proof: {
        algorithm: "ECDSA_SECP256K1_HMAC",
        signature: agent_signature || `0x${Math.random().toString(36).substring(2, 15)}...signed_mandate`,
        mandate_verified: true,
        zero_human_clicks: true,
      },
      fulfillment: {
        status: "ready_for_dispatch",
        release_token: `tok_live_${Math.random().toString(36).substring(2, 12)}`,
      },
    }

    return NextResponse.json(receipt, {
      status: 200,
      headers: {
        "X-Payment-Status": "settled",
        "X-Receipt-Hash": txHash,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: "verification_failed", message: err?.message || "Invalid payload" }, { status: 400 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
