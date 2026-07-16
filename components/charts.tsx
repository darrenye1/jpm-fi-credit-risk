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
  backgroundColor: "#1a1a2e",
  border: "1px solid #2a2a3e",
  borderRadius: 12,
  color: "#fff",
};

export function ScoreBreakdownChart({
  data,
}: {
  data: Array<{ name: string; weighted: number; score: number }>;
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 24, right: 16 }}>
          <CartesianGrid stroke="#2a2a3e" strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, 30]} tick={{ fill: "#8892a4", fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="name"
            width={120}
            tick={{ fill: "#8892a4", fontSize: 11 }}
          />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="weighted" name="Weighted score" fill="#22d3ee" radius={[0, 6, 6, 0]} />
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
          <CartesianGrid stroke="#2a2a3e" strokeDasharray="3 3" />
          <XAxis dataKey="year" tick={{ fill: "#8892a4", fontSize: 12 }} />
          <YAxis tick={{ fill: "#8892a4", fontSize: 12 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenueBn"
            name="Revenue ($B)"
            stroke="#22d3ee"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="netIncomeBn"
            name="Net Income ($B)"
            stroke="#a78bfa"
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
          <CartesianGrid stroke="#2a2a3e" strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fill: "#8892a4", fontSize: 11 }} />
          <YAxis tick={{ fill: "#8892a4", fontSize: 12 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          <Bar dataKey="el" name="EL ($mm)" fill="#22d3ee" radius={[6, 6, 0, 0]} />
          <Bar dataKey="pd" name="PD (%)" fill="#a78bfa" radius={[6, 6, 0, 0]} />
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
          <CartesianGrid stroke="#2a2a3e" strokeDasharray="3 3" />
          <XAxis dataKey="ticker" tick={{ fill: "#8892a4", fontSize: 12 }} />
          <YAxis tick={{ fill: "#8892a4", fontSize: 12 }} unit="%" />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="cet1" name="CET1 %" radius={[6, 6, 0, 0]}>
            {rows.map((entry) => (
              <Cell key={entry.ticker} fill={entry.focus ? "#22d3ee" : "#6366f1"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
