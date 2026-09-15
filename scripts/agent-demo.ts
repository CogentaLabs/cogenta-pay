/**
 * CogentaPay Autonomous Agent CLI Demo Runner
 *
 * Demonstrates the 4-step autonomous machine commerce loop:
 * 1. Catalog Discovery (/.well-known/agent-catalog.json)
 * 2. HTTP 402 Payment Required Quote Negotiation
 * 3. Human Spending Mandate Enforcement
 * 4. Moove Multi-Chain Non-Interactive Settlement & Cryptographic Receipt
 *
 * Usage:
 *   bun run demo
 *   bun run demo --host=http://localhost:3000
 */

const BASE_URL = process.env.COGENTAPAY_HOST || "http://localhost:3000"

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function banner() {
  console.log("\n" + "=".repeat(68))
  console.log("   🤖 COGENTAPAY // AUTONOMOUS AGENT COMMERCE RUNNER")
  console.log("   Settlement Rails: Moove.xyz (37+ Chains → Merchant USDC)")
  console.log("   Target Store: " + BASE_URL)
  console.log("=".repeat(68) + "\n")
}

async function runAgentFlow() {
  banner()

  try {
    // -------------------------------------------------------------
    // STEP 1: Discover Storefront via Machine Manifest
    // -------------------------------------------------------------
    console.log("▶ [STEP 1/4] Querying Machine Catalog Manifest...")
    const catalogUrl = `${BASE_URL}/api/agent-catalog`
    console.log(`  GET ${catalogUrl}`)
    
    const catRes = await fetch(catalogUrl)
    if (!catRes.ok) {
      throw new Error(`Failed to fetch catalog: ${catRes.status} ${catRes.statusText}`)
    }
    const catalog = (await catRes.json()) as any
    console.log(`  ✓ Store: ${catalog.store.name} (${catalog.store.domain})`)
    console.log(`  ✓ Moove Settlement Vault: ${catalog.store.moove_handle}`)
    console.log(`  ✓ Protocols: ${catalog.protocols_supported.join(", ")}`)
    console.log(`  ✓ Available SKUs: ${catalog.products.length} products found`)

    // Select product: H100 Compute Cluster
    const selectedProduct = catalog.products[0]
    console.log(`\n  Target SKU: ${selectedProduct.sku} - "${selectedProduct.title}"`)
    console.log(`  Unit Price: $${selectedProduct.price_usdc} USDC`)
    await sleep(600)

    // -------------------------------------------------------------
    // STEP 2: Submit Order Intent & Negotiate HTTP 402 Quote
    // -------------------------------------------------------------
    console.log("\n▶ [STEP 2/4] Submitting Order Intent & Requesting Price Lock...")
    const checkoutUrl = `${BASE_URL}/api/checkout`
    const orderPayload = {
      product_id: selectedProduct.id,
      quantity: 2,
      source_chain: "base",
      agent_id: "agent_elizaos_402_cli",
    }
    console.log(`  POST ${checkoutUrl}`)
    console.log(`  Payload: ${JSON.stringify(orderPayload)}`)

    const checkoutRes = await fetch(checkoutUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    })

    console.log(`  Status: ${checkoutRes.status} ${checkoutRes.statusText}`)
    const checkoutData = (await checkoutRes.json()) as any

    if (checkoutRes.status !== 402) {
      throw new Error(`Expected HTTP 402 Payment Required, received ${checkoutRes.status}`)
    }

    console.log("  ✓ Intercepted Native HTTP 402 Payment Required!")
    console.log(`  ✓ Order ID: ${checkoutData.order_id}`)
    console.log(`  ✓ Total Amount Due: $${checkoutData.amount_due_usdc} USDC`)
    console.log(`  ✓ Dynamic Moove Link: ${checkoutData.moove_rail.payment_link}`)
    console.log(`  ✓ Price Lock Signature: ${checkoutData.signature}`)
    await sleep(700)

    // -------------------------------------------------------------
    // STEP 3: Enforce Human Mandate Spend Policy
    // -------------------------------------------------------------
    console.log("\n▶ [STEP 3/4] Evaluating Human Spending Mandate...")
    const humanSpendCap = 150.0 // Session limit configured by human user
    const amountDue = parseFloat(checkoutData.amount_due_usdc)
    console.log(`  Human Mandate Session Limit: $${humanSpendCap.toFixed(2)} USDC`)
    console.log(`  Transaction Amount: $${amountDue.toFixed(2)} USDC`)

    if (amountDue > humanSpendCap) {
      console.log("  ✖ Mandate Violation! Order exceeds authorized spending cap.")
      process.exit(1)
    }
    console.log("  ✓ Mandate Approved! Transaction is within authorized spending policy.")
    await sleep(600)

    // -------------------------------------------------------------
    // STEP 4: Settle via Moove Multi-Chain Rails Non-Interactively
    // -------------------------------------------------------------
    console.log("\n▶ [STEP 4/4] Executing Non-Interactive Settlement on Moove...")
    const verifyUrl = `${BASE_URL}/api/verify-settlement`
    console.log(`  POST ${verifyUrl}`)

    const settleRes = await fetch(verifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_id: checkoutData.order_id,
        amount_paid_usdc: checkoutData.amount_due_usdc,
        source_chain: "base",
        agent_signature: checkoutData.signature,
      }),
    })

    const receipt = (await settleRes.json()) as any

    if (!settleRes.ok) {
      throw new Error(`Settlement failed: ${JSON.stringify(receipt)}`)
    }

    console.log(`  Status: 200 OK (Settlement Finalized)`)
    console.log("\n" + "-".repeat(68))
    console.log("  🎉 SETTLEMENT RECEIPT (VERIFIABLE ON-CHAIN):")
    console.log(`  • Order Status:     ${receipt.status.toUpperCase()}`)
    console.log(`  • Merchant Vault:   ${receipt.merchant.handle} (${receipt.merchant.settled_vault})`)
    console.log(`  • Net Settled:      $${receipt.settlement.amount_settled} ${receipt.settlement.currency}`)
    console.log(`  • Source Chain:     ${receipt.settlement.source_chain.toUpperCase()}`)
    console.log(`  • Settlement Proof: ${receipt.settlement.tx_hash}`)
    console.log(`  • Settlement Time:  ${receipt.settlement.latency_ms}ms (Zero Slippage)`)
    console.log(`  • Release Token:    ${receipt.fulfillment.release_token}`)
    console.log("-".repeat(68))
    console.log("  ✓ Autonomous Commerce Completed with 0 Human Clicks.\n")
  } catch (err: any) {
    console.error(`\n❌ Execution Error: ${err.message}\n`)
    process.exit(1)
  }
}

runAgentFlow()
