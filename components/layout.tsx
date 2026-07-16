import {
  Activity,
  AlertTriangle,
  Building2,
  Github,
  Layers,
  Linkedin,
  Mail,
  Shield,
  Users,
} from "lucide-react";
import { author } from "@/lib/author";
import { Badge, StatusPill } from "./ui";

const links = [
  { href: "#overview", label: "Overview", icon: Activity },
  { href: "#capital", label: "Capital & AQ", icon: Building2 },
  { href: "#rating", label: "Rating", icon: Shield },
  { href: "#facility", label: "Facility EL", icon: Layers },
  { href: "#stress", label: "Stress", icon: AlertTriangle },
  { href: "#ews", label: "Early Warning", icon: AlertTriangle },
  { href: "#peers", label: "Peers", icon: Users },
];

export function ProfileBanner() {
  return (
    <section className="border-b border-brand-border/60 bg-brand-dark">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-brand-accent">
          // Portfolio — Financial Analytics
        </p>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="font-display text-3xl font-bold text-white md:text-4xl">
              {author.name}
            </h1>
            <p className="mt-2 text-sm text-brand-muted">{author.title}</p>
            <p className="mt-4 text-brand-muted">{author.tagline}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {author.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md border border-brand-accent/20 bg-brand-accent/5 px-3 py-1 text-xs font-medium text-brand-accent"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="shrink-0">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-brand-muted">
              Contact
            </p>
            <a
              href={`mailto:${author.email}`}
              className="flex items-center gap-2 text-sm text-brand-accent transition hover:text-white"
            >
              <Mail size={14} />
              {author.email}
            </a>
            <div className="mt-3 flex gap-2">
              <a
                href={author.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-brand-border px-3 py-1.5 text-xs text-brand-muted transition hover:border-brand-accent/40 hover:text-white"
              >
                <Linkedin size={13} />
                LinkedIn
              </a>
              <a
                href={author.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-brand-border px-3 py-1.5 text-xs text-brand-muted transition hover:border-brand-accent/40 hover:text-white"
              >
                <Github size={13} />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Header({
  name,
  ticker,
  status,
}: {
  name: string;
  ticker: string;
  status: string;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-border/60 bg-brand-dark/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent/20 font-display text-sm font-bold text-brand-accent ring-1 ring-brand-accent/40">
            JP
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-white">{name}</h1>
            <p className="text-xs text-brand-muted">{ticker} · FI Credit Risk</p>
          </div>
        </div>
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-brand-muted transition hover:bg-white/5 hover:text-white"
            >
              <Icon size={14} />
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <StatusPill status={status} />
          <Badge>By {author.name.split(" ")[0]}</Badge>
        </div>
      </div>
    </header>
  );
}

export function Hero({
  name,
  sector,
  industry,
  regulatoryAsOf,
  marketAsOf,
}: {
  name: string;
  sector: string;
  industry: string;
  regulatoryAsOf: string;
  marketAsOf: string;
}) {
  return (
    <div className="relative overflow-hidden border-b border-brand-border/40 py-14">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-accent/15 via-transparent to-transparent" />
      <div className="relative mx-auto max-w-7xl px-6">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-brand-accent">
          Case Study
        </p>
        <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
          {name}
        </h2>
        <p className="mt-4 max-w-2xl text-brand-muted">
          Financial Institution obligor credit risk — CET1 &amp; asset quality scorecard, facility-level
          expected loss, stress scenarios, and early-warning monitoring. Bank credit framed with
          regulatory metrics, not corporate EBITDA covenants.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <span className="rounded-full bg-white/5 px-4 py-1.5 text-sm text-brand-muted ring-1 ring-white/10">
            {sector}
          </span>
          <span className="rounded-full bg-white/5 px-4 py-1.5 text-sm text-brand-muted ring-1 ring-white/10">
            {industry}
          </span>
          <span className="rounded-full bg-white/5 px-4 py-1.5 text-sm text-brand-muted ring-1 ring-white/10">
            Python · yfinance · Next.js
          </span>
          {regulatoryAsOf && (
            <span className="rounded-full bg-white/5 px-4 py-1.5 text-sm text-brand-muted ring-1 ring-white/10">
              Reg. as of {regulatoryAsOf}
            </span>
          )}
          {marketAsOf && (
            <span className="rounded-full bg-white/5 px-4 py-1.5 text-sm text-brand-muted ring-1 ring-white/10">
              Market {marketAsOf}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function Footer({ disclaimer }: { disclaimer: string }) {
  return (
    <footer className="border-t border-brand-border py-10 text-center text-sm text-brand-muted">
      <p>
        Built by {author.name} · FI Credit Risk portfolio project · For educational purposes only
      </p>
      <p className="mx-auto mt-3 max-w-3xl text-xs leading-relaxed opacity-80">{disclaimer}</p>
    </footer>
  );
}
