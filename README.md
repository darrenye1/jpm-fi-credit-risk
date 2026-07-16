# TD Bank Financial Institution Credit Risk Dashboard

Corporate banking–style **FI obligor credit risk** analysis for **The Toronto-Dominion Bank (TD)**, with a Python pipeline and a Next.js dashboard for Vercel.

This is **not** a corporate EBITDA / covenant model. Banks are scored on capital, asset quality, liquidity, and earnings.

## What It Covers

| Module | Description |
|--------|-------------|
| **FI Metrics** | CET1, NPL, NCO, LCR, NIM, ROAA + statement trends from Yahoo Finance |
| **Internal Rating** | Weighted FI scorecard → rating → through-the-cycle PD |
| **Facility EL** | Hypothetical revolver / term loan / SBLC → EAD, LGD, EL |
| **Stress Testing** | Mild, severe, and funding/deposit shock scenarios |
| **Early Warning** | Policy thresholds, watchlist, recommended actions |
| **Peers** | TD vs RY, BNS, BMO, CM (Canadian Big 5) |

## Tech Stack

- **Python 3.10+** — data + credit engine
- **Next.js 15 + React** — interactive dashboard
- **yfinance / pandas** — market & statements
- **Recharts** — charts
- **Vercel** — hosting (repository root)

## Quick Start

### Python

```bash
pip install -r requirements.txt
python main.py
```

### Export for web + run dashboard

```bash
python scripts/export_for_web.py
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Deploy

See [DEPLOY.md](DEPLOY.md). On Vercel: **Root Directory** = `./`, **Framework** = **Next.js** (not Python).

**Auto-refresh:** GitHub Actions runs weekly (and on demand) to pull latest Yahoo Finance data, rebuild `analysis.json`, and push — Vercel redeploys automatically. After each bank earnings release, update `data/regulatory_metrics.json` (CET1 / NPL / LCR), then re-run the workflow.

## Project Structure

```
├── main.py
├── data/                  # regulatory overlay + analysis.json for dashboard
├── scripts/export_for_web.py
├── src/                   # Python FI credit engine
├── outputs/reports/
├── app/                   # Next.js pages
├── components/
├── lib/
└── public/
```

## Interview Narrative

> Built an FI credit risk workflow for TD Bank: regulatory capital & asset-quality scorecard, facility-level expected loss, stress scenarios, and early-warning monitoring — deployed as an interactive credit dashboard.

## Disclaimer

Educational portfolio project. Internal ratings, PDs, LGDs, and facilities are **illustrative** — not official bank models, agency ratings, or actual exposures. Regulatory metrics in `data/regulatory_metrics.json` should be refreshed from filings.
