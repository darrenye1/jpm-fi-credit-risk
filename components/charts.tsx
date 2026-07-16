"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const tooltipStyle = {
  backgroundColor: "#FFFFFF",
  border: "1px solid #D9E2EC",
  borderRadius: 8,
  color: "#0C2340",
  boxShadow: "0 4px 12px rgba(12,35,64,0.08)",
};

const grid = "#E2E8F0";
const tick = "#64748B";
const green = "#007A33";
const navy = "#0C2340";
const slate = "#64748B";

export function ScoreBreakdownChart({
  data,
}: {
  data: Array<{ name: string; weighted: number; score: number }>;
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 24, right: 16 }}>
          <CartesianGrid stroke={grid} strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, 30]} tick={{ fill: tick, fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="name"
            width={120}
            tick={{ fill: tick, fontSize: 11 }}
          />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="weighted" name="Weighted score" fill={green} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TrendChart({
  data,
}: {
  data: Array<{ year: number | string; netIncome?: number; revenue?: number }>;
}) {
  const scaled = data.map((d) => ({
    year: d.year,
    revenueBn: d.revenue != null ? d.revenue / 1e9 : null,
    netIncomeBn: d.netIncome != null ? d.netIncome / 1e9 : null,
  }));
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <LineChart data={scaled}>
          <CartesianGrid stroke={grid} strokeDasharray="3 3" />
          <XAxis dataKey="year" tick={{ fill: tick, fontSize: 12 }} />
          <YAxis tick={{ fill: tick, fontSize: 12 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenueBn"
            name="Revenue ($B)"
            stroke={navy}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="netIncomeBn"
            name="Net Income ($B)"
            stroke={green}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StressElChart({
  data,
}: {
  data: Array<{ name: string; el: number; pd: number }>;
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid stroke={grid} strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fill: tick, fontSize: 11 }} />
          <YAxis tick={{ fill: tick, fontSize: 12 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          <Bar dataKey="el" name="Expected Loss ($mm)" fill={navy} radius={[4, 4, 0, 0]} />
          <Bar dataKey="pd" name="Probability of Default (%)" fill={green} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PeerCet1Chart({
  data,
}: {
  data: Array<{ ticker: string; cet1: number | null; focus: boolean }>;
}) {
  const rows = data.map((d) => ({
    ticker: d.ticker,
    cet1: d.cet1 ?? 0,
    focus: d.focus,
  }));
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <BarChart data={rows}>
          <CartesianGrid stroke={grid} strokeDasharray="3 3" />
          <XAxis dataKey="ticker" tick={{ fill: tick, fontSize: 12 }} />
          <YAxis tick={{ fill: tick, fontSize: 12 }} unit="%" />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="cet1" name="Common Equity Tier 1 %" radius={[4, 4, 0, 0]}>
            {rows.map((entry) => (
              <Cell key={entry.ticker} fill={entry.focus ? green : slate} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
