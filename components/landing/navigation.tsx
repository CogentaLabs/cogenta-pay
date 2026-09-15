"use client"

export default function Navigation() {
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
    <div className="w-full h-12 sm:h-14 md:h-16 lg:h-[84px] absolute left-0 top-0 flex justify-center items-center z-20 px-6 sm:px-8 md:px-12 lg:px-0">
      <div className="w-full h-0 absolute left-0 top-6 sm:top-7 md:top-8 lg:top-[42px] border-t border-[rgba(55,50,47,0.12)] shadow-[0px_1px_0px_white]"></div>

      <div className="w-full max-w-[calc(100%-32px)] sm:max-w-[calc(100%-48px)] md:max-w-[calc(100%-64px)] lg:max-w-[700px] lg:w-[700px] h-10 sm:h-11 md:h-12 py-1.5 sm:py-2 px-3 sm:px-4 md:px-4 pr-2 sm:pr-3 bg-[#F7F5F3] backdrop-blur-sm shadow-[0px_0px_0px_2px_white] overflow-hidden rounded-[50px] flex justify-between items-center relative z-30">
        <div className="flex justify-center items-center">
          <button
            onClick={scrollToTop}
            className="flex flex-col justify-center items-start text-left cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="flex flex-col justify-center text-[#2F3037] text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-5 font-sans">
              CogentaPay
            </div>
            <div className="hidden sm:flex flex-col justify-center text-[rgba(49,45,43,0.55)] text-[9px] md:text-[10px] font-medium leading-[12px] font-sans">
              by Cogenta Labs
            </div>
          </button>

          <div className="pl-4 sm:pl-5 md:pl-6 flex justify-start items-center hidden sm:flex flex-row gap-3 sm:gap-4 md:gap-5">
            <button
              onClick={() => scrollTo("products")}
              className="text-[rgba(49,45,43,0.80)] text-xs md:text-[13px] font-medium leading-[14px] font-sans cursor-pointer hover:text-[#37322F] transition-colors"
            >
              Products
            </button>
            <button
              onClick={() => scrollTo("protocol")}
              className="text-[rgba(49,45,43,0.80)] text-xs md:text-[13px] font-medium leading-[14px] font-sans cursor-pointer hover:text-[#37322F] transition-colors"
            >
              Protocol
            </button>
            <button
              onClick={() => scrollTo("developers")}
              className="text-[rgba(49,45,43,0.80)] text-xs md:text-[13px] font-medium leading-[14px] font-sans cursor-pointer hover:text-[#37322F] transition-colors"
            >
              Developers
            </button>
            <a
              href="/demo"
              className="text-[#1D6C3E] bg-[#E8F5E9] px-2 py-0.5 rounded-full text-xs font-medium font-sans hover:bg-[#C8E6C9] transition-colors flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse"></span>
              Live Demo
            </a>
          </div>
        </div>

        <div className="h-6 sm:h-7 md:h-8 flex justify-start items-center gap-2 sm:gap-3">
          <button
            onClick={() => scrollTo("waitlist")}
            className="px-2.5 sm:px-3 md:px-[14px] py-1 sm:py-[6px] bg-[#37322F] hover:bg-[#262320] transition-colors shadow-[0px_1px_2px_rgba(55,50,47,0.12)] overflow-hidden rounded-full flex justify-center items-center cursor-pointer"
          >
            <div className="flex flex-col justify-center text-white text-xs md:text-[13px] font-medium leading-5 font-sans whitespace-nowrap">
              Get Early Access
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
