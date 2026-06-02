"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import HeroSection from "@/components/ui/HeroSection";

/* ═══════════════════════════════════════════════════
   ZYGNAL ASTRO — CINEMATIC HOMEPAGE
   ═══════════════════════════════════════════════════ */

// Lazy-load the canvas engine (client-only, no SSR)
const CosmicBackground = dynamic(
  () => import("@/components/ui/CosmicBackground"),
  { ssr: false }
);

/* ─── Zodiac personalization data ─── */
const ZODIAC_SIGNS = [
  { sign: "Aries",       char: "♈", dates: "Mar 21 – Apr 19", element: "Fire",  color: "#ef4444", glow: "rgba(239,68,68,0.2)" },
  { sign: "Taurus",      char: "♉", dates: "Apr 20 – May 20", element: "Earth", color: "#84cc16", glow: "rgba(132,204,22,0.2)" },
  { sign: "Gemini",      char: "♊", dates: "May 21 – Jun 20", element: "Air",   color: "#fbbf24", glow: "rgba(251,191,36,0.2)" },
  { sign: "Cancer",      char: "♋", dates: "Jun 21 – Jul 22", element: "Water", color: "#60a5fa", glow: "rgba(96,165,250,0.2)" },
  { sign: "Leo",         char: "♌", dates: "Jul 23 – Aug 22", element: "Fire",  color: "#f97316", glow: "rgba(249,115,22,0.2)" },
  { sign: "Virgo",       char: "♍", dates: "Aug 23 – Sep 22", element: "Earth", color: "#86efac", glow: "rgba(134,239,172,0.2)" },
  { sign: "Libra",       char: "♎", dates: "Sep 23 – Oct 22", element: "Air",   color: "#f0abfc", glow: "rgba(240,171,252,0.2)" },
  { sign: "Scorpio",     char: "♏", dates: "Oct 23 – Nov 21", element: "Water", color: "#dc2626", glow: "rgba(220,38,38,0.2)" },
  { sign: "Sagittarius", char: "♐", dates: "Nov 22 – Dec 21", element: "Fire",  color: "#c084fc", glow: "rgba(192,132,252,0.2)" },
  { sign: "Capricorn",   char: "♑", dates: "Dec 22 – Jan 19", element: "Earth", color: "#94a3b8", glow: "rgba(148,163,184,0.2)" },
  { sign: "Aquarius",    char: "♒", dates: "Jan 20 – Feb 18", element: "Air",   color: "#38bdf8", glow: "rgba(56,189,248,0.2)" },
  { sign: "Pisces",      char: "♓", dates: "Feb 19 – Mar 20", element: "Water", color: "#818cf8", glow: "rgba(129,140,248,0.2)" },
];

/* ─── Testimonials ─── */
const TESTIMONIALS = [
  {
    quote: "The psychological depth of the Sun-Moon transit analysis was shockingly accurate. It felt less like fortune-telling and more like deep therapeutic alignment.",
    author: "Elena R.",
    sign: "Scorpio Sun",
    stars: 5,
  },
  {
    quote: "Zygnal Astro is the first astrology platform that matches my aesthetic values. The design is breathtaking and the insights are poetic and deeply resonant.",
    author: "Marcus V.",
    sign: "Pisces Rising",
    stars: 5,
  },
  {
    quote: "The compatibility report mapped out friction points my partner and I had been navigating for years, explaining the core cosmic archetypes behind them.",
    author: "Sarah & Leo",
    sign: "Synastry Alignment",
    stars: 5,
  },
];

