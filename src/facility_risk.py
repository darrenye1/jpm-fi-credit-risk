"""Hypothetical FI facility exposure → EAD / LGD / EL."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any

from .rating_model import ObligorRating


@dataclass
class FacilityAssumption:
    name: str
    facility_type: str
    commitment_mm: float
    drawn_mm: float
    seniority: str
    collateral: str
    tenor_years: float
    undrawn_ccf: float  # credit conversion factor for undrawn


@dataclass
class FacilityRisk:
    facility: FacilityAssumption
    ead_mm: float
    lgd_pct: float
    pd_pct: float
    el_mm: float
    el_bps_of_ead: float
    risk_weight_note: str


@dataclass
class PortfolioEL:
    obligor: str
    rating: str
    pd_pct: float
    facilities: list[FacilityRisk]
    total_commitment_mm: float
    total_ead_mm: float
    total_el_mm: float
    narrative: list[str] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


# Default LGD by structure (illustrative — not bank IRB estimates)
LGD_TABLE = {
    ("Senior Unsecured", "None"): 45.0,
    ("Senior Unsecured", "Parent Guarantee"): 40.0,
    ("Senior Secured", "Financial Collateral"): 25.0,
    ("Subordinated", "None"): 75.0,
}


DEFAULT_FACILITIES = [
    FacilityAssumption(
        name="Syndicated Revolving Credit",
        facility_type="Revolver",
        commitment_mm=500.0,
        drawn_mm=120.0,
        seniority="Senior Unsecured",
        collateral="None",
        tenor_years=5.0,
        undrawn_ccf=0.40,
    ),
    FacilityAssumption(
        name="Bilateral Term Loan",
        facility_type="Term Loan",
        commitment_mm=250.0,
        drawn_mm=250.0,
        seniority="Senior Unsecured",
        collateral="None",
        tenor_years=3.0,
        undrawn_ccf=0.0,
    ),
    FacilityAssumption(
        name="Standby Letter of Credit",
        facility_type="Contingent",
        commitment_mm=75.0,
        drawn_mm=0.0,
        seniority="Senior Unsecured",
        collateral="None",
        tenor_years=1.0,
        undrawn_ccf=1.00,
    ),
]


def _lgd(seniority: str, collateral: str) -> float:
    return LGD_TABLE.get((seniority, collateral), 45.0)


def compute_facility_risk(fac: FacilityAssumption, pd_pct: float) -> FacilityRisk:
    undrawn = max(fac.commitment_mm - fac.drawn_mm, 0.0)
    ead = fac.drawn_mm + undrawn * fac.undrawn_ccf
    lgd = _lgd(fac.seniority, fac.collateral)
    el = ead * (pd_pct / 100.0) * (lgd / 100.0)
    return FacilityRisk(
        facility=fac,
        ead_mm=round(ead, 2),
        lgd_pct=lgd,
        pd_pct=pd_pct,
        el_mm=round(el, 4),
        el_bps_of_ead=round(el / ead * 10000, 1) if ead else 0.0,
        risk_weight_note="Illustrative standardized-style LGD; not IRB approved estimates.",
    )


def build_portfolio_el(
    rating: ObligorRating,
    facilities: list[FacilityAssumption] | None = None,
) -> PortfolioEL:
    facilities = facilities or DEFAULT_FACILITIES
    rows = [compute_facility_risk(f, rating.pd_ttc_pct) for f in facilities]
    total_c = sum(f.commitment_mm for f in facilities)
    total_ead = sum(r.ead_mm for r in rows)
    total_el = sum(r.el_mm for r in rows)

    narrative = [
        f"Hypothetical bank exposure to {rating.ticker} as FI obligor / counterparty.",
        f"PD from internal rating {rating.internal_rating} ({rating.pd_ttc_pct:.2f}% TTC).",
        "EAD = drawn + undrawn × CCF; EL = PD × LGD × EAD.",
        "Facilities are illustrative for demo — not actual borrowings of any named bank.",
    ]
    return PortfolioEL(
        obligor=rating.ticker,
        rating=rating.internal_rating,
        pd_pct=rating.pd_ttc_pct,
        facilities=rows,
        total_commitment_mm=round(total_c, 2),
        total_ead_mm=round(total_ead, 2),
        total_el_mm=round(total_el, 4),
        narrative=narrative,
    )
