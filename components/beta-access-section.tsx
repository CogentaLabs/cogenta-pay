"use client"

import { useState } from "react"
import Badge from "./landing/badge"

export default function BetaAccessSection() {
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
    <div id="waitlist" className="w-full flex flex-col justify-center items-center scroll-mt-20">
      {/* Header Section */}
      <div className="self-stretch px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] py-8 sm:py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
        <div className="w-full max-w-[760px] px-4 sm:px-6 py-4 sm:py-5 shadow-[0px_2px_4px_rgba(50,45,43,0.06)] overflow-hidden rounded-lg flex flex-col justify-start items-center gap-3 sm:gap-4 shadow-none">
          <Badge
            icon={
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#37322F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            text="Early Access"
          />
          <div className="w-full text-center flex justify-center flex-col text-[#49423D] text-2xl sm:text-3xl md:text-5xl font-semibold leading-tight md:leading-[58px] font-sans tracking-tight">
            Be first in line when we launch
          </div>
          <div className="w-full max-w-[620px] text-center text-[#605A57] text-sm sm:text-base font-normal leading-relaxed font-sans">
            We are preparing CogentaPay for public beta. Leave your email to receive early invitations, developer testnet credentials, and 1-click storefront plugin releases.
          </div>
        </div>
      </div>

      {/* Email Subscription Container */}
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

          {/* Center Card */}
          <div className="flex-1 max-w-[760px] py-10 md:py-16 px-4 sm:px-6 flex flex-col justify-center items-center gap-8">
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

              <div className="flex flex-col gap-2 max-w-[580px]">
                <h3 className="text-[#37322F] text-xl sm:text-2xl font-semibold font-sans tracking-tight">
                  Get Early Access to CogentaPay
                </h3>
                <p className="text-[#605A57] text-sm sm:text-base font-normal leading-relaxed font-sans">
                  Join merchants, API providers, and autonomous AI developers testing next-gen machine settlement on Moove non-custodial rails.
                </p>
              </div>

              {submitted ? (
                <div className="w-full max-w-[480px] p-4 bg-[#F2F8F4] border border-[#BDE0C7] rounded-xl flex items-center justify-center gap-3 text-[#1D6C3E] text-sm font-medium">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>You&apos;re on the list! We&apos;ll notify you as soon as the beta opens.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="w-full max-w-[540px] flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com, builder@agent.ai, or store@shop.com"
                      className="w-full h-11 sm:h-12 px-4 bg-[#FBF9F8] border border-[#E0DEDB] rounded-full text-sm text-[#37322F] placeholder-[rgba(55,50,47,0.4)] focus:outline-none focus:ring-2 focus:ring-[#37322F]/20 focus:border-[#37322F] transition-all font-sans"
                    />
                  </div>
                  <button
                    type="submit"
                    className="h-11 sm:h-12 px-6 sm:px-8 bg-[#37322F] hover:bg-[#262320] text-white text-sm font-medium rounded-full shadow-sm transition-all duration-200 cursor-pointer flex justify-center items-center font-sans whitespace-nowrap"
                  >
                    Join Waitlist
                  </button>
                </form>
              )}

              {error && <div className="text-xs text-red-600 font-sans">{error}</div>}

              <div className="pt-2 text-xs text-[#847E79] font-sans">
                We respect your inbox. Zero spam — only private beta invitations &amp; product release updates.
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
