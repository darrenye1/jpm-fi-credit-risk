"""FI obligor scorecard → internal rating → through-the-cycle PD proxy."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any

from .fi_metrics import FICreditMetrics

# Internal rating scale (corporate-banking style), mapped to illustrative TTC PD
RATING_PD = {
    "AAA": 0.02,
    "AA": 0.05,
    "A": 0.10,
    "BBB+": 0.25,
    "BBB": 0.40,
    "BBB-": 0.60,
    "BB+": 1.00,
    "BB": 1.50,
    "B": 3.50,
    "CCC": 10.0,
}

# Score bands → rating (higher score = stronger credit)
SCORE_TO_RATING = [
    (90, "AAA"),
    (82, "AA"),
    (74, "A"),
    (68, "BBB+"),
    (62, "BBB"),
    (56, "BBB-"),
    (48, "BB+"),
    (40, "BB"),
    (30, "B"),
    (0, "CCC"),
]


@dataclass
class FactorScore:
    name: str
    category: str
    raw_value: float | None
    unit: str
    score: float
    weight: float
    weighted: float
    rationale: str


@dataclass
class ObligorRating:
    ticker: str
    total_score: float
    internal_rating: str
    pd_ttc_pct: float
    outlook: str
    factors: list[FactorScore] = field(default_factory=list)
    methodology_notes: list[str] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        d = asdict(self)
        return d


def _clamp(x: float, lo: float = 0.0, hi: float = 100.0) -> float:
    return max(lo, min(hi, x))


def _score_cet1(v: float | None) -> tuple[float, str]:
    if v is None:
        return 50.0, "CET1 unavailable — neutral score"
    # Well-capitalized G-SIB: >13 strong; <10 weak
    if v >= 15:
        return 95.0, "CET1 well above peer / regulatory comfort"
    if v >= 13:
        return 85.0, "Strong CET1 vs G-SIB peers"
    if v >= 11.5:
        return 70.0, "Adequate CET1"
    if v >= 10:
        return 55.0, "CET1 near tighter comfort zone"
    return 35.0, "CET1 compressed — heightened capital risk"


def _score_npl(v: float | None) -> tuple[float, str]:
    if v is None:
        return 50.0, "NPL unavailable — neutral score"
    if v <= 0.6:
        return 92.0, "Very clean asset quality"
    if v <= 0.9:
        return 80.0, "Solid asset quality"
    if v <= 1.3:
        return 65.0, "Moderate NPL — monitor vintage risk"
    if v <= 2.0:
        return 45.0, "Elevated NPL"
    return 25.0, "Stressed asset quality"


def _score_nco(v: float | None) -> tuple[float, str]:
    if v is None:
        return 50.0, "NCO unavailable — neutral score"
    if v <= 0.4:
        return 90.0, "Low net charge-offs"
    if v <= 0.7:
        return 78.0, "Contained credit losses"
    if v <= 1.0:
        return 60.0, "Rising loss content"
    return 35.0, "High charge-off run-rate"


def _score_lcr(v: float | None) -> tuple[float, str]:
    if v is None:
        return 50.0, "LCR unavailable — neutral score"
    if v >= 120:
        return 90.0, "Comfortable liquidity coverage"
    if v >= 110:
        return 80.0, "LCR above regulatory minimum with buffer"
    if v >= 100:
        return 60.0, "Meets LCR — limited surplus"
    return 30.0, "LCR below comfort"


def _score_roaa(v: float | None) -> tuple[float, str]:
    if v is None:
        return 50.0, "ROAA unavailable — neutral score"
    if v >= 1.2:
        return 90.0, "Strong through-cycle profitability"
    if v >= 0.9:
        return 75.0, "Solid returns"
    if v >= 0.6:
        return 55.0, "Adequate but below top-tier peers"
    return 35.0, "Weak profitability"


def _score_efficiency(v: float | None) -> tuple[float, str]:
    if v is None:
        return 50.0, "Efficiency ratio unavailable — neutral score"
    # Lower is better for banks
    if v <= 52:
        return 92.0, "Best-in-class efficiency"
    if v <= 58:
        return 80.0, "Strong cost discipline"
    if v <= 65:
        return 62.0, "Average efficiency"
    return 40.0, "Elevated cost base"


def _score_leverage(v: float | None) -> tuple[float, str]:
    if v is None:
        return 50.0, "Leverage ratio unavailable — neutral score"
    if v >= 6.5:
        return 88.0, "Conservative leverage"
    if v >= 5.5:
        return 72.0, "Adequate leverage ratio"
    if v >= 4.5:
        return 55.0, "Tighter leverage"
    return 35.0, "Aggressive leverage"


def _score_to_rating(score: float) -> str:
    for threshold, rating in SCORE_TO_RATING:
        if score >= threshold:
            return rating
    return "CCC"


def rate_fi_obligor(m: FICreditMetrics) -> ObligorRating:
    specs = [
        ("CET1 Ratio", "Capital", m.cet1_ratio, "%", 0.25, _score_cet1),
        ("Leverage Ratio", "Capital", m.leverage_ratio, "%", 0.10, _score_leverage),
        ("NPL Ratio", "Asset Quality", m.npl_ratio, "%", 0.18, _score_npl),
        ("NCO Ratio", "Asset Quality", m.nco_ratio, "%", 0.10, _score_nco),
        ("LCR", "Liquidity", m.lcr, "%", 0.15, _score_lcr),
        ("ROAA", "Earnings", m.roaa, "%", 0.12, _score_roaa),
        ("Efficiency Ratio", "Earnings", m.efficiency_ratio, "%", 0.10, _score_efficiency),
    ]

    factors: list[FactorScore] = []
    total = 0.0
    for name, cat, raw, unit, weight, fn in specs:
        score, rationale = fn(raw)
        weighted = score * weight
        total += weighted
        factors.append(
            FactorScore(
                name=name,
                category=cat,
                raw_value=raw,
                unit=unit,
                score=round(score, 1),
                weight=weight,
                weighted=round(weighted, 2),
                rationale=rationale,
            )
        )

    total = round(_clamp(total), 1)
    rating = _score_to_rating(total)
    pd = RATING_PD[rating]

    # Outlook heuristic
    if m.npl_ratio and m.npl_ratio > 1.0:
        outlook = "Negative"
    elif m.cet1_ratio and m.cet1_ratio >= 14 and (m.roaa or 0) >= 1.0:
        outlook = "Stable-Positive"
    else:
        outlook = "Stable"

    return ObligorRating(
        ticker=m.ticker,
        total_score=total,
        internal_rating=rating,
        pd_ttc_pct=pd,
        outlook=outlook,
        factors=factors,
        methodology_notes=[
            "Weighted expert scorecard tailored to bank obligors (capital, AQ, liquidity, earnings).",
            "Internal ratings mapped to illustrative through-the-cycle PD — not agency ratings.",
            "G-SIB status is a qualitative positive for recovery / systemic support, not a score input.",
        ],
    )
