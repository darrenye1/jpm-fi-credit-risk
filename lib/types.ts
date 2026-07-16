export type FactorScore = {
  name: string;
  category: string;
  raw_value: number | null;
  unit: string;
  score: number;
  weight: number;
  weighted: number;
  rationale: string;
};

export type Analysis = {
  meta: {
    ticker: string;
    name: string;
    framework: string;
    disclaimer: string;
    last_refreshed_at?: string;
    auto_refresh?: string;
  };
  metrics: {
    ticker: string;
    name: string;
    as_of_market: string;
    regulatory_as_of: string;
    market_cap: number | null;
    total_assets: number | null;
    stockholders_equity: number | null;
    total_deposits: number | null;
    net_income: number | null;
    revenue: number | null;
    equity_to_assets: number | null;
    roe_reported: number | null;
    asset_growth_yoy: number | null;
    ni_growth_yoy: number | null;
    provision_to_revenue: number | null;
    cet1_ratio: number | null;
    tier1_ratio: number | null;
    total_capital_ratio: number | null;
    leverage_ratio: number | null;
    lcr: number | null;
    npl_ratio: number | null;
    nco_ratio: number | null;
    allowance_to_loans: number | null;
    nim: number | null;
    efficiency_ratio: number | null;
    roaa: number | null;
    roae: number | null;
    loan_to_deposit: number | null;
    g_sib: boolean;
    peer_group: string;
    annual_trends: Array<Record<string, number | string | null>>;
    notes: string[];
    field_sources?: Record<string, string>;
    regulatory_source?: string;
  };
  rating: {
    ticker: string;
    total_score: number;
    internal_rating: string;
    pd_ttc_pct: number;
    outlook: string;
    factors: FactorScore[];
    methodology_notes: string[];
  };
  portfolio: {
    obligor: string;
    rating: string;
    pd_pct: number;
    total_commitment_mm: number;
    total_ead_mm: number;
    total_el_mm: number;
    narrative: string[];
    facilities: Array<{
      facility: {
        name: string;
        facility_type: string;
        commitment_mm: number;
        drawn_mm: number;
        seniority: string;
        collateral: string;
        tenor_years: number;
        undrawn_ccf: number;
      };
      ead_mm: number;
      lgd_pct: number;
      pd_pct: number;
      el_mm: number;
      el_bps_of_ead: number;
      risk_weight_note: string;
    }>;
  };
  stress: Array<{
    scenario: {
      id: string;
      name: string;
      description: string;
      cet1_shock_pp: number;
      npl_shock_pp: number;
      nco_shock_pp: number;
      lcr_shock_pp: number;
      roaa_shock_pp: number;
      efficiency_shock_pp: number;
      pd_multiplier: number;
    };
    stressed_metrics: Record<string, number | null>;
    rating: string;
    score: number;
    pd_pct: number;
    total_el_mm: number;
    el_vs_base_mm: number;
    flags: string[];
  }>;
  earlyWarning: {
    ticker: string;
    watchlist: boolean;
    overall_status: string;
    items: Array<{
      indicator: string;
      threshold: string;
      actual: string;
      status: string;
      severity: string;
      comment: string;
    }>;
    recommended_actions: string[];
  };
  peers: Array<{
    ticker: string;
    name: string;
    cet1_ratio: number | null;
    npl_ratio: number | null;
    lcr: number | null;
    roaa: number | null;
    efficiency_ratio: number | null;
    leverage_ratio: number | null;
    internal_rating: string | null;
    score: number | null;
    isFocus: boolean;
  }>;
  market: {
    price: number | null;
    marketCap: number | null;
    beta: number | null;
    sector: string;
    industry: string;
    currency: string;
  };
};
