import { analysis } from "@/lib/data";
import { fmtMm, fmtNum, fmtPct, fmtUsd } from "@/lib/format";
import { KPI, Panel, Section, StatusPill } from "@/components/ui";
import {
  PeerCet1Chart,
  ScoreBreakdownChart,
  StressElChart,
  TrendChart,
} from "@/components/charts";

const nav = [
  { href: "#overview", label: "Overview" },
  { href: "#capital", label: "Capital & AQ" },
  { href: "#rating", label: "Rating" },
  { href: "#facility", label: "Facility EL" },
  { href: "#stress", label: "Stress" },
  { href: "#ews", label: "Early Warning" },
  { href: "#peers", label: "Peers" },
];

export default function HomePage() {
  const { meta, metrics, rating, portfolio, stress, earlyWarning, peers, market } =
    analysis;

  const scoreChart = rating.factors.map((f) => ({
    name: f.name.replace(" Ratio", ""),
    weighted: f.weighted,
    score: f.score,
  }));

  const stressChart = stress.map((s) => ({
    name: s.scenario.name.replace(" Severe Credit Cycle", "Severe").replace("Funding / Deposit Shock", "Funding"),
    el: Number(s.total_el_mm.toFixed(3)),
    pd: Number(s.pd_pct.toFixed(2)),
  }));

  const peerChart = peers.map((p) => ({
    ticker: p.ticker,
    cet1: p.cet1_ratio,
    focus: p.isFocus,
  }));

  const trendData = metrics.annual_trends.map((t) => ({
    year: t.year as number,
    netIncome: typeof t.netIncome === "number" ? t.netIncome : undefined,
    revenue: typeof t.revenue === "number" ? t.revenue : undefined,
  }));

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-line/80 bg-ink-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <div>
            <p className="font-display text-lg text-parchment tracking-tight">
              FI Credit Risk
            </p>
            <p className="text-xs font-mono text-muted">
              {meta.ticker} · Corporate Banking Obligor
            </p>
          </div>
          <nav className="hidden lg:flex items-center gap-4 text-sm text-muted">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="hover:text-brass-soft transition-colors">
                {n.label}
              </a>
            ))}
          </nav>
          <StatusPill status={earlyWarning.overall_status} />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 md:px-6 pb-24">
        {/* Hero */}
        <div className="pt-12 md:pt-16 pb-10">
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-brass mb-4">
            Financial Institution Obligor Analysis
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-parchment max-w-4xl leading-tight">
            {meta.ticker}
            <span className="text-muted"> — </span>
            Credit Risk Dashboard
          </h1>
          <p className="mt-5 max-w-2xl text-muted text-lg leading-relaxed">
            {metrics.name}. Bank credit framed with CET1, asset quality, liquidity, and
            earnings — not corporate EBITDA covenants. Hypothetical facility EL for a
            corporate-banking style exposure.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm font-mono text-muted">
            <span className="border border-line px-3 py-1">
              Reg. as of {metrics.regulatory_as_of || "—"}
            </span>
            <span className="border border-line px-3 py-1">
              Market {metrics.as_of_market || "—"}
            </span>
            <span className="border border-line px-3 py-1">
              {metrics.g_sib ? "G-SIB" : "Bank"} · {metrics.peer_group}
            </span>
            {market.price != null && (
              <span className="border border-line px-3 py-1">
                Price {fmtUsd(market.price)}
              </span>
            )}
          </div>
        </div>

        {/* Overview KPIs */}
        <Section
          id="overview"
          eyebrow="01 — Credit memo snapshot"
          title="Obligor overview"
          subtitle="Internal rating drives through-the-cycle PD; EL uses illustrative facility structure."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KPI
              label="Internal Rating"
              value={rating.internal_rating}
              hint={`Outlook: ${rating.outlook}`}
            />
            <KPI
              label="Scorecard"
              value={fmtNum(rating.total_score, 1)}
              hint="Weighted FI factors / 100"
            />
            <KPI
              label="TTC PD"
              value={fmtPct(rating.pd_ttc_pct)}
              hint="Illustrative mapping"
            />
            <KPI
              label="Portfolio EL"
              value={fmtMm(portfolio.total_el_mm, 3)}
              hint={`EAD ${fmtMm(portfolio.total_ead_mm)}`}
            />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KPI label="Market Cap" value={fmtUsd(metrics.market_cap)} />
            <KPI label="Total Assets" value={fmtUsd(metrics.total_assets)} />
            <KPI label="Net Income (latest)" value={fmtUsd(metrics.net_income)} />
            <KPI label="Equity / Assets" value={fmtPct(metrics.equity_to_assets)} />
          </div>
        </Section>

        {/* Capital & AQ */}
        <Section
          id="capital"
          eyebrow="02 — FI metrics"
          title="Capital, asset quality & liquidity"
          subtitle="Regulatory overlay from filings plus statement trends from market data."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <KPI label="CET1" value={fmtPct(metrics.cet1_ratio)} hint="Primary capital lens" />
            <KPI label="Tier 1" value={fmtPct(metrics.tier1_ratio)} />
            <KPI label="Leverage Ratio" value={fmtPct(metrics.leverage_ratio)} />
            <KPI label="NPL Ratio" value={fmtPct(metrics.npl_ratio)} hint="Asset quality" />
            <KPI label="NCO Ratio" value={fmtPct(metrics.nco_ratio)} />
            <KPI label="Allowance / Loans" value={fmtPct(metrics.allowance_to_loans)} />
            <KPI label="LCR" value={fmtPct(metrics.lcr, 0)} hint="Liquidity coverage" />
            <KPI label="NIM" value={fmtPct(metrics.nim)} />
            <KPI label="Efficiency" value={fmtPct(metrics.efficiency_ratio)} />
            <KPI label="ROAA" value={fmtPct(metrics.roaa)} />
            <KPI label="ROAE" value={fmtPct(metrics.roae)} />
            <KPI label="Loan / Deposit" value={fmtPct(metrics.loan_to_deposit, 0)} />
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Panel>
              <h3 className="font-display text-xl mb-4">Revenue & earnings trend</h3>
              <TrendChart data={trendData} />
            </Panel>
            <Panel>
              <h3 className="font-display text-xl mb-3">Method notes</h3>
              <ul className="space-y-2 text-sm text-muted leading-relaxed">
                {metrics.notes.map((n) => (
                  <li key={n} className="border-l-2 border-brass/50 pl-3">
                    {n}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </Section>

        {/* Rating */}
        <Section
          id="rating"
          eyebrow="03 — Scorecard"
          title="Internal FI rating model"
          subtitle="Capital, asset quality, liquidity, and earnings — weighted expert scorecard."
        >
          <div className="grid gap-4 lg:grid-cols-5">
            <Panel className="lg:col-span-2">
              <p className="text-xs font-mono uppercase tracking-wider text-muted">
                Rating outcome
              </p>
              <p className="mt-3 font-display text-5xl text-brass">{rating.internal_rating}</p>
              <p className="mt-2 text-muted">
                Score {fmtNum(rating.total_score, 1)} · PD {fmtPct(rating.pd_ttc_pct)} ·{" "}
                {rating.outlook}
              </p>
              <ul className="mt-6 space-y-2 text-sm text-muted">
                {rating.methodology_notes.map((n) => (
                  <li key={n}>• {n}</li>
                ))}
              </ul>
            </Panel>
            <Panel className="lg:col-span-3">
              <h3 className="font-display text-xl mb-4">Weighted factor contribution</h3>
              <ScoreBreakdownChart data={scoreChart} />
            </Panel>
          </div>
          <div className="mt-4 overflow-x-auto border border-line">
            <table className="w-full text-sm">
              <thead className="bg-ink-800 text-left font-mono text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3">Factor</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Raw</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Weight</th>
                  <th className="px-4 py-3">Rationale</th>
                </tr>
              </thead>
              <tbody>
                {rating.factors.map((f) => (
                  <tr key={f.name} className="border-t border-line/80">
                    <td className="px-4 py-3 text-parchment">{f.name}</td>
                    <td className="px-4 py-3 text-muted">{f.category}</td>
                    <td className="px-4 py-3 font-mono">
                      {f.raw_value == null ? "—" : `${f.raw_value}${f.unit}`}
                    </td>
                    <td className="px-4 py-3 font-mono">{fmtNum(f.score, 1)}</td>
                    <td className="px-4 py-3 font-mono">{(f.weight * 100).toFixed(0)}%</td>
                    <td className="px-4 py-3 text-muted max-w-xs">{f.rationale}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Facility */}
        <Section
          id="facility"
          eyebrow="04 — Exposure"
          title="Hypothetical facility EL"
          subtitle="EL = PD × LGD × EAD. Facilities illustrate a corporate-banking hold to an FI obligor — not actual JPM debt."
        >
          <div className="grid gap-4 sm:grid-cols-3 mb-6">
            <KPI label="Total Commitment" value={fmtMm(portfolio.total_commitment_mm, 0)} />
            <KPI label="Total EAD" value={fmtMm(portfolio.total_ead_mm)} />
            <KPI label="Total Expected Loss" value={fmtMm(portfolio.total_el_mm, 3)} />
          </div>
          <div className="overflow-x-auto border border-line">
            <table className="w-full text-sm">
              <thead className="bg-ink-800 text-left font-mono text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3">Facility</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Commitment</th>
                  <th className="px-4 py-3">Drawn</th>
                  <th className="px-4 py-3">CCF</th>
                  <th className="px-4 py-3">EAD</th>
                  <th className="px-4 py-3">LGD</th>
                  <th className="px-4 py-3">EL</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.facilities.map((row) => (
                  <tr key={row.facility.name} className="border-t border-line/80">
                    <td className="px-4 py-3 text-parchment">{row.facility.name}</td>
                    <td className="px-4 py-3 text-muted">{row.facility.facility_type}</td>
                    <td className="px-4 py-3 font-mono">
                      {fmtMm(row.facility.commitment_mm, 0)}
                    </td>
                    <td className="px-4 py-3 font-mono">{fmtMm(row.facility.drawn_mm, 0)}</td>
                    <td className="px-4 py-3 font-mono">
                      {(row.facility.undrawn_ccf * 100).toFixed(0)}%
                    </td>
                    <td className="px-4 py-3 font-mono">{fmtMm(row.ead_mm)}</td>
                    <td className="px-4 py-3 font-mono">{fmtPct(row.lgd_pct, 0)}</td>
                    <td className="px-4 py-3 font-mono text-brass-soft">
                      {fmtMm(row.el_mm, 3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-4 space-y-1 text-sm text-muted">
            {portfolio.narrative.map((n) => (
              <li key={n}>• {n}</li>
            ))}
          </ul>
        </Section>

        {/* Stress */}
        <Section
          id="stress"
          eyebrow="05 — Scenarios"
          title="Stress testing"
          subtitle="Shocks to CET1, NPL/NCO, LCR, and earnings; PD multiplier overlays cycle severity."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel>
              <h3 className="font-display text-xl mb-4">EL & PD by scenario</h3>
              <StressElChart data={stressChart} />
            </Panel>
            <div className="space-y-3">
              {stress.map((s) => (
                <Panel key={s.scenario.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-lg">{s.scenario.name}</p>
                      <p className="mt-1 text-sm text-muted">{s.scenario.description}</p>
                    </div>
                    <StatusPill status={s.rating} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs font-mono text-muted">
                    <span>PD {fmtPct(s.pd_pct)}</span>
                    <span>EL {fmtMm(s.total_el_mm, 3)}</span>
                    <span>ΔEL {fmtMm(s.el_vs_base_mm, 3)}</span>
                    <span>Score {fmtNum(s.score, 1)}</span>
                  </div>
                  <p className="mt-2 text-xs text-muted">{s.flags[0]}</p>
                </Panel>
              ))}
            </div>
          </div>
        </Section>

        {/* Early warning */}
        <Section
          id="ews"
          eyebrow="06 — Monitoring"
          title="Early warning & watchlist"
          subtitle="Policy-style thresholds for capital, AQ, liquidity, earnings, and rating floor."
        >
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <StatusPill status={earlyWarning.overall_status} />
            <span className="text-sm text-muted">
              Watchlist: {earlyWarning.watchlist ? "Yes" : "No"}
            </span>
          </div>
          <div className="overflow-x-auto border border-line mb-6">
            <table className="w-full text-sm">
              <thead className="bg-ink-800 text-left font-mono text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3">Indicator</th>
                  <th className="px-4 py-3">Threshold</th>
                  <th className="px-4 py-3">Actual</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Comment</th>
                </tr>
              </thead>
              <tbody>
                {earlyWarning.items.map((item) => (
                  <tr key={item.indicator} className="border-t border-line/80">
                    <td className="px-4 py-3 text-parchment">{item.indicator}</td>
                    <td className="px-4 py-3 text-muted">{item.threshold}</td>
                    <td className="px-4 py-3 font-mono">{item.actual}</td>
                    <td className="px-4 py-3">
                      <StatusPill status={item.status} />
                    </td>
                    <td className="px-4 py-3 text-muted">{item.comment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Panel>
            <h3 className="font-display text-xl mb-3">Recommended actions</h3>
            <ul className="space-y-2 text-sm text-muted">
              {earlyWarning.recommended_actions.map((a) => (
                <li key={a} className="border-l-2 border-sea pl-3">
                  {a}
                </li>
              ))}
            </ul>
          </Panel>
        </Section>

        {/* Peers */}
        <Section
          id="peers"
          eyebrow="07 — Peer set"
          title="G-SIB / money-center comparison"
          subtitle="Same FI scorecard applied to JPM, BAC, WFC, and C for relative positioning."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel>
              <h3 className="font-display text-xl mb-4">CET1 vs peers</h3>
              <PeerCet1Chart data={peerChart} />
            </Panel>
            <div className="overflow-x-auto border border-line">
              <table className="w-full text-sm">
                <thead className="bg-ink-800 text-left font-mono text-xs uppercase tracking-wider text-muted">
                  <tr>
                    <th className="px-3 py-3">Ticker</th>
                    <th className="px-3 py-3">CET1</th>
                    <th className="px-3 py-3">NPL</th>
                    <th className="px-3 py-3">LCR</th>
                    <th className="px-3 py-3">ROAA</th>
                    <th className="px-3 py-3">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {peers.map((p) => (
                    <tr
                      key={p.ticker}
                      className={`border-t border-line/80 ${p.isFocus ? "bg-brass/5" : ""}`}
                    >
                      <td className="px-3 py-3 font-mono text-parchment">
                        {p.ticker}
                        {p.isFocus ? " ★" : ""}
                      </td>
                      <td className="px-3 py-3 font-mono">{fmtPct(p.cet1_ratio)}</td>
                      <td className="px-3 py-3 font-mono">{fmtPct(p.npl_ratio)}</td>
                      <td className="px-3 py-3 font-mono">{fmtPct(p.lcr, 0)}</td>
                      <td className="px-3 py-3 font-mono">{fmtPct(p.roaa)}</td>
                      <td className="px-3 py-3 font-mono">{p.internal_rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        <footer className="border-t border-line pt-8 mt-8 text-sm text-muted leading-relaxed max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-wider text-brass mb-2">
            Disclaimer
          </p>
          <p>{meta.disclaimer}</p>
          <p className="mt-4">
            Stack: Python (yfinance / pandas) → JSON export → Next.js on Vercel.
          </p>
        </footer>
      </main>
    </div>
  );
}
