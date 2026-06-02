/* src/app/birth-onboarding/page.tsx */
"use client";

import dynamic from "next/dynamic";
import OnboardingForm from "@/components/onboarding/OnboardingForm";
import Navbar from "@/components/ui/Navbar";

const CosmicBackground = dynamic(
  () => import("@/components/ui/CosmicBackground"),
  { ssr: false }
);

export default function BirthOnboardingPage() {
  return (
    <div
      className="relative min-h-screen text-white flex flex-col overflow-x-hidden"
      style={{ background: "#00000a" }}
    >
      {/* Canvas cosmic environment */}
      <CosmicBackground />

      {/* Navbar */}
      <Navbar />

      {/* Atmospheric gradient overlays */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 100% 60% at 50% 0%, rgba(107,33,168,0.1) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 60% 40% at 80% 80%, rgba(29,78,216,0.06) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.012] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Main onboarding container */}
      <main className="flex-grow flex items-center justify-center relative z-10 pt-28 pb-16 px-4">
        <OnboardingForm />
      </main>

      {/* Footer */}
      <footer
        className="relative z-10 py-8 text-center"
        style={{ borderTop: "1px solid rgba(212,175,55,0.08)" }}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="font-serif text-xs"
            style={{ color: "rgba(200,196,212,0.25)", fontStyle: "italic" }}
          >
            © 2026 Zygnal Astro · All rights cosmic · Written in starlight.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="nav-link text-left" style={{ paddingBottom: "2px" }}>Privacy Charter</a>
            <a href="#" className="nav-link text-left" style={{ paddingBottom: "2px" }}>Terms of Alignment</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
