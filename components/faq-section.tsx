"use client"

import { useState } from "react"

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "What is CogentaPay?",
    answer:
      "CogentaPay is agentic checkout infrastructure that lets autonomous AI agents pay merchants directly via multi-chain crypto settlement and the HTTP 402 protocol powered by Moove. Merchants add one integration and instantly accept machine-initiated payments without CAPTCHAs, redirects, or manual review.",
  },
  {
    question: "What is agentic payment with x402?",
    answer:
      "x402 revives the dormant HTTP 402 'Payment Required' status code as a real payment rail. When an agent hits a paywalled resource, your server responds with 402 and a price quote; the agent settles programmatically and retries — all in a single machine-to-machine round trip, with no human in the loop.",
  },
  {
    question: "How does agentic payment with crypto work?",
    answer:
      "Agents can pay in stablecoins from any of 37+ supported chains. Our liquidity layer, powered by Moove, aggregates and routes the payment so the agent spends from whatever asset it holds while you always receive guaranteed USDC settlement.",
  },
  {
    question: "How do agent spending limits and session keys work?",
    answer:
      "Users grant autonomous agents bounded spend mandates using ephemeral session keys (ERC-4337 standard). The agent can only execute payments within its configured spend limit and expiry window, ensuring complete user control with zero manual checkout friction.",
  },
  {
    question: "How do I add CogentaPay to my store?",
    answer:
      "Drop in our WooCommerce or storefront plugin, or call the REST API directly. Once installed, agent traffic is detected automatically, issued an HTTP 402 invoice, and settled directly into merchant USDC via Moove non-custodial rails.",
  },
  {
    question: "How are disputes and reconciliation handled?",
    answer:
      "Every transaction produces a cryptographic receipt held by both the merchant and the agent — provable, on-chain proof of settlement. This eliminates chargeback ambiguity and turns reconciliation from a multi-day process into a real-time lookup.",
  },
]

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <div id="faq" className="w-full flex justify-center items-start scroll-mt-20">
      <div className="flex-1 px-4 md:px-12 py-16 md:py-20 flex flex-col lg:flex-row justify-start items-start gap-6 lg:gap-12">
        {/* Left Column - Header */}
        <div className="w-full lg:flex-1 flex flex-col justify-center items-start gap-4 lg:py-5">
          <div className="w-full flex flex-col justify-center text-[#49423D] font-semibold leading-tight md:leading-[44px] font-sans text-4xl tracking-tight">
            Frequently Asked Questions
          </div>
          <div className="w-full text-[#605A57] text-base font-normal leading-7 font-sans">
            Everything you need to know about agentic
            <br className="hidden md:block" />
            checkout, settlement, and getting started.
          </div>
        </div>

        {/* Right Column - FAQ Items */}
        <div className="w-full lg:flex-1 flex flex-col justify-center items-center">
          <div className="w-full flex flex-col">
            {faqData.map((item, index) => {
              const isOpen = openItems.includes(index)

              return (
                <div key={index} className="w-full border-b border-[rgba(73,66,61,0.16)] overflow-hidden">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-5 py-[18px] flex justify-between items-center gap-5 text-left hover:bg-[rgba(73,66,61,0.02)] transition-colors duration-200"
                    aria-expanded={isOpen}
                  >
                    <div className="flex-1 text-[#49423D] text-base font-medium leading-6 font-sans">
                      {item.question}
                    </div>
                    <div className="flex justify-center items-center">
                      <ChevronDownIcon
                        className={`w-6 h-6 text-[rgba(73,66,61,0.60)] transition-transform duration-300 ease-in-out ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-5 pb-[18px] text-[#605A57] text-sm font-normal leading-6 font-sans">
                      {item.answer}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
