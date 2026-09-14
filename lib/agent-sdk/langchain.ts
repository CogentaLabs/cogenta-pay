/**
 * CogentaPay LangChain Agent Tools
 * Native LangChain integration built with @langchain/core and Zod.
 * Enables LangChain agents to discover catalogs, negotiate HTTP 402 quotes,
 * and settle non-custodially via Moove multi-chain rails.
 */

import { DynamicStructuredTool } from "@langchain/core/tools"
import { z } from "zod"
import { CogentaPayClient, SpendingMandate } from "./client"

export interface CogentaPayToolsConfig {
  storeUrl?: string
  mandate?: SpendingMandate
  agentId?: string
}

/**
 * Creates individual LangChain tools for granular agent reasoning
 */
export function createCogentaPayTools(config?: CogentaPayToolsConfig) {
  const client = new CogentaPayClient(config?.storeUrl || "https://pay.cogentalabs.com")
  const defaultMandate: SpendingMandate = config?.mandate || {
    maxAmountPerTransaction: 150.0,
  }
  const agentId = config?.agentId || "langchain_runtime_agent"

  // Tool 1: Catalog Discovery
  const discoverCatalogTool = new DynamicStructuredTool({
    name: "cogentapay_discover_catalog",
    description:
      "Discovers the machine-readable catalog from a CogentaPay merchant storefront. Returns available product SKUs, prices in USDC, inventory counts, and supported source blockchains for Moove settlement.",
    schema: z.object({}),
    func: async () => {
      try {
        const catalog = await client.getCatalog()
        return JSON.stringify({
          store: catalog.store.name,
          moove_handle: catalog.store.moove_handle,
          settlement_asset: catalog.store.settlement_asset,
          protocols: catalog.protocols_supported,
          products: catalog.products.map((p) => ({
            id: p.id,
            sku: p.sku,
            title: p.title,
            price_usdc: p.price_usdc,
            stock: p.stock_quantity,
            chains: p.supported_source_chains,
          })),
        })
      } catch (err: any) {
        return JSON.stringify({ error: err.message })
      }
    },
  })

  // Tool 2: HTTP 402 Quote Negotiation
  const requestQuoteTool = new DynamicStructuredTool({
    name: "cogentapay_negotiate_402_quote",
    description:
      "Submits order intent for a SKU and receives an HTTP 402 Payment Required challenge containing a dynamic Moove payment link and a 15-minute price lock signature.",
    schema: z.object({
      productId: z.string().describe("The product ID to purchase (e.g. 'prod_h100_gpu')"),
      quantity: z.number().default(1).describe("Number of units to purchase"),
      sourceChain: z
        .enum(["base", "solana", "ethereum", "polygon", "arbitrum"])
        .default("base")
        .describe("The source blockchain the agent pays from"),
    }),
    func: async ({ productId, quantity, sourceChain }) => {
      try {
        const quote = await client.requestQuote({
          productId,
          quantity,
          sourceChain,
          agentId,
        })
        return JSON.stringify({
          order_id: quote.order_id,
          status: quote.status,
          amount_due_usdc: quote.amount_due_usdc,
          moove_payment_link: quote.moove_rail.payment_link,
          moove_recipient: quote.moove_rail.moove_recipient,
          expires_at: quote.expires_at,
          signature: quote.signature,
        })
      } catch (err: any) {
        return JSON.stringify({ error: err.message })
      }
    },
  })

  // Tool 3: Mandate Check & Moove Settlement
  const settleOrderTool = new DynamicStructuredTool({
    name: "cogentapay_settle_order",
    description:
      "Validates quote against human spending mandate and signs settlement on Moove rails. Returns cryptographic settlement proof and order fulfillment token.",
    schema: z.object({
      orderId: z.string().describe("Order ID returned from quote negotiation"),
      amountPaidUsdc: z.string().describe("Amount due in USDC as quoted"),
      sourceChain: z.string().describe("Source blockchain used for payment"),
      agentSignature: z.string().describe("Cryptographic price lock signature"),
    }),
    func: async ({ orderId, amountPaidUsdc, sourceChain, agentSignature }) => {
      try {
        const amountNum = parseFloat(amountPaidUsdc)
        if (amountNum > defaultMandate.maxAmountPerTransaction) {
          return JSON.stringify({
            status: "mandate_refused",
            error: `Amount ($${amountNum} USDC) exceeds human mandate cap ($${defaultMandate.maxAmountPerTransaction} USDC)`,
          })
        }

        const receipt = await client.settleOrder({
          orderId,
          amountPaidUsdc,
          sourceChain,
          agentSignature,
        })

        return JSON.stringify({
          status: "settled",
          order_id: receipt.order_id,
          settled_vault: receipt.merchant.handle,
          amount: `${receipt.settlement.amount_settled} ${receipt.settlement.currency}`,
          tx_hash: receipt.settlement.tx_hash,
          latency_ms: receipt.settlement.latency_ms,
          fulfillment_token: receipt.fulfillment.release_token,
        })
      } catch (err: any) {
        return JSON.stringify({ error: err.message })
      }
    },
  })

  // Tool 4: Composite End-to-End Buyer Tool
  const compositeCheckoutTool = new DynamicStructuredTool({
    name: "cogentapay_autonomous_checkout",
    description:
      "Executes the entire 4-step autonomous purchase flow: discovers catalog, negotiates HTTP 402 quote, verifies spending mandate, and settles via Moove non-custodial rails in a single step.",
    schema: z.object({
      productId: z.string().describe("Product ID to purchase (e.g. 'prod_h100_gpu', 'prod_agent_key', 'prod_data_oracle')"),
      quantity: z.number().default(1).describe("Number of units"),
      sourceChain: z
        .enum(["base", "solana", "ethereum", "polygon", "arbitrum"])
        .default("base")
        .describe("Source blockchain to pay from"),
    }),
    func: async ({ productId, quantity, sourceChain }) => {
      try {
        const quote = await client.requestQuote({
          productId,
          quantity,
          sourceChain,
          agentId,
        })

        const mandateCheck = client.validateMandate(quote, defaultMandate)
        if (!mandateCheck.approved) {
          return JSON.stringify({
            status: "policy_refused",
            reason: mandateCheck.reason,
            order_id: quote.order_id,
          })
        }

        const receipt = await client.settleOrder({
          orderId: quote.order_id,
          amountPaidUsdc: quote.amount_due_usdc,
          sourceChain,
          agentSignature: quote.signature,
        })

        return JSON.stringify({
          status: "success",
          order_id: receipt.order_id,
          net_settled: `${receipt.settlement.amount_settled} USDC`,
          merchant_vault: receipt.merchant.handle,
          source_chain: receipt.settlement.source_chain,
          tx_hash: receipt.settlement.tx_hash,
          fulfillment_token: receipt.fulfillment.release_token,
          latency_ms: receipt.settlement.latency_ms,
        })
      } catch (err: any) {
        return JSON.stringify({ status: "error", message: err.message })
      }
    },
  })

  return {
    discoverCatalogTool,
    requestQuoteTool,
    settleOrderTool,
    compositeCheckoutTool,
  }
}

/**
 * Backward-compatible single tool export
 */
export function createLangChainPaymentTool(config?: CogentaPayToolsConfig) {
  const tools = createCogentaPayTools(config)
  return tools.compositeCheckoutTool
}
