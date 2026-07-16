# Deploy to Vercel

## One-Click Deploy

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repository
4. **Root Directory**: leave as `./` (repository root)
5. **Framework Preset**: **Next.js** (not Python)
6. Click **Deploy**

## Automatic data refresh (GitHub Actions)

Workflow: `.github/workflows/refresh-dashboard.yml`

| What | Behavior |
|------|----------|
| Schedule | Every **Monday** ~15:00 UTC |
| Manual | GitHub → **Actions** → **Refresh credit dashboard** → **Run workflow** |
| Auto-updates | Yahoo Finance market & statements → recompute rating / EL / stress → commit `analysis.json` → Vercel redeploys |
| Manual after earnings | Edit `data/regulatory_metrics.json` (CET1, NPL, LCR, …), then run the workflow (or `python scripts/export_for_web.py` locally and push) |

### Enable write permission (required once)

GitHub repo → **Settings → Actions → General → Workflow permissions** → **Read and write permissions** → Save.

## Local refresh

```bash
pip install -r requirements.txt
python scripts/export_for_web.py
# optional: python scripts/export_for_web.py TD
```

This updates:
- `public/data/analysis.json`
- `data/analysis.json`

## Local Development

Requires Node.js 18+:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Vercel Project Settings

| Setting | Value |
|---------|-------|
| Root Directory | `./` (default) |
| Framework Preset | **Next.js** |
| Build Command | `npm run build` (default) |
| Output Directory | *(leave empty)* |
| Install Command | `npm install` (default) |

> Do **not** set Output Directory to `out`.  
> If Vercel auto-selects **Python**, switch Framework Preset to **Next.js**.
