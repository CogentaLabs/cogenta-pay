import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const PRODUCTS: Record<string, { title: string; price: number; stock: number }> = {
  prod_h100_gpu: { title: "On-Demand H100 GPU Cluster (1 Hour)", price: 3.85, stock: 128 },
  prod_agent_key: { title: "Autonomous Agent HSM Security Key", price: 89.0, stock: 42 },
  prod_data_oracle: { title: "Real-Time Financial Oracle Stream", price: 15.0, stock: 999 },
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { product_id, quantity = 1, source_chain = "base", agent_id = "agent_session_402" } = body

    if (!product_id || !PRODUCTS[product_id]) {
      return NextResponse.json(
        { error: "invalid_product_id", message: "Product not found in agent catalog" },
        { status: 400 }
      )
    }

    const item = PRODUCTS[product_id]
    const qty = Math.max(1, Number(quantity))
    const totalUsdc = (item.price * qty).toFixed(2)

    // Generate unique machine order identifier and dynamic Moove link token
    const orderId = `ord_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`
    const mooveDynamicToken = `dyn_cgt_${Math.random().toString(36).substring(2, 10)}`
    const moovePaymentLink = `https://pay.moove.xyz/pay/${mooveDynamicToken}?to=@cogentalabs&amount=${totalUsdc}&asset=USDC`

    const expiryTimestamp = Math.floor(Date.now() / 1000) + 15 * 60 // 15-minute lock

    const responsePayload = {
      status: "payment_required",
      protocol: "coinbase-x402",
      order_id: orderId,
      product: {
        id: product_id,
        title: item.title,
        quantity: qty,
        unit_price_usdc: item.price.toFixed(2),
      },
      amount_due_usdc: totalUsdc,
      settlement_asset: "USDC",
      settlement_recipient: "@cogentalabs",
      moove_rail: {
        provider: "moove.xyz",
        payment_link: moovePaymentLink,
        supported_source_chains: ["base", "solana", "ethereum", "polygon", "arbitrum"],
        selected_source_chain: source_chain,
        settlement_mode: "non_custodial_instant_usdc",
      },
      expires_at: expiryTimestamp,
      idempotency_key: `idemp_${orderId}`,
      signature: `0x${Buffer.from(`${orderId}:${totalUsdc}:${expiryTimestamp}`).toString("hex").substring(0, 40)}`,
      instructions: "Agent must sign transaction against moove_rail and submit proof to /api/verify-settlement",
    }

    return NextResponse.json(responsePayload, {
      status: 402, // HTTP 402 Payment Required
      headers: {
        "X-Payment-Protocol": 'x402; version="1.0"',
        "X-Moove-Recipient": "@cogentalabs",
        "X-402-Amount": totalUsdc,
        "X-402-Currency": "USDC",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Agent-Signature",
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: "malformed_request", message: err?.message || "Invalid payload" }, { status: 400 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Agent-Signature",
    },
  })
}