/* ─── FAQ ─── */
const FAQ = [
  {
    q: "How accurate does my birth time need to be?",
    a: "The Rising sign and house divisions shift approximately every 2 hours — even a 15-minute discrepancy can alter placements. Our system provides an optional precision warning and lets you select approximate status to adjust confidence scores.",
  },
  {
    q: "What data source does Zygnal Astro use?",
    a: "We query direct astronomical algorithms to compute the exact positions of planetary bodies relative to Earth's coordinates at your birth location, normalising the data for precise timezone offsets using high-precision ephemeris data.",
  },
  {
    q: "Can I retrieve my reports later?",
    a: "Yes. Even without a persistent login, we provide options to generate a shareable save link, download a high-definition PDF celestial blueprint, or email the report straight to your inbox secured with a unique token.",
  },
  {
    q: "Is my birth data kept private?",
    a: "Absolutely. We collect birth data solely to calculate your charts. Zero third-party ad brokers, zero persistent user profiling, zero data sharing. Your cosmic data is yours alone.",
  },
];

/* ─── Intersection Observer hook for scroll-reveal ─── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

/* ─── Section reveal wrapper ─── */
function RevealSection({ children, className = "", delay = 0 }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.9s ease ${delay}ms, transform 0.9s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── FAQ Accordion Item ─── */
function FaqItem({ q, a, idx }: { q: string; a: string; idx: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-b"
      style={{ borderColor: "rgba(212,175,55,0.08)" }}
    >
      <button
        className="w-full text-left py-6 flex items-center justify-between gap-4 group"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-4">
          <span
            className="font-display text-xs"
            style={{ color: "rgba(212,175,55,0.4)", letterSpacing: "0.2em", minWidth: "2rem" }}
          >
            {String(idx + 1).padStart(2, "0")}
          </span>
          <span
            className="font-serif text-lg group-hover:text-gold-300 transition-colors duration-300"
            style={{ color: "rgba(248,244,255,0.85)", fontStyle: "italic" }}
          >
            {q}
          </span>
        </div>
        <span
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full border transition-all duration-300"
          style={{
            borderColor: open ? "rgba(212,175,55,0.5)" : "rgba(212,175,55,0.15)",
            color: open ? "#d4af37" : "rgba(212,175,55,0.4)",
            transform: open ? "rotate(45deg)" : "none",
          }}
        >
          +
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-500"
        style={{ maxHeight: open ? "200px" : "0" }}
      >
        <p
          className="pb-6 pl-14 font-serif text-base leading-relaxed"
          style={{ color: "rgba(200,196,212,0.55)", fontWeight: 300 }}
        >
          {a}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════ */
export default function Home() {
  const [hoveredSign, setHoveredSign] = useState<string | null>(null);

  return (
    <div
      className="relative min-h-screen text-white flex flex-col overflow-x-hidden"
      style={{ background: "#00000a" }}
    >
      {/* ─── Canvas cosmic environment (lazy, client-only) ─── */}
      <CosmicBackground />

      {/* ─── Navbar ─── */}
      <Navbar />

      {/* ─── Main content ─── */}
      <main className="flex-grow flex flex-col relative z-10">

        {/* ════════════════════════════════════
            HERO
            ════════════════════════════════════ */}
        <HeroSection />

        {/* ════════════════════════════════════
            THE METHOD — 3 cosmic pillars
            ════════════════════════════════════ */}
        <section
          id="insights"
          className="relative py-32 overflow-hidden"
          style={{ background: "linear-gradient(180deg, rgba(0,0,10,0) 0%, rgba(7,5,26,0.8) 30%, rgba(7,5,26,0.9) 70%, rgba(0,0,10,0) 100%)" }}
        >
          {/* Background decorative circle */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{
              width: "800px", height: "800px",
              background: "radial-gradient(ellipse at center, rgba(107,33,168,0.04) 0%, transparent 70%)",
            }}
          />

          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <RevealSection className="text-center mb-20">
              <div className="section-label justify-center mb-6">
                <div className="gold-divider" />
                <span>The Cosmic Method</span>
                <div className="gold-divider" />
              </div>
              <h2
                className="font-display text-white"
                style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "0.08em", lineHeight: 1.1 }}
              >
                PRECISION MEETS POETRY
              </h2>
              <p
                className="font-serif text-xl mt-6 max-w-2xl mx-auto"
                style={{ color: "rgba(200,196,212,0.55)", fontStyle: "italic", fontWeight: 300 }}
              >
                Where ancient starcraft meets the precision of modern astronomical mathematics.
              </p>
            </RevealSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  n: "01",
                  title: "Astronomical Precision",
                  sub: "Direct Ephemeris Calculation",
                  body: "Real-time coordinate queries via Swiss Ephemeris databases rather than generalised sun-sign tables. Every degree, every arc minute — mathematically exact.",
                  icon: (
                    <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
                      <circle cx="20" cy="20" r="18" stroke="rgba(212,175,55,0.4)" strokeWidth="1"/>
                      <circle cx="20" cy="20" r="8" stroke="rgba(212,175,55,0.7)" strokeWidth="1.5"/>
                      <circle cx="20" cy="20" r="2" fill="rgba(212,175,55,0.9)"/>
                      <line x1="20" y1="2" x2="20" y2="10" stroke="rgba(212,175,55,0.5)" strokeWidth="1"/>
                      <line x1="20" y1="30" x2="20" y2="38" stroke="rgba(212,175,55,0.5)" strokeWidth="1"/>
                      <line x1="2" y1="20" x2="10" y2="20" stroke="rgba(212,175,55,0.5)" strokeWidth="1"/>
                      <line x1="30" y1="20" x2="38" y2="20" stroke="rgba(212,175,55,0.5)" strokeWidth="1"/>
                    </svg>
                  ),
                },
                {
                  n: "02",
                  title: "Archetypal Analysis",
                  sub: "Jungian Cosmic Psychology",
                  body: "Poetic interpretations combining classical astrological symbolism with modern depth psychology. Your chart as a map of the psyche — not just personality, but soul.",
                  icon: (
                    <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
                      <circle cx="20" cy="20" r="18" stroke="rgba(212,175,55,0.4)" strokeWidth="1"/>
                      <polygon points="20,5 32,27 8,27" stroke="rgba(212,175,55,0.7)" strokeWidth="1.5" fill="rgba(212,175,55,0.06)"/>
                      <polygon points="20,35 8,13 32,13" stroke="rgba(212,175,55,0.4)" strokeWidth="1" fill="rgba(212,175,55,0.03)"/>
                    </svg>
                  ),
                },
                {
                  n: "03",
                  title: "Sacred Privacy",
                  sub: "Your Cosmos, Your Alone",
                  body: "We collect birth data solely to calculate your charts. Zero third-party brokers, zero ad tracking, zero persistent profiling. Your celestial data is cosmically sealed.",
                  icon: (
                    <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
                      <circle cx="20" cy="20" r="18" stroke="rgba(212,175,55,0.4)" strokeWidth="1"/>
                      <rect x="12" y="18" width="16" height="12" rx="2" stroke="rgba(212,175,55,0.7)" strokeWidth="1.5"/>
                      <path d="M15 18V14a5 5 0 0 1 10 0v4" stroke="rgba(212,175,55,0.5)" strokeWidth="1.5"/>
                      <circle cx="20" cy="24" r="2" fill="rgba(212,175,55,0.7)"/>
                    </svg>
                  ),
                },
              ].map((card, i) => (
                <RevealSection key={card.n} delay={i * 120}>
                  <div className="cosmic-card h-full">
                    {/* Gold number */}
                    <div
                      className="font-display mb-6"
                      style={{
                        fontSize: "2.5rem",
                        color: "rgba(212,175,55,0.12)",
                        lineHeight: 1,
                        letterSpacing: "0.1em",
                      }}
                    >
                      {card.n}
                    </div>
                    {card.icon}
                    <h3
                      className="font-display mt-5 mb-1"
                      style={{ fontSize: "0.75rem", letterSpacing: "0.2em", color: "rgba(248,244,255,0.9)" }}
                    >
                      {card.title}
                    </h3>
                    <div
                      className="mb-4"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.5rem",
                        letterSpacing: "0.2em",
                        color: "rgba(212,175,55,0.5)",
                      }}
                    >
                      {card.sub}
                    </div>
                    <p
                      className="font-serif text-sm leading-relaxed"
                      style={{ color: "rgba(200,196,212,0.5)", fontWeight: 300 }}
                    >
                      {card.body}
                    </p>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            ZODIAC SIGN EXPLORER
            ════════════════════════════════════ */}
        <section
          id="compatibility"
          className="relative py-32 overflow-hidden"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(212,175,55,0.025) 0%, transparent 70%)",
            }}
          />

          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <RevealSection className="text-center mb-16">
              <div className="section-label justify-center mb-6">
                <div className="gold-divider" />
                <span>Your Celestial Identity</span>
                <div className="gold-divider" />
              </div>
              <h2
                className="font-display"
                style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "0.08em", color: "rgba(248,244,255,0.95)" }}
              >
                DISCOVER YOUR SIGN
              </h2>
              <p
                className="font-serif text-lg mt-4 max-w-xl mx-auto"
                style={{ color: "rgba(200,196,212,0.5)", fontStyle: "italic", fontWeight: 300 }}
              >
                Each sign carries ancient wisdom, elemental power, and a unique cosmic signature.
              </p>
            </RevealSection>

            <RevealSection>
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2">
                {ZODIAC_SIGNS.map((z) => (
                  <div
                    key={z.sign}
                    className="relative flex flex-col items-center gap-2 p-3 cursor-pointer group"
                    style={{
                      borderRadius: "2px",
                      border: `1px solid ${hoveredSign === z.sign ? z.color + "40" : "rgba(212,175,55,0.06)"}`,
                      background: hoveredSign === z.sign ? z.glow : "rgba(7,5,26,0.4)",
                      transition: "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
                      transform: hoveredSign === z.sign ? "translateY(-4px) scale(1.05)" : "none",
                      boxShadow: hoveredSign === z.sign ? `0 8px 32px ${z.glow}` : "none",
                    }}
                    onMouseEnter={() => setHoveredSign(z.sign)}
                    onMouseLeave={() => setHoveredSign(null)}
                  >
                    <span
                      className="font-serif text-2xl transition-all duration-300"
                      style={{
                        color: hoveredSign === z.sign ? z.color : "rgba(212,175,55,0.6)",
                        textShadow: hoveredSign === z.sign ? `0 0 20px ${z.color}` : "none",
                        filter: hoveredSign === z.sign ? `drop-shadow(0 0 8px ${z.color})` : "none",
                      }}
                    >
                      {z.char}
                    </span>
                    <span
                      className="font-display text-center leading-tight"
                      style={{
                        fontSize: "0.42rem",
                        letterSpacing: "0.12em",
                        color: hoveredSign === z.sign ? "rgba(248,244,255,0.8)" : "rgba(200,196,212,0.3)",
                      }}
                    >
                      {z.sign.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Sign detail panel */}
              {hoveredSign && (
                <div
                  className="mt-6 p-6 text-center"
                  style={{
                    background: "rgba(7,5,26,0.7)",
                    border: `1px solid ${ZODIAC_SIGNS.find(z => z.sign === hoveredSign)?.color}30`,
                    borderRadius: "2px",
                    animation: "fade-in 0.3s ease",
                  }}
                >
                  {(() => {
                    const z = ZODIAC_SIGNS.find(s => s.sign === hoveredSign)!;
                    return (
                      <div className="flex items-center justify-center gap-6">
                        <span className="font-serif text-4xl" style={{ color: z.color, textShadow: `0 0 30px ${z.color}` }}>{z.char}</span>
                        <div className="text-left">
                          <h3 className="font-display" style={{ fontSize: "0.8rem", letterSpacing: "0.2em", color: z.color }}>
                            {z.sign.toUpperCase()}
                          </h3>
                          <p className="font-serif text-sm" style={{ color: "rgba(200,196,212,0.6)" }}>
                            {z.dates} · {z.element} Sign
                          </p>
                        </div>
                        <Link
                          href="/birth-onboarding"
                          className="btn-cosmic"
                          style={{
                            padding: "0.4rem 1rem",
                            fontSize: "0.55rem",
                            background: `linear-gradient(135deg, ${z.color} 0%, rgba(212,175,55,0.8) 100%)`,
                          }}
                        >
                          CAST MY CHART
                        </Link>
                      </div>
                    );
                  })()}
                </div>
              )}
            </RevealSection>
          </div>
        </section>

        {/* ════════════════════════════════════
            SYNASTRY / COMPATIBILITY TEASER
            ════════════════════════════════════ */}
        <section
          className="relative py-32 overflow-hidden"
          style={{
            background: "linear-gradient(180deg, transparent 0%, rgba(107,33,168,0.04) 40%, rgba(107,33,168,0.04) 60%, transparent 100%)",
            borderTop: "1px solid rgba(212,175,55,0.05)",
            borderBottom: "1px solid rgba(212,175,55,0.05)",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <RevealSection>
                <div className="section-label mb-6">
                  <div className="gold-divider" />
                  <span>Synastry Mapping</span>
                </div>
                <h2
                  className="font-display mb-6"
                  style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "0.08em", lineHeight: 1.1, color: "rgba(248,244,255,0.95)" }}
                >
                  DISCOVER YOUR<br />
                  <span className="text-gold-gradient">COSMIC RESONANCE</span>
                </h2>
                <p
                  className="font-serif text-lg mb-8 leading-relaxed"
                  style={{ color: "rgba(200,196,212,0.55)", fontStyle: "italic", fontWeight: 300 }}
                >
                  Synastry is the ancient study of relationship dynamics through planetary intersections.
                  Map your charts side-by-side to explore chemistry, friction points, and the hidden
                  cosmic architecture of your connection.
                </p>
                <Link href="/birth-onboarding" className="btn-cosmic">
                  BEGIN SYNASTRY RITUAL
                </Link>
              </RevealSection>

              <RevealSection delay={200}>
                <div
                  className="relative p-10 flex flex-col items-center text-center overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, rgba(107,33,168,0.08) 0%, rgba(7,5,26,0.8) 100%)",
                    border: "1px solid rgba(212,175,55,0.12)",
                    borderRadius: "2px",
                  }}
                >
                  {/* Decorative lines */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)" }}
                  />

                  {/* Two overlapping zodiac circles */}
                  <div className="relative flex items-center justify-center mb-8 h-32">
                    <div
                      className="w-28 h-28 rounded-full flex items-center justify-center border animate-breathe"
                      style={{
                        border: "1px solid rgba(212,175,55,0.25)",
                        background: "rgba(212,175,55,0.05)",
                        boxShadow: "0 0 40px rgba(212,175,55,0.1)",
                      }}
                    >
                      <span className="font-serif text-5xl" style={{ color: "rgba(212,175,55,0.7)" }}>♌</span>
                    </div>
                    <div
                      className="-ml-10 w-28 h-28 rounded-full flex items-center justify-center border"
                      style={{
                        border: "1px solid rgba(96,165,250,0.25)",
                        background: "rgba(96,165,250,0.05)",
                        boxShadow: "0 0 40px rgba(96,165,250,0.1)",
                        animation: "celestial-breathe 6s ease-in-out 1s infinite",
                      }}
                    >
                      <span className="font-serif text-5xl" style={{ color: "rgba(96,165,250,0.7)" }}>♒</span>
                    </div>
                    <div
                      className="absolute"
                      style={{
                        width: "1px",
                        height: "60px",
                        background: "linear-gradient(180deg, transparent, rgba(212,175,55,0.5), transparent)",
                        left: "50%",
                      }}
                    />
                  </div>

                  <h3
                    className="font-display mb-3"
                    style={{ fontSize: "0.8rem", letterSpacing: "0.2em", color: "rgba(248,244,255,0.9)" }}
                  >
                    SYNASTRY ALIGNMENT REPORT
                  </h3>
                  <p
                    className="font-serif text-sm mb-6"
                    style={{ color: "rgba(200,196,212,0.45)", fontWeight: 300 }}
                  >
                    Reveal planetary intersections, aspect tensions,
                    and the cosmic blueprint of your relationship.
                  </p>
                  <div
                    className="inline-block px-4 py-2"
                    style={{
                      border: "1px solid rgba(212,175,55,0.15)",
                      fontFamily: "var(--font-display)",
                      fontSize: "0.5rem",
                      letterSpacing: "0.2em",
                      color: "rgba(212,175,55,0.5)",
                    }}
                  >
                    INCLUDED IN PREMIUM COSMIC BLUEPRINT
                  </div>
                </div>
              </RevealSection>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            TESTIMONIALS
            ════════════════════════════════════ */}
        <section id="testimonials" className="relative py-32 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(29,78,216,0.03) 0%, transparent 70%)" }}
          />

          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <RevealSection className="text-center mb-16">
              <div className="section-label justify-center mb-6">
                <div className="gold-divider" />
                <span>What the Stars Reveal</span>
                <div className="gold-divider" />
              </div>
              <h2
                className="font-display"
                style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "0.08em", color: "rgba(248,244,255,0.95)" }}
              >
                COSMIC TESTIMONIALS
              </h2>
            </RevealSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <RevealSection key={i} delay={i * 100}>
                  <div
                    className="relative p-8 h-full flex flex-col"
                    style={{
                      background: "rgba(7,5,26,0.6)",
                      border: "1px solid rgba(212,175,55,0.08)",
                      borderRadius: "2px",
                    }}
                  >
                    {/* Quote mark */}
                    <div
                      className="absolute top-4 right-6 font-serif text-6xl leading-none"
                      style={{ color: "rgba(212,175,55,0.06)" }}
                    >
                      "
                    </div>

                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: t.stars }).map((_, si) => (
                        <span
                          key={si}
                          style={{ color: "#d4af37", fontSize: "10px", textShadow: "0 0 8px rgba(212,175,55,0.6)" }}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    <p
                      className="font-serif text-base leading-relaxed flex-grow mb-6"
                      style={{ color: "rgba(200,196,212,0.65)", fontStyle: "italic", fontWeight: 300 }}
                    >
                      "{t.quote}"
                    </p>

                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)" }}
                      >
                        <span style={{ color: "rgba(212,175,55,0.7)", fontSize: "14px" }}>✦</span>
                      </div>
                      <div>
                        <div
                          className="font-display"
                          style={{ fontSize: "0.6rem", letterSpacing: "0.15em", color: "rgba(248,244,255,0.8)" }}
                        >
                          {t.author}
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "0.45rem",
                            letterSpacing: "0.15em",
                            color: "rgba(212,175,55,0.45)",
                          }}
                        >
                          {t.sign.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            FAQ
            ════════════════════════════════════ */}
        <section id="faq" className="relative py-32">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <RevealSection className="text-center mb-16">
              <div className="section-label justify-center mb-6">
                <div className="gold-divider" />
                <span>Frequently Queried</span>
                <div className="gold-divider" />
              </div>
              <h2
                className="font-display"
                style={{ fontSize: "clamp(2rem, 5vw, 3rem)", letterSpacing: "0.08em", color: "rgba(248,244,255,0.95)" }}
              >
                CELESTIAL ANSWERS
              </h2>
            </RevealSection>

            <RevealSection>
              <div>
                {FAQ.map((item, i) => (
                  <FaqItem key={i} q={item.q} a={item.a} idx={i} />
                ))}
              </div>
            </RevealSection>
          </div>
        </section>

        {/* ════════════════════════════════════
            FINAL CTA
            ════════════════════════════════════ */}
        <section className="relative py-40 overflow-hidden">
          {/* Background */}
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(107,33,168,0.08) 0%, rgba(212,175,55,0.02) 40%, transparent 70%)",
            }}
          />
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)" }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)" }}
          />

          {/* Radial rings */}
          {[200, 280, 360].map((r, i) => (
            <div
              key={r}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
              style={{
                width: `${r * 2}px`,
                height: `${r * 2}px`,
                border: "1px solid rgba(212,175,55,0.04)",
                animation: `spin-slow ${180 + i * 60}s linear ${i % 2 === 0 ? "" : "reverse"} infinite`,
              }}
            />
          ))}

          <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center z-10">
            <RevealSection>
              <div className="section-label justify-center mb-8">
                <div className="gold-divider" />
                <span>Begin Your Journey</span>
                <div className="gold-divider" />
              </div>

              <h2
                className="font-display mb-6"
                style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", letterSpacing: "0.06em", lineHeight: 1, color: "rgba(248,244,255,0.97)" }}
              >
                THE STARS HAVE BEEN
                <br />
                <span className="text-gold-gradient">WAITING FOR YOU</span>
              </h2>

              <p
                className="font-serif text-xl mb-12 max-w-xl mx-auto"
                style={{ color: "rgba(200,196,212,0.5)", fontStyle: "italic", fontWeight: 300 }}
              >
                Cast your celestial blueprint now. Unlock the poetic and psychological
                map written in the stars at the exact moment you arrived.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/birth-onboarding" className="btn-cosmic" style={{ padding: "1.1rem 3rem", fontSize: "0.75rem" }}>
                  ✦ UNLOCK MY CELESTIAL BLUEPRINT
                </Link>
              </div>

              <p
                className="font-serif text-xs mt-6"
                style={{ color: "rgba(200,196,212,0.25)" }}
              >
                Instant access · No account required · ₹99 for full cosmic report
              </p>
            </RevealSection>
          </div>
        </section>
      </main>

      {/* ════════════════════════════════════
          FOOTER
          ════════════════════════════════════ */}
      <footer
        className="relative py-16"
        style={{ borderTop: "1px solid rgba(212,175,55,0.08)", background: "rgba(0,0,10,0.9)" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div
                className="font-display mb-2"
                style={{ fontSize: "0.9rem", letterSpacing: "0.3em", color: "rgba(212,175,55,0.8)" }}
              >
                ZYGNAL ASTRO
              </div>
              <div className="gold-divider mb-4" />
              <p
                className="font-serif text-sm leading-relaxed"
                style={{ color: "rgba(200,196,212,0.35)", fontStyle: "italic", fontWeight: 300 }}
              >
                A cinematic celestial portal combining sacred astrology symbolism,
                precise astronomical mathematics, and emotionally intelligent insight.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <div
                className="font-display mb-4"
                style={{ fontSize: "0.55rem", letterSpacing: "0.25em", color: "rgba(212,175,55,0.5)" }}
              >
                NAVIGATION
              </div>
              <div className="flex flex-col gap-2">
                {["Birth Chart", "Compatibility", "Cosmic Insights", "Testimonials", "FAQ"].map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="nav-link text-left"
                    style={{ display: "inline-block", paddingBottom: "2px" }}
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>

            {/* Legal */}
            <div>
              <div
                className="font-display mb-4"
                style={{ fontSize: "0.55rem", letterSpacing: "0.25em", color: "rgba(212,175,55,0.5)" }}
              >
                COSMIC CHARTER
              </div>
              <div className="flex flex-col gap-2">
                {["Privacy Charter", "Terms of Alignment", "Astronomical API", "Support"].map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="nav-link text-left"
                    style={{ display: "inline-block", paddingBottom: "2px" }}
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div
            className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ borderTop: "1px solid rgba(212,175,55,0.06)" }}
          >
            <p
              className="font-serif text-xs"
              style={{ color: "rgba(200,196,212,0.25)", fontStyle: "italic" }}
            >
              © 2026 Zygnal Astro · All rights cosmic · Written in starlight.
            </p>
            <div className="flex items-center gap-2">
              <div
                className="w-1 h-1 rounded-full"
                style={{ background: "rgba(212,175,55,0.4)", boxShadow: "0 0 6px rgba(212,175,55,0.4)" }}
              />
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.45rem",
                  letterSpacing: "0.2em",
                  color: "rgba(212,175,55,0.3)",
                }}
              >
                CELESTIAL ENGINE v2.0
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
