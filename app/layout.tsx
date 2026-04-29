import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "700"],
});

const SITE_URL = "https://engineroomnetwork.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "EngineRoom Network | The Global Professional Network for Marine Engineers",
    template: "%s | EngineRoom Network",
  },
  description:
    "EngineRoom Network is the global professional network for marine engineering teams. Knowledge, parts and people in one platform. Built by engineers, for engineers. Join the early-access list.",
  keywords: [
    "marine engineering",
    "marine engineers",
    "shipping",
    "maritime",
    "vessel parts",
    "engine room",
    "ship engineering",
    "maritime professionals",
  ],
  authors: [{ name: "EngineRoom Network" }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "EngineRoom Network",
    description:
      "The global professional network for marine engineering teams. Built by engineers, for engineers.",
    siteName: "EngineRoom Network",
  },
  twitter: {
    card: "summary_large_image",
    title: "EngineRoom Network",
    description:
      "The global professional network for marine engineering teams. Built by engineers, for engineers.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#1B6CFF",
          colorText: "#0D1B2A",
          colorTextSecondary: "#5C6B7A",
          colorBackground: "#FFFFFF",
          colorInputBackground: "#FFFFFF",
          colorInputText: "#0D1B2A",
          fontFamily: "var(--font-body), system-ui, sans-serif",
          borderRadius: "2px",
        },
        elements: {
          card: "shadow-lg border border-mist",
          headerTitle: "font-display font-bold tracking-tight",
          formButtonPrimary:
            "bg-hull hover:bg-signal text-white font-semibold rounded-sm transition-colors",
          footerActionLink: "text-signal hover:text-hull",
        },
      }}
    >
      <html
        lang="en"
        className={`${display.variable} ${body.variable} ${mono.variable}`}
      >
        <body className="font-sans">{children}</body>
      </html>
    </ClerkProvider>
  );
}
