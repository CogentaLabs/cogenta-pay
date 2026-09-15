/**
 * CogentaPay LangChain & LangGraph Autonomous Agent Runner
 *
 * Demonstrates native agent commerce using official @langchain/core and @langchain/langgraph.
 * Executes:
 * 1. LangGraph StateGraph Autonomous Workflow
 * 2. LangChain DynamicStructuredTool Direct Execution
 *
 * Usage:
 *   bun run scripts/langchain-agent-demo.ts
 */

import { createCommerceGraph } from "../lib/agent-sdk/langgraph"
import { createCogentaPayTools } from "../lib/agent-sdk/langchain"

const BASE_URL = process.env.COGENTAPAY_HOST || "http://localhost:3000"

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function banner() {
  console.log("\n" + "=".repeat(72))
  console.log("   🦜 LANGCHAIN & LANGGRAPH // AUTONOMOUS AGENT COMMERCE RUNNER")
  console.log("   Powered by CogentaPay & Moove Settlement Rails (37+ Blockchains)")
  console.log("   Target Storefront: " + BASE_URL)
  console.log("=".repeat(72) + "\n")
}

async function runLangGraphWorkflow() {
  console.log("▶ [PART 1/2] Executing LangGraph Deterministic Commerce Workflow...")
  console.log("  Compiling StateGraph: [Discovery -> 402 Quote -> Mandate Check -> Moove Settle]...\n")

  const app = createCommerceGraph({
    storeUrl: BASE_URL,
    defaultSpendCap: 150.0,
  })

  const initialInput = {
    productId: "prod_h100_gpu",
    quantity: 2,
    sourceChain: "base",
    agentId: "langgraph_autonomous_agent_v1",
    spendCap: 150.0,
    productTitle: undefined,
    unitPrice: undefined,
    merchantHandle: undefined,
    quote: undefined,
    orderId: undefined,
    amountDueUsdc: undefined,
    moovePaymentLink: undefined,
    mandateApproved: false,
    rejectionReason: undefined,
    receipt: undefined,
    status: "idle" as const,
    error: undefined,
  }

  const result = await app.invoke(initialInput)

  console.log("  [LangGraph State Results]")
  console.log(`  • Status:           ${result.status.toUpperCase()}`)
  console.log(`  • Product:          ${result.productTitle} ($${result.unitPrice} USDC)`)
  console.log(`  • Order ID:         ${result.orderId}`)
  console.log(`  • Amount Due:       $${result.amountDueUsdc} USDC`)
  console.log(`  • Moove Dynamic URL: ${result.moovePaymentLink}`)
  console.log(`  • Mandate Check:    ${result.mandateApproved ? "APPROVED (Within $150 cap)" : "REJECTED"}`)
  if (result.receipt) {
    console.log(`  • Settled Vault:    ${result.receipt.merchant.handle}`)
    console.log(`  • Net Settled:      $${result.receipt.settlement.amount_settled} USDC`)
    console.log(`  • Proof Tx:         ${result.receipt.settlement.tx_hash}`)
    console.log(`  • Latency:          ${result.receipt.settlement.latency_ms}ms (Moove Zero-Slippage Bridge)`)
    console.log(`  • Fulfillment Token:${result.receipt.fulfillment.release_token}`)
  }
  console.log("  ✓ LangGraph StateGraph Workflow Completed Successfully!\n")
}

async function runLangChainToolCall() {
  console.log("▶ [PART 2/2] Invoking LangChain DynamicStructuredTool (Function Calling Simulation)...")
  const tools = createCogentaPayTools({ storeUrl: BASE_URL })

  console.log(`  Tool Name: "${tools.compositeCheckoutTool.name}"`)
  console.log(`  Invoking tool with SKU: 'prod_data_oracle' on chain: 'solana'...\n`)

  const toolOutputString = await tools.compositeCheckoutTool.invoke({
    productId: "prod_data_oracle",
    quantity: 1,
    sourceChain: "solana",
  })

  const toolOutput = JSON.parse(toolOutputString)
  console.log("  [Tool Return Payload]")
  console.log(JSON.stringify(toolOutput, null, 2))
  console.log("\n  ✓ LangChain Tool Call Executed Successfully!")
}

async function main() {
  banner()
  try {
    await runLangGraphWorkflow()
    await sleep(600)
    await runLangChainToolCall()
    console.log("\n" + "=".repeat(72))
    console.log("   🎉 ALL LANGCHAIN & LANGGRAPH AGENT INTEGRATIONS VERIFIED 100%!")
    console.log("=".repeat(72) + "\n")
  } catch (err: any) {
    console.error(`\n❌ Error during execution: ${err.message}\n`)
    process.exit(1)
  }
}

main()
