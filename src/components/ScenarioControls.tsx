import React from "react";
import { SCENARIO_PRESETS } from "../data/historicalData";
import { ScenarioShock, RegressorConfig } from "../utils/quantEngine";
import { Sliders, Activity, Flame, TrendingUp, Sparkles, ShieldAlert } from "lucide-react";

interface ScenarioControlsProps {
  shock: ScenarioShock;
  setShock: React.Dispatch<React.SetStateAction<ScenarioShock>>;
  config: RegressorConfig;
  setConfig: React.Dispatch<React.SetStateAction<RegressorConfig>>;
  activePresetId: string;
  setActivePresetId: (id: string) => void;
}

export const ScenarioControls: React.FC<ScenarioControlsProps> = ({
  shock,
  setShock,
  config,
  setConfig,
  activePresetId,
  setActivePresetId,
}) => {
  const handlePresetChange = (presetId: string) => {
    setActivePresetId(presetId);
    const p = SCENARIO_PRESETS.find((item) => item.id === presetId);
    if (p) {
      setShock({
        ratesBps: p.ratesBps,
        oilPct: p.oilPct,
        vixPoints: p.vixPoints,
        cpiPct: p.cpiPct,
      });
    }
  };

  const handleSliderChange = (key: keyof ScenarioShock, value: number) => {
    setActivePresetId("custom");
    setShock((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#E8E3D8] rounded-md p-5 shadow-xs">
      {/* Header */}
      <div className="pb-3 mb-3.5 border-b border-[#E8E3D8]">
        <h2 className="font-editorial text-base font-bold text-[#1F2421]">
          Macro Shock Controls
        </h2>
      </div>

      {/* Preset Selector */}
      <div className="mb-4">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C625C] mb-1">
          Scenario Preset
        </label>
        <select
          value={activePresetId}
          onChange={(e) => handlePresetChange(e.target.value)}
          className="w-full bg-[#FAF8F3] border border-[#E0D9CB] rounded px-2.5 py-1.5 text-xs font-medium text-[#1F2421] focus:outline-none focus:border-[#245A46] transition-colors"
        >
          {SCENARIO_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Macro Factor Sliders */}
      <div className="space-y-3.5">
        {/* 1. 10Y Yield Shock */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium text-[#1F2421]">10Y Treasury Yield</span>
            <span className="font-mono-tabular font-bold text-xs px-2 py-0.5 bg-[#F4F1EA] text-[#1F2421] rounded">
              {shock.ratesBps > 0 ? `+${shock.ratesBps}` : shock.ratesBps} bps
            </span>
          </div>
          <input
            type="range"
            min={-250}
            max={250}
            step={25}
            value={shock.ratesBps}
            onChange={(e) => handleSliderChange("ratesBps", parseInt(e.target.value, 10))}
            className="w-full accent-[#245A46] h-1.5 bg-[#E8E3D8] rounded cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#5C625C] font-mono-tabular mt-0.5">
            <span>-250 bps</span>
            <span>0</span>
            <span>+250 bps</span>
          </div>
        </div>

        {/* 2. Crude Oil Shock */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium text-[#1F2421]">WTI Crude Oil</span>
            <span className="font-mono-tabular font-bold text-xs px-2 py-0.5 bg-[#F4F1EA] text-[#1F2421] rounded">
              {shock.oilPct > 0 ? `+${shock.oilPct}` : shock.oilPct}%
            </span>
          </div>
          <input
            type="range"
            min={-40}
            max={40}
            step={5}
            value={shock.oilPct}
            onChange={(e) => handleSliderChange("oilPct", parseInt(e.target.value, 10))}
            className="w-full accent-[#245A46] h-1.5 bg-[#E8E3D8] rounded cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#5C625C] font-mono-tabular mt-0.5">
            <span>-40%</span>
            <span>0%</span>
            <span>+40%</span>
          </div>
        </div>

        {/* 3. VIX Volatility Shock */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium text-[#1F2421]">CBOE VIX Index</span>
            <span className="font-mono-tabular font-bold text-xs px-2 py-0.5 bg-[#F4F1EA] text-[#1F2421] rounded">
              {shock.vixPoints > 0 ? `+${shock.vixPoints}` : shock.vixPoints} pts
            </span>
          </div>
          <input
            type="range"
            min={-10}
            max={30}
            step={2}
            value={shock.vixPoints}
            onChange={(e) => handleSliderChange("vixPoints", parseInt(e.target.value, 10))}
            className="w-full accent-[#245A46] h-1.5 bg-[#E8E3D8] rounded cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#5C625C] font-mono-tabular mt-0.5">
            <span>-10 pts</span>
            <span>0</span>
            <span>+30 pts</span>
          </div>
        </div>

        {/* 4. Optional CPI Inflation Factor */}
        <div className="pt-2 border-t border-[#F0EBE0]">
          <div className="flex items-center justify-between text-xs mb-1">
            <label className="flex items-center gap-1.5 font-medium text-[#1F2421] cursor-pointer">
              <input
                type="checkbox"
                checked={config.includeCpi}
                onChange={(e) => setConfig((prev) => ({ ...prev, includeCpi: e.target.checked }))}
                className="rounded accent-[#245A46] text-[#245A46] cursor-pointer"
              />
              <span>CPI Inflation Factor</span>
            </label>
            <span
              className={`font-mono-tabular font-bold text-xs px-2 py-0.5 rounded ${
                config.includeCpi ? "bg-[#F4F1EA] text-[#1F2421]" : "text-[#5C625C]/50"
              }`}
            >
              {shock.cpiPct > 0 ? `+${shock.cpiPct}` : shock.cpiPct}%
            </span>
          </div>
          {config.includeCpi && (
            <>
              <input
                type="range"
                min={-2.0}
                max={4.0}
                step={0.2}
                value={shock.cpiPct}
                onChange={(e) => handleSliderChange("cpiPct", parseFloat(e.target.value))}
                className="w-full accent-[#245A46] h-1.5 bg-[#E8E3D8] rounded cursor-pointer mt-1"
              />
              <div className="flex justify-between text-[10px] text-[#5C625C] font-mono-tabular mt-0.5">
                <span>-2.0%</span>
                <span>0.0%</span>
                <span>+4.0%</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Econometric Model Settings */}
      <div className="mt-5 pt-4 border-t border-[#E8E3D8]">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#5C625C] block mb-2">
          Econometric Estimator
        </span>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={() => setConfig((prev) => ({ ...prev, modelType: "OLS" }))}
            className={`py-1.5 px-2.5 text-xs font-semibold rounded text-center border transition-colors ${
              config.modelType === "OLS"
                ? "bg-[#245A46] text-white border-[#245A46]"
                : "bg-[#FAF8F3] text-[#5C625C] border-[#E0D9CB] hover:text-[#1F2421]"
            }`}
          >
            Ordinary Least Squares
          </button>
          <button
            onClick={() => setConfig((prev) => ({ ...prev, modelType: "Ridge" }))}
            className={`py-1.5 px-2.5 text-xs font-semibold rounded text-center border transition-colors ${
              config.modelType === "Ridge"
                ? "bg-[#245A46] text-white border-[#245A46]"
                : "bg-[#FAF8F3] text-[#5C625C] border-[#E0D9CB] hover:text-[#1F2421]"
            }`}
          >
            Ridge Regression (L2)
          </button>
        </div>

        {config.modelType === "Ridge" && (
          <div className="mb-3 bg-[#FAF8F3] p-2.5 rounded border border-[#E8E3D8]">
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-[#5C625C]">L2 Shrinkage Penalty (λ / α):</span>
              <span className="font-mono-tabular font-bold text-[#1F2421]">{config.ridgeAlpha}</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={10.0}
              step={0.5}
              value={config.ridgeAlpha}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, ridgeAlpha: parseFloat(e.target.value) }))
              }
              className="w-full accent-[#245A46] h-1.5 bg-[#E8E3D8] rounded cursor-pointer"
            />
          </div>
        )}

        {/* Lookback Window Selector */}
        <div>
          <label className="block text-[11px] font-semibold text-[#5C625C] mb-1">
            Historical Estimation Horizon:
          </label>
          <div className="grid grid-cols-4 gap-1">
            {[36, 48, 60].map((months) => (
              <button
                key={months}
                onClick={() => setConfig((prev) => ({ ...prev, lookbackMonths: months }))}
                className={`py-1 text-[11px] font-mono-tabular font-semibold rounded border transition-colors ${
                  config.lookbackMonths === months
                    ? "bg-[#1F2421] text-white border-[#1F2421]"
                    : "bg-[#FAF8F3] text-[#5C625C] border-[#E0D9CB] hover:bg-[#F2EDE2]"
                }`}
              >
                {months / 12}Y
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
