import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Cinzel,
  Cormorant_Garamond,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ScrollAnimations from "@/components/ScrollAnimations";
import PageTransition from "@/components/PageTransition";
import PageScaleTransition from "@/components/PageScaleTransition";
import ScrollProgress from "@/components/ScrollProgress";
import KENTO_O from "@/components/KENTO_O";
import JsonLd from "@/components/JsonLd";
import ThemeProvider from "@/components/ThemeProvider";
import CustomCursor from "@/components/CustomCursor";
import Embers from "@/components/Embers";
import ConsoleFilter from "@/components/ConsoleFilter";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "KENTO_O | Portfolio",
  description: "Creative developer building refined digital experiences.",
  keywords: ["developer", "portfolio", "web development", "creative"],
  authors: [{ name: "KENTO_O" }],
  icons: {
    icon: "/favicon.jpg",
  },
  openGraph: {
    title: "KENTO_O | Portfolio",
    description: "Creative developer building refined digital experiences.",
    type: "website",
  },
};

export const viewport = "width=device-width, initial-scale=1, maximum-scale=1";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <JsonLd />
      </head>
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} ${cormorant.variable} font-sans cursor-none`}>
        <ConsoleFilter />
        <CustomCursor />
        <ScrollProgress />
        <Embers count={50} />
        <KENTO_O />
        <ThemeProvider>
          <ScrollAnimations />
          <PageTransition />
          <PageScaleTransition>
            <Navbar />
            <main className="min-h-screen">{children}</main>
          </PageScaleTransition>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
