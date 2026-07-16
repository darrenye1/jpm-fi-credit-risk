"""Peer comparison for Canadian Big 5 banks."""

from __future__ import annotations

from dataclasses import asdict, dataclass
from typing import Any

from .fi_metrics import FICreditMetrics, load_regulatory
from .rating_model import rate_fi_obligor

# Canadian Big 5 (NYSE / TSX dual-listed tickers via Yahoo Finance)
PEER_TICKERS = ["TD", "RY", "BNS", "BMO", "CM"]


@dataclass
class PeerRow:
    ticker: str
    name: str
    cet1_ratio: float | None
    npl_ratio: float | None
    lcr: float | None
    roaa: float | None
    efficiency_ratio: float | None
    leverage_ratio: float | None
    internal_rating: str | None
    score: float | None


def _metrics_from_reg(ticker: str) -> FICreditMetrics:
    reg = load_regulatory(ticker)
    return FICreditMetrics(
        ticker=ticker,
        name=str(reg.get("name", ticker)),
        as_of_market="",
        regulatory_as_of=str(reg.get("regulatory_as_of", "")),
        market_cap=None,
        total_assets=None,
        stockholders_equity=None,
        total_deposits=None,
        net_income=None,
        revenue=None,
        equity_to_assets=None,
        roe_reported=None,
        asset_growth_yoy=None,
        ni_growth_yoy=None,
        provision_to_revenue=None,
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
        peer_group=str(reg.get("peer_group", "")),
        field_sources={
            "cet1_ratio": "filing",
            "npl_ratio": "filing",
            "lcr": "filing",
            "roaa": "filing",
            "efficiency_ratio": "filing",
            "leverage_ratio": "filing",
        },
        regulatory_source=str(reg.get("source_note", "")),
    )


def build_peer_table(focus: str = "TD") -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for t in PEER_TICKERS:
        m = _metrics_from_reg(t)
        rating = rate_fi_obligor(m)
        row = PeerRow(
            ticker=t,
            name=m.name,
            cet1_ratio=m.cet1_ratio,
            npl_ratio=m.npl_ratio,
            lcr=m.lcr,
            roaa=m.roaa,
            efficiency_ratio=m.efficiency_ratio,
            leverage_ratio=m.leverage_ratio,
            internal_rating=rating.internal_rating,
            score=rating.total_score,
        )
        d = asdict(row)
        d["isFocus"] = t.upper() == focus.upper()
        rows.append(d)
    return rows
