/* src/components/feature/FeatureStrip.tsx */
"use client";

import React from "react";
import { Compass, Users, Sparkles, Moon } from "lucide-react";

const FEATURES = [
  {
    icon: Compass,
    title: "Birth Chart Blueprint",
    description: "Deep dimensional mapping of planetary positions at your precise moment of entry.",
  },
  {
    icon: Users,
    title: "Celestial Synastry",
    description: "Multi-layered compatibility intelligence analyzing energy intersections.",
  },
  {
    icon: Sparkles,
    title: "Transits & Forecasts",
    description: "Real-time astronomical mapping overlaid on your personal cosmic signature.",
  },
  {
    icon: Moon,
    title: "Lunar Alignment",
    description: "Phase tracking optimized for psychological cycle mapping and meditation.",
  },
];

export default function FeatureStrip() {
  return (
    <section className="py-16 bg-black/90 border-t border-b border-gold-400/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group relative p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-gold-400/30 transition-all duration-500 shadow-xl overflow-hidden"
              >
                {/* Background light glow */}
                <div className="absolute -top-10 -left-10 w-24 h-24 bg-gold-400/5 rounded-full blur-xl group-hover:bg-gold-400/10 transition-all duration-500" />
                
                <div className="mb-4 inline-flex p-3 rounded-xl bg-gold-400/10 text-gold-400 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-6 w-6" />
                </div>
                
                <h3 className="font-serif text-lg text-white mb-2 tracking-wide group-hover:text-gold-300 transition-colors">
                  {feat.title}
                </h3>
                
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
