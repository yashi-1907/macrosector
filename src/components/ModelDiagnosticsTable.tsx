import React from "react";
import { SectorSensitivity, RegressorConfig } from "../utils/quantEngine";
import { Table, CheckCircle2 } from "lucide-react";

interface ModelDiagnosticsTableProps {
  sectors: SectorSensitivity[];
  config: RegressorConfig;
  averageR2: number;
  sampleSize: number;
}

export const ModelDiagnosticsTable: React.FC<ModelDiagnosticsTableProps> = ({
  sectors,
  config,
  averageR2,
  sampleSize,
}) => {
  return (
    <div className="bg-[#FFFFFF] border border-[#E8E3D8] rounded-md p-5 shadow-xs">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-[#E8E3D8] gap-1">
        <h3 className="font-editorial text-base font-bold text-[#1F2421]">
          Regression Fit & Factor Loadings
        </h3>
        <div className="text-xs text-[#5C625C] font-mono-tabular">
          Estimator: <span className="font-semibold text-[#1F2421]">{config.modelType}</span> {config.modelType === "Ridge" ? `(λ=${config.ridgeAlpha})` : ""} · Sample: {sampleSize}M
        </div>
      </div>

      {/* Regression Results Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E0D9CB] bg-[#FAF8F3] text-[#5C625C] font-semibold text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-3">Ticker / Sector</th>
              <th className="py-2.5 px-3 text-right">Alpha (%/mo)</th>
              <th className="py-2.5 px-3 text-right">Beta Rates (+100bps)</th>
              <th className="py-2.5 px-3 text-right">Beta Oil (+10%)</th>
              <th className="py-2.5 px-3 text-right">Beta VIX (+5pts)</th>
              {config.includeCpi && <th className="py-2.5 px-3 text-right">Beta CPI (+1.0%)</th>}
              <th className="py-2.5 px-3 text-right">R² (Variance Explained)</th>
              <th className="py-2.5 px-3 text-right">Adjusted R²</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EBE0] font-mono-tabular">
            {sectors.map((s) => (
              <tr key={s.symbol} className="hover:bg-[#FAF8F3]/60 transition-colors">
                <td className="py-2.5 px-3 font-sans">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono-tabular font-bold text-[#1F2421]">{s.symbol}</span>
                    <span className="text-[#5C625C] truncate">{s.name}</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-right">
                  {s.alphaMonthly >= 0 ? "+" : ""}
                  {s.alphaMonthly.toFixed(3)}%
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span className={s.betaRatesScaled >= 0 ? "text-[#245A46]" : "text-[#A44234]"}>
                    {s.betaRatesScaled >= 0 ? "+" : ""}
                    {s.betaRatesScaled.toFixed(3)}%
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span className={s.betaOilScaled >= 0 ? "text-[#245A46]" : "text-[#A44234]"}>
                    {s.betaOilScaled >= 0 ? "+" : ""}
                    {s.betaOilScaled.toFixed(3)}%
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span className={s.betaVixScaled >= 0 ? "text-[#245A46]" : "text-[#A44234]"}>
                    {s.betaVixScaled >= 0 ? "+" : ""}
                    {s.betaVixScaled.toFixed(3)}%
                  </span>
                </td>
                {config.includeCpi && (
                  <td className="py-2.5 px-3 text-right">
                    <span className={s.betaCpiScaled >= 0 ? "text-[#245A46]" : "text-[#A44234]"}>
                      {s.betaCpiScaled >= 0 ? "+" : ""}
                      {s.betaCpiScaled.toFixed(3)}%
                    </span>
                  </td>
                )}
                <td className="py-2.5 px-3 text-right font-bold text-[#1F2421]">
                  {(s.rSquared * 100).toFixed(1)}%
                </td>
                <td className="py-2.5 px-3 text-right text-[#5C625C]">
                  {(s.adjRSquared * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 pt-2 border-t border-[#E8E3D8] text-[11px] font-mono-tabular text-[#5C625C] flex justify-between">
        <span>Empirical coefficient matrix</span>
        <span>Average R²: {(averageR2 * 100).toFixed(1)}%</span>
      </div>
    </div>
  );
};
