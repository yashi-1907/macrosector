import React from "react";
import { SectorSensitivity, ScenarioShock } from "../utils/quantEngine";
import { SECTORS } from "../data/historicalData";
import { ShieldCheck, AlertTriangle } from "lucide-react";

interface RotationMemoProps {
  sectors: SectorSensitivity[];
  benchmark: SectorSensitivity;
  shock: ScenarioShock;
  includeCpi: boolean;
  dispersion: number;
}

export const RotationMemo: React.FC<RotationMemoProps> = ({
  sectors,
  benchmark,
  shock,
  includeCpi,
  dispersion,
}) => {
  const topSectors = sectors.slice(0, 3);
  const bottomSectors = sectors.slice(-3).reverse();

  return (
    <div className="space-y-5">
      {/* Portfolio Implementation Matrix (Tilts Table) */}
      <div className="bg-[#FFFFFF] border border-[#E8E3D8] rounded-md p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-[#E8E3D8] gap-1">
          <div>
            <h2 className="font-editorial text-lg font-bold text-[#1F2421]">
              Target Portfolio Sector Tilts
            </h2>
            <div className="text-xs text-[#5C625C] font-mono-tabular">
              Active Tilt vs. SPY Benchmark · Horizon: 1-Month · Dispersion: {dispersion.toFixed(2)}%
            </div>
          </div>
          <div className="text-xs text-[#5C625C] font-mono-tabular">
            SPY Implied Return:{" "}
            <span className="font-bold text-[#1F2421]">
              {benchmark.predictedReturn >= 0 ? "+" : ""}
              {benchmark.predictedReturn.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E0D9CB] bg-[#FAF8F3] text-[#5C625C] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-2 px-3">Sector</th>
                <th className="py-2 px-3 text-right">SPY Wt</th>
                <th className="py-2 px-3 text-right">Model Return</th>
                <th className="py-2 px-3 text-right">Active Tilt</th>
                <th className="py-2 px-3 text-right">Target Wt</th>
                <th className="py-2 px-3 text-center">Stance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EBE0] font-mono-tabular">
              {sectors.map((s) => (
                <tr key={s.symbol} className="hover:bg-[#FAF8F3]/60 transition-colors">
                  <td className="py-2 px-3 font-sans">
                    <span className="font-mono-tabular font-bold text-[#1F2421] mr-2">
                      {s.symbol}
                    </span>
                    <span className="text-[#5C625C]">{s.name}</span>
                  </td>
                  <td className="py-2 px-3 text-right text-[#5C625C]">
                    {s.benchmarkWeight.toFixed(1)}%
                  </td>
                  <td className="py-2 px-3 text-right font-semibold">
                    <span className={s.predictedReturn >= 0 ? "text-[#245A46]" : "text-[#A44234]"}>
                      {s.predictedReturn >= 0 ? "+" : ""}
                      {s.predictedReturn.toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right font-bold">
                    <span className={s.recommendedTilt >= 0 ? "text-[#245A46]" : "text-[#A44234]"}>
                      {s.recommendedTilt >= 0 ? "+" : ""}
                      {s.recommendedTilt.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-[#1F2421]">
                    {s.recommendedWeight.toFixed(1)}%
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span
                      className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        s.stance === "Overweight"
                          ? "bg-[#245A46]/10 text-[#245A46]"
                          : s.stance === "Underweight"
                          ? "bg-[#A44234]/10 text-[#A44234]"
                          : "bg-[#5C625C]/10 text-[#5C625C]"
                      }`}
                    >
                      {s.stance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Overweight vs Underweight Rationale Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Overweight Recommendations */}
        <div className="p-4 bg-[#FFFFFF] border border-[#E8E3D8] rounded-md">
          <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-[#E8E3D8]">
            <ShieldCheck className="w-4 h-4 text-[#245A46]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#245A46]">
              Top Overweights
            </span>
          </div>
          <div className="space-y-2 text-xs">
            {topSectors.map((s, idx) => (
              <div key={s.symbol} className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-semibold text-[#1F2421]">
                    {s.symbol} ({s.name})
                  </span>
                  <div className="text-[11px] text-[#5C625C] leading-tight">
                    {SECTORS[s.symbol]?.macroTransmission}
                  </div>
                </div>
                <span className="font-mono-tabular font-bold text-[#245A46] shrink-0">
                  +{s.predictedReturn.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Underweight Recommendations */}
        <div className="p-4 bg-[#FFFFFF] border border-[#E8E3D8] rounded-md">
          <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-[#E8E3D8]">
            <AlertTriangle className="w-4 h-4 text-[#A44234]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#A44234]">
              Top Underweights / Hedges
            </span>
          </div>
          <div className="space-y-2 text-xs">
            {bottomSectors.map((s, idx) => (
              <div key={s.symbol} className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-semibold text-[#1F2421]">
                    {s.symbol} ({s.name})
                  </span>
                  <div className="text-[11px] text-[#5C625C] leading-tight">
                    {SECTORS[s.symbol]?.macroTransmission}
                  </div>
                </div>
                <span className="font-mono-tabular font-bold text-[#A44234] shrink-0">
                  {s.predictedReturn.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
