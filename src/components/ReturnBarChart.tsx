import React, { useState } from "react";
import { SectorSensitivity } from "../utils/quantEngine";
import { Info, ArrowUpRight, ArrowDownRight, Layers } from "lucide-react";

interface ReturnBarChartProps {
  sectors: SectorSensitivity[];
  benchmark: SectorSensitivity;
  dispersion: number;
}

export const ReturnBarChart: React.FC<ReturnBarChartProps> = ({
  sectors,
  benchmark,
  dispersion,
}) => {
  const [hoveredSector, setHoveredSector] = useState<SectorSensitivity | null>(null);

  // Compute maximum absolute return to normalize horizontal bar widths
  const maxAbsVal = Math.max(
    ...sectors.map((s) => Math.abs(s.predictedReturn)),
    Math.abs(benchmark.predictedReturn),
    4.0
  );

  return (
    <div className="bg-[#FFFFFF] border border-[#E8E3D8] rounded-md p-5 shadow-xs relative">
      {/* Title & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-[#E8E3D8] gap-2">
        <h2 className="font-editorial text-base font-bold text-[#1F2421]">
          Sector Forward Returns
        </h2>
        <div className="flex items-center gap-3 text-xs text-[#5C625C]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#245A46]"></span>
            <span>Long</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#A44234]"></span>
            <span>Hedge</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 border border-dashed border-[#5C625C] rounded-xs bg-transparent"></span>
            <span>SPY Benchmark ({benchmark.predictedReturn >= 0 ? "+" : ""}{benchmark.predictedReturn.toFixed(2)}%)</span>
          </div>
        </div>
      </div>

      {/* Main Bar Chart Container */}
      <div className="space-y-2 relative pt-2 pb-4">
        {/* Benchmark SPY Reference Line Callout */}
        <div className="flex items-center justify-between px-3 py-1.5 mb-3 bg-[#FAF8F3] border border-dashed border-[#D4CBB8] rounded text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1F2421]">S&P 500 Benchmark (SPY):</span>
            <span className="text-[#5C625C] font-mono-tabular">
              {benchmark.predictedReturn >= 0 ? `+${benchmark.predictedReturn.toFixed(2)}` : benchmark.predictedReturn.toFixed(2)}%
            </span>
          </div>
          <div className="text-[11px] text-[#5C625C]">
            Long-Short Sector Spread Dispersion: <span className="font-mono-tabular font-bold text-[#1F2421]">{dispersion.toFixed(2)}%</span>
          </div>
        </div>

        {/* 11 Sectors Horizontal Bars */}
        {sectors.map((s, idx) => {
          const val = s.predictedReturn;
          const isPositive = val >= 0;
          const excessVsSpy = val - benchmark.predictedReturn;
          const barWidthPercent = (Math.abs(val) / maxAbsVal) * 45; // 45% max on either half

          return (
            <div
              key={s.symbol}
              onMouseEnter={() => setHoveredSector(s)}
              onMouseLeave={() => setHoveredSector(null)}
              className="group relative flex items-center text-xs py-1 px-2 rounded hover:bg-[#FAF8F3] transition-colors cursor-pointer"
            >
              {/* Sector Name & Symbol */}
              <div className="w-44 sm:w-52 shrink-0 flex items-center justify-between pr-3">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-[10px] font-mono-tabular text-[#5C625C] w-4 text-right">
                    {idx + 1}.
                  </span>
                  <span className="font-mono-tabular font-bold text-[#1F2421]">
                    {s.symbol}
                  </span>
                  <span className="text-[#5C625C] truncate">{s.name}</span>
                </div>
              </div>

              {/* Dynamic Divergent Bar Area */}
              <div className="relative flex-1 h-6 flex items-center">
                {/* Center Zero Hairline */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#DCD5C6] z-10"></div>

                {/* Benchmark Indicator Tick */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 border-l border-dashed border-[#5C625C] z-15"
                  style={{
                    left: `${50 + (benchmark.predictedReturn / maxAbsVal) * 45}%`,
                  }}
                  title={`Benchmark SPY: ${benchmark.predictedReturn.toFixed(2)}%`}
                ></div>

                {/* Left Side (Negative Returns) */}
                <div className="w-1/2 h-full flex items-center justify-end pr-0.5">
                  {!isPositive && (
                    <div
                      className="h-4.5 rounded-xs transition-all duration-300 flex items-center justify-start pl-1.5"
                      style={{
                        width: `${Math.max(barWidthPercent, 1.5)}%`,
                        backgroundColor: "#A44234",
                      }}
                    ></div>
                  )}
                </div>

                {/* Right Side (Positive Returns) */}
                <div className="w-1/2 h-full flex items-center justify-start pl-0.5">
                  {isPositive && (
                    <div
                      className="h-4.5 rounded-xs transition-all duration-300 flex items-center justify-end pr-1.5"
                      style={{
                        width: `${Math.max(barWidthPercent, 1.5)}%`,
                        backgroundColor: "#245A46",
                      }}
                    ></div>
                  )}
                </div>
              </div>

              {/* Return Number Output */}
              <div className="w-20 shrink-0 text-right pl-3 font-mono-tabular font-bold">
                <span className={val >= 0 ? "text-[#245A46]" : "text-[#A44234]"}>
                  {val >= 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Axis Labels */}
      <div className="flex justify-between text-[11px] font-mono-tabular text-[#5C625C] pt-2 border-t border-[#E8E3D8] px-2">
        <span>-{(maxAbsVal * 0.9).toFixed(1)}%</span>
        <span>-{(maxAbsVal * 0.45).toFixed(1)}%</span>
        <span className="font-semibold text-[#1F2421]">0.0% (Equilibrium)</span>
        <span>+{(maxAbsVal * 0.45).toFixed(1)}%</span>
        <span>+{(maxAbsVal * 0.9).toFixed(1)}%</span>
      </div>

      {/* Interactive Tooltip Card on Hover */}
      {hoveredSector && (
        <div className="mt-4 p-3.5 bg-[#F9F7F1] border border-[#E0D9CB] rounded text-xs transition-all">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E8E3D8]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#1F2421] text-sm">
                {hoveredSector.name} ({hoveredSector.symbol})
              </span>
              <span
                className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                  hoveredSector.stance === "Overweight"
                    ? "bg-[#245A46]/10 text-[#245A46]"
                    : hoveredSector.stance === "Underweight"
                    ? "bg-[#A44234]/10 text-[#A44234]"
                    : "bg-[#5C625C]/10 text-[#5C625C]"
                }`}
              >
                {hoveredSector.stance}
              </span>
            </div>
            <div className="font-mono-tabular font-bold text-sm">
              Predicted:{" "}
              <span
                className={
                  hoveredSector.predictedReturn >= 0 ? "text-[#245A46]" : "text-[#A44234]"
                }
              >
                {hoveredSector.predictedReturn >= 0 ? `+` : ``}
                {hoveredSector.predictedReturn.toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Factor Attribution Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] font-mono-tabular">
            <div className="bg-[#FFFFFF] p-2 rounded border border-[#E8E3D8]">
              <span className="text-[#5C625C] block text-[10px] uppercase">Alpha (Intercept)</span>
              <span className="font-semibold text-[#1F2421]">
                {hoveredSector.attribution.alpha >= 0 ? "+" : ""}
                {hoveredSector.attribution.alpha.toFixed(2)}%
              </span>
            </div>
            <div className="bg-[#FFFFFF] p-2 rounded border border-[#E8E3D8]">
              <span className="text-[#5C625C] block text-[10px] uppercase">Rates Impact</span>
              <span
                className={`font-semibold ${
                  hoveredSector.attribution.rates >= 0 ? "text-[#245A46]" : "text-[#A44234]"
                }`}
              >
                {hoveredSector.attribution.rates >= 0 ? "+" : ""}
                {hoveredSector.attribution.rates.toFixed(2)}%
              </span>
            </div>
            <div className="bg-[#FFFFFF] p-2 rounded border border-[#E8E3D8]">
              <span className="text-[#5C625C] block text-[10px] uppercase">Oil Impact</span>
              <span
                className={`font-semibold ${
                  hoveredSector.attribution.oil >= 0 ? "text-[#245A46]" : "text-[#A44234]"
                }`}
              >
                {hoveredSector.attribution.oil >= 0 ? "+" : ""}
                {hoveredSector.attribution.oil.toFixed(2)}%
              </span>
            </div>
            <div className="bg-[#FFFFFF] p-2 rounded border border-[#E8E3D8]">
              <span className="text-[#5C625C] block text-[10px] uppercase">VIX Impact</span>
              <span
                className={`font-semibold ${
                  hoveredSector.attribution.vix >= 0 ? "text-[#245A46]" : "text-[#A44234]"
                }`}
              >
                {hoveredSector.attribution.vix >= 0 ? "+" : ""}
                {hoveredSector.attribution.vix.toFixed(2)}%
              </span>
            </div>
            <div className="bg-[#FFFFFF] p-2 rounded border border-[#E8E3D8]">
              <span className="text-[#5C625C] block text-[10px] uppercase">Model R²</span>
              <span className="font-semibold text-[#1F2421]">
                {(hoveredSector.rSquared * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
