// src/lib/synastryEngine.ts
import { calculateNatalParameters, PlanetaryPosition } from "./astrologyEngine";

export interface SynastryReportNarrative {
  overallCompatibilityScore: number;
  sunCompatibility: string;
  sunNarrative: string;
  moonCompatibility: string;
  moonNarrative: string;
  venusMarsDynamics: string;
  communicationFriction: string;
  karmicConnection: string;
}

const ELEMENT_COMPATIBILITY: Record<string, Record<string, string>> = {
  Fire: { Fire: "High", Air: "High", Earth: "Low", Water: "Low" },
  Earth: { Earth: "High", Water: "High", Fire: "Low", Air: "Low" },
  Air: { Air: "High", Fire: "High", Water: "Low", Earth: "Low" },
  Water: { Water: "High", Earth: "High", Fire: "Low", Air: "Low" }
};

const SYNASTRY_NARRATIVES: Record<string, Record<string, string>> = {
  High: {
    Sun: "Your core identities naturally align, offering a deep sense of mutual respect and shared life direction.",
    Moon: "Your emotional inner worlds are deeply attuned. You intuitively understand each other's needs without having to explain them.",
  },
  Low: {
    Sun: "Your core life forces challenge each other. This friction can lead to immense personal growth, though it requires conscious compromise.",
    Moon: "Your emotional needs speak different languages. One may seek space while the other seeks closeness. Patience is your greatest ally here.",
  }
};

export function generateSynastryReport(
  p1: { month: number, day: number, hour: number, minute: number },
  p2: { month: number, day: number, hour: number, minute: number }
): SynastryReportNarrative {
  
  const chart1 = calculateNatalParameters(p1.month, p1.day, p1.hour, p1.minute);
  const chart2 = calculateNatalParameters(p2.month, p2.day, p2.hour, p2.minute);

  const p1SunElement = chart1.positions.find(p => p.name === "Sun")?.element || "Fire";
  const p2SunElement = chart2.positions.find(p => p.name === "Sun")?.element || "Fire";
  
  const p1MoonElement = chart1.positions.find(p => p.name === "Moon")?.element || "Water";
  const p2MoonElement = chart2.positions.find(p => p.name === "Moon")?.element || "Water";

  const sunComp = ELEMENT_COMPATIBILITY[p1SunElement]?.[p2SunElement] || "Low";
  const moonComp = ELEMENT_COMPATIBILITY[p1MoonElement]?.[p2MoonElement] || "Low";

  let score = 50;
  if (sunComp === "High") score += 20;
  if (moonComp === "High") score += 20;
  
  // Random variance for uniqueness
  score += (p1.day + p2.day) % 10;

  return {
    overallCompatibilityScore: Math.min(score, 99),
    sunCompatibility: sunComp,
    sunNarrative: SYNASTRY_NARRATIVES[sunComp]["Sun"],
    moonCompatibility: moonComp,
    moonNarrative: SYNASTRY_NARRATIVES[moonComp]["Moon"],
    venusMarsDynamics: "Your romantic and physical energies create a dynamic spark. There is a strong magnetic pull that keeps the relationship exciting.",
    communicationFriction: "Mercury aspects suggest you may occasionally misunderstand each other's pacing. Practice active listening.",
    karmicConnection: "Saturn and Jupiter connections indicate a fated relationship meant to teach you both profound lessons about commitment and freedom."
  };
}
