"""Derive FI credit metrics from statements + regulatory overlays."""

from __future__ import annotations

import json
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any

from .data_fetcher import BankMarketData, FIDataFetcher

ROOT = Path(__file__).resolve().parent.parent
REG_PATH = ROOT / "data" / "regulatory_metrics.json"


@dataclass
class FICreditMetrics:
    ticker: str
    name: str
    as_of_market: str
    regulatory_as_of: str
    # Market / scale
    market_cap: float | None
    total_assets: float | None
    stockholders_equity: float | None
    total_deposits: float | None
    net_income: float | None
    revenue: float | None
    # Derived from statements
    equity_to_assets: float | None
    roe_reported: float | None
    asset_growth_yoy: float | None
    ni_growth_yoy: float | None
    provision_to_revenue: float | None
    # Regulatory / supplemental
    cet1_ratio: float | None
    tier1_ratio: float | None
    total_capital_ratio: float | None
    leverage_ratio: float | None
    lcr: float | None
    npl_ratio: float | None
    nco_ratio: float | None
    allowance_to_loans: float | None
    nim: float | None
    efficiency_ratio: float | None
    roaa: float | None
    roae: float | None
    loan_to_deposit: float | None
    g_sib: bool
    peer_group: str
    annual_trends: list[dict[str, Any]] = field(default_factory=list)
    notes: list[str] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


def load_regulatory(ticker: str) -> dict[str, Any]:
    with open(REG_PATH, encoding="utf-8") as f:
        payload = json.load(f)
    banks = payload.get("banks", {})
    row = banks.get(ticker.upper(), {})
    return {
        "regulatory_as_of": payload.get("as_of", ""),
        "source": payload.get("source", ""),
        **row,
    }


def _latest(series: dict[int, float]) -> float | None:
    if not series:
        return None
    return series[max(series)]


def _yoy(series: dict[int, float]) -> float | None:
    if len(series) < 2:
        return None
    years = sorted(series)
    prev, curr = series[years[-2]], series[years[-1]]
    if prev == 0:
        return None
    return (curr - prev) / abs(prev) * 100


def build_fi_metrics(data: BankMarketData) -> FICreditMetrics:
    fetcher = FIDataFetcher
    assets = fetcher.statement_series(
        data,
        "balance",
        ["Total Assets", "TotalAssets"],
    )
    equity = fetcher.statement_series(
        data,
        "balance",
        [
            "Stockholders Equity",
            "Common Stock Equity",
            "Total Equity Gross Minority Interest",
            "Total Stockholder Equity",
        ],
    )
    deposits = fetcher.statement_series(
        data,
        "balance",
        [
            "Total Deposits",
            "Cash Cash Equivalents And Federal Funds Sold",  # weak fallback avoided below
        ],
    )
    # Prefer true deposits if present
    deposits_clean = fetcher.statement_series(
        data,
        "balance",
        ["Total Deposits", "Deposits"],
    )
    deposits = deposits_clean or {}

    net_income = fetcher.statement_series(
        data,
        "income",
        ["Net Income", "Net Income Common Stockholders", "NetIncome"],
    )
    revenue = fetcher.statement_series(
        data,
        "income",
        [
            "Total Revenue",
            "Operating Revenue",
            "Net Interest Income",
            "TotalRevenue",
        ],
    )
    provisions = fetcher.statement_series(
        data,
        "income",
        [
            "Provision For Credit Losses",
            "Credit Losses Provision",
            "ProvisionForLoanLeaseAndOtherLosses",
        ],
    )

    total_assets = _latest(assets)
    stockholders_equity = _latest(equity)
    ni = _latest(net_income)
    rev = _latest(revenue)
    prov = _latest(provisions)

    equity_to_assets = None
    if total_assets and stockholders_equity and total_assets != 0:
        equity_to_assets = stockholders_equity / total_assets * 100

    roe = None
    if stockholders_equity and ni and stockholders_equity != 0:
        roe = ni / stockholders_equity * 100

    provision_to_revenue = None
    if prov is not None and rev and rev != 0:
        provision_to_revenue = abs(prov) / abs(rev) * 100

    # Annual trend table
    years = sorted(set(assets) | set(net_income) | set(revenue) | set(equity))
    trends: list[dict[str, Any]] = []
    for y in years:
        row: dict[str, Any] = {"year": y}
        if y in assets:
            row["totalAssets"] = assets[y]
        if y in equity:
            row["equity"] = equity[y]
        if y in net_income:
            row["netIncome"] = net_income[y]
        if y in revenue:
            row["revenue"] = revenue[y]
        if y in provisions:
            row["provisions"] = provisions[y]
        if y in assets and y in equity and assets[y]:
            row["equityToAssets"] = equity[y] / assets[y] * 100
        trends.append(row)

    reg = load_regulatory(data.ticker)
    notes = [
        "FI credit analysis uses regulatory capital & asset-quality metrics — not corporate EBITDA leverage.",
        f"Regulatory overlay as of {reg.get('regulatory_as_of', 'n/a')} ({reg.get('source', 'filings')}).",
        "Market statements from Yahoo Finance; CET1/NPL/NIM from curated filing-based overlay.",
    ]

    return FICreditMetrics(
        ticker=data.ticker,
        name=data.name,
        as_of_market=str(data.history.index.max().date()) if not data.history.empty else "",
        regulatory_as_of=str(reg.get("regulatory_as_of", "")),
        market_cap=data.market_cap,
        total_assets=total_assets,
        stockholders_equity=stockholders_equity,
        total_deposits=_latest(deposits),
        net_income=ni,
        revenue=rev,
        equity_to_assets=equity_to_assets,
        roe_reported=roe,
        asset_growth_yoy=_yoy(assets),
        ni_growth_yoy=_yoy(net_income),
        provision_to_revenue=provision_to_revenue,
        cet1_ratio=reg.get("cet1_ratio"),
        tier1_ratio=reg.get("tier1_ratio"),
        total_capital_ratio=reg.get("total_capital_ratio"),
        leverage_ratio=reg.get("leverage_ratio"),
        lcr=reg.get("lcr"),
        npl_ratio=reg.get("npl_ratio"),
        nco_ratio=reg.get("nco_ratio"),
        allowance_to_loans=reg.get("allowance_to_loans"),
        nim=reg.get("nim"),
        efficiency_ratio=reg.get("efficiency_ratio"),
        roaa=reg.get("roaa"),
        roae=reg.get("roae"),
        loan_to_deposit=reg.get("loan_to_deposit"),
        g_sib=bool(reg.get("g_sib", False)),
        peer_group=str(reg.get("peer_group", "Banks")),
        annual_trends=trends,
        notes=notes,
    )
