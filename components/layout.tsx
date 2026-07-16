import {
  Activity,
  AlertTriangle,
  BookOpen,
  Building2,
  Github,
  Layers,
  Linkedin,
  Mail,
  Shield,
  Users,
} from "lucide-react";
import { author } from "@/lib/author";
import { Badge } from "./ui";

const links = [
  { href: "#overview", label: "Overview", icon: Activity },
  { href: "#capital", label: "Capital", icon: Building2 },
  { href: "#rating", label: "Rating", icon: Shield },
  { href: "#facility", label: "Expected Loss", icon: Layers },
  { href: "#stress", label: "Stress", icon: AlertTriangle },
  { href: "#ews", label: "Early Warning", icon: AlertTriangle },
  { href: "#peers", label: "Peers", icon: Users },
  { href: "#glossary", label: "Definitions", icon: BookOpen },
];

export function ProfileBanner() {
  return (
    <section className="border-b border-bank-border bg-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-bank-green">
          Portfolio — Credit Risk Analytics
        </p>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="font-display text-3xl font-semibold text-bank-ink md:text-4xl">
              {author.name}
            </h1>
            <p className="mt-2 text-sm text-bank-muted">{author.title}</p>
            <p className="mt-3 text-bank-muted">{author.tagline}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {author.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded border border-bank-border bg-bank-bg px-3 py-1 text-xs font-medium text-bank-ink"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="shrink-0">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-bank-muted">
              Contact
            </p>
            <a
              href={`mailto:${author.email}`}
              className="flex items-center gap-2 text-sm font-medium text-bank-green hover:underline"
            >
              <Mail size={14} />
              {author.email}
            </a>
            <div className="mt-3 flex gap-2">
              <a
                href={author.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded border border-bank-border bg-white px-3 py-1.5 text-xs font-medium text-bank-ink transition hover:border-bank-green hover:text-bank-green"
              >
                <Linkedin size={13} />
                LinkedIn
              </a>
              <a
                href={author.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded border border-bank-border bg-white px-3 py-1.5 text-xs font-medium text-bank-ink transition hover:border-bank-green hover:text-bank-green"
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
}: {
  name: string;
  ticker: string;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-bank-border bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-bank-green font-display text-sm font-bold text-white">
            {ticker.slice(0, 3)}
          </div>
          <div>
            <h1 className="font-display text-base font-semibold text-bank-ink md:text-lg">{name}</h1>
            <p className="text-xs text-bank-muted">{ticker} · FI Credit Risk Memo</p>
          </div>
        </div>
        <nav className="hidden items-center gap-0.5 lg:flex">
          {links.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              className="flex items-center gap-1.5 rounded px-2.5 py-2 text-sm text-bank-muted transition hover:bg-bank-navySoft hover:text-bank-ink"
            >
              <Icon size={14} />
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
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
  regulatorySource,
  lastRefreshedAt,
}: {
  name: string;
  sector: string;
  industry: string;
  regulatoryAsOf: string;
  marketAsOf: string;
  regulatorySource?: string;
  lastRefreshedAt?: string;
}) {
  return (
    <div className="border-b border-bank-border bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-bank-green" />
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-bank-green">
            Credit Risk Case Study
          </p>
        </div>
        <h2 className="max-w-3xl font-display text-[1.85rem] font-semibold leading-tight tracking-tight text-bank-ink md:text-[2.35rem]">
          {name}
        </h2>
        <p className="mt-3 max-w-xl text-[0.98rem] leading-relaxed text-bank-muted">
          FI obligor credit memo for a hypothetical Canadian bank — capital &amp; asset-quality
          scorecard, facility EL, stress testing, and early-warning monitoring.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {[
            sector,
            industry,
            "Python · yfinance · Next.js",
            regulatoryAsOf ? `Filings as of ${regulatoryAsOf}` : "",
            marketAsOf ? `Market ${marketAsOf}` : "",
            lastRefreshedAt ? `Pipeline refreshed ${lastRefreshedAt}` : "",
          ]
            .filter(Boolean)
            .map((tag) => (
              <span
                key={tag}
                className="rounded border border-bank-border bg-bank-bg px-3 py-1 text-sm text-bank-muted"
              >
                {tag}
              </span>
            ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded border border-bank-border bg-bank-bg px-2.5 py-1 font-medium text-bank-muted">
            Live · Yahoo — market cap, assets, earnings, trends (auto-refresh weekly)
          </span>
          <span className="rounded border border-bank-green/30 bg-bank-greenSoft px-2.5 py-1 font-medium text-bank-green">
            Overlay — stylized CET1, NPL, LCR, NIM (illustrative)
          </span>
          <span className="rounded border border-amber-200 bg-amber-50 px-2.5 py-1 font-medium text-bank-warn">
            Illustrative — internal rating, PD, facility EL, stress
          </span>
        </div>
        {regulatorySource ? (
          <p className="mt-3 max-w-3xl text-xs leading-relaxed text-bank-muted">
            Primary regulatory source: {regulatorySource}.
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function Footer({ disclaimer }: { disclaimer: string }) {
  return (
    <footer className="border-t border-bank-border bg-white py-10 text-center text-sm text-bank-muted">
      <p>
        Built by {author.name} · FI Credit Risk portfolio project · For educational purposes only
      </p>
      <p className="mx-auto mt-3 max-w-3xl text-xs leading-relaxed">{disclaimer}</p>
      <p className="mx-auto mt-2 max-w-3xl text-xs leading-relaxed text-bank-muted">
        Personal views only. This project does not represent any employer or financial institution.
      </p>
    </footer>
  );
}

export function DisclaimerBanner({ disclaimer }: { disclaimer: string }) {
  return (
    <div className="border-b border-amber-200 bg-amber-50">
      <div className="mx-auto max-w-7xl px-6 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-bank-warn">
          Disclaimer
        </p>
        <p className="mt-1 text-xs leading-relaxed text-bank-muted md:text-sm">{disclaimer}</p>
      </div>
    </div>
  );
}
