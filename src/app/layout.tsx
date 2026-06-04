import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import Script from "next/script";
import { PostHogProvider } from "@/components/providers/PostHogProvider";
import { Analytics } from "@vercel/analytics/react";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zygnal Astro — Your Celestial Blueprint",
  description:
    "Unlock your cosmic identity through precise astronomical calculation, sacred astrology symbolism, and cinematic celestial storytelling. Your universe awaits.",
  keywords: [
    "astrology",
    "birth chart",
    "cosmic blueprint",
    "zodiac",
    "vedic astrology",
    "natal chart",
  ],
  openGraph: {
    title: "Zygnal Astro — Your Celestial Blueprint",
    description:
      "A cinematic celestial portal combining luxury editorial design, sacred astrology symbolism, and emotionally intelligent personalization.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${cormorant.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-void text-star-white antialiased">
        <PostHogProvider>
          <ThemeProvider>
            {children}
            <Analytics />
          </ThemeProvider>
        </PostHogProvider>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
