"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import AstroWheel from "./AstroWheel";

/* ═══════════════════════════════════════════════════
   ZYGNAL ASTRO — CINEMATIC HERO SECTION
   ═══════════════════════════════════════════════════ */

// Precomputed foreground star positions (no Math.random at render)
const FOREGROUND_STARS = [
  { x: "8%",  y: "22%", size: 3, delay: 0 },
  { x: "91%", y: "15%", size: 2, delay: 1.2 },
  { x: "15%", y: "68%", size: 4, delay: 0.5 },
  { x: "85%", y: "72%", size: 2.5, delay: 2 },
  { x: "4%",  y: "45%", size: 1.5, delay: 0.8 },
  { x: "95%", y: "40%", size: 3, delay: 1.5 },
  { x: "22%", y: "85%", size: 2, delay: 0.3 },
  { x: "78%", y: "88%", size: 1.5, delay: 2.5 },
  { x: "48%", y: "5%",  size: 2.5, delay: 1.0 },
  { x: "55%", y: "92%", size: 2, delay: 1.8 },
];

// Light ray angles
const LIGHT_RAYS = [
  { deg: -65, opacity: 0.06, width: "1px", height: "120vh", left: "48%" },
  { deg: -58, opacity: 0.04, width: "2px", height: "110vh", left: "50%" },
  { deg: -72, opacity: 0.03, width: "1px", height: "130vh", left: "46%" },
  { deg: -50, opacity: 0.03, width: "1px", height: "100vh", left: "52%" },
];

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMouseX((e.clientX - rect.left) / rect.width - 0.5);
      setMouseY((e.clientY - rect.top) / rect.height - 0.5);
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const parallaxStyle = (depth: number) => ({
    transform: `translate(${mouseX * depth}px, ${mouseY * depth}px)`,
    transition: "transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)",
  });

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "radial-gradient(ellipse 120% 80% at 50% 30%, rgba(15,10,40,0.95) 0%, rgba(0,0,10,1) 70%)" }}
    >
      {/* ─── Deep Space Gradient Background ─── */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 100% 60% at 50% 0%, rgba(107,33,168,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 60% 40% at 80% 80%, rgba(29,78,216,0.08) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 50% 35% at 10% 60%, rgba(190,24,93,0.06) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* ─── Grid Lines (barely visible) ─── */}
      <div
        className="absolute inset-0 z-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ─── Volumetric Light Rays ─── */}
      {LIGHT_RAYS.map((ray, i) => (
        <div
          key={`ray-${i}`}
          className="absolute top-0 pointer-events-none z-[1]"
          style={{
            left: ray.left,
            width: ray.width,
            height: ray.height,
            background: `linear-gradient(180deg, rgba(212,175,55,${ray.opacity}) 0%, rgba(212,175,55,${ray.opacity * 0.3}) 50%, transparent 100%)`,
            transform: `rotate(${ray.deg}deg)`,
            transformOrigin: "top center",
            animationDelay: `${i * 1.5}s`,
          }}
        />
      ))}

      {/* ─── Partial Planet (top-right, foreground) ─── */}
      <div
        className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none z-[2]"
        style={{
          background:
            "radial-gradient(ellipse at 30% 40%, rgba(107,33,168,0.15) 0%, rgba(60,20,100,0.08) 40%, transparent 70%)",
          border: "1px solid rgba(107,33,168,0.08)",
          ...parallaxStyle(-15),
        }}
      />

      {/* ─── Foreground Star Points ─── */}
      {FOREGROUND_STARS.map((star, i) => (
        <div
          key={`fstar-${i}`}
          className="absolute rounded-full pointer-events-none z-[3]"
          style={{
            left: star.x,
            top: star.y,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: "#ffffff",
            boxShadow: `0 0 ${star.size * 4}px rgba(212,175,55,0.8), 0 0 ${star.size * 8}px rgba(212,175,55,0.3)`,
            animation: `twinkle ${2 + star.delay}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}

      {/* ─── Atmospheric Glow Behind Content ─── */}
      <div
        className="absolute z-[4] rounded-full pointer-events-none"
        style={{
          width: "600px",
          height: "600px",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(ellipse at center, rgba(212,175,55,0.04) 0%, rgba(107,33,168,0.03) 40%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* ─── Main Content Grid ─── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center min-h-[85vh]">

          {/* ─── LEFT: Typography & CTA ─── */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start space-y-8 text-center lg:text-left">

            {/* Constellation badge */}
            <div
              className={`inline-flex items-center gap-3 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: "100ms" }}
            >
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="constellation-dot"
                    style={{ animationDelay: `${i * 0.4}s` }}
                  />
                ))}
              </div>
              <span className="section-label" style={{ color: "rgba(212,175,55,0.7)" }}>
                Celestial Intelligence • Sacred Geometry
              </span>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="constellation-dot"
                    style={{ animationDelay: `${i * 0.4 + 0.2}s` }}
                  />
                ))}
              </div>
            </div>

            {/* Headline */}
            <div
              className={`transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: "250ms" }}
            >
              <h1
                className="font-display text-white leading-none tracking-wide"
                style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)", lineHeight: 1.05 }}
              >
                <span className="block text-white/90 mb-2">YOUR</span>
                <span className="block text-gold-gradient" style={{ fontStyle: "italic", letterSpacing: "0.05em" }}>
                  CELESTIAL
                </span>
                <span className="block text-white/90">BLUEPRINT</span>
              </h1>
            </div>

            {/* Gold divider */}
            <div
              className={`transition-all duration-700 ${mounted ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`}
              style={{ transitionDelay: "500ms" }}
            >
              <div className="gold-divider" />
            </div>

            {/* Subtitle */}
            <p
              className={`font-serif text-xl leading-relaxed max-w-xl transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{
                color: "rgba(200,196,212,0.75)",
                transitionDelay: "600ms",
                fontStyle: "italic",
                fontWeight: 300,
              }}
            >
              Where sacred astronomical mathematics meets the poetry of your soul.
              Unlock the exact configuration of the cosmos at your birth — and discover
              who you were always meant to become.
            </p>

            {/* Cosmic stats */}
            <div
              className={`flex gap-8 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: "750ms" }}
            >
              {[
                { val: "47K+", label: "Blueprints Cast" },
                { val: "12", label: "Sacred Houses" },
                { val: "99.8%", label: "Accuracy" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="font-display text-2xl font-semibold text-gold-gradient">{stat.val}</div>
                  <div className="text-xs tracking-widest uppercase" style={{ color: "rgba(200,196,212,0.4)", fontFamily: "var(--font-display)" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div
              className={`flex flex-col sm:flex-row items-center lg:items-start gap-4 w-full transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: "900ms" }}
            >
              <Link href="/birth-onboarding" className="btn-cosmic">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" />
                  <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" />
                  <line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" />
                </svg>
                BEGIN YOUR ALIGNMENT
              </Link>
              <a href="#insights" className="btn-ghost">
                EXPLORE THE COSMOS
              </a>
            </div>

            {/* Trust signal */}
            <p
              className="font-serif text-xs italic"
              style={{ color: "rgba(200,196,212,0.35)", transitionDelay: "1000ms" }}
            >
              ✦ No credit card required ✦ Instant celestial snapshot ✦ Secured by cosmic intention
            </p>
          </div>

          {/* ─── RIGHT: Astro Wheel ─── */}
          <div
            className="lg:col-span-6 flex justify-center items-center relative"
            style={parallaxStyle(12)}
          >
            {/* Wheel outer aura rings */}
            <div
              className="absolute rounded-full animate-breathe pointer-events-none"
              style={{
                width: "620px", height: "620px",
                background: "radial-gradient(ellipse at center, rgba(212,175,55,0.04) 0%, transparent 65%)",
              }}
            />
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: "560px", height: "560px",
                border: "1px solid rgba(212,175,55,0.05)",
                animation: "spin-slow 240s linear infinite",
              }}
            />
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: "580px", height: "580px",
                background: "radial-gradient(ellipse at 40% 30%, rgba(107,33,168,0.06) 0%, transparent 60%)",
              }}
            />

            {/* The wheel itself */}
            <div className="relative w-full max-w-[520px]" style={parallaxStyle(6)}>
              <AstroWheel />
            </div>

            {/* Floating zodiac fragments */}
            {[
              { char: "♈", top: "5%",  right: "0%",  size: 24, delay: 0 },
              { char: "♌", top: "85%", left:  "2%",  size: 20, delay: 1.5 },
              { char: "♏", top: "15%", left:  "0%",  size: 22, delay: 0.8 },
              { char: "♓", top: "80%", right: "3%",  size: 20, delay: 2.2 },
            ].map((frag, i) => (
              <div
                key={`frag-${i}`}
                className="absolute font-serif pointer-events-none"
                style={{
                  ...frag,
                  fontSize: `${frag.size}px`,
                  color: "rgba(212,175,55,0.15)",
                  animation: `float-up 8s ease-in-out ${frag.delay}s infinite`,
                  textShadow: "0 0 20px rgba(212,175,55,0.3)",
                }}
              >
                {frag.char}
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ─── Bottom fade ─── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10"
        style={{ background: "linear-gradient(transparent, rgba(0,0,10,0.9))" }}
      />

      {/* ─── Scroll indicator ─── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <span className="section-label text-[0.5rem]" style={{ color: "rgba(212,175,55,0.3)" }}>
          DESCEND INTO YOUR COSMOS
        </span>
        <div
          className="w-px h-12"
          style={{
            background: "linear-gradient(180deg, rgba(212,175,55,0.5), transparent)",
            animation: "float-up 2s ease-in-out infinite",
          }}
        />
      </div>
    </section>
  );
}
