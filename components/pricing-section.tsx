"use client"

import { useState } from "react"

export default function PricingSection() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.")
      return
    }
    setError("")
    setSubmitted(true)
  }

  return (
    <div id="pricing" className="w-full flex flex-col justify-center items-center gap-2">
      {/* Header Section */}
      <div className="self-stretch px-6 md:px-24 py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
        <div className="w-full max-w-[620px] px-6 py-5 shadow-[0px_2px_4px_rgba(50,45,43,0.06)] overflow-hidden rounded-lg flex flex-col justify-start items-center gap-4 shadow-none">
          {/* Pricing Badge */}
          <div className="px-[14px] py-[6px] bg-white shadow-[0px_0px_0px_4px_rgba(55,50,47,0.05)] overflow-hidden rounded-[90px] flex justify-start items-center gap-[8px] border border-[rgba(2,6,23,0.08)] shadow-xs">
            <div className="w-[14px] h-[14px] relative overflow-hidden flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6 1V11M8.5 3H4.75C4.28587 3 3.84075 3.18437 3.51256 3.51256C3.18437 3.84075 3 4.28587 3 4.75C3 5.21413 3.18437 5.65925 3.51256 5.98744C3.84075 6.31563 4.28587 6.5 4.75 6.5H7.25C7.71413 6.5 8.15925 6.68437 8.48744 7.01256C8.81563 7.34075 9 7.78587 9 8.25C9 8.71413 8.81563 9.15925 8.48744 9.48744C8.15925 9.81563 7.71413 10 7.25 10H3.5"
                  stroke="#37322F"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="text-center flex justify-center flex-col text-[#37322F] text-xs font-medium leading-3 font-sans">
              Beta Access
            </div>
          </div>

          {/* Title */}
          <div className="self-stretch text-center flex justify-center flex-col text-[#49423D] text-3xl md:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
            Price for the machine economy
          </div>

          {/* Description */}
          <div className="self-stretch text-center text-[#605A57] text-base font-normal leading-7 font-sans">
            Machine commerce shouldn&apos;t carry expensive SaaS subscriptions or upfront software licenses.
            <br className="hidden sm:block" />
            CogentaPay operates on a transparent, per-transaction settlement model powered by Moove.
          </div>
        </div>
      </div>

      {/* Beta Access & Email Box Section */}
      <div className="self-stretch border-b border-t border-[rgba(55,50,47,0.12)] flex justify-center items-center">
        <div className="flex justify-center items-start w-full">
          {/* Left Decorative Pattern */}
          <div className="w-12 self-stretch relative overflow-hidden hidden md:block">
            <div className="w-[162px] left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
              {Array.from({ length: 120 }).map((_, i) => (
                <div
                  key={i}
                  className="self-stretch h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                ></div>
              ))}
            </div>
          </div>

          {/* Center Beta Container */}
          <div className="flex-1 max-w-[760px] py-12 md:py-16 px-4 sm:px-6 flex flex-col justify-center items-center gap-8">
            <div className="w-full bg-white border border-[#E0DEDB] rounded-2xl p-6 sm:p-10 shadow-sm flex flex-col justify-center items-center gap-6 text-center">
              <div className="w-12 h-12 rounded-full bg-[#F7F5F3] border border-[rgba(55,50,47,0.08)] flex items-center justify-center text-[#37322F]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3 8L10.89 13.26C11.56 13.71 12.44 13.71 13.11 13.26L21 8M5 19H19C20.1 19 21 18.1 21 17V7C21 5.9 20.1 5 19 5H5C3.9 5 3 5.9 3 7V17C3 18.1 3.9 19 5 19Z"
                    stroke="#37322F"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="flex flex-col gap-2 max-w-[500px]">
                <h3 className="text-[#37322F] text-xl sm:text-2xl font-semibold font-sans tracking-tight">
                  Apply for Private Beta Access
                </h3>
                <p className="text-[#605A57] text-sm sm:text-base font-normal leading-relaxed font-sans">
                  We are currently onboarding an initial cohort of e-commerce storefronts, API providers, and autonomous agent builders. Enter your email to secure early access.
                </p>
              </div>

              {submitted ? (
                <div className="w-full max-w-[480px] p-4 bg-[#F2F8F4] border border-[#BDE0C7] rounded-xl flex items-center justify-center gap-3 text-[#1D6C3E] text-sm font-medium">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Thank you! We&apos;ve added you to the priority beta access list.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="w-full max-w-[500px] flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="merchant@store.com or developer@agent.ai"
                      className="w-full h-11 sm:h-12 px-4 bg-[#FBF9F8] border border-[#E0DEDB] rounded-full text-sm text-[#37322F] placeholder-[rgba(55,50,47,0.4)] focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] transition-all font-sans"
                    />
                  </div>
                  <button
                    type="submit"
                    className="h-11 sm:h-12 px-6 sm:px-8 bg-[#37322F] hover:bg-[#262320] text-white text-sm font-medium rounded-full shadow-sm transition-all duration-200 cursor-pointer flex justify-center items-center font-sans whitespace-nowrap"
                  >
                    Apply for Beta Access
                  </button>
                </form>
              )}

              {error && <div className="text-xs text-red-600 font-sans">{error}</div>}

              {/* Value Highlights */}
              <div className="pt-4 border-t border-[rgba(55,50,47,0.08)] w-full grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                <div className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#EFECE8] flex items-center justify-center text-[#37322F] text-[10px] font-bold mt-0.5">✓</div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#37322F] font-sans">Zero Subscriptions</span>
                    <span className="text-[11px] text-[#847E79] font-sans">No monthly platform fees during beta</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#EFECE8] flex items-center justify-center text-[#37322F] text-[10px] font-bold mt-0.5">✓</div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#37322F] font-sans">Powered by Moove</span>
                    <span className="text-[11px] text-[#847E79] font-sans">Non-custodial multi-chain settlement</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#EFECE8] flex items-center justify-center text-[#37322F] text-[10px] font-bold mt-0.5">✓</div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#37322F] font-sans">Sandbox Ready</span>
                    <span className="text-[11px] text-[#847E79] font-sans">Testnet HTTP 402 endpoints & docs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Decorative Pattern */}
          <div className="w-12 self-stretch relative overflow-hidden hidden md:block">
            <div className="w-[162px] left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
              {Array.from({ length: 120 }).map((_, i) => (
                <div
                  key={i}
                  className="self-stretch h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
