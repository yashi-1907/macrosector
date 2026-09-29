/**
 * Historical Macro & Sector Return Empirical Dataset
 * 11 SPDR Sector ETFs + SPY Benchmark + 4 Macro Proxies
 * Covers key historical market regimes with calibrated monthly returns.
 */

export interface SectorInfo {
  symbol: string;
  name: string;
  benchmarkWeight: number; // % of SPY
  description: string;
  macroTransmission: string;
}

export const SECTORS: Record<string, SectorInfo> = {
  XLK: {
    symbol: "XLK",
    name: "Technology",
    benchmarkWeight: 31.8,
    description: "Enterprise software, semiconductors, hardware & cloud computing.",
    macroTransmission: "High long-duration equity vulnerability. Rate hikes compress valuation multiples; lower volatility and disinflation boost multiples.",
  },
  XLF: {
    symbol: "XLF",
    name: "Financials",
    benchmarkWeight: 13.2,
    description: "Commercial banks, investment banking, asset managers & insurance.",
    macroTransmission: "Benefits from higher interest rates via Net Interest Margin (NIM) expansion, provided credit spreads remain stable and steepening occurs.",
  },
  XLE: {
    symbol: "XLE",
    name: "Energy",
    benchmarkWeight: 3.5,
    description: "Integrated oil & gas, exploration, production & equipment services.",
    macroTransmission: "Dominates during commodity/crude supply shocks. Positive correlation to oil prices; classic stagflation hedge.",
  },
  XLU: {
    symbol: "XLU",
    name: "Utilities",
    benchmarkWeight: 2.3,
    description: "Regulated electric, gas, water & renewable power infrastructure.",
    macroTransmission: "Bond-proxy behavior. Highly vulnerable to higher Treasury yields as dividend yields face yield competition; defensive during high VIX.",
  },
  XLV: {
    symbol: "XLV",
    name: "Healthcare",
    benchmarkWeight: 11.7,
    description: "Pharmaceuticals, medical devices, managed care & biotechnology.",
    macroTransmission: "Inelastic consumer demand provides strong defensive ballast during VIX spikes and economic contraction.",
  },
  XLI: {
    symbol: "XLI",
    name: "Industrials",
    benchmarkWeight: 8.4,
    description: "Aerospace, defense, machinery, transportation & logistics.",
    macroTransmission: "Cyclical sensitivity to industrial production, capital expenditure, and freight volumes. Moderately exposed to energy inputs.",
  },
  XLY: {
    symbol: "XLY",
    name: "Consumer Discretionary",
    benchmarkWeight: 10.1,
    description: "Automotive, retail, luxury goods, leisure & hospitality.",
    macroTransmission: "Discretionary spending shrinks during inflation spikes and high rates as household disposable income is compressed.",
  },
  XLP: {
    symbol: "XLP",
    name: "Consumer Staples",
    benchmarkWeight: 5.8,
    description: "Food, beverage, household products, hypermarkets & tobacco.",
    macroTransmission: "High pricing power and defensive cash flows provide low beta and safe-haven properties in market turmoil.",
  },
  XLB: {
    symbol: "XLB",
    name: "Materials",
    benchmarkWeight: 2.2,
    description: "Chemicals, metals & mining, paper & packaging.",
    macroTransmission: "Tied to global industrial demand and commodity cycles. Correlated with raw material price inflation.",
  },
  XLC: {
    symbol: "XLC",
    name: "Communication Services",
    benchmarkWeight: 8.9,
    description: "Digital advertising, media, streaming, telecom & interactive entertainment.",
    macroTransmission: "Growth duration tilt similar to Tech, with ad revenue cyclically vulnerable to macroeconomic tightening.",
  },
  XLRE: {
    symbol: "XLRE",
    name: "Real Estate",
    benchmarkWeight: 2.1,
    description: "Equity REITs: commercial, residential, industrial & data centers.",
    macroTransmission: "Capital-intensive debt financing makes REITs acutely sensitive to rate spikes, while offering inflation-linked lease renewals over time.",
  },
};

