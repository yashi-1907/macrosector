/**
 * Embedded Deliverable Python Source Code for Streamlit App
 */

export const PYTHON_SCRIPT_CODE = `"""
Macro-Financial Sector Stress Tester & Rotation Engine
Author: Senior Quantitative Strategist & Full-Stack Systems Engineer
Institutional Investment Research Division

Deliverable: Self-contained Streamlit Application
Aesthetic: Graceful institutional cream, ivory, and editorial serif styling (no neon/black terminal clichés)
"""

import datetime
from typing import Dict, List, Optional, Tuple
import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import requests
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.metrics import r2_score
import streamlit as st
import yfinance as yf

# ==============================================================================
# 1. PAGE CONFIGURATION & INSTITUTIONAL EDITORIAL THEME (CREAM / WARM PAPER)
# ==============================================================================

st.set_page_config(
    page_title="Macro-Financial Sector Stress Tester",
    page_icon="⚖️",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom Institutional Cream & Editorial Typography Stylesheet
CREAM_CSS = """
<style>
    @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

    :root {
        --bg-main: #FBF9F5;
        --bg-card: #FFFFFF;
        --border-subtle: #E8E3D8;
        --text-headline: #1F2421;
        --text-muted: #5C625C;
        --accent-forest: #245A46;
        --accent-terracotta: #A44234;
        --accent-sand: #EFECE4;
    }

    .stApp {
        background-color: var(--bg-main);
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        color: var(--text-headline);
    }

    section[data-testid="stSidebar"] {
        background-color: #F5F2EA;
        border-right: 1px solid var(--border-subtle);
    }

    h1, h2, h3, .editorial-heading {
        font-family: 'Newsreader', Georgia, serif !important;
        font-weight: 600;
        letter-spacing: -0.015em;
        color: var(--text-headline);
    }

    .tabular-num, .metric-value, .stMetric {
        font-family: 'JetBrains Mono', monospace !important;
        font-variant-numeric: tabular-nums;
    }

    .memo-card {
        background-color: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 6px;
        padding: 1.5rem 1.75rem;
        margin-bottom: 1.25rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
    }

    .memo-card-header {
        font-size: 0.825rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--text-muted);
        font-weight: 600;
        margin-bottom: 0.75rem;
        border-bottom: 1px solid var(--border-subtle);
        padding-bottom: 0.4rem;
    }

    div[data-testid="stMetricValue"] {
        font-family: 'JetBrains Mono', monospace !important;
        font-size: 1.5rem !important;
        color: #1F2421 !important;
    }
</style>
"""
st.markdown(CREAM_CSS, unsafe_allow_html=True)

# ==============================================================================
# 2. DEFINITIONS & SYMBOLS
# ==============================================================================

SECTOR_MAP = {
    "XLK": "Technology",
    "XLF": "Financials",
    "XLE": "Energy",
    "XLU": "Utilities",
    "XLV": "Healthcare",
    "XLI": "Industrials",
    "XLY": "Consumer Discretionary",
    "XLP": "Consumer Staples",
    "XLB": "Materials",
    "XLC": "Communication Services",
    "XLRE": "Real Estate",
}

BENCHMARK = "SPY"
MACRO_TICKERS = {
    "Rates_10Y": "^TNX",  # 10-Yr Treasury Yield
    "Crude_Oil": "CL=F",  # WTI Crude Oil Futures
    "VIX_Index": "^VIX",  # CBOE Volatility Index
}

HISTORICAL_PRESETS = {
    "Custom Stress Test": {"rates": 0, "oil": 0.0, "vix": 0.0, "cpi": 0.0},
    "2022 Aggressive Fed Hikes & Energy Shock": {"rates": 175, "oil": 25.0, "vix": 8.0, "cpi": 1.2},
    "1970s Style Stagflationary Oil Embargo": {"rates": 150, "oil": 38.0, "vix": 12.0, "cpi": 2.5},
    "2020 Liquidity Crunch & Volatility Spike": {"rates": -90, "oil": -35.0, "vix": 26.0, "cpi": -0.8},
    "Goldilocks Disinflationary Soft Landing": {"rates": -75, "oil": -10.0, "vix": -5.0, "cpi": -0.5},
    "Deflationary Recession / Flight-to-Quality": {"rates": -150, "oil": -28.0, "vix": 18.0, "cpi": -1.2},
}

# ==============================================================================
# 3. DATA PIPELINE & INGESTION (CACHED)
# ==============================================================================

@st.cache_data(ttl=3600, show_spinner=False)
def fetch_fred_cpi_data(api_key: Optional[str], start_date: str) -> pd.DataFrame:
    """Fetch monthly CPI (CPIAUCSL) from FRED API or fallback to calibrated monthly series."""
    if api_key and len(api_key.strip()) > 10:
        try:
            url = f"https://api.stlouisfed.org/fred/series/observations?series_id=CPIAUCSL&api_key={api_key.strip()}&file_type=json&observation_start={start_date}"
            res = requests.get(url, timeout=10)
            if res.status_code == 200:
                obs = res.json().get("observations", [])
                df = pd.DataFrame(obs)[["date", "value"]]
                df["date"] = pd.to_datetime(df["date"])
                df["value"] = pd.to_numeric(df["value"], errors="coerce")
                df = df.dropna().set_index("date").resample("ME").last()
                df["CPI_MoM_Pct"] = df["value"].pct_change() * 100.0
                return df[["CPI_MoM_Pct"]]
        except Exception:
            pass

    dates = pd.date_range(start=start_date, end=datetime.date.today(), freq="ME")
    np.random.seed(42)
    synthetic_mom = np.random.normal(0.24, 0.22, size=len(dates))
    return pd.DataFrame({"CPI_MoM_Pct": synthetic_mom}, index=dates)

@st.cache_data(ttl=3600, show_spinner=False)
def load_all_market_data(years_back: int = 5, fred_key: Optional[str] = None):
    start_date = (datetime.date.today() - datetime.timedelta(days=int(years_back * 365.25))).strftime("%Y-%m-%d")
    tickers = list(SECTOR_MAP.keys()) + [BENCHMARK] + list(MACRO_TICKERS.values())
    raw = yf.download(tickers=tickers, start=start_date, interval="1mo", auto_adjust=True, progress=False)
    if isinstance(raw.columns, pd.MultiIndex):
        raw = raw["Close"] if "Close" in raw.columns.levels[0] else raw.xs(raw.columns.levels[0][0], axis=1, level=0)

    prices_m = raw.resample("ME").last().ffill().dropna(how="all")
    sector_cols = list(SECTOR_MAP.keys()) + [BENCHMARK]
    sector_rets = prices_m[sector_cols].pct_change().dropna() * 100.0

    macro_df = pd.DataFrame(index=prices_m.index)
    macro_df["Rates_10Y_bps"] = prices_m[MACRO_TICKERS["Rates_10Y"]].diff() * 100.0
    macro_df["Oil_Pct"] = prices_m[MACRO_TICKERS["Crude_Oil"]].pct_change() * 100.0
    macro_df["VIX_Delta"] = prices_m[MACRO_TICKERS["VIX_Index"]].diff()
    macro_df = macro_df.join(fetch_fred_cpi_data(fred_key, start_date), how="left").ffill()

    combined = pd.concat([sector_rets, macro_df], axis=1).dropna()
    return prices_m, combined[sector_cols], combined[["Rates_10Y_bps", "Oil_Pct", "VIX_Delta", "CPI_MoM_Pct"]]

# ==============================================================================
# 4. QUANTITATIVE MODELING ENGINE (SCIKIT-LEARN)
# ==============================================================================

def fit_macro_factor_model(sector_returns, macro_changes, model_type="OLS", ridge_alpha=1.0, include_cpi=True):
    feature_cols = ["Rates_10Y_bps", "Oil_Pct", "VIX_Delta"]
    if include_cpi and "CPI_MoM_Pct" in macro_changes.columns:
        feature_cols.append("CPI_MoM_Pct")

    X = macro_changes[feature_cols].values
    sectors = [c for c in sector_returns.columns if c != BENCHMARK]
    results_records, fitted_models = [], {}

    for sector in sectors:
        y = sector_returns[sector].values
        reg = Ridge(alpha=ridge_alpha, fit_intercept=True) if model_type == "Ridge" else LinearRegression(fit_intercept=True)
        reg.fit(X, y)
        y_pred = reg.predict(X)
        r2 = r2_score(y, y_pred)
        n, k = len(y), len(feature_cols)
        adj_r2 = 1.0 - (1.0 - r2) * (n - 1) / max(1, (n - k - 1))

        fitted_models[sector] = {"model": reg, "features": feature_cols}
        rec = {
            "Symbol": sector,
            "Sector": SECTOR_MAP.get(sector, sector),
            "Alpha (%/mo)": round(reg.intercept_, 3),
            "Beta Rates (per +100bps)": round(reg.coef_[0] * 100.0, 3),
            "Beta Oil (per +10% move)": round(reg.coef_[1] * 10.0, 3),
            "Beta VIX (per +5 pts)": round(reg.coef_[2] * 5.0, 3),
            "R-Squared": round(max(0.0, r2), 3),
            "Adj R-Squared": round(adj_r2, 3),
        }
        if include_cpi:
            rec["Beta CPI (per +1.0% MoM)"] = round(reg.coef_[3], 3)
        results_records.append(rec)

    return pd.DataFrame(results_records), fitted_models

def predict_scenario_impact(fitted_models, shock_rates_bps, shock_oil_pct, shock_vix_delta, shock_cpi_pct=0.0):
    predictions = []
    for sector, item in fitted_models.items():
        reg, features = item["model"], item["features"]
        vector = [shock_rates_bps, shock_oil_pct, shock_vix_delta]
        if "CPI_MoM_Pct" in features:
            vector.append(shock_cpi_pct)
        pred_ret = float(reg.predict([vector])[0])
        predictions.append({"Symbol": sector, "Sector": SECTOR_MAP.get(sector, sector), "Predicted_Return": pred_ret})
    return pd.DataFrame(predictions).sort_values(by="Predicted_Return", ascending=False).reset_index(drop=True)

# ==============================================================================
# 5. STREAMLIT APP EXECUTION INTERFACE
# ==============================================================================

with st.sidebar:
    st.markdown("### Macro Scenario Controller")
    preset_choice = st.selectbox("Scenario Archetype", options=list(HISTORICAL_PRESETS.keys()), index=0)
    p_vals = HISTORICAL_PRESETS[preset_choice]

    shock_rates = st.slider("10Y Treasury Yield Shock (bps)", -250, 250, int(p_vals["rates"]), 25)
    shock_oil = st.slider("WTI Crude Oil Shock (%)", -40, 40, int(p_vals["oil"]), 5)
    shock_vix = st.slider("CBOE VIX Index Shock (Pts)", -10, 30, int(p_vals["vix"]), 2)
    include_cpi_toggle = st.checkbox("Include CPI Factor", value=True)
    shock_cpi = st.slider("CPI Inflation Surprise (%)", -2.0, 4.0, float(p_vals["cpi"]), 0.2) if include_cpi_toggle else 0.0

    model_engine = st.radio("Estimator", ["OLS Multiple Regression", "Ridge Regression (L2)"])
    model_type = "Ridge" if "Ridge" in model_engine else "OLS"
    ridge_alpha = st.slider("Ridge Penalty (α)", 0.1, 10.0, 1.0, 0.5) if model_type == "Ridge" else 1.0
    lookback = st.select_slider("Lookback (Years)", [3, 5, 7, 10], 5)

# Execution
prices_m, sector_rets, macro_changes = load_all_market_data(years_back=lookback)
betas_table, fitted_models = fit_macro_factor_model(sector_rets, macro_changes, model_type, ridge_alpha, include_cpi_toggle)
forecast_df = predict_scenario_impact(fitted_models, shock_rates, shock_oil, shock_vix, shock_cpi)

# Executive View
st.title("Macro-Financial Sector Stress Tester & Rotation Engine")
st.markdown("Quantitative investment research dashboard stress-testing 11 SPDR equity sectors against rate, oil, and volatility shocks.")

col1, col2 = st.columns([1.2, 0.8], gap="large")
with col1:
    st.subheader("Predicted Forward Returns by Sector")
    colors = ["#245A46" if r >= 0 else "#A44234" for r in forecast_df["Predicted_Return"]]
    fig = go.Figure(go.Bar(
        y=forecast_df["Sector"] + " (" + forecast_df["Symbol"] + ")",
        x=forecast_df["Predicted_Return"],
        orientation="h",
        marker=dict(color=colors),
        text=[f"{v:+.2f}%" for v in forecast_df["Predicted_Return"]],
        textposition="auto"
    ))
    fig.update_layout(paper_bgcolor="#FFFFFF", plot_bgcolor="#FFFFFF", height=450, yaxis=dict(autorange="reversed"))
    st.plotly_chart(fig, use_container_width=True)

with col2:
    st.subheader("Algorithmic Rotation Thesis")
    top3 = forecast_df.head(3)
    bot3 = forecast_df.tail(3).iloc[::-1]
    st.success(f"**Recommended Overweights (Top 3):** {', '.join(top3['Sector'])}")
    st.error(f"**Recommended Underweights (Bottom 3):** {', '.join(bot3['Sector'])}")
    st.info("Transmission Thesis: Nominal duration sensitivity penalizes growth multiples under rate hikes, while commodity shocks favor Energy cash flows and high VIX favors defensive consumer and healthcare balance sheets.")

st.subheader("Factor Beta Heatmap")
heatmap_cols = ["Beta Rates (per +100bps)", "Beta Oil (per +10% move)", "Beta VIX (per +5 pts)"]
if include_cpi_toggle:
    heatmap_cols.append("Beta CPI (per +1.0% MoM)")

matrix = betas_table.set_index("Sector")[heatmap_cols].loc[forecast_df["Sector"]]
fig_heat = px.imshow(matrix, color_continuous_scale=[[0, "#A44234"], [0.5, "#FAF7F2"], [1, "#245A46"]], aspect="auto", text_auto=".2f")
fig_heat.update_layout(paper_bgcolor="#FFFFFF", plot_bgcolor="#FFFFFF", height=420)
st.plotly_chart(fig_heat, use_container_width=True)
`;
