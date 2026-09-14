/**
 * CogentaPay Client SDK
 * Autonomous agent client for discovering machine catalogs, negotiating HTTP 402 quotes,
 * and settling transactions non-custodially via Moove rails.
 */

export interface CatalogStore {
  name: string
  domain: string
  moove_handle: string
  settlement_asset: string
  settlement_rails: string
}

export interface ProductSku {
  id: string
  sku: string
  title: string
  description: string
  price_usdc: string
  inventory_status: string
  stock_quantity: number
  requires_shipping: boolean
  supported_source_chains: string[]
}

export interface AgentCatalogResponse {
  version: string
  store: CatalogStore
  protocols_supported: string[]
  endpoints: {
    catalog: string
    quote: string
    settle: string
    receipt: string
  }
  products: ProductSku[]
}

export interface CheckoutQuoteResponse {
  status: "payment_required"
  protocol: "coinbase-x402" | "google-ap2" | "openai-acp"
  order_id: string
  currency: string
  amount_due_usdc: string
  settlement_recipient: string
  expires_at: number
  signature: string
  moove_rail: {
    payment_link: string
    moove_recipient: string
    settlement_mode: string
    accepted_source_chains: string[]
  }
  item: {
    product_id: string
    quantity: number
  }
}

export interface SettlementReceipt {
  status: "settled"
  order_id: string
  merchant: {
    handle: string
    settled_vault: string
  }
  settlement: {
    currency: string
    amount_settled: string
    source_chain: string
    tx_hash: string
    block_number: number
    latency_ms: number
  }
  fulfillment: {
    instant_access: boolean
    release_token: string
    download_url?: string
  }
}

export interface SpendingMandate {
  maxAmountPerTransaction: number
  maxDailySpend?: number
  allowedChains?: string[]
}

export class CogentaPayClient {
  private baseUrl: string

  constructor(baseUrl: string = "https://pay.cogentalabs.com") {
    this.baseUrl = baseUrl.replace(/\/$/, "")
  }

  /**
   * Fetch machine-readable storefront catalog
   */
  async getCatalog(): Promise<AgentCatalogResponse> {
    const res = await fetch(`${this.baseUrl}/api/agent-catalog`)
    if (!res.ok) {
      throw new Error(`Failed to fetch catalog: ${res.status} ${res.statusText}`)
    }
    return res.json()
  }

  /**
   * Submit order intent and negotiate HTTP 402 Payment Required quote
   */
  async requestQuote(params: {
    productId: string
    quantity: number
    sourceChain: string
    agentId?: string
  }): Promise<CheckoutQuoteResponse> {
    const res = await fetch(`${this.baseUrl}/api/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: params.productId,
        quantity: params.quantity,
        source_chain: params.sourceChain,
        agent_id: params.agentId || "agent_client_sdk",
      }),
    })

    const data = await res.json()
    if (res.status !== 402 && res.status !== 200) {
      throw new Error(`Checkout negotiation failed: ${res.status} ${JSON.stringify(data)}`)
    }
    return data
  }

  /**
   * Validate quote against human spending mandate
   */
  validateMandate(quote: CheckoutQuoteResponse, mandate: SpendingMandate): { approved: boolean; reason?: string } {
    const amount = parseFloat(quote.amount_due_usdc)
    if (amount > mandate.maxAmountPerTransaction) {
      return {
        approved: false,
        reason: `Quote amount ($${amount} USDC) exceeds max spend mandate cap ($${mandate.maxAmountPerTransaction} USDC)`,
      }
    }
    return { approved: true }
  }

  /**
   * Settle order non-custodially via Moove rails and obtain cryptographic receipt
   */
  async settleOrder(params: {
    orderId: string
    amountPaidUsdc: string
    sourceChain: string
    agentSignature: string
  }): Promise<SettlementReceipt> {
    const res = await fetch(`${this.baseUrl}/api/verify-settlement`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_id: params.orderId,
        amount_paid_usdc: params.amountPaidUsdc,
        source_chain: params.sourceChain,
        agent_signature: params.agentSignature,
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(`Settlement verification failed: ${res.status} ${JSON.stringify(err)}`)
    }

    return res.json()
  }
}
