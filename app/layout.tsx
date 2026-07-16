import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hypothetical Canadian Bank | FI Credit Risk",
  description:
    "Educational FI obligor credit risk dashboard for a hypothetical Canadian bank — capital, asset quality, illustrative rating, facility EL, stress testing, and early warning.",
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
