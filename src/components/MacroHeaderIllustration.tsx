import React from "react";
import { ScenarioShock } from "../utils/quantEngine";

interface MacroHeaderIllustrationProps {
  shock?: ScenarioShock;
  className?: string;
}

export const MacroHeaderIllustration: React.FC<MacroHeaderIllustrationProps> = ({
  shock,
  className = "",
}) => {
  const ratesBps = shock?.ratesBps ?? 0;
  const oilPct = shock?.oilPct ?? 0;
  const vixPoints = shock?.vixPoints ?? 0;
  const cpiPct = shock?.cpiPct ?? 0;

  return (
    <div
      className={`relative rounded-md border border-[#E2DCcf] bg-[#FAF8F3] overflow-hidden select-none shadow-xs ${className}`}
      aria-label="Macro-Financial Stress Testing Model Schematic"
    >
      {/* Background subtle micro-grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#D5CDBF_1px,transparent_1px)] [background-size:12px_12px] opacity-40 pointer-events-none" />

      {/* SVG Stress Manifold & Factor Vectors */}
      <svg
        viewBox="0 0 460 140"
        className="w-full h-full block"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle gradient for yield curve shift */}
          <linearGradient id="yieldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#245A46" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#245A46" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#245A46" stopOpacity="0.85" />
          </linearGradient>

          {/* Gradient for volatility shock wave */}
          <linearGradient id="vixGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#A44234" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#A44234" stopOpacity="0.25" />
          </linearGradient>

          {/* Sector nodes glow */}
          <filter id="nodeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#1F2421" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* Coordinate Axis Grid Lines */}
        <line x1="30" y1="20" x2="30" y2="120" stroke="#DDD6C8" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="30" y1="70" x2="435" y2="70" stroke="#D0C8B8" strokeWidth="1" />
        <line x1="130" y1="20" x2="130" y2="120" stroke="#EAE4D8" strokeWidth="0.8" strokeDasharray="2 2" />
        <line x1="230" y1="20" x2="230" y2="120" stroke="#EAE4D8" strokeWidth="0.8" strokeDasharray="2 2" />
        <line x1="330" y1="20" x2="330" y2="120" stroke="#EAE4D8" strokeWidth="0.8" strokeDasharray="2 2" />
        <line x1="430" y1="20" x2="430" y2="120" stroke="#DDD6C8" strokeWidth="1" strokeDasharray="3 3" />

        {/* Volatility Risk Envelope (Shaded Area under stochastic curve) */}
        <path
          d="M 30 70 Q 110 35, 180 50 T 310 38 Q 380 82, 430 70 L 430 70 L 30 70 Z"
          fill="url(#vixGrad)"
        />

        {/* Macro Vector 1: Treasury Yield Curve / Rates (Deep Sage Green) */}
        <path
          d="M 30 96 C 90 92, 160 84, 240 60 C 320 36, 380 28, 430 24"
          stroke="#245A46"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Baseline / Neutral Yield Curve (Dotted Gray) */}
        <path
          d="M 30 102 C 100 98, 180 88, 260 74 C 340 60, 390 56, 430 52"
          stroke="#9FA79F"
          strokeWidth="1.2"
          strokeDasharray="4 3"
        />

        {/* Macro Vector 2: Volatility / VIX Shock Spline (Terracotta Rust) */}
        <path
          d="M 30 70 Q 110 35, 180 50 T 310 38 Q 380 82, 430 70"
          stroke="#A44234"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray={vixPoints !== 0 ? "none" : "5 2"}
        />

        {/* Macro Vector 3: Commodity / Oil Dynamic Wave (Amber Ochre) */}
        <path
          d="M 30 65 C 80 85, 140 105, 200 90 C 260 75, 320 110, 380 85 C 405 72, 420 78, 430 82"
          stroke="#B8860B"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Macro Vector 4: Inflation Pressure Vector (Arrow) */}
        <g opacity="0.75">
          <line x1="240" y1="60" x2="240" y2="35" stroke="#7A5230" strokeWidth="1.2" strokeDasharray="2 2" />
          <polygon points="240,30 237,36 243,36" fill="#7A5230" />
          <text x="246" y="42" fill="#7A5230" fontSize="8" fontFamily="'JetBrains Mono', monospace" fontWeight="600">
            Δπ +CPI
          </text>
        </g>

        {/* Sector Nodes & Badges (SPDR ETF Sensitivity Nodes) */}
        {/* Node 1: Energy (XLE) - Beneficiary in Oil/Inflation */}
        <g filter="url(#nodeShadow)">
          <circle cx="190" cy="45" r="9" fill="#FFFFFF" stroke="#245A46" strokeWidth="1.5" />
          <text x="190" y="48" textAnchor="middle" fill="#1F2421" fontSize="7.5" fontFamily="'JetBrains Mono', monospace" fontWeight="700">
            XLE
          </text>
        </g>

        {/* Node 2: Financials (XLF) - Rates sensitive */}
        <g filter="url(#nodeShadow)">
          <circle cx="280" cy="48" r="9" fill="#FFFFFF" stroke="#245A46" strokeWidth="1.5" />
          <text x="280" y="51" textAnchor="middle" fill="#1F2421" fontSize="7.5" fontFamily="'JetBrains Mono', monospace" fontWeight="700">
            XLF
          </text>
        </g>

        {/* Node 3: Tech (XLK) - Duration sensitive */}
        <g filter="url(#nodeShadow)">
          <circle cx="340" cy="85" r="9" fill="#FFFFFF" stroke="#A44234" strokeWidth="1.5" />
          <text x="340" y="88" textAnchor="middle" fill="#1F2421" fontSize="7.5" fontFamily="'JetBrains Mono', monospace" fontWeight="700">
            XLK
          </text>
        </g>

        {/* Node 4: Utilities (XLU) - Bond proxy */}
        <g filter="url(#nodeShadow)">
          <circle cx="110" cy="98" r="9" fill="#FFFFFF" stroke="#7A807A" strokeWidth="1.2" />
          <text x="110" y="101" textAnchor="middle" fill="#1F2421" fontSize="7.5" fontFamily="'JetBrains Mono', monospace" fontWeight="700">
            XLU
          </text>
        </g>

        {/* Node 5: Industrials (XLI) - Cyclical node */}
        <g filter="url(#nodeShadow)">
          <circle cx="395" cy="58" r="8" fill="#FAF8F3" stroke="#B8860B" strokeWidth="1.2" />
          <text x="395" y="60.5" textAnchor="middle" fill="#1F2421" fontSize="6.5" fontFamily="'JetBrains Mono', monospace" fontWeight="600">
            XLI
          </text>
        </g>

        {/* Benchmark Reference Point SPY */}
        <g>
          <rect x="223" y="64" width="14" height="12" rx="2" fill="#1F2421" />
          <text x="230" y="73" textAnchor="middle" fill="#FAF8F3" fontSize="6.5" fontFamily="'JetBrains Mono', monospace" fontWeight="700">
            SPY
          </text>
        </g>

        {/* Vector Labels / Legend on Chart */}
        <g fontSize="7.5" fontFamily="'JetBrains Mono', monospace" fontWeight="500">
          {/* Rates Curve Label */}
          <text x="385" y="20" fill="#245A46" fontWeight="700">
            ΔRates (Yield Curve)
          </text>

          {/* VIX Shock Label */}
          <text x="45" y="38" fill="#A44234" fontWeight="600">
            ΔVIX Shock
          </text>

          {/* Oil/Commodity Label */}
          <text x="120" y="118" fill="#996E00">
            WTI Energy Vector
          </text>
        </g>

        {/* Mathematical Calibration Watermark */}
        <text
          x="30"
          y="18"
          fill="#8A928A"
          fontSize="7"
          fontFamily="'Newsreader', Georgia, serif"
          fontStyle="italic"
        >
          R_i = α_i + β_rates · Δy + β_oil · ΔOil + β_vix · ΔVIX + β_cpi · ΔCPI + ε_i
        </text>

        {/* Active Shock Micro-Indicator Pill (Bottom Right) */}
        <g>
          <rect
            x="320"
            y="114"
            width="132"
            height="18"
            rx="3"
            fill="#FFFFFF"
            stroke="#DCD5C6"
            strokeWidth="0.8"
          />
          <circle cx="329" cy="123" r="2.5" fill={ratesBps !== 0 || oilPct !== 0 || vixPoints !== 0 || cpiPct !== 0 ? "#245A46" : "#A44234"} />
          <text
            x="336"
            y="126"
            fill="#5C625C"
            fontSize="6.5"
            fontFamily="'JetBrains Mono', monospace"
            fontWeight="600"
          >
            {ratesBps !== 0 || oilPct !== 0 || vixPoints !== 0 || cpiPct !== 0
              ? `ACTIVE SHOCK: ${ratesBps > 0 ? "+" : ""}${ratesBps}bps / ${oilPct > 0 ? "+" : ""}${oilPct}%`
              : "STRESS TESTER ENGINE · ACTIVE"}
          </text>
        </g>
      </svg>
    </div>
  );
};
