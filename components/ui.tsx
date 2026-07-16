import type { ReactNode } from "react";
import clsx from "clsx";

export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 py-14 border-t border-line/80">
      <div className="mb-8 max-w-3xl">
        {eyebrow && (
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-brass mb-3">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-3xl md:text-4xl text-parchment">{title}</h2>
        {subtitle && <p className="mt-3 text-muted leading-relaxed">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("border border-line bg-ink-900/70 p-5 md:p-6", className)}>
      {children}
    </div>
  );
}

export function KPI({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Panel>
      <p className="text-xs font-mono uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-2 font-display text-2xl md:text-3xl text-parchment">{value}</p>
      {hint && <p className="mt-2 text-sm text-muted">{hint}</p>}
    </Panel>
  );
}

export function StatusPill({ status }: { status: string }) {
  const tone =
    status === "Pass" || status === "Stable" || status === "Stable-Positive"
      ? "bg-sea/20 text-sea-bright border-sea/40"
      : status === "Watch" || status === "Negative"
        ? "bg-brass/15 text-brass-soft border-brass/40"
        : "bg-red-500/15 text-red-300 border-red-400/30";
  return (
    <span className={clsx("inline-flex px-2.5 py-0.5 text-xs font-mono border", tone)}>
      {status}
    </span>
  );
}
