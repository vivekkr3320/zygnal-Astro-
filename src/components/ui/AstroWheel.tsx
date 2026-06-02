"use client";

import React, { useMemo } from "react";

/* ═════════════════════════════════════════════════
   ZYGNAL ASTRO — SACRED GEOMETRY WHEEL
   Cinematic astrology instrument with:
   - 5 concentric rings at different speeds
   - 12 zodiac glyph chambers
   - 7 planetary nodes on orbital paths
   - Sacred geometry (Merkaba star)
   - Engraved golden precision ticks
   - SVG defs: metallic gradients + glow filters
   ═════════════════════════════════════════════════ */

const ZODIAC = [
  { char: "♈", name: "Aries",       element: "fire" },
  { char: "♉", name: "Taurus",      element: "earth" },
  { char: "♊", name: "Gemini",      element: "air" },
  { char: "♋", name: "Cancer",      element: "water" },
  { char: "♌", name: "Leo",         element: "fire" },
  { char: "♍", name: "Virgo",       element: "earth" },
  { char: "♎", name: "Libra",       element: "air" },
  { char: "♏", name: "Scorpio",     element: "water" },
  { char: "♐", name: "Sagittarius", element: "fire" },
  { char: "♑", name: "Capricorn",   element: "earth" },
  { char: "♒", name: "Aquarius",    element: "air" },
  { char: "♓", name: "Pisces",      element: "water" },
];

const PLANETS = [
  { symbol: "☉", name: "Sun",     r: 148, angleDeg: 38,  size: 9, color: "#f5e5a0" },
  { symbol: "☽", name: "Moon",    r: 128, angleDeg: 155, size: 8, color: "#c8c4d4" },
  { symbol: "♂", name: "Mars",    r: 112, angleDeg: 272, size: 7, color: "#ef4444" },
  { symbol: "☿", name: "Mercury", r: 96,  angleDeg: 64,  size: 7, color: "#d4af37" },
  { symbol: "♀", name: "Venus",   r: 140, angleDeg: 310, size: 7, color: "#ec4899" },
  { symbol: "♃", name: "Jupiter", r: 120, angleDeg: 195, size: 8, color: "#a78bfa" },
  { symbol: "♄", name: "Saturn",  r: 104, angleDeg: 112, size: 7, color: "#94a3b8" },
];

const ELEMENT_COLORS: Record<string, string> = {
  fire:  "rgba(239,68,68,0.5)",
  earth: "rgba(101,163,13,0.4)",
  air:   "rgba(147,197,253,0.4)",
  water: "rgba(96,165,250,0.45)",
};

const SACRED_TRIANGLES = [
  [0, 4, 8],   // Fire trine
  [1, 5, 9],   // Earth trine
  [2, 6, 10],  // Air trine
  [3, 7, 11],  // Water trine
];

const round2 = (n: number) => Math.round(n * 100) / 100;

function toRad(deg: number) { return (deg * Math.PI) / 180; }