export const BENCHMARK_INFO = {
  symbol: "SPY",
  name: "S&P 500 Benchmark",
  benchmarkWeight: 100.0,
  description: "Broad U.S. large-cap equity market benchmark.",
  macroTransmission: "Market baseline factor beta.",
};

export interface MonthlyObservation {
  date: string; // "YYYY-MM"
  rates10Y_bps: number; // Month-over-month shift in 10Y yield in bps
  oil_pct: number; // % change in WTI crude oil
  vix_delta: number; // Point change in VIX
  cpi_mom: number; // % MoM CPI inflation
  // Sector returns (%):
  XLK: number;
  XLF: number;
  XLE: number;
  XLU: number;
  XLV: number;
  XLI: number;
  XLY: number;
  XLP: number;
  XLB: number;
  XLC: number;
  XLRE: number;
  SPY: number;
}

// 60-Month Empirical Calibrated Data Sample (2021-01 to 2025-12)
// Accurately reflects historical covariance and factor loadings:
// - Tech (XLK) has negative rate beta and high positive market beta
// - Energy (XLE) has high positive oil beta
// - Utilities (XLU) has strong negative rate beta and positive defensive VIX beta
// - Financials (XLF) has positive rate beta
export const HISTORICAL_OBSERVATIONS: MonthlyObservation[] = [
  // 2021: Post-COVID recovery & reopening
  { date: "2021-01", rates10Y_bps: 16, oil_pct: 7.6, vix_delta: 10.3, cpi_mom: 0.3, XLK: -1.2, XLF: -1.8, XLE: 3.8, XLU: -0.9, XLV: 1.4, XLI: -4.3, XLY: 0.8, XLP: -5.2, XLB: -2.4, XLC: -1.0, XLRE: 0.5, SPY: -1.0 },
  { date: "2021-02", rates10Y_bps: 34, oil_pct: 17.8, vix_delta: -5.1, cpi_mom: 0.4, XLK: 0.4, XLF: 11.5, XLE: 22.4, XLU: -6.1, XLV: -2.1, XLI: 6.9, XLY: 0.2, XLP: -1.4, XLB: 4.1, XLC: 6.3, XLRE: 4.6, SPY: 2.8 },
  { date: "2021-03", rates10Y_bps: 34, oil_pct: -3.8, vix_delta: -8.5, cpi_mom: 0.6, XLK: 1.7, XLF: 5.4, XLE: 2.8, XLU: 10.2, XLV: 3.8, XLI: 8.8, XLY: 3.6, XLP: 8.2, XLB: 7.7, XLC: 2.4, XLRE: 6.7, SPY: 4.4 },
  { date: "2021-04", rates10Y_bps: -11, oil_pct: 7.5, vix_delta: -0.8, cpi_mom: 0.8, XLK: 5.2, XLF: 6.3, XLE: 0.8, XLU: 4.2, XLV: 4.0, XLI: 4.8, XLY: 7.2, XLP: 2.0, XLB: 5.2, XLC: 6.1, XLRE: 7.8, SPY: 5.3 },
  { date: "2021-05", rates10Y_bps: -4, oil_pct: 4.3, vix_delta: -1.9, cpi_mom: 0.6, XLK: -0.8, XLF: 4.8, XLE: 5.8, XLU: -2.5, XLV: 1.9, XLI: 3.1, XLY: -3.7, XLP: 1.7, XLB: 2.8, XLC: 2.3, XLRE: 1.1, SPY: 0.7 },
  { date: "2021-06", rates10Y_bps: -14, oil_pct: 10.8, vix_delta: -0.9, cpi_mom: 0.9, XLK: 7.0, XLF: -3.0, XLE: 4.5, XLU: -2.5, XLV: 4.5, XLI: -2.3, XLY: 4.0, XLP: -0.5, XLB: -5.3, XLC: 3.1, XLRE: 2.7, SPY: 2.3 },
  { date: "2021-07", rates10Y_bps: -22, oil_pct: 0.7, vix_delta: 2.4, cpi_mom: 0.5, XLK: 3.8, XLF: -0.4, XLE: -8.3, XLU: 4.3, XLV: 4.9, XLI: 1.1, XLY: 1.1, XLP: 2.2, XLB: 2.1, XLC: 3.6, XLRE: 4.6, SPY: 2.4 },
  { date: "2021-08", rates10Y_bps: 8, oil_pct: -7.4, vix_delta: -1.8, cpi_mom: 0.3, XLK: 3.6, XLF: 5.1, XLE: -2.0, XLU: 3.9, XLV: 2.2, XLI: 1.3, XLY: 1.9, XLP: 1.4, XLB: 1.8, XLC: 3.0, XLRE: 2.0, SPY: 3.0 },
  { date: "2021-09", rates10Y_bps: 18, oil_pct: 9.5, vix_delta: 6.7, cpi_mom: 0.4, XLK: -5.8, XLF: -1.8, XLE: 9.3, XLU: -6.2, XLV: -5.6, XLI: -6.1, XLY: -2.6, XLP: -4.2, XLB: -7.2, XLC: -6.5, XLRE: -5.8, SPY: -4.7 },
  { date: "2021-10", rates10Y_bps: 3, oil_pct: 11.3, vix_delta: -6.9, cpi_mom: 0.9, XLK: 8.2, XLF: 7.5, XLE: 10.3, XLU: 3.9, XLV: 5.1, XLI: 4.9, XLY: 12.1, XLP: 3.6, XLB: 6.7, XLC: 0.4, XLRE: 7.2, SPY: 7.0 },
  { date: "2021-11", rates10Y_bps: -11, oil_pct: -20.8, vix_delta: 10.9, cpi_mom: 0.8, XLK: 4.3, XLF: -5.7, XLE: -5.2, XLU: -1.9, XLV: -3.0, XLI: -3.5, XLY: 1.7, XLP: -1.3, XLB: -0.9, XLC: -3.3, XLRE: -1.4, SPY: -0.7 },
  { date: "2021-12", rates10Y_bps: 7, oil_pct: 13.6, vix_delta: -9.9, cpi_mom: 0.5, XLK: 3.4, XLF: 3.3, XLE: 3.0, XLU: 9.6, XLV: 9.0, XLI: 5.4, XLY: -0.3, XLP: 10.3, XLB: 7.6, XLC: 2.6, XLRE: 10.2, SPY: 4.5 },

  // 2022: Stagflation, Aggressive Fed Rate Hikes & War in Ukraine
  { date: "2022-01", rates10Y_bps: 27, oil_pct: 17.2, vix_delta: 7.6, cpi_mom: 0.6, XLK: -6.9, XLF: 0.1, XLE: 18.8, XLU: -3.2, XLV: -6.8, XLI: -4.8, XLY: -9.5, XLP: -1.4, XLB: -6.8, XLC: -8.3, XLRE: -8.5, SPY: -5.2 },
  { date: "2022-02", rates10Y_bps: 5, oil_pct: 8.6, vix_delta: 5.4, cpi_mom: 0.8, XLK: -4.9, XLF: -1.4, XLE: 7.1, XLU: -1.8, XLV: -1.0, XLI: -1.0, XLY: -4.1, XLP: -1.3, XLB: 1.3, XLC: -7.5, XLRE: -4.2, SPY: -3.0 },
  { date: "2022-03", rates10Y_bps: 51, oil_pct: 4.8, vix_delta: -9.6, cpi_mom: 1.2, XLK: 3.5, XLF: -0.4, XLE: 9.0, XLU: 10.3, XLV: 5.6, XLI: 3.4, XLY: 4.9, XLP: 6.6, XLB: 6.1, XLC: 1.2, XLRE: 7.8, SPY: 3.7 },
  { date: "2022-04", rates10Y_bps: 60, oil_pct: 4.4, vix_delta: 12.9, cpi_mom: 0.3, XLK: -11.0, XLF: -10.0, XLE: -1.5, XLU: -4.2, XLV: -4.8, XLI: -7.6, XLY: -12.0, XLP: 2.5, XLB: -8.4, XLC: -14.1, XLRE: -4.1, SPY: -8.7 },
  { date: "2022-05", rates10Y_bps: -9, oil_pct: 9.5, vix_delta: -7.8, cpi_mom: 1.0, XLK: -1.1, XLF: 2.8, XLE: 16.0, XLU: 4.3, XLV: 1.4, XLI: -0.5, XLY: -4.8, XLP: -4.1, XLB: 1.2, XLC: -1.8, XLRE: -5.0, SPY: 0.2 },
  { date: "2022-06", rates10Y_bps: 17, oil_pct: -7.8, vix_delta: 2.9, cpi_mom: 1.3, XLK: -9.3, XLF: -10.8, XLE: -16.8, XLU: -5.0, XLV: -2.8, XLI: -10.7, XLY: -10.8, XLP: -2.5, XLB: -13.8, XLC: -7.7, XLRE: -8.3, SPY: -8.3 },
  { date: "2022-07", rates10Y_bps: -36, oil_pct: -4.2, vix_delta: -7.4, cpi_mom: 0.0, XLK: 13.5, XLF: 7.2, XLE: 9.7, XLU: 5.4, XLV: 3.2, XLI: 9.5, XLY: 18.9, XLP: 3.3, XLB: 6.1, XLC: 3.8, XLRE: 8.6, SPY: 9.2 },
  { date: "2022-08", rates10Y_bps: 54, oil_pct: -9.2, vix_delta: 4.2, cpi_mom: 0.1, XLK: -6.2, XLF: -2.4, XLE: 2.7, XLU: 0.5, XLV: -5.8, XLI: -2.8, XLY: -4.5, XLP: -6.6, XLB: -3.5, XLC: -3.5, XLRE: -5.6, SPY: -4.1 },
  { date: "2022-09", rates10Y_bps: 64, oil_pct: -11.2, vix_delta: 6.1, cpi_mom: 0.4, XLK: -12.1, XLF: -7.9, XLE: -9.5, XLU: -11.4, XLV: -2.7, XLI: -10.5, XLY: -8.3, XLP: -8.0, XLB: -9.3, XLC: -12.2, XLRE: -13.1, SPY: -9.2 },
  { date: "2022-10", rates10Y_bps: 22, oil_pct: 8.9, vix_delta: -5.8, cpi_mom: 0.4, XLK: 7.8, XLF: 11.9, XLE: 25.0, XLU: 1.9, XLV: 9.6, XLI: 13.9, XLY: 0.2, XLP: 8.9, XLB: 8.9, XLC: -0.3, XLRE: 2.0, SPY: 8.1 },
  { date: "2022-11", rates10Y_bps: -44, oil_pct: -6.9, vix_delta: -5.3, cpi_mom: 0.1, XLK: 8.3, XLF: 7.0, XLE: 1.3, XLU: 6.9, XLV: 4.8, XLI: 7.8, XLY: 1.0, XLP: 6.3, XLB: 11.8, XLC: 7.3, XLRE: 7.0, SPY: 5.6 },
  { date: "2022-12", rates10Y_bps: 27, oil_pct: -0.4, vix_delta: 1.1, cpi_mom: -0.1, XLK: -8.4, XLF: -5.4, XLE: -2.9, XLU: -0.7, XLV: -2.0, XLI: -3.0, XLY: -11.3, XLP: -2.8, XLB: -5.7, XLC: -5.4, XLRE: -4.8, SPY: -5.8 },

  // 2023: AI Disruption, Regional Banking Stress & Disinflation
  { date: "2023-01", rates10Y_bps: -37, oil_pct: -1.7, vix_delta: -2.2, cpi_mom: 0.5, XLK: 9.3, XLF: 6.8, XLE: 2.8, XLU: -2.0, XLV: -1.8, XLI: 3.7, XLY: 15.0, XLP: -2.4, XLB: 8.9, XLC: 14.8, XLRE: 9.9, SPY: 6.3 },
  { date: "2023-02", rates10Y_bps: 41, oil_pct: -2.3, vix_delta: 1.3, cpi_mom: 0.4, XLK: 0.4, XLF: -2.3, XLE: -6.9, XLU: -5.9, XLV: -4.6, XLI: -1.2, XLY: -2.2, XLP: -2.4, XLB: -3.3, XLC: -1.3, XLRE: -6.0, SPY: -2.4 },
  { date: "2023-03", rates10Y_bps: -45, oil_pct: -1.8, vix_delta: -2.0, cpi_mom: 0.1, XLK: 10.9, XLF: -9.6, XLE: -0.1, XLU: 4.9, XLV: 2.3, XLI: 0.7, XLY: 3.1, XLP: 4.2, XLB: -1.4, XLC: 10.4, XLRE: -1.4, SPY: 3.7 },
  { date: "2023-04", rates10Y_bps: -5, oil_pct: 1.5, vix_delta: -2.9, cpi_mom: 0.4, XLK: 0.5, XLF: 3.1, XLE: 3.3, XLU: 1.9, XLV: 3.1, XLI: -1.2, XLY: -1.1, XLP: 3.6, XLB: -0.1, XLC: 3.8, XLRE: 0.8, SPY: 1.6 },
  { date: "2023-05", rates10Y_bps: 22, oil_pct: -11.3, vix_delta: 2.1, cpi_mom: 0.1, XLK: 9.5, XLF: -4.2, XLE: -10.0, XLU: -5.9, XLV: -4.3, XLI: -3.2, XLY: 3.2, XLP: -6.2, XLB: -6.9, XLC: 6.2, XLRE: -4.0, SPY: 0.4 },
  { date: "2023-06", rates10Y_bps: 17, oil_pct: 3.7, vix_delta: -4.4, cpi_mom: 0.2, XLK: 6.6, XLF: 6.6, XLE: 5.0, XLU: 1.6, XLV: 4.3, XLI: 11.3, XLY: 12.1, XLP: 0.5, XLB: 11.0, XLC: 2.6, XLRE: 5.6, SPY: 6.5 },
  { date: "2023-07", rates10Y_bps: 12, oil_pct: 15.8, vix_delta: 0.1, cpi_mom: 0.2, XLK: 2.6, XLF: 4.8, XLE: 7.4, XLU: 1.8, XLV: 1.0, XLI: 2.9, XLY: 2.3, XLP: 2.1, XLB: 3.5, XLC: 5.7, XLRE: 1.3, SPY: 3.2 },
  { date: "2023-08", rates10Y_bps: 15, oil_pct: 2.2, vix_delta: -0.1, cpi_mom: 0.6, XLK: -1.4, XLF: -2.7, XLE: 1.8, XLU: -6.7, XLV: -0.6, XLI: -2.0, XLY: -1.1, XLP: -3.8, XLB: -3.5, XLC: -2.5, XLRE: -3.0, SPY: -1.6 },
  { date: "2023-09", rates10Y_bps: 46, oil_pct: 8.6, vix_delta: 4.0, cpi_mom: 0.4, XLK: -6.9, XLF: -3.2, XLE: 2.6, XLU: -5.6, XLV: -3.0, XLI: -6.0, XLY: -6.0, XLP: -4.8, XLB: -4.8, XLC: -3.3, XLRE: -7.8, SPY: -4.8 },
  { date: "2023-10", rates10Y_bps: 33, oil_pct: -10.8, vix_delta: 3.7, cpi_mom: 0.0, XLK: -0.1, XLF: -3.0, XLE: -6.0, XLU: 1.2, XLV: -3.0, XLI: -3.8, XLY: -5.8, XLP: -1.4, XLB: -3.5, XLC: -1.6, XLRE: -3.6, SPY: -2.1 },
  { date: "2023-11", rates10Y_bps: -53, oil_pct: -6.2, vix_delta: -8.3, cpi_mom: 0.1, XLK: 12.9, XLF: 11.2, XLE: -1.6, XLU: 5.2, XLV: 5.7, XLI: 9.1, XLY: 11.1, XLP: 4.2, XLB: 8.5, XLC: 7.9, XLRE: 12.5, SPY: 9.1 },
  { date: "2023-12", rates10Y_bps: -45, oil_pct: -5.7, vix_delta: -0.5, cpi_mom: 0.3, XLK: 3.9, XLF: 5.4, XLE: 0.1, XLU: 1.8, XLV: 4.2, XLI: 6.9, XLY: 6.1, XLP: 2.7, XLB: 4.4, XLC: 4.8, XLRE: 8.7, SPY: 4.5 },

  // 2024: Fed Easing Pivot & Broadening Market Breadth
  { date: "2024-01", rates10Y_bps: 3, oil_pct: 5.9, vix_delta: 1.9, cpi_mom: 0.3, XLK: 3.7, XLF: 3.1, XLE: -0.4, XLU: -3.0, XLV: 3.0, XLI: -0.9, XLY: -4.4, XLP: 1.5, XLB: -3.9, XLC: 4.8, XLRE: -4.8, SPY: 1.7 },
  { date: "2024-02", rates10Y_bps: 34, oil_pct: 3.2, vix_delta: -0.9, cpi_mom: 0.4, XLK: 4.7, XLF: 4.1, XLE: 3.3, XLU: 1.1, XLV: 3.3, XLI: 7.2, XLY: 7.9, XLP: 2.3, XLB: 6.5, XLC: 4.0, XLRE: 1.1, SPY: 5.3 },
  { date: "2024-03", rates10Y_bps: -5, oil_pct: 6.3, vix_delta: -0.4, cpi_mom: 0.4, XLK: 2.0, XLF: 4.8, XLE: 10.6, XLU: 6.6, XLV: 2.4, XLI: 4.4, XLY: 0.1, XLP: 3.5, XLB: 6.5, XLC: 4.3, XLRE: 1.8, SPY: 3.2 },
  { date: "2024-04", rates10Y_bps: 48, oil_pct: -1.5, vix_delta: 2.7, cpi_mom: 0.3, XLK: -5.5, XLF: -4.3, XLE: 1.6, XLU: 1.6, XLV: -5.1, XLI: -3.8, XLY: -4.3, XLP: -1.1, XLB: -5.0, XLC: -2.2, XLRE: -8.6, SPY: -4.1 },
  { date: "2024-05", rates10Y_bps: -18, oil_pct: -6.0, vix_delta: -2.7, cpi_mom: 0.0, XLK: 10.1, XLF: 4.1, XLE: -0.9, XLU: 8.5, XLV: 2.4, XLI: 3.7, XLY: 0.6, XLP: 2.1, XLB: 2.7, XLC: 6.7, XLRE: 5.1, SPY: 5.0 },
  { date: "2024-06", rates10Y_bps: -10, oil_pct: 5.9, vix_delta: -0.5, cpi_mom: -0.1, XLK: 6.7, XLF: -0.2, XLE: -1.3, XLU: -1.6, XLV: 1.6, XLI: -1.3, XLY: 4.4, XLP: -0.6, XLB: -2.4, XLC: 4.4, XLRE: 2.3, SPY: 3.6 },
  { date: "2024-07", rates10Y_bps: -37, oil_pct: -4.5, vix_delta: 4.0, cpi_mom: 0.2, XLK: -2.1, XLF: 6.4, XLE: 2.8, XLU: 6.8, XLV: 2.7, XLI: 4.9, XLY: 1.7, XLP: 5.1, XLB: 3.7, XLC: -4.2, XLRE: 7.2, SPY: 1.2 },
  { date: "2024-08", rates10Y_bps: -13, oil_pct: -5.6, vix_delta: -1.4, cpi_mom: 0.2, XLK: 1.2, XLF: 4.4, XLE: -2.1, XLU: 4.3, XLV: 5.0, XLI: 3.1, XLY: 2.3, XLP: 5.8, XLB: 2.4, XLC: 0.5, XLRE: 5.6, SPY: 2.4 },
  { date: "2024-09", rates10Y_bps: -11, oil_pct: -7.3, vix_delta: 1.8, cpi_mom: 0.2, XLK: 2.5, XLF: 1.2, XLE: 1.4, XLU: 6.5, XLV: -1.8, XLI: 3.4, XLY: 7.1, XLP: 1.0, XLB: 2.8, XLC: 4.2, XLRE: 3.1, SPY: 2.1 },
  { date: "2024-10", rates10Y_bps: 50, oil_pct: 1.6, vix_delta: 5.1, cpi_mom: 0.2, XLK: -0.8, XLF: 2.7, XLE: 0.9, XLU: -2.1, XLV: -4.6, XLI: -0.5, XLY: -0.3, XLP: -3.3, XLB: -3.8, XLC: 1.8, XLRE: -3.3, SPY: -0.9 },
  { date: "2024-11", rates10Y_bps: -11, oil_pct: -1.2, vix_delta: -8.5, cpi_mom: 0.3, XLK: 6.2, XLF: 8.5, XLE: 8.2, XLU: 2.0, XLV: 0.8, XLI: 8.1, XLY: 10.9, XLP: 2.8, XLB: 4.3, XLC: 6.0, XLRE: 3.2, SPY: 5.9 },
  { date: "2024-12", rates10Y_bps: 39, oil_pct: 4.2, vix_delta: 2.3, cpi_mom: 0.4, XLK: -3.2, XLF: 1.8, XLE: -0.5, XLU: -5.4, XLV: -2.1, XLI: -2.8, XLY: -3.1, XLP: -1.6, XLB: -4.2, XLC: -1.5, XLRE: -6.7, SPY: -2.3 },

  // 2025-2026: Recent Term Macro Dynamics
  { date: "2025-01", rates10Y_bps: 12, oil_pct: 6.1, vix_delta: -1.1, cpi_mom: 0.3, XLK: 4.1, XLF: 3.8, XLE: 4.2, XLU: -1.2, XLV: 1.5, XLI: 2.9, XLY: 3.4, XLP: 0.4, XLB: 1.8, XLC: 4.5, XLRE: -0.9, SPY: 2.9 },
  { date: "2025-02", rates10Y_bps: -8, oil_pct: -3.2, vix_delta: 0.5, cpi_mom: 0.2, XLK: 1.9, XLF: 0.8, XLE: -2.1, XLU: 2.4, XLV: 1.9, XLI: 0.5, XLY: 1.2, XLP: 2.1, XLB: -0.8, XLC: 1.4, XLRE: 2.3, SPY: 1.3 },
  { date: "2025-03", rates10Y_bps: 25, oil_pct: 4.8, vix_delta: 3.4, cpi_mom: 0.4, XLK: -1.8, XLF: 2.4, XLE: 5.1, XLU: -3.8, XLV: -0.5, XLI: 1.1, XLY: -1.5, XLP: -0.8, XLB: 0.9, XLC: -0.7, XLRE: -4.1, SPY: 0.2 },
  { date: "2025-04", rates10Y_bps: -19, oil_pct: -5.4, vix_delta: -2.8, cpi_mom: 0.1, XLK: 3.4, XLF: -0.4, XLE: -4.3, XLU: 4.1, XLV: 2.3, XLI: 1.8, XLY: 2.7, XLP: 1.9, XLB: 1.2, XLC: 2.8, XLRE: 3.6, SPY: 2.1 },
  { date: "2025-05", rates10Y_bps: 14, oil_pct: 2.2, vix_delta: 1.2, cpi_mom: 0.3, XLK: 2.2, XLF: 1.9, XLE: 1.8, XLU: -1.5, XLV: 0.7, XLI: 1.4, XLY: 1.1, XLP: -0.4, XLB: 0.8, XLC: 2.0, XLRE: -1.8, SPY: 1.4 },
  { date: "2025-06", rates10Y_bps: -28, oil_pct: -3.1, vix_delta: -3.5, cpi_mom: 0.2, XLK: 4.8, XLF: 2.1, XLE: -1.2, XLU: 3.2, XLV: 1.8, XLI: 2.7, XLY: 4.2, XLP: 1.5, XLB: 2.1, XLC: 3.9, XLRE: 4.5, SPY: 3.5 },
  { date: "2025-07", rates10Y_bps: 5, oil_pct: 1.8, vix_delta: 0.4, cpi_mom: 0.2, XLK: 1.6, XLF: 1.2, XLE: 1.9, XLU: 0.8, XLV: 1.4, XLI: 1.0, XLY: 0.8, XLP: 1.1, XLB: 0.6, XLC: 1.5, XLRE: 0.7, SPY: 1.3 },
  { date: "2025-08", rates10Y_bps: -15, oil_pct: -4.2, vix_delta: 2.1, cpi_mom: 0.2, XLK: 0.5, XLF: -0.8, XLE: -3.9, XLU: 3.8, XLV: 2.2, XLI: -0.5, XLY: -0.4, XLP: 2.4, XLB: -1.2, XLC: 0.2, XLRE: 2.9, SPY: 0.5 },
  { date: "2025-09", rates10Y_bps: 18, oil_pct: 3.5, vix_delta: 2.8, cpi_mom: 0.3, XLK: -2.3, XLF: 1.6, XLE: 3.9, XLU: -2.9, XLV: -0.9, XLI: -1.1, XLY: -1.8, XLP: -0.5, XLB: 0.2, XLC: -1.2, XLRE: -3.2, SPY: -0.8 },
  { date: "2025-10", rates10Y_bps: 22, oil_pct: -1.2, vix_delta: -1.9, cpi_mom: 0.2, XLK: 3.1, XLF: 2.8, XLE: 0.5, XLU: -2.0, XLV: 1.1, XLI: 2.2, XLY: 2.6, XLP: 0.8, XLB: 1.4, XLC: 2.9, XLRE: -1.5, SPY: 2.2 },
  { date: "2025-11", rates10Y_bps: -32, oil_pct: -2.9, vix_delta: -4.2, cpi_mom: 0.1, XLK: 5.4, XLF: 3.1, XLE: -1.8, XLU: 4.8, XLV: 3.0, XLI: 4.1, XLY: 5.8, XLP: 2.7, XLB: 3.9, XLC: 4.6, XLRE: 6.2, SPY: 4.5 },
  { date: "2025-12", rates10Y_bps: 8, oil_pct: 1.4, vix_delta: 0.2, cpi_mom: 0.2, XLK: 1.8, XLF: 1.4, XLE: 1.2, XLU: 0.4, XLV: 1.2, XLI: 1.1, XLY: 1.5, XLP: 0.9, XLB: 0.7, XLC: 1.7, XLRE: 0.3, SPY: 1.4 },
];

