import { analysis } from "@/lib/data";
import { fmtMm, fmtNum, fmtPct, fmtUsd } from "@/lib/format";
import { Card, KPICard, Section, StatusPill } from "@/components/ui";
import { Footer, Header, Hero, ProfileBanner } from "@/components/layout";
import {
  PeerCet1Chart,
  ScoreBreakdownChart,
  StressElChart,
  TrendChart,
} from "@/components/charts";

export default function HomePage() {
  const { meta, metrics, rating, portfolio, stress, earlyWarning, peers, market } =
    analysis;

  const scoreChart = rating.factors.map((f) => ({
    name: f.name.replace(" Ratio", ""),
    weighted: f.weighted,
    score: f.score,
  }));

  const stressChart = stress.map((s) => ({
    name: s.scenario.name
      .replace(" Severe Credit Cycle", "Severe")
      .replace("Funding / Deposit Shock", "Funding"),
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
    <>
      <ProfileBanner />
      <Header
        name={metrics.name}
        ticker={meta.ticker}
        status={earlyWarning.overall_status}
      />
      <main>
        <Hero
          name={metrics.name}
          sector={market.sector}
          industry={market.industry}
          regulatoryAsOf={metrics.regulatory_as_of}
          marketAsOf={metrics.as_of_market}
        />

        {/* Overview KPIs */}
        <div id="overview" className="mx-auto max-w-7xl px-6 pt-10">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KPICard
              label="Internal Rating"
              value={rating.internal_rating}
              change={`Outlook: ${rating.outlook}`}
            />
            <KPICard
              label="Scorecard"
              value={fmtNum(rating.total_score, 1)}
              change="Weighted FI factors / 100"
            />
            <KPICard
              label="TTC PD"
              value={fmtPct(rating.pd_ttc_pct)}
              change="Illustrative mapping"
            />
            <KPICard
              label="Portfolio EL"
              value={fmtMm(portfolio.total_el_mm, 3)}
              change={`EAD ${fmtMm(portfolio.total_ead_mm)}`}
            />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KPICard label="Market Cap" value={fmtUsd(metrics.market_cap)} />
            <KPICard label="Total Assets" value={fmtUsd(metrics.total_assets)} />
            <KPICard label="Net Income (latest)" value={fmtUsd(metrics.net_income)} />
            <KPICard label="Equity / Assets" value={fmtPct(metrics.equity_to_assets)} />
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6">
          {/* Capital & AQ */}
          <Section
            id="capital"
            title="Capital, Asset Quality & Liquidity"
            subtitle="Regulatory overlay from filings plus statement trends from market data — FI metrics, not corporate EBITDA leverage."
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <KPICard label="CET1" value={fmtPct(metrics.cet1_ratio)} change="Primary capital lens" />
              <KPICard label="Tier 1" value={fmtPct(metrics.tier1_ratio)} />
              <KPICard label="Leverage Ratio" value={fmtPct(metrics.leverage_ratio)} />
              <KPICard label="NPL Ratio" value={fmtPct(metrics.npl_ratio)} change="Asset quality" />
              <KPICard label="NCO Ratio" value={fmtPct(metrics.nco_ratio)} />
              <KPICard label="Allowance / Loans" value={fmtPct(metrics.allowance_to_loans)} />
              <KPICard label="LCR" value={fmtPct(metrics.lcr, 0)} change="Liquidity coverage" />
              <KPICard label="NIM" value={fmtPct(metrics.nim)} />
              <KPICard label="Efficiency" value={fmtPct(metrics.efficiency_ratio)} />
              <KPICard label="ROAA" value={fmtPct(metrics.roaa)} />
              <KPICard label="ROAE" value={fmtPct(metrics.roae)} />
              <KPICard label="Loan / Deposit" value={fmtPct(metrics.loan_to_deposit, 0)} />
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <Card>
                <h3 className="mb-4 text-lg font-semibold text-white">Revenue & earnings trend</h3>
                <TrendChart data={trendData} />
              </Card>
              <Card>
                <h3 className="mb-4 text-lg font-semibold text-white">Method notes</h3>
                <ul className="space-y-3 text-sm text-brand-muted leading-relaxed">
                  {metrics.notes.map((n) => (
                    <li key={n} className="border-l-2 border-brand-accent/50 pl-3">
                      {n}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </Section>

          {/* Rating */}
          <Section
            id="rating"
            title="Internal FI Rating Model"
            subtitle="Capital, asset quality, liquidity, and earnings — weighted expert scorecard mapped to through-the-cycle PD."
          >
            <div className="grid gap-6 lg:grid-cols-5">
              <Card className="lg:col-span-2">
                <p className="text-sm text-brand-muted">Rating outcome</p>
                <p className="mt-3 font-display text-5xl font-bold text-brand-accent">
                  {rating.internal_rating}
                </p>
                <p className="mt-2 text-brand-muted">
                  Score {fmtNum(rating.total_score, 1)} · PD {fmtPct(rating.pd_ttc_pct)} ·{" "}
                  {rating.outlook}
                </p>
                <ul className="mt-6 space-y-2 text-sm text-brand-muted">
                  {rating.methodology_notes.map((n) => (
                    <li key={n}>• {n}</li>
                  ))}
                </ul>
              </Card>
              <Card className="lg:col-span-3">
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Weighted factor contribution
                </h3>
                <ScoreBreakdownChart data={scoreChart} />
              </Card>
            </div>
            <Card className="mt-6 overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand-border text-left text-brand-muted">
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
                    <tr key={f.name} className="border-b border-brand-border/40">
                      <td className="px-4 py-3 text-white">{f.name}</td>
                      <td className="px-4 py-3 text-brand-muted">{f.category}</td>
                      <td className="px-4 py-3 font-mono text-brand-muted">
                        {f.raw_value == null ? "—" : `${f.raw_value}${f.unit}`}
                      </td>
                      <td className="px-4 py-3 font-mono text-white">{fmtNum(f.score, 1)}</td>
                      <td className="px-4 py-3 font-mono text-brand-muted">
                        {(f.weight * 100).toFixed(0)}%
                      </td>
                      <td className="px-4 py-3 text-brand-muted max-w-xs">{f.rationale}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </Section>

          {/* Facility EL */}
          <Section
            id="facility"
            title="Hypothetical Facility EL"
            subtitle="EL = PD × LGD × EAD. Facilities illustrate a corporate-banking hold to an FI obligor — not actual TD Bank debt."
          >
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              <KPICard
                label="Total Commitment"
                value={fmtMm(portfolio.total_commitment_mm, 0)}
              />
              <KPICard label="Total EAD" value={fmtMm(portfolio.total_ead_mm)} />
              <KPICard
                label="Total Expected Loss"
                value={fmtMm(portfolio.total_el_mm, 3)}
              />
            </div>
            <Card className="overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand-border text-left text-brand-muted">
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
                    <tr key={row.facility.name} className="border-b border-brand-border/40">
                      <td className="px-4 py-3 text-white">{row.facility.name}</td>
                      <td className="px-4 py-3 text-brand-muted">{row.facility.facility_type}</td>
                      <td className="px-4 py-3 font-mono text-brand-muted">
                        {fmtMm(row.facility.commitment_mm, 0)}
                      </td>
                      <td className="px-4 py-3 font-mono text-brand-muted">
                        {fmtMm(row.facility.drawn_mm, 0)}
                      </td>
                      <td className="px-4 py-3 font-mono text-brand-muted">
                        {(row.facility.undrawn_ccf * 100).toFixed(0)}%
                      </td>
                      <td className="px-4 py-3 font-mono text-white">{fmtMm(row.ead_mm)}</td>
                      <td className="px-4 py-3 font-mono text-brand-muted">
                        {fmtPct(row.lgd_pct, 0)}
                      </td>
                      <td className="px-4 py-3 font-mono text-brand-accent">
                        {fmtMm(row.el_mm, 3)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
            <ul className="mt-4 space-y-1 text-sm text-brand-muted">
              {portfolio.narrative.map((n) => (
                <li key={n}>• {n}</li>
              ))}
            </ul>
          </Section>

          {/* Stress */}
          <Section
            id="stress"
            title="Stress Testing"
            subtitle="Shocks to CET1, NPL/NCO, LCR, and earnings; PD multiplier overlays cycle severity."
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <h3 className="mb-4 text-lg font-semibold text-white">EL & PD by scenario</h3>
                <StressElChart data={stressChart} />
              </Card>
              <div className="space-y-3">
                {stress.map((s) => (
                  <Card key={s.scenario.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-lg font-semibold text-white">
                          {s.scenario.name}
                        </p>
                        <p className="mt-1 text-sm text-brand-muted">{s.scenario.description}</p>
                      </div>
                      <StatusPill status={s.rating} />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs font-mono text-brand-muted">
                      <span>PD {fmtPct(s.pd_pct)}</span>
                      <span>EL {fmtMm(s.total_el_mm, 3)}</span>
                      <span>ΔEL {fmtMm(s.el_vs_base_mm, 3)}</span>
                      <span>Score {fmtNum(s.score, 1)}</span>
                    </div>
                    <p className="mt-2 text-xs text-brand-muted">{s.flags[0]}</p>
                  </Card>
                ))}
              </div>
            </div>
          </Section>

          {/* Early warning */}
          <Section
            id="ews"
            title="Early Warning & Watchlist"
            subtitle="Policy-style thresholds for capital, AQ, liquidity, earnings, and rating floor."
          >
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <StatusPill status={earlyWarning.overall_status} />
              <span className="text-sm text-brand-muted">
                Watchlist: {earlyWarning.watchlist ? "Yes" : "No"}
              </span>
            </div>
            <Card className="mb-6 overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand-border text-left text-brand-muted">
                    <th className="px-4 py-3">Indicator</th>
                    <th className="px-4 py-3">Threshold</th>
                    <th className="px-4 py-3">Actual</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {earlyWarning.items.map((item) => (
                    <tr key={item.indicator} className="border-b border-brand-border/40">
                      <td className="px-4 py-3 text-white">{item.indicator}</td>
                      <td className="px-4 py-3 text-brand-muted">{item.threshold}</td>
                      <td className="px-4 py-3 font-mono text-white">{item.actual}</td>
                      <td className="px-4 py-3">
                        <StatusPill status={item.status} />
                      </td>
                      <td className="px-4 py-3 text-brand-muted">{item.comment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
            <Card>
              <h3 className="mb-3 text-lg font-semibold text-white">Recommended actions</h3>
              <ul className="space-y-2 text-sm text-brand-muted">
                {earlyWarning.recommended_actions.map((a) => (
                  <li key={a} className="border-l-2 border-brand-accent pl-3">
                    {a}
                  </li>
                ))}
              </ul>
            </Card>
          </Section>

          {/* Peers */}
          <Section
            id="peers"
            title="Canadian Big 5 Comparison"
            subtitle="Same FI scorecard applied to TD, RY, BNS, BMO, and CM for relative positioning."
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <h3 className="mb-4 text-lg font-semibold text-white">CET1 vs peers</h3>
                <PeerCet1Chart data={peerChart} />
              </Card>
              <Card className="overflow-x-auto p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-brand-border text-left text-brand-muted">
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
                        className={`border-b border-brand-border/40 ${
                          p.isFocus ? "bg-brand-accent/5" : ""
                        }`}
                      >
                        <td className="px-3 py-3 font-mono text-white">
                          {p.ticker}
                          {p.isFocus ? " ★" : ""}
                        </td>
                        <td className="px-3 py-3 font-mono text-brand-muted">
                          {fmtPct(p.cet1_ratio)}
                        </td>
                        <td className="px-3 py-3 font-mono text-brand-muted">
                          {fmtPct(p.npl_ratio)}
                        </td>
                        <td className="px-3 py-3 font-mono text-brand-muted">
                          {fmtPct(p.lcr, 0)}
                        </td>
                        <td className="px-3 py-3 font-mono text-brand-muted">
                          {fmtPct(p.roaa)}
                        </td>
                        <td className="px-3 py-3 font-mono text-white">{p.internal_rating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          </Section>
        </div>

        <Footer disclaimer={meta.disclaimer} />
      </main>
    </>
  );
}
