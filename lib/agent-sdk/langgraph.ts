/**
 * CogentaPay LangGraph Autonomous Commerce Workflow
 * Multi-step deterministic state machine for machine-to-machine checkout.
 * Routes: Discovery -> HTTP 402 Negotiation -> Mandate Safety Check -> Moove Settle -> Receipt.
 */

import { Annotation, StateGraph, START, END } from "@langchain/langgraph"
import { CogentaPayClient, SpendingMandate, CheckoutQuoteResponse, SettlementReceipt } from "./client"

export const CommerceStateAnnotation = Annotation.Root({
  productId: Annotation<string>,
  quantity: Annotation<number>,
  sourceChain: Annotation<string>,
  agentId: Annotation<string>,
  spendCap: Annotation<number>,

  // Discovered state
  productTitle: Annotation<string | undefined>,
  unitPrice: Annotation<string | undefined>,
  merchantHandle: Annotation<string | undefined>,

  // 402 Negotiation state
  quote: Annotation<CheckoutQuoteResponse | undefined>,
  orderId: Annotation<string | undefined>,
  amountDueUsdc: Annotation<string | undefined>,
  moovePaymentLink: Annotation<string | undefined>,

  // Policy check
  mandateApproved: Annotation<boolean>,
  rejectionReason: Annotation<string | undefined>,

  // Settlement receipt
  receipt: Annotation<SettlementReceipt | undefined>,
  status: Annotation<"idle" | "discovered" | "negotiated" | "mandate_rejected" | "settled" | "failed">,
  error: Annotation<string | undefined>,
})

export type CommerceState = typeof CommerceStateAnnotation.State

export interface CommerceGraphConfig {
  storeUrl?: string
  defaultSpendCap?: number
}

/**
 * Builds the LangGraph state machine for autonomous 402 commerce
 */
export function createCommerceGraph(config?: CommerceGraphConfig) {
  const client = new CogentaPayClient(config?.storeUrl || "https://pay.cogentalabs.com")

  const workflow = new StateGraph(CommerceStateAnnotation)
    // Node 1: Catalog Discovery
    .addNode("discover_catalog", async (state) => {
      try {
        const catalog = await client.getCatalog()
        const product = catalog.products.find((p) => p.id === state.productId) || catalog.products[0]
        return {
          productTitle: product ? product.title : "Unknown Product",
          unitPrice: product ? product.price_usdc : "0.00",
          merchantHandle: catalog.store.moove_handle,
          status: "discovered" as const,
        }
      } catch (err: any) {
        return {
          status: "failed" as const,
          error: `Discovery failed: ${err.message}`,
        }
      }
    })

    // Node 2: Negotiate HTTP 402 Quote
    .addNode("negotiate_402_quote", async (state) => {
      try {
        const quote = await client.requestQuote({
          productId: state.productId,
          quantity: state.quantity || 1,
          sourceChain: state.sourceChain || "base",
          agentId: state.agentId || "langgraph_agent",
        })
        return {
          quote,
          orderId: quote.order_id,
          amountDueUsdc: quote.amount_due_usdc,
          moovePaymentLink: quote.moove_rail.payment_link,
          status: "negotiated" as const,
        }
      } catch (err: any) {
        return {
          status: "failed" as const,
          error: `Quote negotiation failed: ${err.message}`,
        }
      }
    })

    // Node 3: Evaluate Human Spending Mandate
    .addNode("evaluate_mandate", async (state) => {
      if (!state.quote) {
        return {
          mandateApproved: false,
          rejectionReason: "Missing quote data",
          status: "failed" as const,
        }
      }
      const cap = state.spendCap || config?.defaultSpendCap || 150.0
      const amount = parseFloat(state.quote.amount_due_usdc)

      if (amount > cap) {
        return {
          mandateApproved: false,
          rejectionReason: `Order amount ($${amount} USDC) exceeds spend limit of $${cap} USDC`,
          status: "mandate_rejected" as const,
        }
      }

      return {
        mandateApproved: true,
        status: "negotiated" as const,
      }
    })

    // Node 4: Settle on Moove Rails
    .addNode("settle_moove_payment", async (state) => {
      try {
        if (!state.quote) throw new Error("No quote available for settlement")

        const receipt = await client.settleOrder({
          orderId: state.quote.order_id,
          amountPaidUsdc: state.quote.amount_due_usdc,
          sourceChain: state.sourceChain || "base",
          agentSignature: state.quote.signature,
        })

        return {
          receipt,
          status: "settled" as const,
        }
      } catch (err: any) {
        return {
          status: "failed" as const,
          error: `Moove settlement failed: ${err.message}`,
        }
      }
    })

    // Node 5: Abort on Policy Violation
    .addNode("policy_abort", async (state) => {
      return {
        status: "mandate_rejected" as const,
      }
    })

  // Define Edges & Flow
  workflow.addEdge(START, "discover_catalog")
  workflow.addEdge("discover_catalog", "negotiate_402_quote")
  workflow.addEdge("negotiate_402_quote", "evaluate_mandate")

  // Conditional Routing after Mandate Check
  workflow.addConditionalEdges(
    "evaluate_mandate",
    (state) => (state.mandateApproved ? "approved" : "rejected"),
    {
      approved: "settle_moove_payment",
      rejected: "policy_abort",
    }
  )

  workflow.addEdge("settle_moove_payment", END)
  workflow.addEdge("policy_abort", END)

  return workflow.compile()
}
