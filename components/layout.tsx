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
  status,
}: {
  name: string;
  ticker: string;
  status: string;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-bank-border bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-bank-green font-display text-sm font-bold text-white">
            TD
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
    <div className="border-b border-bank-border bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-bank-green" />
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-bank-green">
            Credit Risk Case Study
          </p>
        </div>
        <h2 className="max-w-4xl font-display text-3xl font-semibold tracking-tight text-bank-ink md:text-5xl">
          {name}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-bank-muted">
          Financial Institution obligor credit assessment — CET1 &amp; asset quality scorecard,
          facility-level expected loss, stress scenarios, and early-warning monitoring. Framed with
          regulatory bank metrics, not corporate EBITDA covenants.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {[
            sector,
            industry,
            "Python · yfinance · Next.js",
            regulatoryAsOf ? `Reg. as of ${regulatoryAsOf}` : "",
            marketAsOf ? `Market ${marketAsOf}` : "",
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
    </footer>
  );
}
