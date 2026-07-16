"""Export FI credit analysis JSON for the Vercel / Next.js dashboard."""

from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT))

from main import run


def _round_floats(obj, ndigits: int = 4):
    if isinstance(obj, float):
        return round(obj, ndigits)
    if isinstance(obj, dict):
        return {k: _round_floats(v, ndigits) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_round_floats(v, ndigits) for v in obj]
    return obj


def export(ticker: str = "HCB") -> Path:
    payload = _round_floats(run(ticker))
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    payload.setdefault("meta", {})
    payload["meta"]["last_refreshed_at"] = now
    payload["meta"]["auto_refresh"] = (
        "GitHub Actions refreshes public market/statement data weekly for illustration. "
        "Update data/regulatory_metrics.json to refresh the stylized regulatory overlay."
    )

    targets = [
        ROOT / "public" / "data" / "analysis.json",
        ROOT / "data" / "analysis.json",
    ]
    for path in targets:
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=2, default=str)
        print(f"Wrote {path.as_posix().split('Financial Risk Management/')[-1]}")
    return targets[0]


if __name__ == "__main__":
    ticker = sys.argv[1] if len(sys.argv) > 1 else "HCB"
    export(ticker.upper())
