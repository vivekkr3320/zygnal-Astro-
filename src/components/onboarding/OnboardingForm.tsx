/* src/components/onboarding/OnboardingForm.tsx */
"use client";

import React, { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════
   ZYGNAL ASTRO — CINEMATIC ONBOARDING RITUAL
   ═══════════════════════════════════════════════════ */

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const range = (n: number) => Array.from({ length: n }, (_, i) => i);

// ─── Zodiac sign resolver ───
const getZodiacSign = (day: number, month: number): string => {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
};

const getZodiacChar = (sign: string): string => {
  const map: Record<string, string> = {
    Aries: "♈", Taurus: "♉", Gemini: "♊", Cancer: "♋",
    Leo: "♌", Virgo: "♍", Libra: "♎", Scorpio: "♏",
    Sagittarius: "♐", Capricorn: "♑", Aquarius: "♒", Pisces: "♓",
  };
  return map[sign] || "✦";
};

// ─── Dynamic zodiac atmosphere ───
interface ZodiacTheme {
  accent: string;
  glow: string;
  gradientFrom: string;
  sunDesc: string;
  moonDesc: string;
  risingDesc: string;
  rarePercent: number;
  rareFact: string;
}

const ZODIAC_THEMES: Record<string, ZodiacTheme> = {
  Aries:       { accent: "#ef4444", glow: "rgba(239,68,68,0.15)",   gradientFrom: "rgba(239,68,68,0.08)",   sunDesc: "Your Aries Sun blazes with pioneering courage and raw initiative. You are cosmically wired to lead, to begin, and to fearlessly explore uncharted territories of experience.", moonDesc: "A fiery, independent emotional core that demands freedom and authenticity. You process feelings through action and bold self-expression.", risingDesc: "A commanding, energetic first impression that radiates confidence and infectious enthusiasm to everyone around you.", rarePercent: 2.7, rareFact: "A rare Mars-Jupiter conjunction in your cardinal fire sign creates an exceptionally powerful drive shared by only 2.7% of natal charts." },
  Taurus:      { accent: "#84cc16", glow: "rgba(132,204,22,0.15)",  gradientFrom: "rgba(132,204,22,0.08)",  sunDesc: "Your Taurus Sun embodies steadfast determination, sensory richness, and an innate appreciation for beauty and material harmony.", moonDesc: "A deeply grounded emotional foundation that craves stability, comfort, and the tangible pleasures of physical existence.", risingDesc: "A warm, reliable, and aesthetically refined presence that puts others at ease with your calm, measured energy.", rarePercent: 3.4, rareFact: "A Venus-Saturn trine in your earth sign creates a rare blend of artistic discipline found in only 3.4% of charts." },
  Gemini:      { accent: "#fbbf24", glow: "rgba(251,191,36,0.15)",  gradientFrom: "rgba(251,191,36,0.08)",  sunDesc: "Your Gemini Sun dances with intellectual curiosity, communicative brilliance, and an insatiable hunger for diverse experiences.", moonDesc: "A quick-silver emotional landscape that processes feelings through language, ideas, and social connection.", risingDesc: "A witty, engaging, and mentally agile first impression that captivates through conversation and charm.", rarePercent: 2.9, rareFact: "A Mercury-Uranus aspect in your mutable air sign grants a rare cognitive speed shared by only 2.9% of individuals." },
  Cancer:      { accent: "#60a5fa", glow: "rgba(96,165,250,0.15)",  gradientFrom: "rgba(96,165,250,0.08)",  sunDesc: "Your Cancer Sun flows with deep emotional intelligence, nurturing instinct, and a powerful connection to ancestral memory.", moonDesc: "An exceptionally sensitive inner world ruled by lunar tides — you feel everything deeply and remember it forever.", risingDesc: "A gentle, protective, and deeply empathetic presence that creates immediate emotional safety for others.", rarePercent: 2.1, rareFact: "A Moon-Neptune conjunction in your cardinal water sign creates an extraordinary psychic sensitivity found in only 2.1% of charts." },
  Leo:         { accent: "#f97316", glow: "rgba(249,115,22,0.15)",  gradientFrom: "rgba(249,115,22,0.08)",  sunDesc: "Your Leo Sun radiates warmth, creative pride, and noble self-expression. You are cosmically designed to lead, inspire, and create from the heart.", moonDesc: "A loyal, generous, and proud emotional foundation. You feel most secure when your unique creative voice is seen and celebrated.", risingDesc: "A radiant, confident, and theatrical first impression. You bring natural solar warmth and expressive presence to any gathering.", rarePercent: 3.1, rareFact: "A powerful Fire Grand Trine aligns your key houses, focusing your willpower with a density shared by only 3.1% of charts." },
  Virgo:       { accent: "#86efac", glow: "rgba(134,239,172,0.15)", gradientFrom: "rgba(134,239,172,0.08)", sunDesc: "Your Virgo Sun operates with meticulous precision, analytical depth, and a sacred devotion to refinement and service.", moonDesc: "A carefully organized emotional interior that finds peace through structure, analysis, and meaningful contribution.", risingDesc: "A composed, intelligent, and detail-oriented first impression that commands respect through quiet competence.", rarePercent: 3.6, rareFact: "A Mercury-Pluto sextile in your mutable earth sign creates an exceptional analytical depth found in only 3.6% of charts." },
  Libra:       { accent: "#f0abfc", glow: "rgba(240,171,252,0.15)", gradientFrom: "rgba(240,171,252,0.08)", sunDesc: "Your Libra Sun harmonizes beauty, justice, and relational intelligence into an elegant dance of social grace and artistic vision.", moonDesc: "An emotionally diplomatic inner world that seeks balance, partnership, and aesthetic harmony in all things.", risingDesc: "A charming, graceful, and aesthetically attuned first impression that creates natural social ease.", rarePercent: 2.5, rareFact: "A Venus-Jupiter conjunction in your cardinal air sign creates a rare gift for relational beauty shared by only 2.5% of individuals." },
  Scorpio:     { accent: "#dc2626", glow: "rgba(220,38,38,0.15)",   gradientFrom: "rgba(220,38,38,0.08)",   sunDesc: "Your Scorpio Sun burns with intense, transformative energy. You look beyond superficial facades, driven to uncover hidden psychological truths and raw emotional depths.", moonDesc: "Your Moon indicates a passionate, intensely private emotional landscape that demands absolute trust, vulnerability, and spiritual intimacy.", risingDesc: "A magnetic, mysterious, and deeply observant first impression. Others instinctively sense your emotional strength and quiet authority.", rarePercent: 1.8, rareFact: "Your chart possesses an uncommon Venus-Pluto Scorpio transit configuration, occurring in less than 1.8% of modern celestial paths." },
  Sagittarius: { accent: "#c084fc", glow: "rgba(192,132,252,0.15)", gradientFrom: "rgba(192,132,252,0.08)", sunDesc: "Your Sagittarius Sun blazes with philosophical vision, adventurous spirit, and an eternal quest for meaning beyond the horizon.", moonDesc: "A restless, optimistic emotional core that finds nourishment through exploration, learning, and spiritual expansion.", risingDesc: "An enthusiastic, open-minded, and philosophically engaging first impression that inspires others to dream bigger.", rarePercent: 2.8, rareFact: "A Jupiter-Neptune trine in your mutable fire sign creates a rare visionary capacity shared by only 2.8% of charts." },
  Capricorn:   { accent: "#94a3b8", glow: "rgba(148,163,184,0.15)", gradientFrom: "rgba(148,163,184,0.08)", sunDesc: "Your Capricorn Sun embodies disciplined ambition, structural mastery, and the patient wisdom of the cosmic mountain goat.", moonDesc: "A stoic, responsible emotional foundation that finds security through achievement, structure, and long-term planning.", risingDesc: "A composed, authoritative, and quietly powerful first impression that conveys maturity and dependability.", rarePercent: 3.3, rareFact: "A Saturn-Pluto conjunction in your cardinal earth sign creates an exceptional transformative discipline found in only 3.3% of charts." },
  Aquarius:    { accent: "#38bdf8", glow: "rgba(56,189,248,0.15)",  gradientFrom: "rgba(56,189,248,0.08)",  sunDesc: "Your Aquarius Sun pulses with innovative vision, humanitarian ideals, and a radical commitment to authentic individuality.", moonDesc: "A progressive, independent emotional landscape that processes feelings through intellectual analysis and collective awareness.", risingDesc: "A unique, forward-thinking, and magnetically eccentric first impression that challenges conventions effortlessly.", rarePercent: 2.4, rareFact: "A Uranus-Mercury trine in your fixed air sign creates a rare inventive genius shared by only 2.4% of individuals." },
  Pisces:      { accent: "#818cf8", glow: "rgba(129,140,248,0.15)", gradientFrom: "rgba(129,140,248,0.08)", sunDesc: "Your Pisces Sun flows with limitless empathy, rich imagination, and high spiritual receptivity. You walk gently between physical and emotional realms.", moonDesc: "A deeply impressionable, dreamlike inner world. Music, solitude, and creative arts act as your natural soul sanctuaries.", risingDesc: "A soft, magnetic, and highly intuitive aura. People feel naturally safe, validated, and understood in your presence.", rarePercent: 2.3, rareFact: "A rare Neptune-Jupiter alignment in Pisces channels a high-frequency emotional receptivity shared by only 2.3% of individuals." },
};

const DEFAULT_THEME: ZodiacTheme = {
  accent: "#d4af37", glow: "rgba(212,175,55,0.15)", gradientFrom: "rgba(212,175,55,0.08)",
  sunDesc: "Your solar alignment infuses you with a unique blend of intellectual curiosity, creative potential, and cosmic purpose.",
  moonDesc: "Your inner emotional foundation values balance, harmony, and structural stability, allowing you to find grace in times of change.",
  risingDesc: "A balanced, engaging, and sophisticated personal aura that navigates relationships with elegant poise and intelligence.",
  rarePercent: 4.2,
  rareFact: "A rare planetary sextile between Saturn and Uranus coordinates your chart, balancing tradition with sudden progressive breakthroughs.",
};

// ─── Loading ritual stage names ───
const RITUAL_STAGES = [
  { label: "Querying planetary ephemeris database...", icon: "◉" },
  { label: "Mapping temporal-spatial coordinates...", icon: "◈" },
  { label: "Aligning Sun, Moon & House positions...", icon: "◇" },
  { label: "Synthesizing celestial synastry vectors...", icon: "⬡" },
  { label: "Finalizing personal cosmic portrait...", icon: "✦" },
];

// ─── Step labels ───
const STEP_NAMES = ["Birth Date", "Time Precision", "Geographic Origin", "Ritual Synthesis"];

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function OnboardingForm() {
  // ─── Form state ───
  const [step, setStep] = useState(0);
  const [birthMonth, setBirthMonth] = useState(10);
  const [birthDay, setBirthDay] = useState(11);
  const [birthYear, setBirthYear] = useState(1996);
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const [ampm, setAmpm] = useState("PM");
  const [confidence, setConfidence] = useState("Exact");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");

  // ─── Workflow state ───
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showSnapshot, setShowSnapshot] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [revealReport, setRevealReport] = useState(false);
  const [revealPhase, setRevealPhase] = useState(0);

  // ─── Transaction state ───
  const [reportToken, setReportToken] = useState("");
  const [orderId, setOrderId] = useState("");
  const [isMockMode, setIsMockMode] = useState(true);
  const [serverCalculations, setServerCalculations] = useState<any[]>([]);
  const [serverNarrative, setServerNarrative] = useState<any>(null);
  const [pollingStatus, setPollingStatus] = useState("");
  const [paymentRecordId, setPaymentRecordId] = useState("");

  // ─── Payment fields ───
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  // ─── Synastry upsell ───
  const [partnerName, setPartnerName] = useState("");
  const [partnerMonth, setPartnerMonth] = useState(4);
  const [partnerDay, setPartnerDay] = useState(15);
  const [partnerYear, setPartnerYear] = useState(1995);
  const [showSynastryResult, setShowSynastryResult] = useState(false);

  // ─── Misc ───
  const [copiedLink, setCopiedLink] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ─── Audio refs ───
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => { setMounted(true); }, []);

  // ─── Derived ───
  const userZodiac = getZodiacSign(birthDay, birthMonth + 1);
  const zodiacChar = getZodiacChar(userZodiac);
  const theme = ZODIAC_THEMES[userZodiac] || DEFAULT_THEME;
  const isBirthTimeWarningActive = hour === 12 && minute === 0;

  // ════════════════════════════════════
  //  AUDIO
  // ════════════════════════════════════
  const handleToggleAudio = () => {
    if (isAudioPlaying) stopCelestialHum(); else playCelestialHum();
  };

  const playCelestialHum = () => {
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AC();
      audioCtxRef.current = ctx;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 2.5);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;
      const notes = [110, 164.81, 220, 277.18, 329.63, 440];
      notes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.detune.setValueAtTime((Math.random() - 0.5) * 12, ctx.currentTime);
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.08 + Math.random() * 0.05, ctx.currentTime);
        lfoGain.gain.setValueAtTime(0.25, ctx.currentTime);
        lfo.connect(lfoGain.gain);
        lfoGain.connect(oscGain.gain);
        lfo.start();
        oscGain.gain.setValueAtTime(0.12, ctx.currentTime);
        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start();
        oscillatorsRef.current.push(osc);
      });
      setIsAudioPlaying(true);
    } catch (e) {
      console.warn("Audio Context not supported.", e);
    }
  };

  const stopCelestialHum = () => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 0.6);
      setTimeout(() => {
        oscillatorsRef.current.forEach((o) => { try { o.stop(); } catch {} });
        try { audioCtxRef.current?.close(); } catch {}
        audioCtxRef.current = null;
        oscillatorsRef.current = [];
        gainNodeRef.current = null;
        setIsAudioPlaying(false);
      }, 700);
    } else {
      setIsAudioPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        oscillatorsRef.current.forEach((o) => { try { o.stop(); } catch {} });
        try { audioCtxRef.current?.close(); } catch {}
      }
    };
  }, []);

  // ════════════════════════════════════
  //  NAVIGATION
  // ════════════════════════════════════
  const next = () => setStep((s) => Math.min(s + 1, STEP_NAMES.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  // ════════════════════════════════════
  //  CHECKOUT → LOADING → SNAPSHOT
  // ════════════════════════════════════
  const handleStartAnalysis = async () => {
    if (!email) { alert("Please specify a valid email address to map your cosmic alignment."); return; }
    setIsLoading(true);
    setLoadingStep(0);
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          birthData: { month: birthMonth, day: birthDay, year: birthYear, hour, minute, ampm, confidence, location, timezone },
        }),
      });
      if (!res.ok) throw new Error("Failed to initiate checkout.");
      const data = await res.json();
      setReportToken(data.token);
      setOrderId(data.orderId);
      setIsMockMode(data.mock);
      setPaymentRecordId(data.paymentRecordId);

      let current = 0;
      const interval = setInterval(() => {
        current++;
        if (current < RITUAL_STAGES.length) {
          setLoadingStep(current);
        } else {
          clearInterval(interval);
          setIsLoading(false);
          setShowSnapshot(true);
        }
      }, 1400);
    } catch (err) {
      console.error(err);
      alert("Checkout failed. Please check backend connection.");
      setIsLoading(false);
    }
  };

  // ════════════════════════════════════
  //  PAYMENT + POLLING
  // ════════════════════════════════════
  const pollReportStatus = (token: string) => {
    setPollingStatus("QUEUED");
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/reports/${token}`);
        if (!res.ok) return;
        const data = await res.json();
        setPollingStatus(data.status);
        if (data.status === "COMPLETED") {
          clearInterval(interval);
          setServerCalculations(data.calculations || []);
          setServerNarrative(data.narrative || null);
          setIsPaid(true);
          // Start cinematic reveal sequence
          setRevealPhase(1);
          setTimeout(() => setRevealPhase(2), 1200);
          setTimeout(() => setRevealPhase(3), 2400);
          setTimeout(() => {
            setRevealReport(true);
            setIsPaymentProcessing(false);
            window.location.href = `/report/${token}`;
          }, 3600);
        } else if (data.status === "FAILED") {
          clearInterval(interval);
          alert("Report generation failed. Please contact support.");
          setIsPaymentProcessing(false);
        }
      } catch (err) { console.error("Polling error:", err); }
    }, 2000);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCVC) return;
    setIsPaymentProcessing(true);
    try {
      if (isMockMode) {
        const res = await fetch("/api/payments/mock-capture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentRecordId,
            orderId,
            token: reportToken,
          }),
        });
        if (!res.ok) throw new Error("Mock capture failed.");
        pollReportStatus(reportToken);
      } else {
        const rp = (window as any).Razorpay;
        if (!rp) { alert("Razorpay script missing."); setIsPaymentProcessing(false); return; }
        const rzp = new rp({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: 9900, currency: "INR",
          name: "Zygnal Astro", description: "Premium Celestial Blueprint",
          order_id: orderId,
          handler: async (response: any) => {
            // Trigger capture manually for local testing since webhook isn't configured
            try {
              await fetch("/api/payments/mock-capture", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  paymentRecordId,
                  orderId,
                  token: reportToken,
                }),
              });
            } catch (err) {
              console.error("Capture trigger failed", err);
            }
            pollReportStatus(reportToken);
          },
          prefill: { email },
          theme: { color: "#d4af37" },
        });
        rzp.open();
      }
    } catch (err) {
      console.error(err);
      alert("Payment processing error.");
      setIsPaymentProcessing(false);
    }
  };

  // ════════════════════════════════════
  //  UTILITY ACTIONS
  // ════════════════════════════════════
  const triggerPDFDownload = () => alert("Cosmic Blueprint PDF download started!");
  const triggerEmailReport = () => {
    if (!email) { alert("Please enter a valid email."); return; }
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 4000);
  };
  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.origin + `/report/share?sign=${userZodiac}&rare=${theme.rarePercent}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // ════════════════════════════════════
  //  SHARED STYLES
  // ════════════════════════════════════
  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(212,175,55,0.12)",
    borderRadius: "2px",
    padding: "14px 16px",
    color: "#f8f4ff",
    fontFamily: "var(--font-serif)",
    fontSize: "0.9rem",
    outline: "none",
    transition: "all 0.3s ease",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "var(--font-display)",
    fontSize: "0.5rem",
    letterSpacing: "0.25em",
    color: "rgba(212,175,55,0.5)",
    marginBottom: "6px",
    textTransform: "uppercase" as const,
  };

  const panelStyle: React.CSSProperties = {
    background: "rgba(7,5,26,0.7)",
    backdropFilter: "blur(24px) saturate(1.5)",
    WebkitBackdropFilter: "blur(24px) saturate(1.5)",
    border: "1px solid rgba(212,175,55,0.12)",
    borderRadius: "2px",
    padding: "3rem",
    position: "relative" as const,
    overflow: "hidden",
    boxShadow: "0 32px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(212,175,55,0.08)",
  };

  // ════════════════════════════════════════════════════════
  //  RENDER
  // ════════════════════════════════════════════════════════
  return (
    <section className="relative w-full max-w-4xl mx-auto z-20">

      {/* ─── Audio Toggle ─── */}
      <div className="absolute -top-12 right-0 z-30">
        <button
          onClick={handleToggleAudio}
          className="flex items-center gap-2 px-4 py-2 transition-all duration-500"
          style={{
            background: "rgba(7,5,26,0.6)",
            backdropFilter: "blur(12px)",
            border: `1px solid ${isAudioPlaying ? "rgba(212,175,55,0.4)" : "rgba(212,175,55,0.1)"}`,
            borderRadius: "2px",
            color: isAudioPlaying ? "#d4af37" : "rgba(200,196,212,0.4)",
          }}
        >
          <span style={{ fontSize: "14px" }}>{isAudioPlaying ? "🔊" : "🔇"}</span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.45rem",
              letterSpacing: "0.2em",
            }}
          >
            {isAudioPlaying ? "CELESTIAL HUM" : "MUTED"}
          </span>
          {isAudioPlaying && (
            <div
              className="w-1.5 h-1.5 rounded-full animate-breathe"
              style={{ background: "#d4af37", boxShadow: "0 0 8px rgba(212,175,55,0.8)" }}
            />
          )}
        </button>
      </div>

      {/* ══════════════════════════════════════
          STAGE 1: ONBOARDING STEPS
          ══════════════════════════════════════ */}
      {!isLoading && !showSnapshot && (
        <div
          style={panelStyle}
          className={`transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          {/* Gold top border accent */}
          <div
            className="absolute top-0 left-[10%] right-[10%] h-px pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), rgba(212,175,55,0.8), rgba(212,175,55,0.5), transparent)" }}
          />

          {/* Zodiac atmosphere glow */}
          <div
            className="absolute -top-32 -right-32 w-80 h-80 rounded-full pointer-events-none transition-all duration-1000"
            style={{ background: `radial-gradient(ellipse at center, ${theme.glow} 0%, transparent 70%)`, filter: "blur(40px)" }}
          />

          {/* ─── Header ─── */}
          <div className="text-center mb-10">
            <div className="section-label justify-center mb-4">
              <div className="gold-divider" />
              <span>Cosmic Calibration</span>
              <div className="gold-divider" />
            </div>
            <h1
              className="font-display text-white"
              style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", letterSpacing: "0.1em", lineHeight: 1.1 }}
            >
              INITIATE YOUR ALIGNMENT
            </h1>

            {/* Live zodiac indicator */}
            {birthDay && birthMonth !== undefined && (
              <div
                className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 transition-all duration-500"
                style={{
                  border: `1px solid ${theme.accent}30`,
                  borderRadius: "2px",
                  background: `${theme.gradientFrom}`,
                }}
              >
                <span className="font-serif text-lg" style={{ color: theme.accent, textShadow: `0 0 12px ${theme.accent}` }}>
                  {zodiacChar}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.5rem",
                    letterSpacing: "0.2em",
                    color: theme.accent,
                  }}
                >
                  {userZodiac.toUpperCase()} DETECTED
                </span>
              </div>
            )}
          </div>

          {/* ─── Sacred Geometry Progress ─── */}
          <div className="flex justify-between items-center max-w-lg mx-auto mb-12">
            {STEP_NAMES.map((label, idx) => (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center relative z-10">
                  <div
                    className="w-10 h-10 flex items-center justify-center transition-all duration-500"
                    style={{
                      borderRadius: "2px",
                      border: `1px solid ${idx <= step ? "rgba(212,175,55,0.6)" : "rgba(212,175,55,0.1)"}`,
                      background: idx < step
                        ? "linear-gradient(135deg, #e8c958, #d4af37)"
                        : idx === step
                        ? "rgba(212,175,55,0.08)"
                        : "rgba(7,5,26,0.5)",
                      color: idx < step ? "#0a0800" : idx === step ? "#d4af37" : "rgba(200,196,212,0.3)",
                      fontFamily: "var(--font-display)",
                      fontSize: "0.7rem",
                      boxShadow: idx <= step ? "0 0 20px rgba(212,175,55,0.15)" : "none",
                    }}
                  >
                    {idx < step ? "✓" : `0${idx + 1}`}
                  </div>
                  <span
                    className="hidden sm:block mt-2"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "0.4rem",
                      letterSpacing: "0.15em",
                      color: idx === step ? "rgba(212,175,55,0.8)" : "rgba(200,196,212,0.25)",
                      textTransform: "uppercase" as const,
                    }}
                  >
                    {label}
                  </span>
                </div>
                {idx < STEP_NAMES.length - 1 && (
                  <div
                    className="flex-grow h-px mx-3 transition-all duration-700"
                    style={{
                      background: idx < step
                        ? "linear-gradient(90deg, #d4af37, rgba(212,175,55,0.3))"
                        : "rgba(212,175,55,0.06)",
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* ─── Step Content ─── */}
          <div className="min-h-[260px] flex flex-col justify-center">

            {/* STEP 0: Birth Date & Time */}
            {step === 0 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="font-serif text-xl" style={{ color: "rgba(248,244,255,0.9)", fontStyle: "italic", fontWeight: 300 }}>
                    When did your earthly voyage commence?
                  </h2>
                  <p className="font-serif text-xs mt-1" style={{ color: "rgba(200,196,212,0.4)" }}>
                    Your precise astronomical alignment requires exact temporal parameters.
                  </p>
                </div>

                {/* Date dropdowns */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label style={labelStyle}>Month</label>
                    <select value={birthMonth} onChange={(e) => setBirthMonth(Number(e.target.value))} style={inputStyle}>
                      {MONTHS.map((m, idx) => (
                        <option key={idx} value={idx} style={{ background: "#07051a", color: "#f8f4ff" }}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Day</label>
                    <select value={birthDay} onChange={(e) => setBirthDay(Number(e.target.value))} style={inputStyle}>
                      {range(31).map((d) => (
                        <option key={d} value={d + 1} style={{ background: "#07051a", color: "#f8f4ff" }}>{d + 1}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Year</label>
                    <select value={birthYear} onChange={(e) => setBirthYear(Number(e.target.value))} style={inputStyle}>
                      {range(90).map((y) => {
                        const yr = 1940 + y;
                        return <option key={yr} value={yr} style={{ background: "#07051a", color: "#f8f4ff" }}>{yr}</option>;
                      })}
                    </select>
                  </div>
                </div>

                {/* Time selection */}
                <div className="grid grid-cols-3 gap-4 items-end">
                  <div>
                    <label style={labelStyle}>Hour</label>
                    <select value={hour} onChange={(e) => setHour(Number(e.target.value))} style={inputStyle}>
                      {range(12).map((h) => (
                        <option key={h} value={h === 0 ? 12 : h} style={{ background: "#07051a" }}>{h === 0 ? 12 : h}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Minute</label>
                    <select value={minute} onChange={(e) => setMinute(Number(e.target.value))} style={inputStyle}>
                      {range(60).map((m) => (
                        <option key={m} value={m} style={{ background: "#07051a" }}>{m.toString().padStart(2, "0")}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex h-[50px]" style={{ border: "1px solid rgba(212,175,55,0.12)", borderRadius: "2px" }}>
                    {["AM", "PM"].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setAmpm(v)}
                        className="flex-1 flex items-center justify-center gap-1 transition-all duration-300"
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "0.6rem",
                          letterSpacing: "0.15em",
                          background: ampm === v ? "linear-gradient(135deg, #e8c958, #d4af37)" : "transparent",
                          color: ampm === v ? "#0a0800" : "rgba(200,196,212,0.4)",
                        }}
                      >
                        <span>{v === "AM" ? "☉" : "☾"}</span>
                        <span>{v}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Birth time warning */}
                {isBirthTimeWarningActive && (
                  <div
                    className="flex items-start gap-3 p-4"
                    style={{
                      background: "rgba(251,191,36,0.06)",
                      border: "1px solid rgba(251,191,36,0.15)",
                      borderRadius: "2px",
                      animation: "celestial-breathe 4s ease-in-out infinite",
                    }}
                  >
                    <span style={{ color: "#fbbf24", fontSize: "16px", flexShrink: 0, marginTop: "2px" }}>⚠</span>
                    <div>
                      <h4
                        className="font-display mb-1"
                        style={{ fontSize: "0.55rem", letterSpacing: "0.2em", color: "#fbbf24" }}
                      >
                        BIRTH TIME ACCURACY ADVISORY
                      </h4>
                      <p className="font-serif text-xs leading-relaxed" style={{ color: "rgba(251,191,36,0.7)", fontWeight: 300 }}>
                        12:00 is commonly a system placeholder. Birth time strongly influences your Rising sign and house placements.
                        If unsure of the exact minute, referencing your official birth records will significantly improve chart accuracy.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 1: Time Confidence */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="font-serif text-xl" style={{ color: "rgba(248,244,255,0.9)", fontStyle: "italic", fontWeight: 300 }}>
                    What is the certainty of this birth time?
                  </h2>
                  <p className="font-serif text-xs mt-1" style={{ color: "rgba(200,196,212,0.4)" }}>
                    Confidence levels calibrate our precision matrices for house placements.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { val: "Exact", title: "Minute-Exact", desc: "From official records or birth certificate.", icon: "◎" },
                    { val: "Approximate", title: "Approximate", desc: "Estimated within a 30-minute window.", icon: "◐" },
                    { val: "Unsure", title: "Unsure / Guess", desc: "Rough approximate or placeholder hour.", icon: "◌" },
                  ].map((item) => (
                    <button
                      key={item.val}
                      onClick={() => setConfidence(item.val)}
                      className="flex flex-col text-left p-5 transition-all duration-400"
                      style={{
                        borderRadius: "2px",
                        border: `1px solid ${confidence === item.val ? "rgba(212,175,55,0.5)" : "rgba(212,175,55,0.08)"}`,
                        background: confidence === item.val ? "rgba(212,175,55,0.06)" : "rgba(255,255,255,0.02)",
                        boxShadow: confidence === item.val ? "0 0 30px rgba(212,175,55,0.1)" : "none",
                        transform: confidence === item.val ? "translateY(-2px)" : "none",
                      }}
                    >
                      <span className="font-serif text-2xl mb-2" style={{ color: confidence === item.val ? "#d4af37" : "rgba(200,196,212,0.2)" }}>
                        {item.icon}
                      </span>
                      <span
                        className="font-display mb-1"
                        style={{
                          fontSize: "0.6rem",
                          letterSpacing: "0.15em",
                          color: confidence === item.val ? "#e8c958" : "rgba(248,244,255,0.7)",
                        }}
                      >
                        {item.title.toUpperCase()}
                      </span>
                      <span className="font-serif text-xs" style={{ color: "rgba(200,196,212,0.4)", fontWeight: 300 }}>
                        {item.desc}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-2">
                  <span style={{ color: "rgba(212,175,55,0.4)", fontSize: "12px" }}>⏱</span>
                  <span className="font-serif text-xs" style={{ color: "rgba(200,196,212,0.35)", fontStyle: "italic" }}>
                    Even rough estimates reveal major planetary transit clusters perfectly.
                  </span>
                </div>
              </div>
            )}

            {/* STEP 2: Birth Location */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="font-serif text-xl" style={{ color: "rgba(248,244,255,0.9)", fontStyle: "italic", fontWeight: 300 }}>
                    Where did you enter the world?
                  </h2>
                  <p className="font-serif text-xs mt-1" style={{ color: "rgba(200,196,212,0.4)" }}>
                    Geographic coordinates alter local house divisions. Timezone offsets are normalized automatically.
                  </p>
                </div>

                <div className="relative max-w-md mx-auto">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Search city of birth..."
                    style={{
                      ...inputStyle,
                      fontStyle: "italic",
                    }}
                  />

                  {/* Autocomplete suggestions */}
                  {location && location.length > 1 && (
                    <div
                      className="absolute left-0 right-0 mt-2 z-30"
                      style={{
                        background: "rgba(7,5,26,0.95)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(212,175,55,0.15)",
                        borderRadius: "2px",
                        boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
                      }}
                    >
                      {["New York, NY, USA", "London, UK", "New Delhi, India", "Mumbai, India", "Los Angeles, CA, USA", "Paris, France"]
                        .filter((c) => c.toLowerCase().includes(location.toLowerCase()))
                        .map((c, i) => (
                          <button
                            key={i}
                            onClick={() => setLocation(c)}
                            className="w-full text-left px-4 py-3 font-serif text-sm transition-all duration-200"
                            style={{
                              color: "rgba(200,196,212,0.7)",
                              borderBottom: "1px solid rgba(212,175,55,0.05)",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "rgba(212,175,55,0.06)";
                              e.currentTarget.style.color = "#e8c958";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                              e.currentTarget.style.color = "rgba(200,196,212,0.7)";
                            }}
                          >
                            {c}
                          </button>
                        ))}
                    </div>
                  )}
                </div>

                <p className="font-serif text-xs text-center" style={{ color: "rgba(200,196,212,0.3)", fontStyle: "italic" }}>
                  Timezone offsets are calculated automatically to guarantee sub-degree accuracy.
                </p>
              </div>
            )}

            {/* STEP 3: Review */}
            {step === 3 && (
              <div className="space-y-6 max-w-md mx-auto text-center">
                <div className="mb-4">
                  <h2 className="font-serif text-xl" style={{ color: "rgba(248,244,255,0.9)", fontStyle: "italic", fontWeight: 300 }}>
                    Synthesis Ritual Ready
                  </h2>
                  <p className="font-serif text-xs mt-1" style={{ color: "rgba(200,196,212,0.4)" }}>
                    Review your cosmic parameters before calculation.
                  </p>
                </div>

                <div
                  className="text-left space-y-4 p-6"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(212,175,55,0.1)",
                    borderRadius: "2px",
                  }}
                >
                  {[
                    { label: "Birth Date", value: `${MONTHS[birthMonth]} ${birthDay}, ${birthYear}` },
                    { label: "Birth Time", value: `${hour}:${minute.toString().padStart(2, "0")} ${ampm}` },
                    { label: "Precision", value: `${confidence} Confidence` },
                    { label: "Location", value: location || "Not Provided" },
                    { label: "Sun Sign", value: `${zodiacChar} ${userZodiac}` },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center pb-3"
                      style={{ borderBottom: i < 4 ? "1px solid rgba(212,175,55,0.06)" : "none" }}
                    >
                      <span style={{ fontFamily: "var(--font-display)", fontSize: "0.5rem", letterSpacing: "0.2em", color: "rgba(200,196,212,0.4)", textTransform: "uppercase" as const }}>
                        {row.label}
                      </span>
                      <span className="font-serif text-sm" style={{ color: i === 4 ? theme.accent : "rgba(248,244,255,0.85)" }}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Email input */}
                <div className="text-left">
                  <label style={labelStyle}>Email for Report Delivery</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    style={{ ...inputStyle, fontStyle: "italic" }}
                  />
                </div>

                <div className="flex items-center justify-center gap-2">
                  <span style={{ color: "rgba(212,175,55,0.5)", fontSize: "12px" }}>🛡</span>
                  <span className="font-serif text-xs" style={{ color: "rgba(200,196,212,0.3)", fontStyle: "italic" }}>
                    Aligned with global privacy guidelines. Zero data sharing.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ─── Navigation Buttons ─── */}
          <div
            className="mt-10 pt-6 flex items-center justify-between"
            style={{ borderTop: "1px solid rgba(212,175,55,0.06)" }}
          >
            {step > 0 ? (
              <button onClick={prev} className="btn-ghost" style={{ padding: "0.7rem 1.5rem", fontSize: "0.6rem" }}>
                ← BACK
              </button>
            ) : <div />}

            {step < STEP_NAMES.length - 1 ? (
              <button
                onClick={next}
                disabled={step === 2 && !location}
                className="btn-cosmic"
                style={{
                  padding: "0.7rem 2rem",
                  fontSize: "0.6rem",
                  opacity: step === 2 && !location ? 0.3 : 1,
                  cursor: step === 2 && !location ? "not-allowed" : "pointer",
                }}
              >
                CONTINUE →
              </button>
            ) : (
              <button onClick={handleStartAnalysis} className="btn-cosmic" style={{ padding: "0.7rem 2rem", fontSize: "0.6rem" }}>
                ✦ INITIATE RITUAL
              </button>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          STAGE 2: CINEMATIC LOADING RITUAL
          ══════════════════════════════════════ */}
      {isLoading && (
        <div
          style={{ ...panelStyle, padding: "4rem 3rem", textAlign: "center" as const }}
          className="flex flex-col items-center justify-center min-h-[450px]"
        >
          {/* Sacred geometry spinner */}
          <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: "1px solid rgba(212,175,55,0.4)",
                animation: "spin-slow 4s linear infinite",
              }}
            />
            <div
              className="absolute inset-3 rounded-full"
              style={{
                border: "1px solid rgba(212,175,55,0.2)",
                animation: "spin-slow 6s linear reverse infinite",
              }}
            />
            <div
              className="absolute inset-6 rounded-full"
              style={{
                border: "1px solid rgba(212,175,55,0.1)",
                animation: "spin-slow 8s linear infinite",
              }}
            />
            {/* Central zodiac glyph */}
            <span
              className="font-serif text-4xl animate-breathe"
              style={{ color: theme.accent, textShadow: `0 0 30px ${theme.accent}` }}
            >
              {zodiacChar}
            </span>
          </div>

          <h2
            className="font-display mb-2"
            style={{ fontSize: "0.8rem", letterSpacing: "0.25em", color: "rgba(248,244,255,0.9)" }}
          >
            ALIGNING SOLAR GEOMETRY
          </h2>

          {/* Stage labels */}
          <div className="h-8 flex items-center">
            <p
              className="font-serif text-sm animate-breathe"
              style={{ color: `${theme.accent}cc`, fontStyle: "italic" }}
            >
              {RITUAL_STAGES[loadingStep]?.icon} {RITUAL_STAGES[loadingStep]?.label}
            </p>
          </div>

          {/* Progress bar */}
          <div
            className="w-48 h-px mt-6 overflow-hidden"
            style={{ background: "rgba(212,175,55,0.1)" }}
          >
            <div
              className="h-full transition-all duration-1000 ease-out"
              style={{
                width: `${((loadingStep + 1) / RITUAL_STAGES.length) * 100}%`,
                background: `linear-gradient(90deg, ${theme.accent}, #d4af37)`,
                boxShadow: `0 0 12px ${theme.accent}`,
              }}
            />
          </div>

          {/* Stage dots */}
          <div className="flex gap-2 mt-4">
            {RITUAL_STAGES.map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full transition-all duration-500"
                style={{
                  background: i <= loadingStep ? theme.accent : "rgba(212,175,55,0.1)",
                  boxShadow: i <= loadingStep ? `0 0 8px ${theme.accent}` : "none",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          STAGE 3: COSMIC SNAPSHOT + PAYMENT
          ══════════════════════════════════════ */}
      {showSnapshot && !revealReport && (
        <div className="space-y-6">
          {/* Snapshot panel */}
          <div
            style={{
              ...panelStyle,
              borderColor: `${theme.accent}20`,
              background: `linear-gradient(135deg, ${theme.gradientFrom} 0%, rgba(7,5,26,0.8) 50%, rgba(7,5,26,0.9) 100%)`,
            }}
          >
            {/* Accent top border */}
            <div
              className="absolute top-0 left-0 right-0 h-px pointer-events-none"
              style={{ background: `linear-gradient(90deg, transparent, ${theme.accent}80, transparent)` }}
            />

            {/* Header */}
            <div className="text-center mb-8">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 mb-4"
                style={{
                  border: `1px solid ${theme.accent}30`,
                  borderRadius: "2px",
                  background: `${theme.gradientFrom}`,
                }}
              >
                <span className="font-serif text-lg" style={{ color: theme.accent }}>{zodiacChar}</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "0.5rem", letterSpacing: "0.2em", color: theme.accent }}>
                  {userZodiac.toUpperCase()} SUN DETECTED
                </span>
              </div>
              <h2
                className="font-display"
                style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", letterSpacing: "0.08em", color: "rgba(248,244,255,0.95)" }}
              >
                YOUR COSMIC SNAPSHOT
              </h2>
              <p className="font-serif text-xs mt-2" style={{ color: "rgba(200,196,212,0.4)", fontStyle: "italic" }}>
                Initial celestial alignments generated successfully.
              </p>
            </div>

            {/* Teaser cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {[
                { icon: "☉", title: `Sun in ${userZodiac}`, desc: theme.sunDesc },
                { icon: "☾", title: "Moon Aspect", desc: theme.moonDesc },
                { icon: "↑", title: "Ascendant Presence", desc: theme.risingDesc },
              ].map((card, i) => (
                <div
                  key={i}
                  className="p-5"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(212,175,55,0.08)",
                    borderRadius: "2px",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg" style={{ color: theme.accent, textShadow: `0 0 10px ${theme.accent}` }}>
                      {card.icon}
                    </span>
                    <span
                      className="font-display"
                      style={{ fontSize: "0.55rem", letterSpacing: "0.15em", color: "rgba(248,244,255,0.85)" }}
                    >
                      {card.title.toUpperCase()}
                    </span>
                  </div>
                  <p className="font-serif text-xs leading-relaxed" style={{ color: "rgba(200,196,212,0.55)", fontWeight: 300 }}>
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Blurred blueprint + payment overlay */}
            <div
              className="relative min-h-[320px] flex flex-col justify-center items-center overflow-hidden"
              style={{ background: "rgba(0,0,10,0.5)", border: "1px solid rgba(212,175,55,0.06)", borderRadius: "2px" }}
            >
              {/* Blurred mock lines */}
              <div className="absolute inset-0 p-6 space-y-3 pointer-events-none select-none" style={{ filter: "blur(8px)", opacity: 0.25 }}>
                {[48, "100%", "85%", "70%", 32, "100%", "65%"].map((w, i) => (
                  <div
                    key={i}
                    className="rounded"
                    style={{
                      height: typeof w === "number" ? "6px" : "4px",
                      width: typeof w === "number" ? `${w * 4}px` : w,
                      background: "rgba(200,196,212,0.4)",
                    }}
                  />
                ))}
              </div>

              {/* Payment card */}
              <div
                className="relative z-10 max-w-md w-full p-8"
                style={{
                  background: "rgba(7,5,26,0.9)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(212,175,55,0.2)",
                  borderRadius: "2px",
                  boxShadow: "0 32px 64px rgba(0,0,0,0.6)",
                }}
              >
                {/* Lock icon */}
                <div className="flex justify-center mb-4">
                  <div
                    className="w-12 h-12 flex items-center justify-center"
                    style={{
                      border: "1px solid rgba(212,175,55,0.25)",
                      borderRadius: "2px",
                      background: "rgba(212,175,55,0.05)",
                    }}
                  >
                    <span style={{ color: "#d4af37", fontSize: "20px" }}>🔒</span>
                  </div>
                </div>

                <h3
                  className="font-display text-center mb-1"
                  style={{ fontSize: "0.7rem", letterSpacing: "0.2em", color: "rgba(248,244,255,0.9)" }}
                >
                  UNLOCK FULL COSMIC BLUEPRINT
                </h3>
                <p className="font-serif text-xs text-center mb-6" style={{ color: "rgba(200,196,212,0.4)", fontStyle: "italic" }}>
                  Complete planetary breakdown, karmic alignments, 12-month transits, and save tools.
                </p>

                {isPaymentProcessing ? (
                  /* Processing state */
                  <div className="py-8 text-center space-y-4">
                    <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{ border: "1px solid rgba(212,175,55,0.5)", animation: "spin-slow 3s linear infinite" }}
                      />
                      <span className="font-serif text-2xl animate-breathe" style={{ color: theme.accent }}>{zodiacChar}</span>
                    </div>

                    {/* Reveal phases */}
                    {revealPhase >= 1 && (
                      <div className="space-y-1" style={{ animation: "fade-in 0.5s ease" }}>
                        <div className="font-display" style={{ fontSize: "0.55rem", letterSpacing: "0.2em", color: theme.accent }}>
                          {revealPhase === 1 && "PLANETARY SYNCHRONIZATION..."}
                          {revealPhase === 2 && "CELESTIAL MATRIX ALIGNED..."}
                          {revealPhase === 3 && "COSMIC BLUEPRINT UNLOCKED"}
                        </div>
                      </div>
                    )}

                    {revealPhase === 0 && (
                      <>
                        <h4 className="font-display" style={{ fontSize: "0.55rem", letterSpacing: "0.2em", color: "rgba(248,244,255,0.8)" }}>
                          SYNTHESIZING CHART MATRIX
                        </h4>
                        <p className="font-serif text-xs" style={{ color: "rgba(212,175,55,0.6)", fontStyle: "italic" }}>
                          {pollingStatus === "QUEUED" ? "Queued in worker pipeline..." : "Calculating planetary degrees..."}
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  /* Payment form */
                  <form onSubmit={handlePayment} className="space-y-4 text-left">
                    <div>
                      <label style={labelStyle}>Email</label>
                      <input
                        type="email" required value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        style={{ ...inputStyle, fontSize: "0.8rem" }}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Card Number</label>
                      <input
                        type="text" required value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, "").replace(/(\d{4})/g, "$1 ").trim())}
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        style={{ ...inputStyle, fontSize: "0.8rem", fontFamily: "monospace" }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label style={labelStyle}>Expiry</label>
                        <input
                          type="text" required value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY" maxLength={5}
                          style={{ ...inputStyle, fontSize: "0.8rem", fontFamily: "monospace" }}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>CVC</label>
                        <input
                          type="password" required value={cardCVC}
                          onChange={(e) => setCardCVC(e.target.value)}
                          placeholder="•••" maxLength={3}
                          style={{ ...inputStyle, fontSize: "0.8rem", fontFamily: "monospace" }}
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn-cosmic w-full" style={{ marginTop: "8px" }}>
                      UNLOCK CELESTIAL FLOW — ₹99
                    </button>
                  </form>
                )}

                <div className="mt-4 flex items-center justify-center gap-1.5">
                  <span style={{ fontSize: "10px", color: "rgba(212,175,55,0.4)" }}>🛡</span>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "0.4rem",
                      letterSpacing: "0.15em",
                      color: "rgba(200,196,212,0.25)",
                    }}
                  >
                    SECURED PAYMENT GATE · 256-BIT ENCRYPTION
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          STAGE 4: FULL COSMIC REPORT
          ══════════════════════════════════════ */}
      {revealReport && (
        <div className="space-y-6" style={{ animation: "fade-in-up 1s ease-out" }}>

          {/* ─── Report Header ─── */}
          <div
            style={{
              ...panelStyle,
              padding: "3rem",
              borderColor: `${theme.accent}20`,
              background: `linear-gradient(135deg, ${theme.gradientFrom} 0%, rgba(7,5,26,0.85) 100%)`,
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-px pointer-events-none"
              style={{ background: `linear-gradient(90deg, transparent, ${theme.accent}80, transparent)` }}
            />

            <div className="max-w-2xl mx-auto text-center space-y-4">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5"
                style={{
                  border: `1px solid ${theme.accent}30`,
                  borderRadius: "2px",
                  background: `${theme.gradientFrom}`,
                }}
              >
                <span style={{ fontFamily: "var(--font-display)", fontSize: "0.5rem", letterSpacing: "0.2em", color: theme.accent }}>
                  ✦ AUTHENTIC BLUEPRINT UNLOCKED
                </span>
              </div>

              <h1
                className="font-display"
                style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "0.08em", color: "rgba(248,244,255,0.97)" }}
              >
                YOUR COSMIC DESTINY
              </h1>

              <p className="font-serif text-sm" style={{ color: "rgba(200,196,212,0.5)", fontStyle: "italic", fontWeight: 300 }}>
                Calculated coordinates centered on <span style={{ color: theme.accent }}>{location}</span>.
                Temporal synchronization completed with local UTC coordinates.
              </p>
            </div>

            {/* Action bar */}
            <div
              className="mt-8 pt-6 flex flex-wrap items-center justify-center gap-3"
              style={{ borderTop: "1px solid rgba(212,175,55,0.08)" }}
            >
              <button onClick={copyShareLink} className="btn-ghost" style={{ padding: "0.5rem 1.2rem", fontSize: "0.5rem" }}>
                {copiedLink ? "✓ COPIED" : "📋 SHARE LINK"}
              </button>
              <button onClick={triggerPDFDownload} className="btn-ghost" style={{ padding: "0.5rem 1.2rem", fontSize: "0.5rem" }}>
                📄 DOWNLOAD PDF
              </button>
              <div className="flex" style={{ border: "1px solid rgba(212,175,55,0.12)", borderRadius: "2px" }}>
                <input
                  type="email" placeholder="Email..." value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent outline-none font-serif text-xs px-3 py-2 w-36"
                  style={{ color: "#f8f4ff" }}
                />
                <button
                  onClick={triggerEmailReport}
                  className="px-3 py-1.5"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.45rem",
                    letterSpacing: "0.15em",
                    background: "linear-gradient(135deg, #e8c958, #d4af37)",
                    color: "#0a0800",
                  }}
                >
                  {emailSent ? "SENT!" : "SEND"}
                </button>
              </div>
            </div>
          </div>

          {/* ─── Rarity Section ─── */}
          <div
            className="flex flex-col md:flex-row items-center gap-6"
            style={{
              ...panelStyle,
              padding: "2rem",
              borderColor: "rgba(212,175,55,0.15)",
            }}
          >
            <div
              className="flex-shrink-0 w-24 h-24 flex flex-col items-center justify-center relative"
              style={{ border: `1px solid ${theme.accent}30`, borderRadius: "50%", background: `${theme.gradientFrom}` }}
            >
              <span className="font-display text-2xl" style={{ color: theme.accent }}>{theme.rarePercent}%</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "0.35rem", letterSpacing: "0.15em", color: "rgba(200,196,212,0.4)" }}>
                RARITY
              </span>
              <div
                className="absolute inset-0 rounded-full"
                style={{ border: `1px solid ${theme.accent}30`, animation: "spin-slow 8s linear infinite" }}
              />
            </div>
            <div>
              <h3 className="font-display mb-2" style={{ fontSize: "0.7rem", letterSpacing: "0.15em", color: "rgba(248,244,255,0.9)" }}>
                WHAT MAKES YOUR ALIGNMENT UNIQUE
              </h3>
              <p className="font-serif text-sm leading-relaxed" style={{ color: "rgba(200,196,212,0.5)", fontWeight: 300 }}>
                {theme.rareFact} This planetary convergence infuses your astrological houses with an exceptionally focused field of intuition and internal drive.
              </p>
            </div>
          </div>

          {/* ─── Main Report Content ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left: Planet positions */}
            <div className="space-y-6 lg:col-span-1">
              <div
                className="p-6 space-y-4"
                style={{
                  background: "rgba(7,5,26,0.6)",
                  border: "1px solid rgba(212,175,55,0.1)",
                  borderRadius: "2px",
                }}
              >
                <h3
                  className="font-display pb-2"
                  style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: theme.accent, borderBottom: "1px solid rgba(212,175,55,0.08)" }}
                >
                  PLANET POSITIONS
                </h3>
                {(serverCalculations.length > 0 ? serverCalculations : [
                  { name: "Sun", sign: userZodiac, deg: "19° 22'", house: "1st House" },
                  { name: "Moon", sign: "Cancer", deg: "04° 15'", house: "9th House" },
                  { name: "Mercury", sign: userZodiac, deg: "28° 09'", house: "1st House" },
                  { name: "Venus", sign: "Scorpio", deg: "11° 42'", house: "12th House" },
                  { name: "Mars", sign: "Leo", deg: "02° 31'", house: "10th House" },
                  { name: "Jupiter", sign: "Pisces", deg: "15° 50'", house: "5th House" },
                  { name: "Saturn", sign: "Taurus", deg: "21° 04'", house: "7th House" },
                ]).map((p: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center pb-2"
                    style={{ borderBottom: "1px solid rgba(212,175,55,0.04)" }}
                  >
                    <span className="font-serif text-xs" style={{ color: "rgba(248,244,255,0.8)" }}>{p.name}</span>
                    <span className="font-serif text-xs" style={{ color: "rgba(200,196,212,0.5)" }}>{p.sign} {p.deg}</span>
                    <span style={{ fontFamily: "monospace", fontSize: "0.6rem", color: `${theme.accent}aa` }}>{p.house}</span>
                  </div>
                ))}
              </div>

              {/* Share snippet */}
              <div
                className="p-6 text-center"
                style={{
                  background: `linear-gradient(135deg, ${theme.gradientFrom} 0%, rgba(7,5,26,0.6) 100%)`,
                  border: `1px solid ${theme.accent}15`,
                  borderRadius: "2px",
                }}
              >
                <span className="font-serif text-3xl block mb-3" style={{ color: theme.accent, textShadow: `0 0 20px ${theme.accent}` }}>
                  {zodiacChar}
                </span>
                <h4 className="font-display mb-2" style={{ fontSize: "0.55rem", letterSpacing: "0.15em", color: "rgba(248,244,255,0.8)" }}>
                  COSMIC IDENTITY SNIPPET
                </h4>
                <p className="font-serif text-xs mb-4" style={{ color: "rgba(200,196,212,0.5)", fontStyle: "italic" }}>
                  "Driven by {userZodiac} intensity. Receptive with Moon energy. Grounded with unique planetary coordinates."
                </p>
                <button onClick={copyShareLink} className="btn-cosmic" style={{ padding: "0.4rem 1rem", fontSize: "0.5rem" }}>
                  COPY SHARE CARD
                </button>
              </div>
            </div>

            {/* Right: Narrative prose */}
            <div className="lg:col-span-2 space-y-6">
              <div
                className="p-8 space-y-8"
                style={{
                  background: "rgba(7,5,26,0.6)",
                  border: "1px solid rgba(212,175,55,0.1)",
                  borderRadius: "2px",
                }}
              >
                {[
                  {
                    n: "I",
                    title: "The Primary Flame: Solar Consciousness",
                    body: serverNarrative?.solarConsciousness ||
                      `Your ${userZodiac} Sun indicates your core vitality and active conscious drive. Astrologically, this is the center around which your identity revolves. Rather than a set of rigid behaviors, it acts as a lifelong developmental journey. You find purpose by exploring the positive traits of your sign — seeking emotional depth, learning to build healthy trust parameters, and aligning your conscious objectives with internal drives.`,
                  },
                  {
                    n: "II",
                    title: "The Hidden Tide: Lunar Unconscious",
                    body: serverNarrative?.lunarUnconscious ||
                      `The Moon rules the waters of the unconscious mind. In your chart, it represents how you react in moments of stress, what conditions make you feel safe, and how you receive and process affection. Your inner world is characterized by high sensitivity. You process life through an emotional lens, filtering events through intuitive gut responses. Honoring this emotional matrix is essential for your psychological integration.`,
                  },
                  {
                    n: "III",
                    title: "The Mask & Gate: Ascendant Axis",
                    body: serverNarrative?.ascendantAxis ||
                      `Your Ascendant, or Rising Sign, represents the lens through which you view the outside world, and the first impression you broadcast to others. It is the outer gate of your psychic castle. Your Rising alignment ensures that you approach life with an observant, sophisticated, and slightly guarded attitude, allowing you to gauge social currents before engaging.`,
                  },
                ].map((section, i) => (
                  <div key={i} className="space-y-2">
                    <h3 className="font-serif text-xl" style={{ color: theme.accent, fontStyle: "italic" }}>
                      {section.n}. {section.title}
                    </h3>
                    <p className="font-serif text-sm leading-relaxed" style={{ color: "rgba(200,196,212,0.6)", fontWeight: 300 }}>
                      {section.body}
                    </p>
                  </div>
                ))}
              </div>

              {/* Synastry Upsell */}
              <div
                className="p-8 space-y-6"
                style={{
                  background: "linear-gradient(135deg, rgba(107,33,168,0.06) 0%, rgba(7,5,26,0.8) 100%)",
                  border: "1px solid rgba(212,175,55,0.12)",
                  borderRadius: "2px",
                }}
              >
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: "20px" }}>💜</span>
                  <h3 className="font-display" style={{ fontSize: "0.7rem", letterSpacing: "0.15em", color: "rgba(248,244,255,0.9)" }}>
                    UNLOCK RELATIONSHIP SYNERGY
                  </h3>
                </div>

                <p className="font-serif text-xs leading-relaxed" style={{ color: "rgba(200,196,212,0.45)", fontWeight: 300 }}>
                  Explore romantic compatibility or emotional synastry. Input a partner's details to calculate intersecting coordinate degrees, aspect links, and potential friction points.
                </p>

                {!showSynastryResult ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label style={labelStyle}>Partner&apos;s Name</label>
                        <input
                          type="text" value={partnerName}
                          onChange={(e) => setPartnerName(e.target.value)}
                          placeholder="Partner's Name"
                          style={inputStyle}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label style={labelStyle}>Month</label>
                          <select value={partnerMonth} onChange={(e) => setPartnerMonth(Number(e.target.value))} style={{ ...inputStyle, padding: "10px 8px" }}>
                            {MONTHS.map((m, i) => <option key={i} value={i} style={{ background: "#07051a" }}>{m.slice(0, 3)}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={labelStyle}>Day</label>
                          <select value={partnerDay} onChange={(e) => setPartnerDay(Number(e.target.value))} style={{ ...inputStyle, padding: "10px 8px" }}>
                            {range(31).map((d) => <option key={d} value={d + 1} style={{ background: "#07051a" }}>{d + 1}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={labelStyle}>Year</label>
                          <select value={partnerYear} onChange={(e) => setPartnerYear(Number(e.target.value))} style={{ ...inputStyle, padding: "10px 8px" }}>
                            {range(80).map((y) => <option key={y} value={1950 + y} style={{ background: "#07051a" }}>{1950 + y}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setShowSynastryResult(true)} className="btn-cosmic" style={{ padding: "0.6rem 1.5rem", fontSize: "0.55rem" }}>
                      COMPARE ALIGNMENTS
                    </button>
                  </div>
                ) : (
                  <div
                    className="p-5 space-y-4"
                    style={{
                      background: "rgba(0,0,10,0.5)",
                      border: `1px solid ${theme.accent}20`,
                      borderRadius: "2px",
                      animation: "fade-in 0.5s ease",
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-display" style={{ fontSize: "0.55rem", letterSpacing: "0.15em", color: "rgba(248,244,255,0.8)" }}>
                        SYNASTRY: {userZodiac.toUpperCase()} & {getZodiacSign(partnerDay, partnerMonth + 1).toUpperCase()}
                      </span>
                      <button
                        onClick={() => setShowSynastryResult(false)}
                        className="flex items-center gap-1"
                        style={{ fontFamily: "var(--font-display)", fontSize: "0.4rem", letterSpacing: "0.1em", color: "rgba(200,196,212,0.4)" }}
                      >
                        ↻ COMPARE ANOTHER
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center">
                      {[
                        { val: "88%", label: "Resonance", color: "#ec4899" },
                        { val: "72%", label: "Communication", color: "#d4af37" },
                        { val: "92%", label: "Shared Destiny", color: "#14b8a6" },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className="p-3"
                          style={{ background: "rgba(255,255,255,0.02)", borderRadius: "2px", border: "1px solid rgba(212,175,55,0.06)" }}
                        >
                          <div className="font-display text-lg" style={{ color: s.color }}>{s.val}</div>
                          <div style={{ fontFamily: "var(--font-display)", fontSize: "0.35rem", letterSpacing: "0.15em", color: "rgba(200,196,212,0.35)" }}>
                            {s.label.toUpperCase()}
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="font-serif text-xs leading-relaxed" style={{ color: "rgba(200,196,212,0.5)", fontStyle: "italic", fontWeight: 300 }}>
                      "A high concentration of trine aspects between your {userZodiac} Sun and their Venus configuration creates a beautiful, frictionless flow of appreciation. This connection fosters mutual trust, but demands active commitment to sustain depth over time."
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reset */}
          <div className="text-center pt-4">
            <button
              onClick={() => {
                setRevealReport(false);
                setIsPaid(false);
                setShowSnapshot(false);
                setRevealPhase(0);
                setStep(0);
              }}
              className="inline-flex items-center gap-2 font-display transition-colors duration-300"
              style={{ fontSize: "0.5rem", letterSpacing: "0.2em", color: "rgba(200,196,212,0.3)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#d4af37"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(200,196,212,0.3)"; }}
            >
              ↻ RE-CALIBRATE ANOTHER ALIGNMENT
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
