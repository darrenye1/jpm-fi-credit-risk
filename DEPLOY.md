# Deploy to Vercel

## One-Click Deploy

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repository
4. **Root Directory**: leave as `./` (repository root)
5. **Framework Preset**: **Next.js** (not Python)
6. Click **Deploy**

## Update Credit Data

Before deploying (or when you want fresh numbers), run locally:

```bash
pip install -r requirements.txt
python scripts/export_for_web.py
```

This updates:
- `public/data/analysis.json`
- `data/analysis.json`

Update regulatory overlays in `data/regulatory_metrics.json` after each earnings release, then re-export.

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
