/* src/app/report/[token]/page.tsx */
"use client";

import React, { useState, useEffect } from "react";
import ForecastCard from "@/components/ui/ForecastCard";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "@/components/ui/Navbar";

// Dynamically import AstroWheel client side to prevent server hydration mismatch
const AstroWheel = dynamic(() => import("@/components/ui/AstroWheel"), { ssr: false });
const CosmicBackground = dynamic(() => import("@/components/ui/CosmicBackground"), { ssr: false });

const ZODIAC_GLOWS: Record<string, { accent: string; glow: string; gradient: string }> = {
  Aries:       { accent: "#ef4444", glow: "rgba(239,68,68,0.15)",   gradient: "rgba(239,68,68,0.06)" },
  Taurus:      { accent: "#84cc16", glow: "rgba(132,204,22,0.15)",  gradient: "rgba(132,204,22,0.06)" },
  Gemini:      { accent: "#fbbf24", glow: "rgba(251,191,36,0.15)",  gradient: "rgba(251,191,36,0.06)" },
  Cancer:      { accent: "#60a5fa", glow: "rgba(96,165,250,0.15)",  gradient: "rgba(96,165,250,0.06)" },
  Leo:         { accent: "#f97316", glow: "rgba(249,115,22,0.15)",  gradient: "rgba(249,115,22,0.06)" },
  Virgo:       { accent: "#86efac", glow: "rgba(134,239,172,0.15)", gradient: "rgba(134,239,172,0.06)" },
  Libra:       { accent: "#f0abfc", glow: "rgba(240,171,252,0.15)", gradient: "rgba(240,171,252,0.06)" },
  Scorpio:     { accent: "#dc2626", glow: "rgba(220,38,38,0.15)",   gradient: "rgba(220,38,38,0.06)" },
  Sagittarius: { accent: "#c084fc", glow: "rgba(192,132,252,0.15)", gradient: "rgba(192,132,252,0.06)" },
  Capricorn:   { accent: "#94a3b8", glow: "rgba(148,163,184,0.15)", gradient: "rgba(148,163,184,0.06)" },
  Aquarius:    { accent: "#38bdf8", glow: "rgba(56,189,248,0.15)",  gradient: "rgba(56,189,248,0.06)" },
  Pisces:      { accent: "#818cf8", glow: "rgba(129,140,248,0.15)", gradient: "rgba(129,140,248,0.06)" },
};

const DEFAULT_GLOW = { accent: "#d4af37", glow: "rgba(212,175,55,0.15)", gradient: "rgba(212,175,55,0.06)" };

