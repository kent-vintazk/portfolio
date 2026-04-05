import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollAnimations from "@/components/ScrollAnimations";
import PageTransition from "@/components/PageTransition";
import PageScaleTransition from "@/components/PageScaleTransition";
import ScrollProgress from "@/components/ScrollProgress";
import KENTO_O from "@/components/KENTO_O";
import JsonLd from "@/components/JsonLd";
import ThemeProvider from "@/components/ThemeProvider";
import CustomCursor from "@/components/CustomCursor";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd />
      </head>
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} font-sans cursor-none`}>
        <CustomCursor />
        <ScrollProgress />
        <KENTO_O />
        <ThemeProvider>
          <ScrollAnimations />
          <PageTransition />
          <PageScaleTransition>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </PageScaleTransition>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
