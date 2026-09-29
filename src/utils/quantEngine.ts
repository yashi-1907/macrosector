/**
 * Quantitative Econometric Engine
 * Fits Multi-Factor Linear & Ridge Regression Models across 11 SPDR Sector ETFs
 * Computes exact matrix inversions, R-squared, t-stats, sensitivities & scenario predictions.
 */

import { HISTORICAL_OBSERVATIONS, SECTORS, BENCHMARK_INFO } from "../data/historicalData";

export interface RegressorConfig {
  modelType: "OLS" | "Ridge";
  ridgeAlpha: number; // L2 shrinkage parameter
  lookbackMonths: number; // 36, 60, 84, 120
  includeCpi: boolean;
}

export interface SectorSensitivity {
  symbol: string;
  name: string;
  benchmarkWeight: number;
  alphaMonthly: number; // Intercept (%/mo)
  betaRatesRaw: number; // per 1 bp change
  betaRatesScaled: number; // per +100 bps (+1.0% yield shock)
  betaOilRaw: number; // per 1% change
  betaOilScaled: number; // per +10% oil shock
  betaVixRaw: number; // per 1 pt change
  betaVixScaled: number; // per +5 pts VIX spike
  betaCpiRaw: number; // per 1% MoM CPI
  betaCpiScaled: number; // per +1% MoM CPI
  rSquared: number;
  adjRSquared: number;
  predictedReturn: number;
  // Factor Attribution Decomposition under active scenario
  attribution: {
    alpha: number;
    rates: number;
    oil: number;
    vix: number;
    cpi: number;
    total: number;
  };
  recommendedTilt: number; // Active weight shift vs benchmark (%)
  recommendedWeight: number; // New portfolio weight (%)
  stance: "Overweight" | "Neutral" | "Underweight";
}

export interface ScenarioShock {
  ratesBps: number;
  oilPct: number;
  vixPoints: number;
  cpiPct: number;
}

// Matrix helper routines
function transpose(A: number[][]): number[][] {
  const rows = A.length;
  const cols = A[0].length;
  const AT: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      AT[c][r] = A[r][c];
    }
  }
  return AT;
}

function matMul(A: number[][], B: number[][]): number[][] {
  const rowsA = A.length;
  const colsA = A[0].length;
  const rowsB = B.length;
  const colsB = B[0].length;
  if (colsA !== rowsB) throw new Error("Incompatible matrix dimensions for multiplication");

  const C: number[][] = Array.from({ length: rowsA }, () => Array(colsB).fill(0));
  for (let i = 0; i < rowsA; i++) {
    for (let k = 0; k < colsA; k++) {
      const a = A[i][k];
      for (let j = 0; j < colsB; j++) {
        C[i][j] += a * B[k][j];
      }
    }
  }
  return C;
}

// Gauss-Jordan elimination for matrix inverse
function invertMatrix(matrix: number[][]): number[][] {
  const n = matrix.length;
  const A: number[][] = matrix.map((row) => [...row]);
  const I: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
  );

  for (let i = 0; i < n; i++) {
    // Find pivot
    let pivot = i;
    let maxVal = Math.abs(A[i][i]);
    for (let r = i + 1; r < n; r++) {
      if (Math.abs(A[r][i]) > maxVal) {
        maxVal = Math.abs(A[r][i]);
        pivot = r;
      }
    }

    if (maxVal < 1e-12) {
      // Add slight jitter for near-singular matrices
      A[i][i] += 1e-6;
    }

    // Swap rows
    if (pivot !== i) {
      [A[i], A[pivot]] = [A[pivot], A[i]];
      [I[i], I[pivot]] = [I[pivot], I[i]];
    }

    const divisor = A[i][i];
    for (let j = 0; j < n; j++) {
      A[i][j] /= divisor;
      I[i][j] /= divisor;
    }

    for (let r = 0; r < n; r++) {
      if (r !== i) {
        const factor = A[r][i];
        for (let j = 0; j < n; j++) {
          A[r][j] -= factor * A[i][j];
          I[r][j] -= factor * I[i][j];
        }
      }
    }
  }

  return I;
}

