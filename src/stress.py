"""Stress testing for FI obligor credit metrics and EL."""

from __future__ import annotations

from copy import deepcopy
from dataclasses import asdict, dataclass, field
from typing import Any

from .facility_risk import FacilityAssumption, build_portfolio_el
from .fi_metrics import FICreditMetrics
from .rating_model import ObligorRating, rate_fi_obligor


@dataclass
class StressScenario:
    id: str
    name: str
    description: str
    # Additive shocks to key ratios (percentage points unless noted)
    cet1_shock_pp: float = 0.0
    npl_shock_pp: float = 0.0
    nco_shock_pp: float = 0.0
    lcr_shock_pp: float = 0.0
    roaa_shock_pp: float = 0.0
    efficiency_shock_pp: float = 0.0
    pd_multiplier: float = 1.0  # applied after re-rating, as overlay


SCENARIOS = [
    StressScenario(
        id="base",
        name="Base",
        description="Current regulatory overlay and market statements — no shock.",
    ),
    StressScenario(
        id="mild",
        name="Mild Downturn",
        description="Soft landing: modest AQ deterioration, NIM pressure, limited capital drawdown.",
        cet1_shock_pp=-0.8,
        npl_shock_pp=0.35,
        nco_shock_pp=0.25,
        lcr_shock_pp=-5,
        roaa_shock_pp=-0.25,
        efficiency_shock_pp=3.0,
        pd_multiplier=1.5,
    ),
    StressScenario(
        id="severe",
        name="Severe Credit Cycle",
        description="Deep recession: rising NPLs/NCOs, capital depletion, liquidity stress.",
        cet1_shock_pp=-2.5,
        npl_shock_pp=1.20,
        nco_shock_pp=0.90,
        lcr_shock_pp=-15,
        roaa_shock_pp=-0.70,
        efficiency_shock_pp=8.0,
        pd_multiplier=3.0,
    ),
    StressScenario(
        id="funding",
        name="Funding / Deposit Shock",
        description="2023-style deposit flight & wholesale funding stress — liquidity first.",
        cet1_shock_pp=-0.5,
        npl_shock_pp=0.20,
        nco_shock_pp=0.10,
        lcr_shock_pp=-25,
        roaa_shock_pp=-0.40,
        efficiency_shock_pp=4.0,
        pd_multiplier=2.0,
    ),
]


@dataclass
class StressResult:
    scenario: StressScenario
    stressed_metrics: dict[str, float | None]
    rating: str
    score: float
    pd_pct: float
    total_el_mm: float
    el_vs_base_mm: float
    flags: list[str] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        d = asdict(self)
        return d


def _apply_shock(m: FICreditMetrics, s: StressScenario) -> FICreditMetrics:
    out = deepcopy(m)
    if out.cet1_ratio is not None:
        out.cet1_ratio = max(0.0, out.cet1_ratio + s.cet1_shock_pp)
    if out.npl_ratio is not None:
        out.npl_ratio = max(0.0, out.npl_ratio + s.npl_shock_pp)
    if out.nco_ratio is not None:
        out.nco_ratio = max(0.0, out.nco_ratio + s.nco_shock_pp)
    if out.lcr is not None:
        out.lcr = max(0.0, out.lcr + s.lcr_shock_pp)
    if out.roaa is not None:
        out.roaa = out.roaa + s.roaa_shock_pp
    if out.efficiency_ratio is not None:
        out.efficiency_ratio = out.efficiency_ratio + s.efficiency_shock_pp
    return out


def _flags(m: FICreditMetrics, rating: ObligorRating) -> list[str]:
    flags: list[str] = []
    if m.cet1_ratio is not None and m.cet1_ratio < 11.5:
        flags.append("CET1 below internal early-warning threshold (11.5%)")
    if m.npl_ratio is not None and m.npl_ratio > 1.5:
        flags.append("NPL above watchlist threshold (1.5%)")
    if m.lcr is not None and m.lcr < 105:
        flags.append("LCR buffer thin (<105%)")
    if rating.internal_rating in {"BB+", "BB", "B", "CCC"}:
        flags.append(f"Internal rating migrated to {rating.internal_rating}")
    if not flags:
        flags.append("No hard limit breach under this scenario")
    return flags


def run_stress_suite(
    metrics: FICreditMetrics,
    facilities: list[FacilityAssumption] | None = None,
) -> list[StressResult]:
    base_rating = rate_fi_obligor(metrics)
    base_el = build_portfolio_el(base_rating, facilities).total_el_mm

    results: list[StressResult] = []
    for scenario in SCENARIOS:
        stressed = _apply_shock(metrics, scenario)
        rating = rate_fi_obligor(stressed)
        # PD overlay for cycle severity beyond scorecard migration
        pd = rating.pd_ttc_pct * scenario.pd_multiplier
        # Rebuild EL with overridden PD
        from .facility_risk import compute_facility_risk, DEFAULT_FACILITIES

        facs = facilities or DEFAULT_FACILITIES
        el = sum(compute_facility_risk(f, pd).el_mm for f in facs)
        results.append(
            StressResult(
                scenario=scenario,
                stressed_metrics={
                    "cet1_ratio": stressed.cet1_ratio,
                    "npl_ratio": stressed.npl_ratio,
                    "nco_ratio": stressed.nco_ratio,
                    "lcr": stressed.lcr,
                    "roaa": stressed.roaa,
                    "efficiency_ratio": stressed.efficiency_ratio,
                },
                rating=rating.internal_rating,
                score=rating.total_score,
                pd_pct=round(pd, 3),
                total_el_mm=round(el, 4),
                el_vs_base_mm=round(el - base_el, 4),
                flags=_flags(stressed, rating),
            )
        )
    return results
