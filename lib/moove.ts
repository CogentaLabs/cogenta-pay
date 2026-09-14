/**
 * Moove Agentic Payments Client
 * Adheres strictly to the Moove Receive Agent HTTP standard:
 * https://docs.moove.xyz/sdks/introduction
 * Reference: moove-agentic-payments-skill.md
 *
 * NOTE: There is NO official npm package from moove.xyz. The API is plain HTTP:
 * - POST $MOOVE_API_BASE_URL/v1/payment-link
 * - GET  $MOOVE_API_BASE_URL/v1/payment-link/{id}
 * - GET  $MOOVE_API_BASE_URL/v1/payment-link?status=completed
 */

export interface CreatePaymentLinkParams {
  /**
   * Decimal string, e.g. "49.99" or "3.85". NEVER a float number.
   */
  toAmount: string
  /**
   * Internal reference number (e.g. order ID) that travels with the link into Moove dashboard
   */
  description: string
  /**
   * 1 for one-off checkout link. Omit or null for uncapped usage.
   */
  maxUsage?: number | null
  /**
   * ISO-8601 UTC string (e.g. "2026-12-31T00:00:00Z") or null for never expires
   */
  expirationDate?: string | null
}

export interface MoovePaymentLinkResponse {
  id: string
  url: string
  toAmount: string
  description?: string
  status?: "active" | "completed" | "inactive"
  isLive: boolean
}

export interface MooveLinkStatusResponse {
  id: string
  status: "active" | "completed" | "inactive"
  receivedAmount?: string
  toAmount?: string
  description?: string
  isLive: boolean
}

export interface MooveClientConfig {
  apiKey?: string
  baseUrl?: string
}

export class MooveReceiveAgent {
  private apiKey?: string
  private baseUrl: string

  constructor(config?: MooveClientConfig) {
    this.apiKey = config?.apiKey || process.env.MOOVE_API_KEY
    this.baseUrl = (config?.baseUrl || process.env.MOOVE_API_BASE_URL || "https://api.moove.xyz").replace(/\/$/, "")
  }

  /**
   * Create a one-off hosted payment link via the Moove Receive Agent
   */
  async createPaymentLink(params: CreatePaymentLinkParams): Promise<MoovePaymentLinkResponse> {
    // Contract enforcement: toAmount MUST be a string
    if (typeof params.toAmount !== "string" || !/^\d+(\.\d{1,6})?$/.test(params.toAmount)) {
      throw new Error(`[Moove Contract Violation] toAmount must be a decimal string, received: ${params.toAmount}`)
    }

    const payload = {
      toAmount: params.toAmount,
      description: params.description,
      maxUsage: params.maxUsage !== undefined ? params.maxUsage : 1,
      expirationDate: params.expirationDate || null,
    }

    // If a live Moove API key is configured, execute real HTTP call to Moove Receive Agent
    if (this.apiKey && this.apiKey.startsWith("mk_")) {
      const res = await fetch(`${this.baseUrl}/v1/payment-link`, {
        method: "POST",
        headers: {
          "X-API-Key": this.apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errText = await res.text().catch(() => "")
        throw new Error(`Moove Receive Agent failed (${res.status}): ${errText}`)
      }

      const data = await res.json()
      return {
        id: data.id,
        url: data.url,
        toAmount: params.toAmount,
        description: params.description,
        status: data.status || "active",
        isLive: true,
      }
    }

    // Fallback sandbox mode when MOOVE_API_KEY is not set in environment
    const randomId = `pl_${Math.random().toString(36).substring(2, 11)}_${Date.now().toString(36)}`
    const dynamicToken = `dyn_cgt_${Math.random().toString(36).substring(2, 10)}`
    const simulatedUrl = `https://pay.moove.xyz/pay/${dynamicToken}?to=@cogentapay&amount=${params.toAmount}&asset=USDC`

    return {
      id: randomId,
      url: simulatedUrl,
      toAmount: params.toAmount,
      description: params.description,
      status: "active",
      isLive: false,
    }
  }

  /**
   * Check whether a payment link has settled via GET /v1/payment-link/{id}
   */
  async getPaymentLinkStatus(linkId: string): Promise<MooveLinkStatusResponse> {
    if (this.apiKey && this.apiKey.startsWith("mk_")) {
      const res = await fetch(`${this.baseUrl}/v1/payment-link/${linkId}`, {
        method: "GET",
        headers: {
          "X-API-Key": this.apiKey,
        },
      })

      if (!res.ok) {
        const errText = await res.text().catch(() => "")
        throw new Error(`Moove status query failed (${res.status}): ${errText}`)
      }

      const data = await res.json()
      return {
        id: data.id,
        status: data.status,
        receivedAmount: data.receivedAmount,
        toAmount: data.toAmount,
        description: data.description,
        isLive: true,
      }
    }

    // Simulated settlement check
    return {
      id: linkId,
      status: "completed",
      receivedAmount: "3.85",
      isLive: false,
    }
  }

  /**
   * List completed links for store reconciliation via GET /v1/payment-link?status=completed
   */
  async listPaymentLinks(options?: { status?: "active" | "completed" | "inactive"; offset?: number }) {
    if (this.apiKey && this.apiKey.startsWith("mk_")) {
      const query = new URLSearchParams()
      if (options?.status) query.set("status", options.status)
      if (options?.offset) query.set("offset", String(options.offset))

      const res = await fetch(`${this.baseUrl}/v1/payment-link?${query.toString()}`, {
        method: "GET",
        headers: {
          "X-API-Key": this.apiKey,
        },
      })

      if (!res.ok) {
        throw new Error(`Failed to list Moove payment links: ${res.statusText}`)
      }

      return res.json()
    }

    return {
      items: [],
      total: 0,
      isLive: false,
    }
  }
}

export const mooveReceiveAgent = new MooveReceiveAgent()
