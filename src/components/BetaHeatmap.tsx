import React, { useState } from "react";
import { SectorSensitivity } from "../utils/quantEngine";
import { ArrowUpDown, HelpCircle } from "lucide-react";

interface BetaHeatmapProps {
  sectors: SectorSensitivity[];
  includeCpi: boolean;
}

type SortField =
  | "symbol"
  | "name"
  | "betaRatesScaled"
  | "betaOilScaled"
  | "betaVixScaled"
  | "betaCpiScaled"
  | "alphaMonthly"
  | "rSquared";

export const BetaHeatmap: React.FC<BetaHeatmapProps> = ({ sectors, includeCpi }) => {
  const [sortField, setSortField] = useState<SortField>("betaRatesScaled");
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sortedSectors = [...sectors].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (typeof valA === "string" && typeof valB === "string") {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
  });

  // Color generator for heatmap cells
  const getCellBg = (val: number, min: number, max: number) => {
    if (val === 0) return "#FAF8F3";
    const absMax = Math.max(Math.abs(min), Math.abs(max)) || 1;
    const intensity = Math.min(Math.abs(val) / absMax, 1);

    if (val > 0) {
      // Light forest green tint
      return `rgba(36, 90, 70, ${0.08 + intensity * 0.45})`;
    } else {
      // Light terracotta tint
      return `rgba(164, 66, 52, ${0.08 + intensity * 0.45})`;
    }
  };

  // Find mins/maxs for color mapping
  const ratesVals = sectors.map((s) => s.betaRatesScaled);
  const minRates = Math.min(...ratesVals);
  const maxRates = Math.max(...ratesVals);

  const oilVals = sectors.map((s) => s.betaOilScaled);
  const minOil = Math.min(...oilVals);
  const maxOil = Math.max(...oilVals);

  const vixVals = sectors.map((s) => s.betaVixScaled);
  const minVix = Math.min(...vixVals);
  const maxVix = Math.max(...vixVals);

  const cpiVals = sectors.map((s) => s.betaCpiScaled);
  const minCpi = Math.min(...cpiVals);
  const maxCpi = Math.max(...cpiVals);

  return (
    <div className="bg-[#FFFFFF] border border-[#E8E3D8] rounded-md p-5 shadow-xs">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-[#E8E3D8] gap-1">
        <h2 className="font-editorial text-base font-bold text-[#1F2421]">
          Macro Factor Beta Matrix
        </h2>
        <div className="text-xs text-[#5C625C] font-mono-tabular">
          Mean R²: {(sectors.reduce((acc, s) => acc + s.rSquared, 0) / sectors.length * 100).toFixed(1)}%
        </div>
      </div>

      {/* Heatmap Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E0D9CB] bg-[#FAF8F3] text-[#5C625C] font-semibold text-[11px] uppercase tracking-wider">
              <th
                onClick={() => handleSort("symbol")}
                className="py-2.5 px-3 cursor-pointer hover:text-[#1F2421]"
              >
                <div className="flex items-center gap-1">
                  <span>Sector ETF</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th
                onClick={() => handleSort("betaRatesScaled")}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-[#1F2421]"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>ΔRates Beta (+100bps)</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th
                onClick={() => handleSort("betaOilScaled")}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-[#1F2421]"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>ΔOil Beta (+10%)</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th
                onClick={() => handleSort("betaVixScaled")}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-[#1F2421]"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>ΔVIX Beta (+5 pts)</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              {includeCpi && (
                <th
                  onClick={() => handleSort("betaCpiScaled")}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-[#1F2421]"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>ΔCPI Beta (+1.0%)</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
              )}
              <th
                onClick={() => handleSort("alphaMonthly")}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-[#1F2421]"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Monthly Alpha (α)</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th
                onClick={() => handleSort("rSquared")}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-[#1F2421]"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Model R²</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EBE0] font-mono-tabular">
            {sortedSectors.map((s) => (
              <tr key={s.symbol} className="hover:bg-[#FAF8F3]/60 transition-colors">
                <td className="py-2.5 px-3 font-sans">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-tabular font-bold text-[#1F2421] w-10">
                      {s.symbol}
                    </span>
                    <span className="text-[#5C625C]">{s.name}</span>
                  </div>
                </td>

                {/* Rates Beta */}
                <td
                  className="py-2.5 px-3 text-right font-semibold"
                  style={{ backgroundColor: getCellBg(s.betaRatesScaled, minRates, maxRates) }}
                >
                  <span className={s.betaRatesScaled >= 0 ? "text-[#245A46]" : "text-[#A44234]"}>
                    {s.betaRatesScaled >= 0 ? `+` : ``}
                    {s.betaRatesScaled.toFixed(2)}%
                  </span>
                </td>

                {/* Oil Beta */}
                <td
                  className="py-2.5 px-3 text-right font-semibold"
                  style={{ backgroundColor: getCellBg(s.betaOilScaled, minOil, maxOil) }}
                >
                  <span className={s.betaOilScaled >= 0 ? "text-[#245A46]" : "text-[#A44234]"}>
                    {s.betaOilScaled >= 0 ? `+` : ``}
                    {s.betaOilScaled.toFixed(2)}%
                  </span>
                </td>

                {/* VIX Beta */}
                <td
                  className="py-2.5 px-3 text-right font-semibold"
                  style={{ backgroundColor: getCellBg(s.betaVixScaled, minVix, maxVix) }}
                >
                  <span className={s.betaVixScaled >= 0 ? "text-[#245A46]" : "text-[#A44234]"}>
                    {s.betaVixScaled >= 0 ? `+` : ``}
                    {s.betaVixScaled.toFixed(2)}%
                  </span>
                </td>

                {/* CPI Beta */}
                {includeCpi && (
                  <td
                    className="py-2.5 px-3 text-right font-semibold"
                    style={{ backgroundColor: getCellBg(s.betaCpiScaled, minCpi, maxCpi) }}
                  >
                    <span className={s.betaCpiScaled >= 0 ? "text-[#245A46]" : "text-[#A44234]"}>
                      {s.betaCpiScaled >= 0 ? `+` : ``}
                      {s.betaCpiScaled.toFixed(2)}%
                    </span>
                  </td>
                )}

                {/* Alpha */}
                <td className="py-2.5 px-3 text-right text-[#1F2421]">
                  {s.alphaMonthly >= 0 ? `+` : ``}
                  {s.alphaMonthly.toFixed(2)}%
                </td>

                {/* R-Squared */}
                <td className="py-2.5 px-3 text-right font-bold text-[#1F2421]">
                  {(s.rSquared * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Matrix Footnote */}
      <div className="mt-3 pt-2 border-t border-[#E8E3D8] text-[11px] font-mono-tabular text-[#5C625C] flex justify-between">
        <span>Green = positive beta · Red = negative beta</span>
        <span>Click column header to sort</span>
      </div>
    </div>
  );
};
