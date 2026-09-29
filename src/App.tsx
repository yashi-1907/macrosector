import React, { useState, useMemo } from "react";
import { Header } from "./components/Header";
import { ScenarioControls } from "./components/ScenarioControls";
import { ReturnBarChart } from "./components/ReturnBarChart";
import { BetaHeatmap } from "./components/BetaHeatmap";
import { RotationMemo } from "./components/RotationMemo";
import { ModelDiagnosticsTable } from "./components/ModelDiagnosticsTable";
import { CodeExportModal } from "./components/CodeExportModal";
import { MacroHeaderIllustration } from "./components/MacroHeaderIllustration";
import { LoginPage } from "./components/LoginPage";
import { runFactorRegression, ScenarioShock, RegressorConfig } from "./utils/quantEngine";
import {
  TrendingUp,
  TrendingDown,
  Layers,
  Activity,
  FileCode,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("analyst@macro-research.com");
  const [activeTab, setActiveTab] = useState<"dashboard" | "heatmap" | "memo" | "code">(
    "dashboard"
  );
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false);

  // Scenario Shock State
  const [shock, setShock] = useState<ScenarioShock>({
    ratesBps: 0,
    oilPct: 0,
    vixPoints: 0,
    cpiPct: 0,
  });

  // Econometric Regressor State
  const [config, setConfig] = useState<RegressorConfig>({
    modelType: "OLS",
    ridgeAlpha: 1.0,
    lookbackMonths: 60,
    includeCpi: true,
  });

  const [activePresetId, setActivePresetId] = useState<string>("custom");

  // Re-estimate econometric models on state innovations
  const { sectors, benchmark, dispersion, averageR2, sampleSize } = useMemo(() => {
    return runFactorRegression(config, shock);
  }, [config, shock]);

  const topSector = sectors[0];
  const bottomSector = sectors[sectors.length - 1];

  const handleResetShocks = () => {
    setActivePresetId("custom");
    setShock({
      ratesBps: 0,
      oilPct: 0,
      vixPoints: 0,
      cpiPct: 0,
    });
  };

  const handleLogin = (email: string) => {
    setUserEmail(email);
    setIsAuthenticated(true);
    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1F2421] flex flex-col font-sans">
      {/* Top Bar Contract (Wordmark, Nav links, Action buttons) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetShocks={handleResetShocks}
        onOpenCode={() => setIsCodeModalOpen(true)}
        isAuthenticated={isAuthenticated}
        userEmail={userEmail}
        onLogout={handleLogout}
      />

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5">
        {/* Dedicated Login Gateway (Clean separate login page with related picture) */}
        {!isAuthenticated ? (
          <LoginPage onLogin={handleLogin} shock={shock} />
        ) : (
          <>
            {/* Tab 1: Main Stress Tester Dashboard */}
            {activeTab === "dashboard" && (
              <div className="space-y-5">
                {/* Dashboard Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8E3D8] gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#245A46] bg-[#245A46]/10 px-2 py-0.5 rounded font-mono-tabular">
                        Live Session: {userEmail}
                      </span>
                      <span className="text-[#A4AAA4]">•</span>
                      <span className="text-xs text-[#5C625C] font-mono-tabular">11 Sector Models</span>
                    </div>
                    <h1 className="font-editorial text-2xl font-bold tracking-tight text-[#1F2421]">
                      Macro-Financial Sector Stress Tester
                    </h1>
                    <p className="text-xs text-[#5C625C] mt-0.5">
                      SPDR Sector ETF sensitivities to rates, commodities, volatility, and inflation
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono-tabular">
                    <span className="px-2.5 py-1 bg-[#F2EDE2] border border-[#E0D9CB] rounded text-[#5C625C]">
                      Sample: <strong className="text-[#1F2421]">{sampleSize}M</strong>
                    </span>
                    <span className="px-2.5 py-1 bg-[#F2EDE2] border border-[#E0D9CB] rounded text-[#5C625C]">
                      Model: <strong className="text-[#1F2421]">{config.modelType}</strong>
                    </span>
                  </div>
                </div>

            {/* Executive Dashboard Metric Ribbon */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Metric 1: Top Long */}
              <div className="bg-[#FFFFFF] border border-[#E8E3D8] rounded-md p-3 shadow-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#5C625C] mb-1">
                  Top Tactical Long
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-mono-tabular text-lg font-bold text-[#1F2421]">
                    {topSector.symbol}
                  </span>
                  <span className="font-mono-tabular font-bold text-sm text-[#245A46]">
                    {topSector.predictedReturn >= 0 ? "+" : ""}
                    {topSector.predictedReturn.toFixed(2)}%
                  </span>
                </div>
                <div className="text-[11px] text-[#5C625C] truncate mt-0.5">
                  {topSector.name}
                </div>
              </div>

              {/* Metric 2: Primary Short / Underweight */}
              <div className="bg-[#FFFFFF] border border-[#E8E3D8] rounded-md p-3 shadow-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#5C625C] mb-1">
                  Top Tactical Hedge
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-mono-tabular text-lg font-bold text-[#1F2421]">
                    {bottomSector.symbol}
                  </span>
                  <span className="font-mono-tabular font-bold text-sm text-[#A44234]">
                    {bottomSector.predictedReturn >= 0 ? "+" : ""}
                    {bottomSector.predictedReturn.toFixed(2)}%
                  </span>
                </div>
                <div className="text-[11px] text-[#5C625C] truncate mt-0.5">
                  {bottomSector.name}
                </div>
              </div>

              {/* Metric 3: Return Dispersion */}
              <div className="bg-[#FFFFFF] border border-[#E8E3D8] rounded-md p-3 shadow-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#5C625C] mb-1">
                  Sector Dispersion (L-S)
                </div>
                <div className="font-mono-tabular text-lg font-bold text-[#1F2421]">
                  {dispersion.toFixed(2)}%
                </div>
                <div className="text-[11px] text-[#5C625C] mt-0.5">
                  Spread: {topSector.symbol} vs {bottomSector.symbol}
                </div>
              </div>

              {/* Metric 4: Mean Variance Explained R2 */}
              <div className="bg-[#FFFFFF] border border-[#E8E3D8] rounded-md p-3 shadow-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#5C625C] mb-1">
                  Mean Fit (R²)
                </div>
                <div className="font-mono-tabular text-lg font-bold text-[#1F2421]">
                  {(averageR2 * 100).toFixed(1)}%
                </div>
                <div className="text-[11px] text-[#5C625C] mt-0.5">
                  Across 11 sector equations
                </div>
              </div>
            </div>

            {/* Interactive Scenario Controls & Ranked Bar Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left Column: Interactive Scenario Controls (4 cols) */}
              <div className="lg:col-span-4">
                <ScenarioControls
                  shock={shock}
                  setShock={setShock}
                  config={config}
                  setConfig={setConfig}
                  activePresetId={activePresetId}
                  setActivePresetId={setActivePresetId}
                />
              </div>

              {/* Right Column: Ranked Chart (8 cols) */}
              <div className="lg:col-span-8">
                <ReturnBarChart
                  sectors={sectors}
                  benchmark={benchmark}
                  dispersion={dispersion}
                />
              </div>
            </div>

            {/* Full-width Diagnostics Table spanning whole container without blank left space */}
            <ModelDiagnosticsTable
              sectors={sectors}
              config={config}
              averageR2={averageR2}
              sampleSize={sampleSize}
            />
          </div>
        )}

        {/* Tab 2: Full Factor Beta Heatmap */}
        {activeTab === "heatmap" && (
          <div className="space-y-6">
            <BetaHeatmap sectors={sectors} includeCpi={config.includeCpi} />
            <ModelDiagnosticsTable
              sectors={sectors}
              config={config}
              averageR2={averageR2}
              sampleSize={sampleSize}
            />
          </div>
        )}

        {/* Tab 3: Rotation Memo & Tilts */}
        {activeTab === "memo" && (
          <RotationMemo
            sectors={sectors}
            benchmark={benchmark}
            shock={shock}
            includeCpi={config.includeCpi}
            dispersion={dispersion}
          />
        )}

        {/* Tab 4: Python & Streamlit Code Hub */}
        {activeTab === "code" && (
          <div className="bg-[#FFFFFF] border border-[#E8E3D8] rounded-md p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-[#E8E3D8]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5C625C]">
                  Deliverable Artifacts
                </span>
                <h2 className="font-editorial text-xl font-bold text-[#1F2421]">
                  Self-Contained Python Application & Environment
                </h2>
              </div>
              <button
                onClick={() => setIsCodeModalOpen(true)}
                className="mt-2 sm:mt-0 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#245A46] rounded hover:bg-[#1C4636] transition-colors"
              >
                Open Code Modal & Download
              </button>
            </div>

            <div className="text-xs text-[#1F2421] leading-relaxed mb-4">
              The project files <code>app.py</code> and <code>requirements.txt</code> have been created in the root workspace directory. You can run them locally or deploy them to Streamlit Community Cloud with:
            </div>

            <div className="bg-[#F5F2EA] p-3.5 rounded border border-[#E8E3D8] font-mono-tabular text-xs text-[#1F2421] mb-6">
              <span className="text-[#5C625C]"># Step 1: Install institutional dependencies</span><br />
              pip install -r requirements.txt<br /><br />
              <span className="text-[#5C625C]"># Step 2: Launch Streamlit Stress Tester</span><br />
              streamlit run app.py
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#FAF8F3] border border-[#E8E3D8] rounded">
                <div className="font-bold text-[#1F2421] mb-1">
                  1. yfinance & Data Caching
                </div>
                <p className="text-[#5C625C]">
                  Ingests monthly adjusted close prices for 11 SPDR Sector ETFs (XLK, XLF, XLE, XLU, XLV, XLI, XLY, XLP, XLB, XLC, XLRE), SPY, 10Y Yield (^TNX), WTI Crude (CL=F), VIX (^VIX), and FRED CPI series with <code>@st.cache_data</code>.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F3] border border-[#E8E3D8] rounded">
                <div className="font-bold text-[#1F2421] mb-1">
                  2. Scikit-Learn Regression Engine
                </div>
                <p className="text-[#5C625C]">
                  Computes multi-factor OLS and Ridge models with calibrated statistical scaling, R-squared evaluation, and scenario forward returns mapping.
                </p>
              </div>
            </div>
          </div>
        )}
        </>
      )}
      </main>

      {/* Code Export Modal */}
      <CodeExportModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />

      {/* Institutional Footer */}
      <footer className="mt-auto border-t border-[#E8E3D8] bg-[#F7F5F0] py-4 px-6 text-xs text-[#5C625C]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-[11px]">
            Macro-Financial Sector Stress Tester & Rotation Engine · Institutional Investment Research
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>SPDR Sector Model</span>
            <span>·</span>
            <span>Ridge L2 & OLS</span>
            <span>·</span>
            <span>Monthly Rebalancing</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
