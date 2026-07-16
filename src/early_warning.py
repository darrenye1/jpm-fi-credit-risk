"""Early-warning indicators and watchlist logic for FI obligors."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any

from .fi_metrics import FICreditMetrics
from .rating_model import ObligorRating


@dataclass
class WarningItem:
    indicator: str
    threshold: str
    actual: str
    status: str  # Pass | Watch | Breach
    severity: str  # Low | Medium | High
    comment: str


@dataclass
class EarlyWarningReport:
    ticker: str
    watchlist: bool
    overall_status: str
    items: list[WarningItem] = field(default_factory=list)
    recommended_actions: list[str] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


def _status(pass_ok: bool, watch: bool) -> str:
    if not pass_ok:
        return "Breach"
    if watch:
        return "Watch"
    return "Pass"


def build_early_warning(m: FICreditMetrics, rating: ObligorRating) -> EarlyWarningReport:
    items: list[WarningItem] = []

    checks = [
        (
            "CET1 Ratio",
            "≥ 11.5% (watch < 13%)",
            m.cet1_ratio,
            "%",
            lambda v: v >= 11.5,
            lambda v: v < 13.0,
            "High",
            "Capital adequacy vs internal FI limit",
        ),
        (
            "NPL Ratio",
            "≤ 1.5% (watch > 1.0%)",
            m.npl_ratio,
            "%",
            lambda v: v <= 1.5,
            lambda v: v > 1.0,
            "High",
            "Asset quality deterioration signal",
        ),
        (
            "NCO Ratio",
            "≤ 1.0% (watch > 0.7%)",
            m.nco_ratio,
            "%",
            lambda v: v <= 1.0,
            lambda v: v > 0.7,
            "Medium",
            "Loss content / underwriting quality",
        ),
        (
            "LCR",
            "≥ 105% (watch < 110%)",
            m.lcr,
            "%",
            lambda v: v >= 105,
            lambda v: v < 110,
            "High",
            "Liquidity buffer for deposit / wholesale stress",
        ),
        (
            "ROAA",
            "≥ 0.60% (watch < 0.90%)",
            m.roaa,
            "%",
            lambda v: v >= 0.60,
            lambda v: v < 0.90,
            "Medium",
            "Earnings capacity to absorb credit costs",
        ),
        (
            "Efficiency Ratio",
            "≤ 70% (watch > 60%)",
            m.efficiency_ratio,
            "%",
            lambda v: v <= 70,
            lambda v: v > 60,
            "Low",
            "Operating leverage / cost flexibility",
        ),
        (
            "Internal Rating",
            "≥ BBB- (watch ≤ BBB)",
            rating.internal_rating,
            "",
            lambda v: v not in {"BB+", "BB", "B", "CCC"},
            lambda v: v in {"BBB", "BBB-"},
            "High",
            "Obligor grade vs investment-grade policy floor",
        ),
    ]

    for name, thr, raw, unit, pass_fn, watch_fn, sev, comment in checks:
        if raw is None:
            items.append(
                WarningItem(
                    indicator=name,
                    threshold=thr,
                    actual="n/a",
                    status="Watch",
                    severity="Low",
                    comment="Missing data — treat as monitoring gap",
                )
            )
            continue
        if isinstance(raw, str):
            actual = raw
            ok = pass_fn(raw)
            watch = watch_fn(raw)
        else:
            actual = f"{raw:.2f}{unit}"
            ok = pass_fn(float(raw))
            watch = watch_fn(float(raw))
        items.append(
            WarningItem(
                indicator=name,
                threshold=thr,
                actual=actual,
                status=_status(ok, watch),
                severity=sev if not ok else ("Medium" if watch else "Low"),
                comment=comment,
            )
        )

    breaches = sum(1 for i in items if i.status == "Breach")
    watches = sum(1 for i in items if i.status == "Watch")
    if breaches:
        overall = "Breach"
        watchlist = True
    elif watches >= 2:
        overall = "Watch"
        watchlist = True
    else:
        overall = "Pass"
        watchlist = False

    actions: list[str] = []
    if overall == "Pass":
        actions = [
            "Maintain routine annual review cycle",
            "Keep existing facility limits; no rating override needed",
            "Refresh regulatory overlay after next 10-Q / earnings",
        ]
    elif overall == "Watch":
        actions = [
            "Move to enhanced monitoring (quarterly deep-dive)",
            "Re-validate liquidity and deposit betas in funding shock scenario",
            "Consider tighter undrawn CCF / lower unsecured hold",
        ]
    else:
        actions = [
            "Escalate to credit committee / reduce unsecured exposure",
            "Request updated capital plan and AQ outlook from relationship team",
            "Reprice / shorten tenor; raise collateral or guarantees if renewing",
        ]

    return EarlyWarningReport(
        ticker=m.ticker,
        watchlist=watchlist,
        overall_status=overall,
        items=items,
        recommended_actions=actions,
    )
