"use client"

export default function FooterSection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="w-full pt-10 flex flex-col justify-start items-start">
      {/* Main Footer Content */}
      <div className="self-stretch h-auto flex flex-col md:flex-row justify-between items-start md:items-center px-4 md:px-8 pb-8 pt-0 gap-6">
        {/* Brand Section */}
        <div className="flex flex-col justify-start items-start gap-2 max-w-[500px]">
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity text-left"
          >
            <span className="text-[#37322F] text-lg font-semibold font-sans">CogentaPay</span>
            <span className="text-xs px-2 py-0.5 bg-[#EFECE8] text-[#605A57] rounded-full font-medium font-sans">
              by Cogenta Labs
            </span>
          </button>
          <div className="text-[rgba(73,66,61,0.75)] text-xs sm:text-sm font-normal font-sans leading-relaxed">
            The Checkout Layer for Autonomous AI Agents.
          </div>
        </div>

        {/* In-Page Navigation Links */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-[#605A57] font-sans">
          <button
            onClick={() => scrollTo("products")}
            className="hover:text-[#37322F] transition-colors cursor-pointer"
          >
            Products
          </button>
          <button
            onClick={() => scrollTo("protocol")}
            className="hover:text-[#37322F] transition-colors cursor-pointer"
          >
            Protocol
          </button>
          <button
            onClick={() => scrollTo("developers")}
            className="hover:text-[#37322F] transition-colors cursor-pointer"
          >
            Developers
          </button>
          <button
            onClick={() => scrollTo("faq")}
            className="hover:text-[#37322F] transition-colors cursor-pointer"
          >
            FAQ
          </button>
          <button
            onClick={() => scrollTo("waitlist")}
            className="hover:text-[#37322F] text-[#37322F] font-semibold transition-colors cursor-pointer"
          >
            Join Waitlist
          </button>
        </div>
      </div>

      {/* Footer Sub-bar */}
      <div className="self-stretch px-4 md:px-8 py-3 border-t border-[rgba(55,50,47,0.08)] flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-[#847E79] font-sans">
        <div>Non-custodial cross-chain checkout • Powered by Moove rails</div>
        <div>&copy; {new Date().getFullYear()} Cogenta Labs. All rights reserved.</div>
      </div>

      {/* Bottom Section with Pattern */}
      <div className="self-stretch h-10 relative overflow-hidden border-t border-b border-[rgba(55,50,47,0.12)]">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="w-full h-full relative">
            {Array.from({ length: 400 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-[300px] h-16 border border-[rgba(3,7,18,0.08)]"
                style={{
                  left: `${i * 300 - 600}px`,
                  top: "-120px",
                  transform: "rotate(-45deg)",
                  transformOrigin: "top left",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
