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
    <section id={id} className="scroll-mt-24 border-t border-bank-border py-12 md:py-14">
      <div className="mb-7">
        <h2 className="font-display text-[1.65rem] font-semibold leading-snug text-bank-ink md:text-[1.85rem]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-bank-muted">{subtitle}</p>
        )}
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
  tone = "default",
  source,
}: {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
  /** accent = green highlight; navy = navy soft highlight */
  tone?: "default" | "accent" | "navy";
  /** Data provenance badge shown under the label */
  source?: "market" | "filing" | "derived" | "model";
}) {
  const sourceLabel =
    source === "market"
      ? "Live · Yahoo"
      : source === "filing"
        ? "From filings"
        : source === "derived"
          ? "Calculated"
          : source === "model"
            ? "Illustrative"
            : null;
  const sourceClass =
    source === "model"
      ? "border-amber-200 bg-amber-50 text-bank-warn"
      : source === "filing"
        ? "border-bank-green/30 bg-bank-greenSoft text-bank-green"
        : source === "market" || source === "derived"
          ? "border-bank-border bg-bank-bg text-bank-muted"
          : "";

  return (
    <div
      className={clsx(
        "rounded-lg border p-5 shadow-bank",
        tone === "accent" && "border-bank-green/35 bg-bank-greenSoft",
        tone === "navy" && "border-bank-navy/20 bg-bank-navySoft",
        tone === "default" && "border-bank-border bg-bank-card"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p
          className={clsx(
            "text-[0.7rem] font-bold uppercase tracking-[0.08em]",
            tone === "accent" && "text-bank-green",
            tone === "navy" && "text-bank-navy/70",
            tone === "default" && "text-bank-muted"
          )}
        >
          {label}
        </p>
        {sourceLabel && (
          <span
            className={clsx(
              "shrink-0 rounded border px-1.5 py-0.5 text-[0.65rem] font-semibold leading-none",
              sourceClass
            )}
          >
            {sourceLabel}
          </span>
        )}
      </div>
      <p
        className={clsx(
          "mt-2 font-display font-semibold tracking-tight",
          tone === "accent" && "text-[1.85rem] text-bank-green md:text-[2.05rem]",
          tone === "navy" && "text-[1.85rem] text-bank-navy md:text-[2.05rem]",
          tone === "default" && "text-[1.45rem] text-bank-ink md:text-2xl"
        )}
      >
        {value}
      </p>
      {change && (
        <p
          className={clsx(
            "mt-1.5 text-[0.85rem] leading-snug",
            positive === true && "font-medium text-bank-green",
            positive === false && "font-medium text-bank-danger",
            positive === undefined && "text-bank-muted"
          )}
        >
          {change}
        </p>
      )}
    </div>
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
