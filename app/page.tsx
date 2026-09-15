"use client"

import Navigation from "../components/landing/navigation"
import HeroSection from "../components/landing/hero"
import ProductShowcase from "../components/landing/product-showcase"
import SocialProof from "../components/landing/social-proof"
import BentoGrid from "../components/landing/bento-grid"
import DocumentationSection from "../components/documentation-section"
import ArchitectureSection from "../components/architecture-section"
import FAQSection from "../components/faq-section"
import BetaAccessSection from "../components/beta-access-section"
import FooterSection from "../components/footer-section"

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen relative bg-[#F7F5F3] overflow-x-hidden flex flex-col justify-start items-center">
      <div className="relative flex flex-col justify-start items-center w-full">
        {/* Main container with proper margins */}
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] relative flex flex-col justify-start items-start min-h-screen">
          {/* Left vertical line */}
          <div className="w-[1px] h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

          {/* Right vertical line */}
          <div className="w-[1px] h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

          <div className="self-stretch pt-[9px] overflow-hidden border-b border-[rgba(55,50,47,0.06)] flex flex-col justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-[66px] relative z-10">
            {/* 1. Navigation */}
            <Navigation />

            {/* 2. Hero Section */}
            <HeroSection />

            {/* 3. Product Showcase (Auto-Switching Hero Carousel) */}
            <ProductShowcase />

            {/* 4. Social Proof & Protocols (Moove, Google AP2, Coinbase x402) */}
            <SocialProof />

            {/* 5. Bento Grid (Why Agents Fail & Non-Interactive Settlement) */}
            <BentoGrid />

            {/* 6. Documentation Section (Every Way an Agent Can Pay) */}
            <DocumentationSection />

            {/* 7. Moove Settlement Architecture & Developer Code Sandbox */}
            <ArchitectureSection />

            {/* 8. FAQ Section */}
            <FAQSection />

            {/* 9. Consolidated Beta Access / Grant Cohort CTA */}
            <BetaAccessSection />

            {/* 10. Footer Section */}
            <FooterSection />
          </div>
        </div>
      </div>
    </div>
  )
}
