// src/components/ui/ForecastCard.tsx
import React from "react";
import { Forecast } from "@/lib/forecastEngine";

interface ForecastCardProps {
  forecast: Forecast;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ forecast }) => {
  const {
    todayEnergy,
    weekCareer,
    weekLove,
    weekMoney,
    weekHealth,
    opportunities,
    warnings,
  } = forecast;

  return (
    <div className="p-6 bg-black/45 border border-[#d4af37]/15 rounded-xl backdrop-blur-sm shadow-lg">
      <h2 className="text-xl font-display text-[#d4af37] mb-4">Today's Energy</h2>
      <p className="text-sm text-[#c8c4d4] mb-6">{todayEnergy}</p>

      <h3 className="text-lg font-display text-[#d4af37] mb-2">This Week</h3>
      <ul className="space-y-2 mb-4">
        <li className="text-sm text-[#c8c4d4]"><strong>Career:</strong> {weekCareer}</li>
        <li className="text-sm text-[#c8c4d4]"><strong>Love:</strong> {weekLove}</li>
        <li className="text-sm text-[#c8c4d4]"><strong>Money:</strong> {weekMoney}</li>
        <li className="text-sm text-[#c8c4d4]"><strong>Health:</strong> {weekHealth}</li>
      </ul>

      <h3 className="text-lg font-display text-[#d4af37] mb-2">Opportunities</h3>
      <ul className="list-disc list-inside text-sm text-[#c8c4d4] mb-4">
        {opportunities.map((op, i) => (
          <li key={i}>{op}</li>
        ))}
      </ul>

      <h3 className="text-lg font-display text-[#d4af37] mb-2">Warnings</h3>
      <ul className="list-disc list-inside text-sm text-[#c8c4d4]">
        {warnings.map((w, i) => (
          <li key={i}>{w}</li>
        ))}
      </ul>
    </div>
  );
};

export default ForecastCard;
