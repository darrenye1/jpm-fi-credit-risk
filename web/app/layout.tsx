import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JPM FI Credit Risk | Corporate Banking Dashboard",
  description:
    "Financial Institution obligor credit risk analysis for JPMorgan Chase — capital, asset quality, internal rating, facility EL, stress testing, and early warning.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
