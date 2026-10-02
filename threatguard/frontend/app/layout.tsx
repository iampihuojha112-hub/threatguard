import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });

export const metadata: Metadata = {
  title: { default: "ThreatGuard | Email phishing detection", template: "%s | ThreatGuard" },
  description: "Paste an email and get a phishing verdict, a risk score and a plain-language explanation.",
};

export const viewport: Viewport = { themeColor: "#05060d", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${sora.variable}`}>
      <body>{children}</body>
    </html>
  );
}
