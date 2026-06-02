"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════
   ZYGNAL ASTRO — LUXURY CELESTIAL NAVBAR
   ═══════════════════════════════════════════════════ */

const NAV_LINKS = [
  { label: "Origin",      href: "/" },
  { label: "Birth Chart", href: "/birth-onboarding" },
  { label: "Synastry",    href: "#compatibility" },
  { label: "Cosmos",      href: "#insights" },
  { label: "Alignment",   href: "#testimonials" },
  { label: "Oracle",      href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-700"
        style={{ paddingTop: scrolled ? "0" : "16px" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="relative flex h-16 items-center justify-between px-6 transition-all duration-700"
            style={{
              borderRadius: scrolled ? "0" : "4px",
              background: scrolled
                ? "rgba(0, 0, 10, 0.92)"
                : "rgba(7, 5, 26, 0.55)",
              backdropFilter: "blur(24px) saturate(1.8)",
              WebkitBackdropFilter: "blur(24px) saturate(1.8)",
              border: `1px solid rgba(212,175,55,${scrolled ? "0.15" : "0.1"})`,
              borderTop: scrolled ? "none" : undefined,
              boxShadow: scrolled
                ? "0 4px 40px rgba(0,0,0,0.6), 0 0 1px rgba(212,175,55,0.1)"
                : "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(212,175,55,0.08)",
            }}
          >
            {/* Top gold border line */}
            <div
              className="absolute top-0 left-[10%] right-[10%] h-px pointer-events-none"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), rgba(212,175,55,0.8), rgba(212,175,55,0.5), transparent)",
                opacity: scrolled ? 0.4 : 0.7,
                transition: "opacity 0.5s ease",
              }}
            />

            {/* ─── Logo ─── */}
            <Link
              href="/"
              className="flex items-center gap-3 group"
              onClick={() => setActiveLink("/")}
            >
              {/* Sacred geometry logo mark */}
              <div className="relative w-8 h-8 flex-shrink-0">
                <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8 group-hover:rotate-[30deg] transition-transform duration-700">
                  <circle cx="16" cy="16" r="14" stroke="rgba(212,175,55,0.4)" strokeWidth="0.8"/>
                  <circle cx="16" cy="16" r="10" stroke="rgba(212,175,55,0.25)" strokeWidth="0.5"/>
                  <polygon points="16,4 27,22 5,22" stroke="rgba(212,175,55,0.7)" strokeWidth="1" fill="rgba(212,175,55,0.06)"/>
                  <polygon points="16,28 5,10 27,10" stroke="rgba(212,175,55,0.4)" strokeWidth="0.8" fill="rgba(212,175,55,0.03)"/>
                  <circle cx="16" cy="16" r="3" fill="rgba(212,175,55,0.9)"/>
                </svg>
              </div>

              <div>
                <div
                  className="font-display tracking-[0.25em] text-transparent bg-clip-text"
                  style={{
                    fontSize: "0.75rem",
                    background: "linear-gradient(135deg, #fdf6d8, #d4af37, #e8c958)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  ZYGNAL
                </div>
                <div
                  style={{
                    fontSize: "0.5rem",
                    letterSpacing: "0.35em",
                    color: "rgba(212,175,55,0.45)",
                    fontFamily: "var(--font-display)",
                    lineHeight: 1,
                  }}
                >
                  ASTRO
                </div>
              </div>
            </Link>

            {/* ─── Nav Links ─── */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="nav-link"
                  onClick={() => setActiveLink(link.href)}
                  style={{
                    color: activeLink === link.href
                      ? "rgba(212,175,55,0.9)"
                      : "rgba(200,196,212,0.55)",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* ─── Right Actions ─── */}
            <div className="flex items-center gap-4">
              {/* Planet indicator */}
              <div className="hidden md:flex items-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full animate-breathe"
                  style={{ background: "rgba(212,175,55,0.8)", boxShadow: "0 0 8px rgba(212,175,55,0.6)" }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.45rem",
                    letterSpacing: "0.2em",
                    color: "rgba(212,175,55,0.4)",
                  }}
                >
                  LIVE CELESTIAL FEED
                </span>
              </div>

              <Link
                href="/birth-onboarding"
                className="btn-cosmic"
                style={{ padding: "0.5rem 1.2rem", fontSize: "0.55rem" }}
              >
                BEGIN RITUAL
              </Link>

              {/* Mobile menu button */}
              <button
                className="lg:hidden flex flex-col gap-1.5 p-1"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="block h-px w-5 transition-all duration-300"
                    style={{
                      background: "rgba(212,175,55,0.7)",
                      transform: mobileOpen
                        ? i === 0 ? "rotate(45deg) translateY(6px)"
                        : i === 1 ? "scaleX(0)"
                        : "rotate(-45deg) translateY(-6px)"
                        : "none",
                    }}
                  />
                ))}
              </button>
            </div>
          </div>
        </div>

        {/* ─── Mobile Menu ─── */}
        <div
          className="lg:hidden mx-4 overflow-hidden transition-all duration-500"
          style={{
            maxHeight: mobileOpen ? "400px" : "0",
            opacity: mobileOpen ? 1 : 0,
          }}
        >
          <div
            className="mt-2 rounded-sm px-6 py-4 flex flex-col gap-4"
            style={{
              background: "rgba(7,5,26,0.95)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(212,175,55,0.12)",
              borderTop: "1px solid rgba(212,175,55,0.3)",
            }}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link text-left"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </header>
    </>
  );
}
