"""Run full JPM FI credit risk analysis pipeline."""

from __future__ import annotations

import json
from pathlib import Path

from src.data_fetcher import FIDataFetcher
from src.early_warning import build_early_warning
from src.facility_risk import build_portfolio_el
from src.fi_metrics import build_fi_metrics
from src.peers import build_peer_table
from src.rating_model import rate_fi_obligor
from src.stress import run_stress_suite

ROOT = Path(__file__).parent
OUTPUTS = ROOT / "outputs"
REPORTS = OUTPUTS / "reports"


def run(ticker: str = "JPM") -> dict:
    print(f"[1/6] Fetching market & statements for {ticker}...")
    data = FIDataFetcher(ticker).fetch()

    print("[2/6] Building FI credit metrics...")
    metrics = build_fi_metrics(data)

    print("[3/6] Scoring obligor rating / PD...")
    rating = rate_fi_obligor(metrics)

    print("[4/6] Computing facility EAD / EL...")
    portfolio = build_portfolio_el(rating)

    print("[5/6] Running stress scenarios...")
    stress = run_stress_suite(metrics)

    print("[6/6] Early warning + peer table...")
    ews = build_early_warning(metrics, rating)
    peers = build_peer_table(ticker)

    payload = {
        "meta": {
            "ticker": ticker,
            "name": metrics.name,
            "framework": "Financial Institution (FI) Obligor Credit Risk",
            "disclaimer": (
                "Educational portfolio project. Internal ratings, PDs, LGDs, and facilities "
                "are illustrative — not official bank models, agency ratings, or actual exposures."
            ),
        },
        "metrics": metrics.to_dict(),
        "rating": rating.to_dict(),
        "portfolio": portfolio.to_dict(),
        "stress": [s.to_dict() for s in stress],
        "earlyWarning": ews.to_dict(),
        "peers": peers,
        "market": {
            "price": data.price,
            "marketCap": data.market_cap,
            "beta": data.beta,
            "sector": data.sector,
            "industry": data.industry,
            "currency": data.currency,
        },
    }

    REPORTS.mkdir(parents=True, exist_ok=True)
    out_path = REPORTS / f"{ticker}_fi_credit_risk.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, default=str)
    print(f"Saved {out_path.name}")

    # Short text summary
    summary_path = REPORTS / f"{ticker}_executive_summary.txt"
    summary = _executive_summary(payload)
    summary_path.write_text(summary, encoding="utf-8")
    print(f"Saved {summary_path.name}")
    try:
        print(summary)
    except UnicodeEncodeError:
        print(summary.encode("ascii", errors="replace").decode("ascii"))
    return payload


def _executive_summary(payload: dict) -> str:
    m = payload["metrics"]
    r = payload["rating"]
    p = payload["portfolio"]
    e = payload["earlyWarning"]
    lines = [
        f"FI CREDIT RISK MEMO — {payload['meta']['ticker']} ({m['name']})",
        "=" * 60,
        f"Internal Rating: {r['internal_rating']}  |  Score: {r['total_score']}  |  Outlook: {r['outlook']}",
        f"TTC PD: {r['pd_ttc_pct']:.2f}%",
        f"CET1: {m.get('cet1_ratio')}%  |  NPL: {m.get('npl_ratio')}%  |  LCR: {m.get('lcr')}%",
        f"Hypothetical Total Commitment: ${p['total_commitment_mm']:.0f}mm",
        f"Total EAD: ${p['total_ead_mm']:.1f}mm  |  Total EL: ${p['total_el_mm']:.3f}mm",
        f"Early Warning: {e['overall_status']}  |  Watchlist: {e['watchlist']}",
        "",
        "Key actions:",
        *[f"  - {a}" for a in e["recommended_actions"]],
        "",
        payload["meta"]["disclaimer"],
    ]
    return "\n".join(lines)


if __name__ == "__main__":
    run("JPM")