export default function AstroWheel() {
  const SIZE = 520;
  const C = SIZE / 2; // center

  const geo = useMemo(() => {
    // Outer degree ticks (every 5°, major every 30°)
    const ticks = Array.from({ length: 72 }, (_, i) => {
      const a = toRad(i * 5);
      const major = i % 6 === 0;
      const r1 = 246;
      const r2 = major ? 234 : 239;
      return {
        x1: round2(C + r1 * Math.cos(a)),
        y1: round2(C + r1 * Math.sin(a)),
        x2: round2(C + r2 * Math.cos(a)),
        y2: round2(C + r2 * Math.sin(a)),
        major,
      };
    });

    // Sector mid-angle dividers
    const sectors = Array.from({ length: 12 }, (_, i) => {
      const a = toRad(i * 30);
      return {
        x1: round2(C + 170 * Math.cos(a)),
        y1: round2(C + 170 * Math.sin(a)),
        x2: round2(C + 246 * Math.cos(a)),
        y2: round2(C + 246 * Math.sin(a)),
      };
    });

    // Zodiac glyph positions (midpoint of each 30° sector)
    const zodiacs = ZODIAC.map((z, i) => {
      const a = toRad(i * 30 + 15);
      return {
        ...z,
        x: round2(C + 208 * Math.cos(a)),
        y: round2(C + 208 * Math.sin(a)),
        labelX: round2(C + 185 * Math.cos(a)),
        labelY: round2(C + 185 * Math.sin(a)),
        rotation: i * 30 + 15 + 90,
      };
    });

    // Sacred geometry — 4 elemental triangles
    const triangles = SACRED_TRIANGLES.map((indices, ti) => {
      const points = indices.map((idx) => {
        const a = toRad(idx * 30 + 15);
        return {
          x: round2(C + 80 * Math.cos(a)),
          y: round2(C + 80 * Math.sin(a)),
        };
      });
      return { points, element: ZODIAC[indices[0]].element };
    });

    // Planetary nodes
    const planets = PLANETS.map((p) => {
      const a = toRad(p.angleDeg);
      return {
        ...p,
        x: round2(C + p.r * Math.cos(a)),
        y: round2(C + p.r * Math.sin(a)),
      };
    });

    // Aspect lines (connecting planetary nodes)
    const aspects = [
      { from: 0, to: 3, color: "#d4af37", opacity: 0.4, dash: "4,4" },
      { from: 1, to: 5, color: "#a78bfa", opacity: 0.35, dash: "none" },
      { from: 2, to: 6, color: "#ef4444", opacity: 0.3, dash: "2,4" },
      { from: 0, to: 5, color: "#d4af37", opacity: 0.3, dash: "6,3" },
      { from: 4, to: 1, color: "#ec4899", opacity: 0.25, dash: "none" },
    ].map((a) => ({
      ...a,
      x1: planets[a.from].x,
      y1: planets[a.from].y,
      x2: planets[a.to].x,
      y2: planets[a.to].y,
    }));

    // House cusp labels
    const houseCusps = Array.from({ length: 12 }, (_, i) => {
      const a = toRad(i * 30 + 15);
      return {
        n: i + 1,
        x: round2(C + 155 * Math.cos(a)),
        y: round2(C + 155 * Math.sin(a)),
      };
    });

    return { ticks, sectors, zodiacs, triangles, planets, aspects, houseCusps };
  }, []);

  return (
    <div className="relative w-full max-w-[520px] aspect-square mx-auto select-none">
      {/* Outer ambient glow */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, rgba(107,33,168,0.05) 50%, transparent 75%)",
          filter: "blur(24px)",
        }}
      />

      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full h-full overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Sacred Astrology Wheel"
      >
        <defs>
          {/* Metallic gold gradient */}
          <linearGradient id="gold-metal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#fdf6d8" stopOpacity="0.9" />
            <stop offset="25%"  stopColor="#e8c958" stopOpacity="0.85" />
            <stop offset="50%"  stopColor="#d4af37" stopOpacity="1" />
            <stop offset="75%"  stopColor="#b8941c" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0.95" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="glow-gold" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-soft" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="planet-glow" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Radial center gradient */}
          <radialGradient id="center-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#d4af37" stopOpacity="0.15" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* Ring outer rim gradient */}
          <radialGradient id="outer-rim" cx="50%" cy="50%" r="50%">
            <stop offset="85%"  stopColor="transparent" />
            <stop offset="95%"  stopColor="rgba(212,175,55,0.08)" />
            <stop offset="100%" stopColor="rgba(212,175,55,0.2)" />
          </radialGradient>
        </defs>

        {/* ═══ RING 5 — Deep space void fill ═══ */}
        <circle cx={C} cy={C} r={246}
          fill="rgba(0,0,10,0.85)"
          stroke="rgba(212,175,55,0.12)" strokeWidth="1"
        />

        {/* ═══ RING 4 — Outer rim glow ═══ */}
        <circle cx={C} cy={C} r={246} fill="url(#outer-rim)" />

        {/* ═══ Degree Ticks — Slowly rotating outer ring ═══ */}
        <g className="animate-spin-slow" style={{ transformOrigin: `${C}px ${C}px` }}>
          {geo.ticks.map((t, i) => (
            <line
              key={`tick-${i}`}
              x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
              stroke={t.major ? "url(#gold-metal)" : "rgba(212,175,55,0.3)"}
              strokeWidth={t.major ? "1.5" : "0.8"}
            />
          ))}
          {/* Outer circle */}
          <circle cx={C} cy={C} r={246}
            fill="none"
            stroke="url(#gold-metal)" strokeWidth="1.5"
          />
          <circle cx={C} cy={C} r={238}
            fill="none"
            stroke="rgba(212,175,55,0.2)" strokeWidth="0.5"
          />
        </g>

        {/* ═══ RING 3 — Zodiac band (counter-rotate slowly) ═══ */}
        <g className="animate-spin-reverse" style={{ transformOrigin: `${C}px ${C}px` }}>
          {/* Zodiac band fill */}
          <circle cx={C} cy={C} r={232}
            fill="none"
            stroke="rgba(212,175,55,0.08)" strokeWidth="60"
          />
          <circle cx={C} cy={C} r={232}
            fill="none"
            stroke="rgba(212,175,55,0.25)" strokeWidth="0.8"
          />
          <circle cx={C} cy={C} r={170}
            fill="none"
            stroke="rgba(212,175,55,0.25)" strokeWidth="0.8"
          />

          {/* 12 Sector dividers */}
          {geo.sectors.map((s, i) => (
            <line
              key={`sec-${i}`}
              x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
              stroke="rgba(212,175,55,0.3)" strokeWidth="0.8"
            />
          ))}

          {/* Zodiac glyphs */}
          {geo.zodiacs.map((z, i) => (
            <g key={`zod-${i}`}>
              {/* Element color background per segment */}
              <path
                d={`M ${C} ${C} L ${round2(C + 246 * Math.cos(toRad(i * 30 - 90)))} ${round2(C + 246 * Math.sin(toRad(i * 30 - 90)))} A 246 246 0 0 1 ${round2(C + 246 * Math.cos(toRad((i + 1) * 30 - 90)))} ${round2(C + 246 * Math.sin(toRad((i + 1) * 30 - 90)))} Z`}
                fill={ELEMENT_COLORS[z.element]}
                opacity="0.12"
              />
              {/* Glyph */}
              <text
                x={z.x} y={z.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="url(#gold-metal)"
                fontSize="18"
                fontFamily="serif"
                filter="url(#glow-gold)"
                style={{ transform: `rotate(${z.rotation}deg)`, transformOrigin: `${z.x}px ${z.y}px` }}
              >
                {z.char}
              </text>
              {/* Name label */}
              <text
                x={z.labelX} y={z.labelY}
                textAnchor="middle"
                dominantBaseline="central"
                fill="rgba(212,175,55,0.45)"
                fontSize="6"
                fontFamily="serif"
                letterSpacing="1"
                style={{ transform: `rotate(${z.rotation}deg)`, transformOrigin: `${z.labelX}px ${z.labelY}px` }}
              >
                {z.name.toUpperCase()}
              </text>
            </g>
          ))}
        </g>

        {/* ═══ RING 2 — House system + orbit paths ═══ */}
        <g className="animate-spin-slow" style={{ transformOrigin: `${C}px ${C}px`, animationDuration: "200s" }}>
          {/* House ring */}
          <circle cx={C} cy={C} r={165}
            fill="rgba(0,0,10,0.6)"
            stroke="rgba(212,175,55,0.2)" strokeWidth="0.8"
          />

          {/* Orbital ellipse paths */}
          <ellipse cx={C} cy={C} rx={148} ry={142}
            fill="none" stroke="rgba(212,175,55,0.08)" strokeWidth="0.5" strokeDasharray="4,8"
          />
          <ellipse cx={C} cy={C} rx={128} ry={122}
            fill="none" stroke="rgba(167,139,250,0.08)" strokeWidth="0.5" strokeDasharray="2,6"
          />
          <ellipse cx={C} cy={C} rx={112} ry={108}
            fill="none" stroke="rgba(239,68,68,0.06)" strokeWidth="0.5" strokeDasharray="3,7"
          />

          {/* House cusp numbers */}
          {geo.houseCusps.map((h) => (
            <text
              key={`house-${h.n}`}
              x={h.x} y={h.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="rgba(212,175,55,0.3)"
              fontSize="8"
              fontFamily="serif"
            >
              {h.n}
            </text>
          ))}
        </g>

        {/* ═══ RING 1 — Sacred inner geometry ═══ */}
        <g>
          {/* Inner circle boundary */}
          <circle cx={C} cy={C} r={90}
            fill="rgba(0,0,10,0.7)"
            stroke="rgba(212,175,55,0.3)" strokeWidth="1"
          />

          {/* 4 Elemental trine triangles */}
          {geo.triangles.map((tri, ti) => {
            const pts = tri.points.map((p) => `${p.x},${p.y}`).join(" ");
            const colors = {
              fire: "rgba(239,68,68,0.25)",
              earth: "rgba(101,163,13,0.2)",
              air: "rgba(147,197,253,0.2)",
              water: "rgba(96,165,250,0.25)",
            };
            return (
              <polygon
                key={`tri-${ti}`}
                points={pts}
                fill={colors[tri.element as keyof typeof colors]}
                stroke={colors[tri.element as keyof typeof colors].replace("0.2", "0.5").replace("0.25", "0.5")}
                strokeWidth="0.8"
              />
            );
          })}

          {/* Aspect lines */}
          {geo.aspects.map((a, i) => (
            <line
              key={`asp-${i}`}
              x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2}
              stroke={a.color}
              strokeOpacity={a.opacity}
              strokeWidth="0.8"
              strokeDasharray={a.dash === "none" ? undefined : a.dash}
            />
          ))}

          {/* Inner ring details */}
          <circle cx={C} cy={C} r={50}
            fill="url(#center-grad)"
            stroke="rgba(212,175,55,0.2)" strokeWidth="0.8"
          />

          {/* Six-pointed star (Merkaba) */}
          {[0, 60, 120, 180, 240, 300].map((deg, i) => {
            const a = toRad(deg);
            const r = 42;
            return (
              <line
                key={`merkaba-${i}`}
                x1={round2(C + r * Math.cos(a))}
                y1={round2(C + r * Math.sin(a))}
                x2={round2(C + r * Math.cos(a + Math.PI))}
                y2={round2(C + r * Math.sin(a + Math.PI))}
                stroke="rgba(212,175,55,0.2)"
                strokeWidth="0.8"
              />
            );
          })}

          {/* Planetary nodes */}
          {geo.planets.map((p, i) => (
            <g key={`planet-${i}`} filter="url(#planet-glow)">
              {/* Glow halo */}
              <circle cx={p.x} cy={p.y} r={p.size + 4}
                fill={`${p.color}15`}
                stroke={p.color}
                strokeOpacity="0.2"
                strokeWidth="0.5"
              />
              {/* Planet circle */}
              <circle cx={p.x} cy={p.y} r={p.size}
                fill={`${p.color}20`}
                stroke={p.color}
                strokeOpacity="0.7"
                strokeWidth="1.2"
              />
              {/* Planet symbol */}
              <text
                x={p.x} y={p.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={p.color}
                fontSize={p.size + 1}
                fontFamily="serif"
                fillOpacity="0.9"
              >
                {p.symbol}
              </text>
            </g>
          ))}
        </g>

        {/* ═══ CENTER MEDALLION ═══ */}
        <g filter="url(#glow-soft)">
          {/* Outer ring */}
          <circle cx={C} cy={C} r={22}
            fill="rgba(0,0,10,0.9)"
            stroke="url(#gold-metal)" strokeWidth="1.5"
          />
          {/* Inner decoration */}
          <circle cx={C} cy={C} r={14}
            fill="rgba(212,175,55,0.06)"
            stroke="rgba(212,175,55,0.4)" strokeWidth="0.8"
          />
          {/* Center dot */}
          <circle cx={C} cy={C} r={5}
            fill="url(#gold-metal)"
          />
          {/* Four compass points */}
          {[0, 90, 180, 270].map((deg, i) => {
            const a = toRad(deg);
            const r1 = 7;
            const r2 = 13;
            return (
              <line
                key={`compass-${i}`}
                x1={round2(C + r1 * Math.cos(a))}
                y1={round2(C + r1 * Math.sin(a))}
                x2={round2(C + r2 * Math.cos(a))}
                y2={round2(C + r2 * Math.sin(a))}
                stroke="rgba(212,175,55,0.6)"
                strokeWidth="0.8"
              />
            );
          })}
        </g>

        {/* ═══ OUTERMOST ENGRAVED FRAME ═══ */}
        <circle cx={C} cy={C} r={252}
          fill="none"
          stroke="rgba(212,175,55,0.06)" strokeWidth="8"
        />
        <circle cx={C} cy={C} r={254}
          fill="none"
          stroke="rgba(212,175,55,0.15)" strokeWidth="0.5"
        />
        <circle cx={C} cy={C} r={248}
          fill="none"
          stroke="rgba(212,175,55,0.15)" strokeWidth="0.5"
        />
      </svg>
    </div>
  );
}
