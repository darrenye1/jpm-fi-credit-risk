import { analysis } from "@/lib/data";
import { fmtMm, fmtNum, fmtPct, fmtUsd } from "@/lib/format";
import {
  BANK_SHORT,
  FACTOR_LABELS,
  GLOSSARY,
  INDICATOR_LABELS,
  METRIC_LABELS,
} from "@/lib/glossary";
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

  // Short axis labels for chart readability; tables use full names.
  const scoreChart = rating.factors.map((f) => {
    const full = FACTOR_LABELS[f.name] ?? f.name;
    const short =
      full === "Common Equity Tier 1 Ratio"
        ? "Common Equity Tier 1"
        : full === "Liquidity Coverage Ratio"
          ? "Liquidity Coverage"
          : full === "Return on Average Assets"
            ? "Return on Assets"
            : full === "Non-Performing Loan Ratio"
              ? "Non-Performing Loans"
              : full === "Net Charge-Off Ratio"
                ? "Net Charge-Offs"
                : full.replace(" Ratio", "");
    return { name: short, weighted: f.weighted, score: f.score };
  });

  const stressChart = stress.map((s) => ({
    name: s.scenario.name
      .replace(" Severe Credit Cycle", "Severe")
      .replace("Funding / Deposit Shock", "Funding"),
    el: Number(s.total_el_mm.toFixed(3)),
    pd: Number(s.pd_pct.toFixed(2)),
  }));

  const peerChart = peers.map((p) => ({
    ticker:
      p.ticker === "RY"
        ? "RBC"
        : p.ticker === "CM"
          ? "CIBC"
          : p.ticker === "BNS"
            ? "Scotia"
            : p.ticker,
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

        <div id="overview" className="mx-auto max-w-7xl px-6 pt-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.1em] text-bank-green">
            Credit decision snapshot
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KPICard
              label="Internal Rating"
              value={rating.internal_rating}
              change={`Outlook: ${rating.outlook}`}
              tone="accent"
            />
            <KPICard
              label="Scorecard"
              value={fmtNum(rating.total_score, 1)}
              change="Weighted bank factors / 100"
              tone="navy"
            />
            <KPICard
              label="Probability of Default"
              value={fmtPct(rating.pd_ttc_pct)}
              change="Through-the-cycle estimate"
              tone="accent"
            />
            <KPICard
              label="Expected Loss"
              value={fmtMm(portfolio.total_el_mm, 3)}
              change={`Exposure at Default ${fmtMm(portfolio.total_ead_mm)}`}
              tone="accent"
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
          <Section
            id="capital"
            title="Capital, Asset Quality & Liquidity"
            subtitle="Regulatory overlay from filings plus statement trends from market data — bank metrics, not corporate EBITDA leverage."
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <KPICard
                label={METRIC_LABELS.cet1}
                value={fmtPct(metrics.cet1_ratio)}
                change="Primary capital lens"
                tone="accent"
              />
              <KPICard label={METRIC_LABELS.tier1} value={fmtPct(metrics.tier1_ratio)} />
              <KPICard label={METRIC_LABELS.leverage} value={fmtPct(metrics.leverage_ratio)} />
              <KPICard
                label={METRIC_LABELS.npl}
                value={fmtPct(metrics.npl_ratio)}
                change="Asset quality"
                tone="navy"
              />
              <KPICard label={METRIC_LABELS.nco} value={fmtPct(metrics.nco_ratio)} />
              <KPICard label={METRIC_LABELS.allowance} value={fmtPct(metrics.allowance_to_loans)} />
              <KPICard
                label={METRIC_LABELS.lcr}
                value={fmtPct(metrics.lcr, 0)}
                change="Liquidity coverage"
                tone="accent"
              />
              <KPICard label={METRIC_LABELS.nim} value={fmtPct(metrics.nim)} />
              <KPICard label={METRIC_LABELS.efficiency} value={fmtPct(metrics.efficiency_ratio)} />
              <KPICard label={METRIC_LABELS.roaa} value={fmtPct(metrics.roaa)} />
              <KPICard label={METRIC_LABELS.roae} value={fmtPct(metrics.roae)} />
              <KPICard label={METRIC_LABELS.ltd} value={fmtPct(metrics.loan_to_deposit, 0)} />
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <Card>
                <h3 className="mb-4 text-lg font-semibold text-bank-ink">Revenue & earnings trend</h3>
                <TrendChart data={trendData} />
              </Card>
              <Card>
                <h3 className="mb-4 text-lg font-semibold text-bank-ink">Method notes</h3>
                <ul className="space-y-3 text-sm leading-relaxed text-bank-muted">
                  {metrics.notes.map((n) => (
                    <li key={n} className="border-l-2 border-bank-green/50 pl-3">
                      {n}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </Section>

          <Section
            id="rating"
            title="Internal Bank Rating Model"
            subtitle="Capital, asset quality, liquidity, and earnings — weighted expert scorecard mapped to through-the-cycle probability of default."
          >
            <div className="grid gap-6 lg:grid-cols-5">
              <Card className="lg:col-span-2">
                <p className="text-sm text-bank-muted">Rating outcome</p>
                <p className="mt-3 font-display text-5xl font-semibold tracking-tight text-bank-green md:text-6xl">
                  {rating.internal_rating}
                </p>
                <p className="mt-2 text-bank-muted">
                  Score {fmtNum(rating.total_score, 1)} · Probability of Default{" "}
                  {fmtPct(rating.pd_ttc_pct)} · {rating.outlook}
                </p>
                <ul className="mt-6 space-y-2 text-sm text-bank-muted">
                  {rating.methodology_notes.map((n) => (
                    <li key={n}>• {n}</li>
                  ))}
                </ul>
              </Card>
              <Card className="lg:col-span-3">
                <h3 className="mb-4 text-lg font-semibold text-bank-ink">
                  Weighted factor contribution
                </h3>
                <ScoreBreakdownChart data={scoreChart} />
              </Card>
            </div>
            <Card className="mt-6 overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-bank-border text-left text-bank-muted">
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
                    <tr key={f.name} className="border-b border-bank-border/40">
                      <td className="px-4 py-3 text-bank-ink">
                        {FACTOR_LABELS[f.name] ?? f.name}
                      </td>
                      <td className="px-4 py-3 text-bank-muted">{f.category}</td>
                      <td className="px-4 py-3 font-mono text-bank-muted">
                        {f.raw_value == null ? "—" : `${f.raw_value}${f.unit}`}
                      </td>
                      <td className="px-4 py-3 font-mono text-bank-ink">{fmtNum(f.score, 1)}</td>
                      <td className="px-4 py-3 font-mono text-bank-muted">
                        {(f.weight * 100).toFixed(0)}%
                      </td>
                      <td className="max-w-xs px-4 py-3 text-bank-muted">{f.rationale}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </Section>

          <Section
            id="facility"
            title="Hypothetical Facility Expected Loss"
            subtitle="Expected Loss = Probability of Default × Loss Given Default × Exposure at Default. Facilities illustrate a corporate-banking hold to a bank obligor — not actual TD Bank debt."
          >
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              <KPICard label="Total Commitment" value={fmtMm(portfolio.total_commitment_mm, 0)} />
              <KPICard
                label="Total Exposure at Default"
                value={fmtMm(portfolio.total_ead_mm)}
                tone="navy"
              />
              <KPICard
                label="Total Expected Loss"
                value={fmtMm(portfolio.total_el_mm, 3)}
                tone="accent"
              />
            </div>
            <Card className="overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-bank-border text-left text-bank-muted">
                    <th className="px-4 py-3">Facility</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Commitment</th>
                    <th className="px-4 py-3">Drawn</th>
                    <th className="px-4 py-3">Credit Conversion Factor</th>
                    <th className="px-4 py-3">Exposure at Default</th>
                    <th className="px-4 py-3">Loss Given Default</th>
                    <th className="px-4 py-3">Expected Loss</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.facilities.map((row) => (
                    <tr key={row.facility.name} className="border-b border-bank-border/40">
                      <td className="px-4 py-3 text-bank-ink">{row.facility.name}</td>
                      <td className="px-4 py-3 text-bank-muted">{row.facility.facility_type}</td>
                      <td className="px-4 py-3 font-mono text-bank-muted">
                        {fmtMm(row.facility.commitment_mm, 0)}
                      </td>
                      <td className="px-4 py-3 font-mono text-bank-muted">
                        {fmtMm(row.facility.drawn_mm, 0)}
                      </td>
                      <td className="px-4 py-3 font-mono text-bank-muted">
                        {(row.facility.undrawn_ccf * 100).toFixed(0)}%
                      </td>
                      <td className="px-4 py-3 font-mono text-bank-ink">{fmtMm(row.ead_mm)}</td>
                      <td className="px-4 py-3 font-mono text-bank-muted">
                        {fmtPct(row.lgd_pct, 0)}
                      </td>
                      <td className="px-4 py-3 font-mono text-bank-green">
                        {fmtMm(row.el_mm, 3)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
            <ul className="mt-4 space-y-1 text-sm text-bank-muted">
              {portfolio.narrative.map((n) => (
                <li key={n}>• {n}</li>
              ))}
            </ul>
          </Section>

          <Section
            id="stress"
            title="Stress Testing"
            subtitle="Shocks to capital, asset quality, liquidity, and earnings; probability-of-default multipliers overlay cycle severity."
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <h3 className="mb-4 text-lg font-semibold text-bank-ink">
                  Expected Loss & Probability of Default by scenario
                </h3>
                <StressElChart data={stressChart} />
              </Card>
              <div className="space-y-3">
                {stress.map((s) => (
                  <Card key={s.scenario.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-lg font-semibold text-bank-ink">
                          {s.scenario.name}
                        </p>
                        <p className="mt-1 text-sm text-bank-muted">{s.scenario.description}</p>
                      </div>
                      <StatusPill status={s.rating} />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-bank-muted">
                      <span>Probability of Default {fmtPct(s.pd_pct)}</span>
                      <span>Expected Loss {fmtMm(s.total_el_mm, 3)}</span>
                      <span>Δ Expected Loss {fmtMm(s.el_vs_base_mm, 3)}</span>
                      <span>Score {fmtNum(s.score, 1)}</span>
                    </div>
                    <p className="mt-2 text-xs text-bank-muted">{s.flags[0]}</p>
                  </Card>
                ))}
              </div>
            </div>
          </Section>

          <Section
            id="ews"
            title="Early Warning & Watchlist"
            subtitle="Policy-style thresholds for capital, asset quality, liquidity, earnings, and rating floor."
          >
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <StatusPill status={earlyWarning.overall_status} />
              <span className="text-sm text-bank-muted">
                Watchlist: {earlyWarning.watchlist ? "Yes" : "No"}
              </span>
            </div>
            <Card className="mb-6 overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-bank-border text-left text-bank-muted">
                    <th className="px-4 py-3">Indicator</th>
                    <th className="px-4 py-3">Threshold</th>
                    <th className="px-4 py-3">Actual</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {earlyWarning.items.map((item) => (
                    <tr key={item.indicator} className="border-b border-bank-border/40">
                      <td className="px-4 py-3 text-bank-ink">
                        {INDICATOR_LABELS[item.indicator] ?? item.indicator}
                      </td>
                      <td className="px-4 py-3 text-bank-muted">{item.threshold}</td>
                      <td className="px-4 py-3 font-mono text-bank-ink">{item.actual}</td>
                      <td className="px-4 py-3">
                        <StatusPill status={item.status} />
                      </td>
                      <td className="px-4 py-3 text-bank-muted">{item.comment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
            <Card>
              <h3 className="mb-3 text-lg font-semibold text-bank-ink">Recommended actions</h3>
              <ul className="space-y-2 text-sm text-bank-muted">
                {earlyWarning.recommended_actions.map((a) => (
                  <li key={a} className="border-l-2 border-bank-green pl-3">
                    {a}
                  </li>
                ))}
              </ul>
            </Card>
          </Section>

          <Section
            id="peers"
            title="Canadian Big 5 Comparison"
            subtitle="Same bank scorecard applied to TD Bank, Royal Bank of Canada, Bank of Nova Scotia, Bank of Montreal, and Canadian Imperial Bank of Commerce."
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <h3 className="mb-4 text-lg font-semibold text-bank-ink">
                  Common Equity Tier 1 Ratio vs peers
                </h3>
                <PeerCet1Chart data={peerChart} />
              </Card>
              <Card className="overflow-x-auto p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-bank-border text-left text-bank-muted">
                      <th className="px-3 py-3">Bank</th>
                      <th className="px-3 py-3">Common Equity Tier 1</th>
                      <th className="px-3 py-3">Non-Performing Loans</th>
                      <th className="px-3 py-3">Liquidity Coverage</th>
                      <th className="px-3 py-3">Return on Assets</th>
                      <th className="px-3 py-3">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {peers.map((p) => (
                      <tr
                        key={p.ticker}
                        className={`border-b border-bank-border/40 ${
                          p.isFocus ? "bg-bank-greenSoft" : ""
                        }`}
                      >
                        <td className="px-3 py-3 text-bank-ink">
                          <span className="font-medium">{BANK_SHORT[p.ticker] ?? p.name}</span>
                          {p.isFocus ? " ★" : ""}
                          <span className="mt-0.5 block text-xs text-bank-muted">{p.ticker}</span>
                        </td>
                        <td className="px-3 py-3 font-mono text-bank-muted">
                          {fmtPct(p.cet1_ratio)}
                        </td>
                        <td className="px-3 py-3 font-mono text-bank-muted">
                          {fmtPct(p.npl_ratio)}
                        </td>
                        <td className="px-3 py-3 font-mono text-bank-muted">
                          {fmtPct(p.lcr, 0)}
                        </td>
                        <td className="px-3 py-3 font-mono text-bank-muted">
                          {fmtPct(p.roaa)}
                        </td>
                        <td className="px-3 py-3 font-mono text-bank-ink">{p.internal_rating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          </Section>

          <Section
            id="glossary"
            title="Metric Definitions"
            subtitle="Short definitions of the bank credit metrics used in this memo."
          >
            <div className="grid gap-3 md:grid-cols-2">
              {GLOSSARY.map((item) => (
                <Card key={item.term} className="p-4">
                  <p className="font-semibold text-bank-ink">{item.term}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-bank-muted">
                    {item.definition}
                  </p>
                </Card>
              ))}
            </div>
          </Section>
        </div>

        <Footer disclaimer={meta.disclaimer} />
      </main>
    </>
  );
}
