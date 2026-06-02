// src/lib/forecastEngine.ts
/**
 * Deterministic cosmic forecast generator.
 * Given birth parameters and a target date, returns a forecast.
 * The same inputs always produce the same output, useful for caching.
 */
export interface Forecast {
  todayEnergy: string;
  weekCareer: string;
  weekLove: string;
  weekMoney: string;
  weekHealth: string;
  opportunities: string[];
  warnings: string[];
}

// Utility to get day-of-year (1-366)
function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime() + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

// Simple deterministic hash based on inputs
function deterministicHash(...values: (string | number)[]): number {
  let hash = 0;
  for (const val of values) {
    const str = String(val);
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
  }
  return Math.abs(hash);
}

// Sample phrase banks
const ENERGY_PHRASES = [
  "Your aura burns bright, inviting opportunity.",
  "A subtle calm surrounds you; great for reflection.",
  "Turbulent winds hint at unexpected change.",
];

const CAREER_PHRASES = [
  "A new project will showcase your talents.",
  "Collaboration will bring hidden rewards.",
  "Avoid overcommitting – focus on priorities.",
];

const LOVE_PHRASES = [
  "Romantic sparks will reignite in familiar places.",
  "Communication will deepen emotional bonds.",
  "Guard your heart; not all gestures are sincere.",
];

const MONEY_PHRASES = [
  "A modest gain is on the horizon; invest wisely.",
  "Watch unexpected expenses; keep a buffer.",
  "A sudden opportunity may bring profit – evaluate carefully.",
];

const HEALTH_PHRASES = [
  "Energy levels rise – perfect for physical activity.",
  "Prioritize rest; mental fatigue may surface.",
  "Listen to your body; minor aches could indicate imbalance.",
];

const OPPORTUNITY_PHRASES = [
  "A mentorship could open new doors.",
  "Travel plans may bring fresh perspectives.",
  "A creative hobby will spark inspiration.",
];

const WARNING_PHRASES = [
  "Beware of overextending finances.",
  "Emotional impulsivity may cause friction.",
  "Stress could affect decision‑making; pause before acting.",
];

export function generateForecast(
  birthMonth: number,
  birthDay: number,
  birthYear: number,
  targetDate: Date = new Date()
): Forecast {
  // Deterministic seed based on birth data + target date
  const seed = deterministicHash(birthMonth, birthDay, birthYear, targetDate.toISOString());

  const pick = (arr: string[], offset: number) => arr[(seed + offset) % arr.length];

  const todayEnergy = pick(ENERGY_PHRASES, 0);
  const weekCareer = pick(CAREER_PHRASES, 1);
  const weekLove = pick(LOVE_PHRASES, 2);
  const weekMoney = pick(MONEY_PHRASES, 3);
  const weekHealth = pick(HEALTH_PHRASES, 4);

  // Choose 2‑3 opportunities & 1‑2 warnings
  const oppCount = (seed % 3) + 1; // 1‑3
  const warnCount = (seed % 2) + 1; // 1‑2
  const opportunities: string[] = [];
  const warnings: string[] = [];
  for (let i = 0; i < oppCount; i++) {
    opportunities.push(pick(OPPORTUNITY_PHRASES, 5 + i));
  }
  for (let i = 0; i < warnCount; i++) {
    warnings.push(pick(WARNING_PHRASES, 8 + i));
  }

  return {
    todayEnergy,
    weekCareer,
    weekLove,
    weekMoney,
    weekHealth,
    opportunities,
    warnings,
  };
}
