/**
 * CogentaPay ElizaOS Agent Plugin
 * Official plugin integration built with @elizaos/core.
 * Enables ElizaOS autonomous characters/agents to discover catalogs,
 * negotiate HTTP 402 invoices, and execute non-custodial multi-chain payments via Moove.
 */

import type { Action, Plugin, IAgentRuntime, Memory, State, HandlerCallback } from "@elizaos/core"
import { CogentaPayClient, SpendingMandate } from "./client"

export interface ElizaOSPluginConfig {
  storeUrl?: string
  mandate?: SpendingMandate
}

/**
 * Creates the BUY_WITH_COGENTAPAY action for ElizaOS agents
 */
export function createElizaOSPaymentAction(config?: ElizaOSPluginConfig): Action {
  const client = new CogentaPayClient(config?.storeUrl || "https://pay.cogentalabs.com")
  const defaultMandate: SpendingMandate = config?.mandate || {
    maxAmountPerTransaction: 150.0,
  }

  return {
    name: "BUY_WITH_COGENTAPAY",
    similes: [
      "PURCHASE_PRODUCT",
      "BUY_GPU_HOURS",
      "SETTLE_402_INVOICE",
      "AGENT_CHECKOUT",
      "PAY_WITH_MOOVE",
    ],
    description:
      "Autonomously discovers merchant catalog, requests an HTTP 402 price quote, checks human spending limits, and settles payment non-custodially on Moove rails.",

    validate: async (_runtime: IAgentRuntime, message: Memory, _state?: State): Promise<boolean> => {
      const text = message.content?.text?.toLowerCase() || ""
      return (
        text.includes("buy") ||
        text.includes("purchase") ||
        text.includes("checkout") ||
        text.includes("order") ||
        text.includes("pay")
      )
    },

    handler: async (
      _runtime: IAgentRuntime,
      message: Memory,
      _state?: State,
      _options?: Record<string, unknown>,
      callback?: HandlerCallback
    ): Promise<boolean> => {
      try {
        if (callback) {
          callback({
            text: "🔍 Querying CogentaPay machine catalog at /.well-known/agent-catalog.json...",
          })
        }

        // 1. Fetch Catalog
        const catalog = await client.getCatalog()
        const defaultProduct = catalog.products[0]

        if (!defaultProduct) {
          if (callback) callback({ text: "❌ No available inventory found in catalog." })
          return false
        }

        // 2. Request 402 Quote
        if (callback) {
          callback({
            text: `🛒 Negotiating HTTP 402 quote for SKU: ${defaultProduct.sku} (${defaultProduct.title}) on Base...`,
          })
        }

        const quote = await client.requestQuote({
          productId: defaultProduct.id,
          quantity: 1,
          sourceChain: "base",
          agentId: "elizaos_runtime_agent",
        })

        // 3. Check Spending Mandate
        const mandateCheck = client.validateMandate(quote, defaultMandate)
        if (!mandateCheck.approved) {
          if (callback) {
            callback({
              text: `⚠️ Human Mandate Policy Refusal: ${mandateCheck.reason}. Transaction aborted.`,
            })
          }
          return false
        }

        // 4. Settle via Moove
        if (callback) {
          callback({
            text: `💳 Mandate approved! Settling $${quote.amount_due_usdc} USDC via Moove rails into merchant vault (${quote.settlement_recipient})...`,
          })
        }

        const receipt = await client.settleOrder({
          orderId: quote.order_id,
          amountPaidUsdc: quote.amount_due_usdc,
          sourceChain: "base",
          agentSignature: quote.signature,
        })

        if (callback) {
          callback({
            text: `✅ Purchase finalized with 0 human clicks!\n• Order: ${receipt.order_id}\n• Amount: $${receipt.settlement.amount_settled} USDC\n• Tx Hash: ${receipt.settlement.tx_hash}\n• Fulfillment Token: ${receipt.fulfillment.release_token}`,
          })
        }

        return true
      } catch (err: any) {
        if (callback) {
          callback({ text: `❌ Agent commerce execution failed: ${err.message}` })
        }
        return false
      }
    },

    examples: [
      [
        {
          user: "{{user1}}",
          content: { text: "Buy 1 hour of H100 GPU compute for our clustering task." },
        },
        {
          user: "{{agentName}}",
          content: {
            text: "Negotiating HTTP 402 invoice via CogentaPay and settling on Moove rails...",
            action: "BUY_WITH_COGENTAPAY",
          },
        },
      ],
    ],
  }
}

/**
 * Creates the official ElizaOS plugin package
 */
export function createElizaOSPlugin(config?: ElizaOSPluginConfig): Plugin {
  return {
    name: "cogentapay",
    description: "Autonomous commerce plugin powered by CogentaPay and Moove payment rails",
    actions: [createElizaOSPaymentAction(config)],
  }
}

export const defaultElizaOSPlugin = createElizaOSPlugin()
