# CogentaPay

**Autonomous checkout for AI agents — by [Cogenta Labs](https://cogentalabs.com)**

CogentaPay is a merchant checkout gateway for the agentic economy. Traditional checkouts (3DS, CAPTCHAs, OTPs) brick autonomous AI agents — CogentaPay lets them pay natively using **HTTP 402 (Payment Required)**, with settlement routed non-custodially into merchant USDC vaults via **[Moove](https://moove.xyz)** across **37+ blockchains**.

> 🔗 **Live:** [pay.cogentalabs.com](https://pay.cogentalabs.com)

## How It Works

The 4-step autonomous commerce loop — **zero human clicks**:

1. **Catalog Discovery** — Agent fetches the machine-readable storefront manifest at `GET /api/agent-catalog` (also available at `/.well-known/agent-catalog.json`).
2. **Quote Negotiation** — Agent submits an order intent to `POST /api/checkout` and receives an **HTTP 402** response containing a dynamic Moove payment link, a 15-minute price lock, and an idempotency key.
3. **Mandate Enforcement** — The agent's human-configured spending mandate (per-transaction and daily caps, e.g. max $150/tx) is checked before any funds move.
4. **Settlement & Receipt** — Agent submits proof to `POST /api/verify-settlement` and receives a cryptographic settlement receipt: on-chain tx hash, settled amount, latency, and a fulfillment release token.

Supported protocols: **Coinbase x402**, **Google AP2**, **OpenAI ACP**.
Supported source chains: **Base, Solana, Ethereum, Polygon, Arbitrum** → settled in **USDC**.

## Tech Stack

- [Next.js](https://nextjs.org) 14 (App Router) + React 19 + TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4 + shadcn/ui (Radix primitives)
- [Bun](https://bun.sh) as package manager & demo runner
- Deployed on Vercel

## Project Structure

```
app/
  page.tsx                      # Landing page
  demo/page.tsx                 # Interactive demo
  api/agent-catalog/route.ts    # GET  – machine-readable storefront manifest
  api/checkout/route.ts         # POST – order intent → HTTP 402 quote w/ Moove link
  api/verify-settlement/route.ts# POST – settlement proof → cryptographic receipt
components/
  landing/                      # Hero, navbar, bento grid, showcase
  *-section.tsx                 # Pricing, FAQ, docs, testimonials, CTA, etc.
  ui/                           # shadcn/ui primitives
hooks/                          # use-toast, use-mobile
lib/utils.ts                    # cn() and helpers
public/
  .well-known/agent-catalog.json# Static agent catalog manifest
  section-image/                # Hero / section artwork
scripts/
  agent-demo.ts                 # Autonomous agent CLI demo runner
```

## Getting Started

Requires **Bun** (or Node ≥ 18) and Next.js 14.

```bash
# Install dependencies
bun install

# Start the dev server
bun run dev
# → http://localhost:3000
```

### Run the Agent Demo

With the dev server running, execute the full 4-step autonomous purchase flow end-to-end:

```bash
bun run demo
# or target a different host
bun run demo --host=http://localhost:3000
# equivalently: COGENTAPAY_HOST=http://localhost:3000 bun run demo
```

The runner will discover the catalog, negotiate an HTTP 402 quote for 2× "On-Demand H100 GPU Cluster", enforce a $150 human spend mandate, and settle on Moove — printing a verifiable settlement receipt.

### Production

```bash
bun run build
bun run start
```

## API Reference

### `GET /api/agent-catalog`
Machine-readable storefront manifest: store info, Moove handle, supported protocols, endpoints, and product SKUs (price, stock, shipping, supported source chains).

### `POST /api/checkout`
Submits an order intent and returns **HTTP 402 Payment Required**.

```jsonc
// Request
{ "product_id": "prod_h100_gpu", "quantity": 2, "source_chain": "base", "agent_id": "agent_session_402" }

// Response (402)
{
  "status": "payment_required",
  "protocol": "coinbase-x402",
  "order_id": "ord_…",
  "amount_due_usdc": "7.70",
  "moove_rail": { "payment_link": "https://pay.moove.xyz/pay/…", "settlement_mode": "non_custodial_instant_usdc" },
  "expires_at": 1789000000,          // 15-minute price lock
  "signature": "0x…"
}
```

### `POST /api/verify-settlement`
Submits payment proof and returns a settlement receipt (tx hash, block number, latency, cryptographic proof, fulfillment release token).

```jsonc
// Request
{ "order_id": "ord_…", "amount_paid_usdc": "7.70", "source_chain": "base", "agent_signature": "0x…" }
```

> ⚠️ **Note:** The API routes currently return **simulated** settlement data (randomized tx hashes, mock vaults) for demo purposes. Wiring them to real Moove rails / on-chain verification is the next milestone.

## Pricing

CogentaPay is currently in **beta** and the beta version is **free to use** — no fees, no commitments. Pricing for future plans will be announced later as the product evolves.


## License

This project is proprietary software, **not** open source. Licensed under the [Cogenta Labs Proprietary Software License](./LICENSE) — all rights reserved by **Cogenta Labs** (cogentalabs.com).

For commercial licensing inquiries, visit [cogentalabs.com](https://cogentalabs.com).

