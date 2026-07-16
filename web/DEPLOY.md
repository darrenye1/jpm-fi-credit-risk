# Deploy to Vercel

## One-Click Deploy

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repository
4. Set **Root Directory** to `web`
5. Click **Deploy**

## Update Credit Data

Before deploying (or when you want fresh numbers), run locally:

```bash
pip install -r requirements.txt
python scripts/export_for_web.py
```

This updates:
- `web/public/data/analysis.json`
- `web/data/analysis.json`

Update regulatory overlays in `data/regulatory_metrics.json` after each earnings release, then re-export.

## Local Development

Requires Node.js 18+:

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Vercel Project Settings

| Setting | Value |
|---------|-------|
| Root Directory | `web` |
| Framework Preset | Next.js |
| Build Command | `npm run build` (default) |
| Output Directory | *(leave empty)* |
| Install Command | `npm install` (default) |

> Do **not** set Output Directory to `out`.