export default function ReportPage() {
  const params = useParams();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Recovery utility states
  const [copiedLink, setCopiedLink] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);

  // Tab controls
  const [activeIdentityTab, setActiveIdentityTab] = useState<"sun" | "moon" | "rising">("sun");
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<"personality" | "career" | "relationships" | "purpose">("personality");
  const [activeMainTab, setActiveMainTab] = useState<'report' | 'forecast'>('report');
  const [forecast, setForecast] = useState<any>(null);

  useEffect(() => {
    if (!token) return;

    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/reports/${token}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Astrology blueprint not found. Please verify your token.");
          }
          throw new Error("Failed to load blueprint details.");
        }
        const data = await res.json();
        
        // If the report status is still queuing/processing, poll again
        if (data.status === "QUEUED" || data.status === "PROCESSING") {
          setTimeout(fetchReport, 2000);
        } else {
          setReport(data);
          setLoading(false);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "An unexpected error occurred.");
        setLoading(false);
      }
    };

    fetchReport();
  }, [token]);

  // Fetch forecast when forecast tab active
  useEffect(() => {
    if (activeMainTab !== 'forecast' || !token) return;
    const fetchForecast = async () => {
      try {
        const res = await fetch(`/api/reports/${token}/forecast`);
        if (!res.ok) throw new Error('Failed to load forecast');
        const data = await res.json();
        setForecast(data);
      } catch (err) {
        console.error('Forecast fetch error:', err);
      }
    };
    fetchForecast();
  }, [activeMainTab, token]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#030114] text-[#f8f4ff] font-serif relative overflow-hidden flex flex-col items-center justify-center p-6">
        <CosmicBackground />
        <div className="z-10 text-center space-y-6">
          {/* Cosmic Loader Rings */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#d4af37]/20 animate-spin" style={{ animationDuration: "12s" }} />
            <div className="absolute inset-2 rounded-full border border-double border-[#d4af37]/45 animate-spin" style={{ animationDuration: "8s", animationDirection: "reverse" }} />
            <div className="absolute inset-4 rounded-full border border-[#d4af37] animate-pulse" />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-display tracking-widest text-[#d4af37] animate-pulse">
              ✦
            </span>
          </div>
          <h2 className="text-2xl tracking-widest font-display text-[#d4af37] uppercase">ALIGNING THE STARS</h2>
          <p className="text-xs text-[#c8c4d4]/60 max-w-sm mx-auto font-sans leading-relaxed tracking-wider">
            Fetching celestial ephemeris alignments and writing permanent blueprint narratives to memory...
          </p>
        </div>
      </main>
    );
  }

  if (error || !report) {
    return (
      <main className="min-h-screen bg-[#030114] text-[#f8f4ff] font-serif relative overflow-hidden flex flex-col items-center justify-center p-6">
        <CosmicBackground />
        <div className="z-10 text-center max-w-md p-8 border border-red-900/30 bg-black/60 backdrop-blur-md space-y-6">
          <span className="text-4xl text-red-500 block">⚠️</span>
          <h2 className="text-xl font-display tracking-wider uppercase text-red-400">BLUEPRINT OFFLINE</h2>
          <p className="text-sm text-[#c8c4d4]/70 leading-relaxed">
            {error || "We could not retrieve this astrological profile from the archives."}
          </p>
          <a href="/birth-onboarding" className="btn-cosmic inline-block py-3 px-8 text-xs font-display">
            BEGIN NEW RITUAL
          </a>
        </div>
      </main>
    );
  }

  // Derive zodiac alignments and details
  const sunSign = report.narrative?.sunSign || "Leo";
  const zodiacTheme = ZODIAC_GLOWS[sunSign] || DEFAULT_GLOW;

  // Print-to-PDF utility
  const handlePrint = () => {
    window.print();
  };

  // Re-trigger access email delivery
  const handleSendEmailCopy = async () => {
    if (resendingEmail) return;
    setResendingEmail(true);
    try {
      const res = await fetch(`/api/reports/${token}/email`, {
        method: "POST",
      });
      if (!res.ok) throw new Error();
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 4000);
    } catch {
      alert("Could not transmit backup email copy.");
    } finally {
      setResendingEmail(false);
    }
  };

  // Copy share recovery url
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + `/report/${token}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const birthYear = report.birthData?.year || 1996;
  const birthMonth = report.birthData?.month !== undefined ? report.birthData.month + 1 : 11;
  const birthDay = report.birthData?.day || 11;
  const birthLocation = report.birthData?.location || "Cosmic Space";
  const birthTime = `${report.birthData?.hour || 12}:${String(report.birthData?.minute || 0).padStart(2, "0")} ${report.birthData?.ampm || "PM"}`;

  return (
    <main className="min-h-screen bg-[#030114] text-[#f8f4ff] font-serif relative overflow-x-hidden flex flex-col">
      <CosmicBackground />
      <Navbar />

      {/* Dynamic Cosmic Backing Glow */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none z-0 filter blur-[100px] opacity-40 transition-all duration-1000"
        style={{ background: `radial-gradient(ellipse at center, ${zodiacTheme.glow} 0%, transparent 70%)` }}
      />
      <div
        className="absolute bottom-20 left-0 w-[400px] h-[400px] rounded-full pointer-events-none z-0 filter blur-[80px] opacity-30 transition-all duration-1000"
        style={{ background: `radial-gradient(ellipse at center, ${zodiacTheme.glow} 0%, transparent 70%)` }}
      />

      <div className="relative w-full max-w-7xl mx-auto px-6 py-12 z-10 flex-grow print:p-0 print:max-w-full">
        {/* Header Ribbon / Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-[#d4af37]/15 mb-12 print:hidden">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: zodiacTheme.accent }} />
              <span className="text-xs font-display tracking-widest text-[#c8c4d4]/65 uppercase">CELESTIAL PROFILE ACTIVE</span>
            </div>
            <h1 className="text-4xl tracking-widest font-display text-transparent bg-clip-text bg-gradient-to-r from-[#f8f4ff] via-[#d4af37] to-[#f8f4ff]">
              THE CELESTIAL BLUEPRINT
            </h1>
          </div>

          {/* Core Access Controls */}
          <div className="relative z-50 flex flex-wrap items-center gap-3">
            <button onClick={handlePrint} className="btn-cosmic flex items-center gap-2 py-3 px-6 text-xs font-display">
              <span>📥</span> PRINT / DOWNLOAD PDF
            </button>
            <button onClick={handleSendEmailCopy} className="btn-cosmic flex items-center gap-2 py-3 px-6 text-xs font-display">
              <span>📧</span> {emailSent ? "EMAIL TRANSMITTED!" : "SEND EMAIL COPY"}
            </button>
            <button onClick={handleCopyLink} className="btn-cosmic flex items-center gap-2 py-3 px-6 text-xs font-display" style={{ border: `1px solid ${copiedLink ? zodiacTheme.accent : "rgba(212,175,55,0.12)"}` }}>
              <span>🔗</span> {copiedLink ? "COPIED TO CLIPBOARD!" : "COPY SHARE LINK"}
            </button>
          </div>
        </div>

        {/* PRINT BANNER ONLY SHOWN IN PDF PRINT MODE */}
        <div className="hidden print:block text-center space-y-4 pb-8 mb-12 border-b-2 border-black">
          <h1 className="text-5xl font-display uppercase tracking-widest text-black">ZYGNAL ASTRO</h1>
          <h2 className="text-2xl font-serif italic text-black">Your Permanent Natal Astrology Blueprint</h2>
          <div className="text-xs text-gray-600 grid grid-cols-2 gap-4 max-w-xl mx-auto pt-4">
            <div><strong>Explorer:</strong> {report.birthData?.email || "Cosmic Soul"}</div>
            <div><strong>Coordinates:</strong> {birthLocation}</div>
            <div><strong>Timestamp:</strong> {birthMonth}/{birthDay}/{birthYear} @ {birthTime}</div>
            <div><strong>Profile Signature:</strong> {token}</div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            GRID BLOCK 1: ASTROWHEEL & METRICS
            ══════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-center print:block print:space-y-12">
          {/* Wheel wrapper */}
          <div className="lg:col-span-6 flex justify-center print:w-full print:mx-auto">
            <div className="relative p-6 bg-black/45 border border-[#d4af37]/12 rounded-lg backdrop-blur-sm print:border-none print:bg-transparent">
              <AstroWheel />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-black/60 border border-[#d4af37]/20 flex items-center justify-center animate-pulse">
                  <span className="text-2xl text-[#d4af37] font-display">✦</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live natal calculations table */}
          <div className="lg:col-span-6 space-y-6 print:w-full">
            <div className="p-8 bg-black/65 border border-[#d4af37]/12 rounded-lg backdrop-blur-md print:bg-white print:text-black print:border-2 print:border-black">
              <div className="flex justify-between items-center mb-6 border-b border-[#d4af37]/15 pb-4 print:border-black">
                <h2 className="text-lg tracking-widest font-display text-[#d4af37] uppercase print:text-black">
                  NATAL SPATIAL COORDINATES
                </h2>
                <span className="text-[10px] font-display tracking-widest text-[#c8c4d4]/50 uppercase print:hidden">
                  ACTIVE SYNASTRY METRIC
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-xs border-b border-[#d4af37]/8 pb-6 print:border-black">
                <div>
                  <span className="block text-[9px] font-display uppercase text-[#c8c4d4]/55 print:text-gray-600 mb-1">ORIGIN DATE</span>
                  <span className="font-serif text-sm font-semibold">{birthMonth}/{birthDay}/{birthYear}</span>
                </div>
                <div>
                  <span className="block text-[9px] font-display uppercase text-[#c8c4d4]/55 print:text-gray-600 mb-1">ORIGIN TIME</span>
                  <span className="font-serif text-sm font-semibold">{birthTime} ({report.birthData?.confidence || "Exact"})</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-[9px] font-display uppercase text-[#c8c4d4]/55 print:text-gray-600 mb-1">GEOGRAPHIC LOCATION</span>
                  <span className="font-serif text-sm font-semibold truncate block">{birthLocation}</span>
                </div>
              </div>

              {/* Planets mapping table */}
              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 print:max-h-none print:overflow-visible">
                {(report.calculations || []).map((p: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center pb-2 border-b border-[#d4af37]/5 text-sm print:border-gray-300 print:text-black">
                    <div className="flex items-center gap-2">
                      <span className="text-[#d4af37] font-semibold print:text-black">✦</span>
                      <span className="font-serif font-medium">{p.name}</span>
                    </div>
                    <span className="font-sans text-xs text-[#c8c4d4]/70 print:text-black">
                      {p.sign} {p.deg}
                    </span>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#d4af37]/90 print:bg-transparent print:border-none print:text-black">
                      {p.house}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            GRID BLOCK 2: CORE IDENTITY TABS
            ══════════════════════════════════════ */}
        <div className="mb-12 print:block print:space-y-12">
          <div className="p-8 bg-black/60 border border-[#d4af37]/12 rounded-lg backdrop-blur-md print:bg-white print:text-black print:border-2 print:border-black">
            {/* Tabs Trigger */}
            <div className="flex border-b border-[#d4af37]/15 pb-px mb-8 print:hidden">
              {[
                { id: "sun", label: `☉ SUN SIGN: ${report.narrative?.sunSign || "Aries"}` },
                { id: "moon", label: `☽ MOON SIGN: ${report.narrative?.moonSign || "Leo"}` },
                { id: "rising", label: `✦ RISING SIGN: ${report.narrative?.risingSign || "Libra"}` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveIdentityTab(tab.id as any)}
                  className="flex-1 py-4 text-center font-display text-[10px] sm:text-xs tracking-widest uppercase transition-all duration-300 outline-none"
                  style={{
                    color: activeIdentityTab === tab.id ? zodiacTheme.accent : "rgba(200,196,212,0.45)",
                    borderBottom: activeIdentityTab === tab.id ? `2px solid ${zodiacTheme.accent}` : "none",
                    fontWeight: activeIdentityTab === tab.id ? "bold" : "normal"
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Core identity detailed contents */}
            <div className="space-y-6">
              {/* Tab: Sun Sign */}
              {(activeIdentityTab === "sun" || typeof window !== "undefined" && window.matchMedia && window.matchMedia("print").matches) && (
                <div className={`space-y-4 print:block ${activeIdentityTab === "sun" ? "block" : "hidden print:block"}`}>
                  <h3 className="text-2xl font-display text-[#d4af37] uppercase flex items-center gap-2 print:text-black">
                    ☉ The Solar Spark: Conscious Purpose ({report.narrative?.sunSign})
                  </h3>
                  <p className="text-sm font-semibold tracking-wider italic text-[#c8c4d4]/80 print:text-gray-800">
                    "{report.narrative?.sunIntro}"
                  </p>
                  <p className="text-sm leading-relaxed text-[#c8c4d4]/65 font-serif font-light text-justify print:text-black">
                    {report.narrative?.sunDetails}
                  </p>
                </div>
              )}

              {/* Tab: Moon Sign */}
              {(activeIdentityTab === "moon" || typeof window !== "undefined" && window.matchMedia && window.matchMedia("print").matches) && (
                <div className={`space-y-4 print:block ${activeIdentityTab === "moon" ? "block" : "hidden print:block"} print:pt-6 print:border-t print:border-gray-300`}>
                  <h3 className="text-2xl font-display text-[#d4af37] uppercase flex items-center gap-2 print:text-black">
                    ☽ The Lunar Tide: Emotional Landscape ({report.narrative?.moonSign})
                  </h3>
                  <p className="text-sm font-semibold tracking-wider italic text-[#c8c4d4]/80 print:text-gray-800">
                    "{report.narrative?.moonIntro}"
                  </p>
                  <p className="text-sm leading-relaxed text-[#c8c4d4]/65 font-serif font-light text-justify print:text-black">
                    {report.narrative?.moonDetails}
                  </p>
                </div>
              )}

              {/* Tab: Rising Sign */}
              {(activeIdentityTab === "rising" || typeof window !== "undefined" && window.matchMedia && window.matchMedia("print").matches) && (
                <div className={`space-y-4 print:block ${activeIdentityTab === "rising" ? "block" : "hidden print:block"} print:pt-6 print:border-t print:border-gray-300`}>
                  <h3 className="text-2xl font-display text-[#d4af37] uppercase flex items-center gap-2 print:text-black">
                    ✦ The Ascendant Lens: Outer Gateway ({report.narrative?.risingSign})
                  </h3>
                  <p className="text-sm font-semibold tracking-wider italic text-[#c8c4d4]/80 print:text-gray-800">
                    "{report.narrative?.risingIntro}"
                  </p>
                  <p className="text-sm leading-relaxed text-[#c8c4d4]/65 font-serif font-light text-justify print:text-black">
                    {report.narrative?.risingDetails}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            GRID BLOCK 3: DETAILED DEEP-DIVES
            ══════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 print:block print:space-y-12">
          {/* Tabs Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-2 print:hidden">
            {[
              { id: "personality", label: "Ⅰ. PERSONALITY BLUEPRINT" },
              { id: "career", label: "Ⅱ. CAREER & WEALTH GENERATION" },
              { id: "relationships", label: "Ⅲ. RELATIONSHIPS & LOVE STYLE" },
              { id: "purpose", label: "Ⅳ. LIFE PURPOSE & DESTINY" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveAnalysisTab(tab.id as any)}
                className="py-4 px-6 text-left font-display text-xs tracking-widest uppercase transition-all duration-300 rounded outline-none border border-[#d4af37]/8 hover:border-[#d4af37]/35"
                style={{
                  color: activeAnalysisTab === tab.id ? "#000" : "rgba(200,196,212,0.65)",
                  background: activeAnalysisTab === tab.id ? zodiacTheme.accent : "rgba(7,5,26,0.55)",
                  borderColor: activeAnalysisTab === tab.id ? zodiacTheme.accent : "rgba(212,175,55,0.08)",
                  boxShadow: activeAnalysisTab === tab.id ? `0 0 20px ${zodiacTheme.glow}` : "none"
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Deep-dive content card */}
          <div className="lg:col-span-8 p-8 bg-black/65 border border-[#d4af37]/12 rounded-lg backdrop-blur-md print:bg-white print:text-black print:border-2 print:border-black">
            <div className="space-y-8">
              {/* Module: Personality */}
              {(activeAnalysisTab === "personality" || typeof window !== "undefined" && window.matchMedia && window.matchMedia("print").matches) && (
                <div className={`space-y-6 print:block ${activeAnalysisTab === "personality" ? "block" : "hidden print:block"}`}>
                  <h3 className="text-2xl font-display text-[#d4af37] uppercase border-b border-[#d4af37]/15 pb-4 print:text-black print:border-black">
                    Ⅰ. Personality Analysis
                  </h3>
                  <p className="text-sm leading-relaxed text-[#c8c4d4]/65 print:text-black">
                    {report.narrative?.personalityOverview}
                  </p>
                  
                  {/* Strengths & Weaknesses Grids */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 print:grid-cols-2">
                    {/* Strengths */}
                    <div className="p-5 bg-emerald-950/15 border border-emerald-900/20 rounded print:border-black print:bg-gray-100 print:text-black">
                      <h4 className="text-xs font-display tracking-wider text-emerald-400 uppercase mb-3 print:text-black print:font-bold">
                        CELESTIAL STRENGTHS
                      </h4>
                      <ul className="space-y-2">
                        {(report.narrative?.strengths || []).map((s: string, idx: number) => (
                          <li key={idx} className="text-xs text-[#c8c4d4]/70 flex items-center gap-2 print:text-black">
                            <span className="text-emerald-500 font-bold">✓</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="p-5 bg-rose-950/15 border border-rose-900/20 rounded print:border-black print:bg-gray-100 print:text-black">
                      <h4 className="text-xs font-display tracking-wider text-rose-400 uppercase mb-3 print:text-black print:font-bold">
                        SHADOW BLIND SPOTS
                      </h4>
                      <ul className="space-y-2">
                        {(report.narrative?.blindSpots || []).map((w: string, idx: number) => (
                          <li key={idx} className="text-xs text-[#c8c4d4]/70 flex items-center gap-2 print:text-black">
                            <span className="text-rose-500 font-bold">✦</span> {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Communication style */}
                  <div className="pt-4 border-t border-[#d4af37]/8 print:border-black">
                    <h4 className="text-xs font-display tracking-wider text-[#d4af37] uppercase mb-2 print:text-black print:font-bold">
                      COMMUNICATION & INTELLECTUAL EXPRESSION
                    </h4>
                    <p className="text-xs leading-relaxed text-[#c8c4d4]/60 print:text-black">
                      {report.narrative?.communicationStyle}
                    </p>
                  </div>
                </div>
              )}

              {/* Module: Career & Wealth */}
              {(activeAnalysisTab === "career" || typeof window !== "undefined" && window.matchMedia && window.matchMedia("print").matches) && (
                <div className={`space-y-4 print:block ${activeAnalysisTab === "career" ? "block" : "hidden print:block"} print:pt-6 print:border-t print:border-gray-300`}>
                  <h3 className="text-2xl font-display text-[#d4af37] uppercase border-b border-[#d4af37]/15 pb-4 print:text-black print:border-black">
                    Ⅱ. Career & Wealth Generation
                  </h3>
                  <p className="text-sm leading-relaxed text-[#c8c4d4]/65 print:text-black">
                    {report.narrative?.careerWealth}
                  </p>
                </div>
              )}

              {/* Module: Relationships */}
              {(activeAnalysisTab === "relationships" || typeof window !== "undefined" && window.matchMedia && window.matchMedia("print").matches) && (
                <div className={`space-y-4 print:block ${activeAnalysisTab === "relationships" ? "block" : "hidden print:block"} print:pt-6 print:border-t print:border-gray-300`}>
                  <h3 className="text-2xl font-display text-[#d4af37] uppercase border-b border-[#d4af37]/15 pb-4 print:text-black print:border-black">
                    Ⅲ. Relationships & Connection Style
                  </h3>
                  <p className="text-sm leading-relaxed text-[#c8c4d4]/65 print:text-black">
                    {report.narrative?.relationships}
                  </p>
                </div>
              )}

              {/* Module: Purpose */}
              {(activeAnalysisTab === "purpose" || typeof window !== "undefined" && window.matchMedia && window.matchMedia("print").matches) && (
                <div className={`space-y-4 print:block ${activeAnalysisTab === "purpose" ? "block" : "hidden print:block"} print:pt-6 print:border-t print:border-gray-300`}>
                  <h3 className="text-2xl font-display text-[#d4af37] uppercase border-b border-[#d4af37]/15 pb-4 print:text-black print:border-black">
                    Ⅳ. Life Purpose & Cosmic Destiny
                  </h3>
                  <p className="text-sm leading-relaxed text-[#c8c4d4]/65 print:text-black">
                    {report.narrative?.lifePurpose}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            GRID BLOCK 4: HIGHLIGHTS & COSMIC ADVICE
            ══════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:block print:space-y-12">
              ) : (
                <p className="text-sm text-[#c8c4d4]">Loading forecast...</p>
              )}
            </div>
          )}
          {activeMainTab === 'report' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:block print:space-y-12">
          {/* Highlights */}
          <div className="p-8 bg-black/60 border border-[#d4af37]/12 rounded-lg backdrop-blur-md print:bg-white print:text-black print:border-2 print:border-black">
            <h3 className="text-lg tracking-widest font-display text-[#d4af37] uppercase border-b border-[#d4af37]/15 pb-4 mb-4 print:text-black print:border-black">
              ☉ PLANETARY ELEMENTS
            </h3>
            <p className="text-sm leading-relaxed text-[#c8c4d4]/65 print:text-black">
              {report.narrative?.planetaryHighlights}
            </p>
          </div>

          {/* Cosmic Advice */}
          <div className="p-8 bg-[#07051a]/55 border border-[#d4af37]/18 rounded-lg backdrop-blur-md print:bg-white print:text-black print:border-2 print:border-black" style={{ borderLeft: `4px solid ${zodiacTheme.accent}` }}>
            <h3 className="text-lg tracking-widest font-display text-[#d4af37] uppercase border-b border-[#d4af37]/15 pb-4 mb-4 print:text-black print:border-black">
              ✦ COSMIC DEVOTION RITUALS
            </h3>
            <p className="text-sm leading-relaxed text-[#c8c4d4]/65 print:text-black">
              {report.narrative?.cosmicAdvice}
            </p>
          </div>
        </div>

        {/* Print recovery reminder at page footer */}
        <div className="text-center pt-16 border-t border-[#d4af37]/10 mt-16 print:hidden">
          <p className="text-xs text-[#c8c4d4]/45 mb-4">
            This Celestial Profile is permanently engraved. Bookmark this URL to access your records anytime. Zero credentials required.
          </p>
          <span className="font-display text-[9px] text-[#d4af37]/50 tracking-widest uppercase">
            ZYGNAL ASTRO — WRITTEN IN THE STARS
          </span>
        </div>
      </div>
    </main>
  );
}
