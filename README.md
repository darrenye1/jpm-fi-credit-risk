# Hypothetical Canadian Bank — FI Credit Risk Dashboard

Corporate banking–style **FI obligor credit risk** analysis for a **hypothetical Canadian bank (HCB)**, with a Python pipeline and a Next.js dashboard for Vercel.

This is **not** a corporate EBITDA / covenant model. Banks are scored on capital, asset quality, liquidity, and earnings.

The obligor and peer set are anonymized for portfolio use. Outputs are illustrative and do **not** represent any named issuer or employer.

## What It Covers

| Module | Description |
|--------|-------------|
| **FI Metrics** | CET1, NPL, NCO, LCR, NIM, ROAA + statement trends from public market data |
| **Internal Rating** | Weighted FI scorecard → rating → through-the-cycle PD |
| **Facility EL** | Hypothetical revolver / term loan / SBLC → EAD, LGD, EL |
| **Stress Testing** | Mild, severe, and funding/deposit shock scenarios |
| **Early Warning** | Policy thresholds, watchlist, recommended actions |
| **Peers** | Focus bank vs anonymized Canadian large-bank peer set |

## Tech Stack

- **Python 3.10+** — data + credit engine
- **Next.js 15 + React** — interactive dashboard
- **yfinance / pandas** — public market & statements (illustration source only)
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

**Auto-refresh:** GitHub Actions runs weekly (and on demand) to pull latest public market data, rebuild `analysis.json`, and push — Vercel redeploys automatically. Update `data/regulatory_metrics.json` when refreshing the stylized regulatory overlay, then re-run the workflow.

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

> Built an FI credit risk workflow for a hypothetical Canadian bank: regulatory capital & asset-quality scorecard, facility-level expected loss, stress scenarios, and early-warning monitoring — deployed as an interactive credit dashboard.

## Disclaimer

Educational portfolio project. The obligor is a **hypothetical Canadian bank**. Market & statement figures come from public market data providers for illustration; CET1/NPL/LCR-style ratios are a stylized overlay. Internal ratings, PDs, LGDs, facilities, peer labels, and stress scenarios are **illustrative** — not official bank models, agency ratings, actual exposures, or the views of any employer or financial institution. Not investment or credit advice.
