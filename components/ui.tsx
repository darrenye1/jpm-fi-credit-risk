import type { ReactNode } from "react";
import clsx from "clsx";

export function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-bank-border py-14">
      <div className="mb-8">
        <h2 className="font-display text-2xl font-semibold text-bank-ink md:text-3xl">{title}</h2>
        {subtitle && <p className="mt-2 max-w-2xl text-bank-muted">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "rounded-lg border border-bank-border bg-bank-card p-5 shadow-bank",
        className
      )}
    >
      {children}
    </div>
  );
}

export function KPICard({
  label,
  value,
  change,
  positive,
}: {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
}) {
  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-wide text-bank-muted">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold text-bank-ink">{value}</p>
      {change && (
        <p
          className={clsx(
            "mt-1 text-sm",
            positive === true && "text-bank-green",
            positive === false && "text-bank-danger",
            positive === undefined && "text-bank-muted"
          )}
        >
          {change}
        </p>
      )}
    </Card>
  );
}

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded border border-bank-green/30 bg-bank-greenSoft px-2.5 py-1 text-xs font-semibold text-bank-green">
      {children}
    </span>
  );
}

export function StatusPill({ status }: { status: string }) {
  const tone =
    status === "Pass" || status === "Stable" || status === "Stable-Positive"
      ? "bg-bank-greenSoft text-bank-green border-bank-green/30"
      : status === "Watch" || status === "Negative"
        ? "bg-amber-50 text-bank-warn border-amber-200"
        : "bg-red-50 text-bank-danger border-red-200";
  return (
    <span className={clsx("inline-flex rounded border px-2.5 py-1 text-xs font-semibold", tone)}>
      {status}
    </span>
  );
}
