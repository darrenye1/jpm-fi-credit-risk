export type GlossaryItem = {
  term: string;
  definition: string;
};

/** Full-name display labels for FI credit metrics */
export const METRIC_LABELS = {
  cet1: "Common Equity Tier 1 Ratio",
  tier1: "Tier 1 Capital Ratio",
  leverage: "Leverage Ratio",
  npl: "Non-Performing Loan Ratio",
  nco: "Net Charge-Off Ratio",
  allowance: "Allowance to Loans",
  lcr: "Liquidity Coverage Ratio",
  nim: "Net Interest Margin",
  efficiency: "Efficiency Ratio",
  roaa: "Return on Average Assets",
  roae: "Return on Average Equity",
  ltd: "Loan-to-Deposit Ratio",
  pd: "Through-the-Cycle Probability of Default",
  el: "Expected Loss",
  ead: "Exposure at Default",
  lgd: "Loss Given Default",
  ccf: "Credit Conversion Factor",
} as const;

export const BANK_SHORT: Record<string, string> = {
  TD: "TD Bank",
  RY: "Royal Bank of Canada",
  BNS: "Bank of Nova Scotia",
  BMO: "Bank of Montreal",
  CM: "Canadian Imperial Bank of Commerce",
};

export const FACTOR_LABELS: Record<string, string> = {
  "CET1 Ratio": "Common Equity Tier 1 Ratio",
  "Leverage Ratio": "Leverage Ratio",
  "NPL Ratio": "Non-Performing Loan Ratio",
  "NCO Ratio": "Net Charge-Off Ratio",
  LCR: "Liquidity Coverage Ratio",
  ROAA: "Return on Average Assets",
  "Efficiency Ratio": "Efficiency Ratio",
};

export const INDICATOR_LABELS: Record<string, string> = {
  "CET1 Ratio": "Common Equity Tier 1 Ratio",
  "NPL Ratio": "Non-Performing Loan Ratio",
  "NCO Ratio": "Net Charge-Off Ratio",
  LCR: "Liquidity Coverage Ratio",
  ROAA: "Return on Average Assets",
  "Efficiency Ratio": "Efficiency Ratio",
  "Internal Rating": "Internal Rating",
};

export const GLOSSARY: GlossaryItem[] = [
  {
    term: "Common Equity Tier 1 Ratio",
    definition:
      "Highest-quality capital (common equity) as a share of risk-weighted assets. Core measure of a bank’s ability to absorb losses.",
  },
  {
    term: "Tier 1 Capital Ratio",
    definition:
      "Tier 1 capital (CET1 plus additional going-concern capital) divided by risk-weighted assets.",
  },
  {
    term: "Leverage Ratio",
    definition:
      "Tier 1 capital divided by total leverage exposure. A non-risk-weighted backstop to capital ratios.",
  },
  {
    term: "Non-Performing Loan Ratio",
    definition:
      "Impaired or past-due loans as a share of total loans. Higher values signal weaker asset quality.",
  },
  {
    term: "Net Charge-Off Ratio",
    definition:
      "Loans written off (net of recoveries) relative to average loans. Reflects realized credit losses.",
  },
  {
    term: "Allowance to Loans",
    definition:
      "Loan-loss reserves as a percentage of loans. Indicates provisioning buffer for expected credit losses.",
  },
  {
    term: "Liquidity Coverage Ratio",
    definition:
      "High-quality liquid assets divided by stressed 30-day net cash outflows. Measures short-term liquidity resilience.",
  },
  {
    term: "Net Interest Margin",
    definition:
      "Net interest income as a share of average earning assets. Core banking profitability from lending and deposits.",
  },
  {
    term: "Efficiency Ratio",
    definition:
      "Non-interest expenses divided by revenue. Lower is generally better (cost discipline).",
  },
  {
    term: "Return on Average Assets",
    definition: "Net income relative to average total assets. Overall earning power of the balance sheet.",
  },
  {
    term: "Return on Average Equity",
    definition: "Net income relative to average shareholders’ equity. Return generated for equity holders.",
  },
  {
    term: "Loan-to-Deposit Ratio",
    definition:
      "Loans divided by deposits. Indicates how much of the deposit base is deployed into lending.",
  },
  {
    term: "Probability of Default",
    definition:
      "Estimated likelihood that the obligor defaults over a given horizon. Here mapped from the internal rating (through-the-cycle).",
  },
  {
    term: "Exposure at Default",
    definition:
      "Estimated exposure if default occurs: drawn amounts plus undrawn commitments × credit conversion factor.",
  },
  {
    term: "Loss Given Default",
    definition:
      "Share of exposure expected to be lost after default, after recoveries. Varies by seniority and collateral.",
  },
  {
    term: "Expected Loss",
    definition:
      "Probability of Default × Loss Given Default × Exposure at Default. Average credit loss under the rating view.",
  },
  {
    term: "Credit Conversion Factor",
    definition:
      "Fraction of undrawn commitment assumed to be drawn at default when calculating Exposure at Default.",
  },
];