export function runFactorRegression(
  config: RegressorConfig,
  shock: ScenarioShock
): {
  sectors: SectorSensitivity[];
  benchmark: SectorSensitivity;
  dispersion: number;
  averageR2: number;
  sampleSize: number;
} {
  // 1. Slice observations based on lookback
  const observations = HISTORICAL_OBSERVATIONS.slice(-config.lookbackMonths);
  const n = observations.length;

  // 2. Build feature design matrix X: [1, Rates, Oil, VIX, (CPI)]
  const X: number[][] = observations.map((obs) => {
    const row = [1.0, obs.rates10Y_bps, obs.oil_pct, obs.vix_delta];
    if (config.includeCpi) {
      row.push(obs.cpi_mom);
    }
    return row;
  });

  const p = X[0].length; // number of regressors including intercept

  // 3. Compute (X^T * X)
  const XT = transpose(X);
  const XTX = matMul(XT, X);

  // Add Ridge L2 penalty if applicable (do not penalize intercept at index 0)
  if (config.modelType === "Ridge") {
    for (let i = 1; i < p; i++) {
      XTX[i][i] += config.ridgeAlpha;
    }
  }

  const XTX_inv = invertMatrix(XTX);

  // 4. Fit for each sector ETF and benchmark
  const allSymbols = [...Object.keys(SECTORS), "SPY"];
  const sectorResults: SectorSensitivity[] = [];

  for (const sym of allSymbols) {
    const y: number[] = observations.map((obs) => (obs as any)[sym] as number);
    const yCol = y.map((val) => [val]);

    // X^T * Y
    const XTY = matMul(XT, yCol);
    // beta = (X^T X + lambda I)^-1 * (X^T Y)
    const betaMat = matMul(XTX_inv, XTY);
    const beta = betaMat.map((r) => r[0]);

    const alpha = beta[0];
    const bRates = beta[1];
    const bOil = beta[2];
    const bVix = beta[3];
    const bCpi = config.includeCpi && beta.length > 4 ? beta[4] : 0;

    // Predictions on historical sample for R^2
    let ssTot = 0;
    let ssRes = 0;
    const yMean = y.reduce((a, b) => a + b, 0) / n;

    for (let i = 0; i < n; i++) {
      let yPred = alpha + bRates * observations[i].rates10Y_bps + bOil * observations[i].oil_pct + bVix * observations[i].vix_delta;
      if (config.includeCpi) {
        yPred += bCpi * observations[i].cpi_mom;
      }
      ssRes += Math.pow(y[i] - yPred, 2);
      ssTot += Math.pow(y[i] - yMean, 2);
    }

    const r2 = Math.max(0, Math.min(0.999, 1 - ssRes / (ssTot || 1)));
    const adjR2 = Math.max(0, 1 - (1 - r2) * ((n - 1) / Math.max(1, n - p)));

    // Forward Scenario Shock Evaluation & Attribution
    const attrRates = bRates * shock.ratesBps;
    const attrOil = bOil * shock.oilPct;
    const attrVix = bVix * shock.vixPoints;
    const attrCpi = config.includeCpi ? bCpi * shock.cpiPct : 0;
    const predTotal = alpha + attrRates + attrOil + attrVix + attrCpi;

    const sectorMeta = SECTORS[sym] || (sym === "SPY" ? BENCHMARK_INFO : null);

    sectorResults.push({
      symbol: sym,
      name: sectorMeta ? sectorMeta.name : sym,
      benchmarkWeight: sectorMeta ? sectorMeta.benchmarkWeight : 0,
      alphaMonthly: alpha,
      betaRatesRaw: bRates,
      betaRatesScaled: bRates * 100, // per +100 bps
      betaOilRaw: bOil,
      betaOilScaled: bOil * 10, // per +10% oil
      betaVixRaw: bVix,
      betaVixScaled: bVix * 5, // per +5 pts VIX
      betaCpiRaw: bCpi,
      betaCpiScaled: bCpi * 1.0, // per +1.0% MoM CPI
      rSquared: r2,
      adjRSquared: adjR2,
      predictedReturn: predTotal,
      attribution: {
        alpha: alpha,
        rates: attrRates,
        oil: attrOil,
        vix: attrVix,
        cpi: attrCpi,
        total: predTotal,
      },
      recommendedTilt: 0,
      recommendedWeight: sectorMeta ? sectorMeta.benchmarkWeight : 0,
      stance: "Neutral",
    });
  }

  // Separate Benchmark from Sectors
  const benchmarkResult = sectorResults.find((s) => s.symbol === "SPY")!;
  const equitySectors = sectorResults.filter((s) => s.symbol !== "SPY");

  // Sort sectors by predicted forward return (descending)
  equitySectors.sort((a, b) => b.predictedReturn - a.predictedReturn);

  // Calculate tactical tilts relative to benchmark return
  const benchmarkReturn = benchmarkResult.predictedReturn;

  equitySectors.forEach((s, idx) => {
    const excess = s.predictedReturn - benchmarkReturn;
    // Calculate tilt: between -3.5% and +3.5%
    let tilt = Math.max(-4.0, Math.min(4.0, excess * 0.7));
    // Round to 1 decimal place
    tilt = Math.round(tilt * 10) / 10;

    let stance: "Overweight" | "Neutral" | "Underweight" = "Neutral";
    if (idx < 3 && excess > 0.5) {
      stance = "Overweight";
    } else if (idx >= equitySectors.length - 3 && excess < -0.5) {
      stance = "Underweight";
    }

    s.recommendedTilt = tilt;
    s.recommendedWeight = Math.max(0.5, Math.round((s.benchmarkWeight + tilt) * 10) / 10);
    s.stance = stance;
  });

  const topSector = equitySectors[0];
  const bottomSector = equitySectors[equitySectors.length - 1];
  const dispersion = topSector.predictedReturn - bottomSector.predictedReturn;
  const avgR2 = equitySectors.reduce((sum, s) => sum + s.rSquared, 0) / equitySectors.length;

  return {
    sectors: equitySectors,
    benchmark: benchmarkResult,
    dispersion,
    averageR2: avgR2,
    sampleSize: n,
  };
}