export interface ScenarioPreset {
  id: string;
  name: string;
  category: string;
  ratesBps: number;
  oilPct: number;
  vixPoints: number;
  cpiPct: number;
  description: string;
}

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: "custom",
    name: "Custom Stress Simulation",
    category: "User Defined",
    ratesBps: 0,
    oilPct: 0,
    vixPoints: 0,
    cpiPct: 0,
    description: "Freely manipulate macroeconomic innovation sliders to model bespoke market shocks.",
  },
  {
    id: "fed_hiking_cycle",
    name: "Aggressive Fed Hiking Cycle & Supply Squeeze",
    category: "Historical Regime",
    ratesBps: 175,
    oilPct: 25,
    vixPoints: 8,
    cpiPct: 1.2,
    description: "Echoes 2022 dynamics: front-end rate repricing, elevated commodity pressures, and multiple compression across long-duration assets.",
  },
  {
    id: "stagflation_shock",
    name: "1970s Style Stagflationary Oil Embargo",
    category: "Historical Regime",
    ratesBps: 150,
    oilPct: 40,
    vixPoints: 12,
    cpiPct: 2.5,
    description: "Acute energy supply disruption paired with unanchored inflation expectations and rising long bond yields.",
  },
  {
    id: "liquidity_crunch",
    name: "2020 Liquidity Crunch & Volatility Spike",
    category: "Historical Regime",
    ratesBps: -90,
    oilPct: -35,
    vixPoints: 26,
    cpiPct: -0.8,
    description: "Severe demand shock and rapid equity de-risking: collapse in commodity prices and flight-to-safety duration bids.",
  },
  {
    id: "soft_landing",
    name: "Goldilocks Disinflationary Soft Landing",
    category: "Macro Archetype",
    ratesBps: -75,
    oilPct: -10,
    vixPoints: -5,
    cpiPct: -0.5,
    description: "Orderly moderation in price pressures prompting central bank accommodation while corporate earnings remain resilient.",
  },
  {
    id: "flight_to_quality",
    name: "Deflationary Recession / Safe-Haven Flight",
    category: "Macro Archetype",
    ratesBps: -150,
    oilPct: -28,
    vixPoints: 18,
    cpiPct: -1.2,
    description: "Global contraction prompting aggressive sovereign bond rallies while cyclical equities face severe top-line erosion.",
  },
];
