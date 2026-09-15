import type React from "react"

interface EffortlessIntegrationProps {
  /** Fixed width from Figma: 482px */
  width?: number | string
  /** Fixed height from Figma: 300px */
  height?: number | string
  /** Optional className to pass to root */
  className?: string
}

/**
 * Effortless Integration – Service integration constellation
 * Three concentric rings with logos positioned on ring axes
 */
const EffortlessIntegration: React.FC<EffortlessIntegrationProps> = ({ width = 482, height = 300, className = "" }) => {
  const centerX = 250
  const centerY = 179
  const rings = [
    { radius: 80, logos: 2 }, // Inner ring - 2 logos
    { radius: 120, logos: 3 }, // Middle ring - 3 logos
    { radius: 160, logos: 2 }, // Outer ring - 2 logos
  ]

  const getPositionOnRing = (ringRadius: number, angle: number) => ({
    x: centerX + ringRadius * Math.cos(angle),
    y: centerY + ringRadius * Math.sin(angle),
  })

  return (
    <div
      className={className}
      style={{
        width,
        height,
        position: "relative",
        overflow: "hidden",
        maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, transparent 20%, transparent 80%, rgba(255,255,255,0.1) 100%)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      {/* Outer ring */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          border: "1px solid rgba(55, 50, 47, 0.2)",
          opacity: 0.8,
        }}
      />
      {/* Middle ring */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "240px",
          height: "240px",
          borderRadius: "50%",
          border: "1px solid rgba(55, 50, 47, 0.25)",
          opacity: 0.7,
        }}
      />
      {/* Inner ring */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          border: "1px solid rgba(55, 50, 47, 0.3)",
          opacity: 0.6,
        }}
      />

      {/* Company logos positioned systematically on ring axes */}
      <div
        style={{
          width: "500px",
          height: "358px",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          position: "absolute",
        }}
      >
        {/* Center Moove icon */}
        <div
          style={{
            width: "56px",
            height: "56px",
            left: `${centerX - 28}px`,
            top: `${centerY - 28}px`,
            position: "absolute",
            background: "#37322F",
            boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.2)",
            borderRadius: "99px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 800,
            fontSize: "24px",
            color: "#FFCE31",
          }}
        >
          M
        </div>

        {/* Ethereum - 180° (left) */}
        <div
          style={{
            width: "32px",
            height: "32px",
            left: `${getPositionOnRing(80, Math.PI).x - 16}px`,
            top: `${getPositionOnRing(80, Math.PI).y - 16}px`,
            position: "absolute",
            background: "#627EEA",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <img
            src="/icons/ethereum.svg"
            alt="Ethereum"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Solana - 0° (right) */}
        <div
          style={{
            width: "32px",
            height: "32px",
            left: `${getPositionOnRing(80, 0).x - 16}px`,
            top: `${getPositionOnRing(80, 0).y - 16}px`,
            position: "absolute",
            background: "#000000",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <img
            src="/icons/solana.svg"
            alt="Solana"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Polygon - 315° (top-right) */}
        <div
          style={{
            width: "32px",
            height: "32px",
            left: `${getPositionOnRing(120, -Math.PI / 4).x - 16}px`,
            top: `${getPositionOnRing(120, -Math.PI / 4).y - 16}px`,
            position: "absolute",
            background: "#7B3FE4",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <img
            src="/icons/polygon.svg"
            alt="Polygon"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Arbitrum - 135° (bottom-left) */}
        <div
          style={{
            width: "32px",
            height: "32px",
            left: `${getPositionOnRing(120, (3 * Math.PI) / 4).x - 16}px`,
            top: `${getPositionOnRing(120, (3 * Math.PI) / 4).y - 16}px`,
            position: "absolute",
            background: "#28A0F0",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <img
            src="/icons/arbitrum.svg"
            alt="Arbitrum"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Base - 225° (bottom-left diagonal) */}
        <div
          style={{
            width: "32px",
            height: "32px",
            left: `${getPositionOnRing(120, (5 * Math.PI) / 4).x - 16}px`,
            top: `${getPositionOnRing(120, (5 * Math.PI) / 4).y - 16}px`,
            position: "absolute",
            background: "#0052FF",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <img
            src="/icons/base.svg"
            alt="Base"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Optimism - 180° (outer left) */}
        <div
          style={{
            width: "32px",
            height: "32px",
            left: `${getPositionOnRing(160, Math.PI).x - 16}px`,
            top: `${getPositionOnRing(160, Math.PI).y - 16}px`,
            position: "absolute",
            background: "#FF0420",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <img
            src="/icons/optimism.svg"
            alt="Optimism"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Bitcoin - 0° (outer right) */}
        <div
          style={{
            width: "32px",
            height: "32px",
            left: `${getPositionOnRing(160, 0).x - 16}px`,
            top: `${getPositionOnRing(160, 0).y - 16}px`,
            position: "absolute",
            background: "#F7931A",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/bitcoin.svg"
            alt="Bitcoin"
            style={{
              width: "18px",
              height: "18px",
              filter: "brightness(0) invert(1)",
            }}
          />
        </div>

        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(55, 50, 47, 0.1)" />
              <stop offset="50%" stopColor="rgba(55, 50, 47, 0.05)" />
              <stop offset="100%" stopColor="rgba(55, 50, 47, 0.1)" />
            </linearGradient>
          </defs>

          {/* Inner ring connections */}
          <line
            x1={centerX}
            y1={centerY}
            x2={getPositionOnRing(80, 0).x}
            y2={getPositionOnRing(80, 0).y}
            stroke="url(#connectionGradient)"
            strokeWidth="1"
            opacity="0.2"
          />
          <line
            x1={centerX}
            y1={centerY}
            x2={getPositionOnRing(80, Math.PI).x}
            y2={getPositionOnRing(80, Math.PI).y}
            stroke="url(#connectionGradient)"
            strokeWidth="1"
            opacity="0.2"
          />

          {/* Middle ring connections */}
          <line
            x1={centerX}
            y1={centerY}
            x2={getPositionOnRing(120, -Math.PI / 4).x}
            y2={getPositionOnRing(120, -Math.PI / 4).y}
            stroke="url(#connectionGradient)"
            strokeWidth="1"
            opacity="0.15"
          />
          <line
            x1={centerX}
            y1={centerY}
            x2={getPositionOnRing(120, (3 * Math.PI) / 4).x}
            y2={getPositionOnRing(120, (3 * Math.PI) / 4).y}
            stroke="url(#connectionGradient)"
            strokeWidth="1"
            opacity="0.15"
          />
          <line
            x1={centerX}
            y1={centerY}
            x2={getPositionOnRing(120, (5 * Math.PI) / 4).x}
            y2={getPositionOnRing(120, (5 * Math.PI) / 4).y}
            stroke="url(#connectionGradient)"
            strokeWidth="1"
            opacity="0.15"
          />

          {/* Outer ring connections */}
          <line
            x1={centerX}
            y1={centerY}
            x2={getPositionOnRing(160, 0).x}
            y2={getPositionOnRing(160, 0).y}
            stroke="url(#connectionGradient)"
            strokeWidth="1"
            opacity="0.1"
          />
          <line
            x1={centerX}
            y1={centerY}
            x2={getPositionOnRing(160, Math.PI).x}
            y2={getPositionOnRing(160, Math.PI).y}
            stroke="url(#connectionGradient)"
            strokeWidth="1"
            opacity="0.1"
          />
        </svg>
      </div>
    </div>
  )
}

export default EffortlessIntegration
