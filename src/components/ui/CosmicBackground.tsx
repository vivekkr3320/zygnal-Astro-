"use client";

import React, { useEffect, useRef, useCallback } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  layer: number; // 0=far, 1=mid, 2=near (parallax)
}

interface ShootingStar {
  x: number;
  y: number;
  angle: number;
  speed: number;
  length: number;
  opacity: number;
  life: number;
  maxLife: number;
}

interface NebulaCloud {
  x: number;
  y: number;
  rx: number;
  ry: number;
  color: string;
  opacity: number;
  driftX: number;
  driftY: number;
  phase: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  color: string;
}

// Seeded pseudo-random for deterministic layout without Math.random()
function seededRng(seed: number) {
  let s = seed;
  return function (): number {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export default function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  const initScene = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const W = canvas.width;
    const H = canvas.height;
    const rng = seededRng(42);

    // --- Stars ---
    const stars: Star[] = Array.from({ length: 320 }, (_, i) => ({
      x: rng() * W,
      y: rng() * H,
      size: rng() * 1.8 + 0.2,
      opacity: rng() * 0.7 + 0.2,
      twinkleSpeed: rng() * 0.015 + 0.003,
      twinklePhase: rng() * Math.PI * 2,
      layer: Math.floor(rng() * 3),
    }));

    // --- Nebulae ---
    const nebulaColors = [
      "rgba(107,33,168,",  // violet
      "rgba(67,56,202,",   // indigo
      "rgba(139,20,80,",   // rose
      "rgba(180,130,20,",  // gold
      "rgba(29,78,216,",   // blue
    ];
    const nebulae: NebulaCloud[] = Array.from({ length: 6 }, (_, i) => ({
      x: rng() * W,
      y: rng() * H,
      rx: rng() * 300 + 200,
      ry: rng() * 200 + 150,
      color: nebulaColors[i % nebulaColors.length],
      opacity: rng() * 0.12 + 0.04,
      driftX: (rng() - 0.5) * 0.08,
      driftY: (rng() - 0.5) * 0.05,
      phase: rng() * Math.PI * 2,
    }));

    // --- Shooting Stars ---
    const shootingStars: ShootingStar[] = [];
    let nextShoot = rng() * 4000 + 2000;

    // --- Particles ---
    const particles: Particle[] = [];
    const particleColors = ["rgba(212,175,55,", "rgba(200,196,212,", "rgba(255,255,255,"];

    let lastTime = 0;

    function spawnParticle() {
      if (particles.length > 40) return;
      const r = seededRng(Date.now() % 10000);
      particles.push({
        x: r() * W,
        y: H + 10,
        vx: (r() - 0.5) * 0.4,
        vy: -(r() * 0.4 + 0.15),
        size: r() * 1.5 + 0.5,
        opacity: r() * 0.6 + 0.2,
        life: 0,
        maxLife: r() * 200 + 100,
        color: particleColors[Math.floor(r() * particleColors.length)],
      });
    }

    function spawnShootingStar() {
      const r = seededRng(Date.now() % 99999);
      shootingStars.push({
        x: r() * W * 0.7,
        y: r() * H * 0.4,
        angle: Math.PI / 6 + r() * 0.4,
        speed: r() * 8 + 6,
        length: r() * 120 + 60,
        opacity: 1,
        life: 0,
        maxLife: r() * 60 + 40,
      });
    }

    function draw(timestamp: number) {
      const delta = timestamp - lastTime;
      lastTime = timestamp;
      timeRef.current += delta;
      const t = timeRef.current * 0.001;

      // Clear with deep void
      ctx.fillStyle = "rgba(0, 0, 10, 0.15)";
      ctx.fillRect(0, 0, W, H);

      // --- Draw Nebulae ---
      nebulae.forEach((neb) => {
        neb.x += neb.driftX;
        neb.y += neb.driftY;
        if (neb.x > W + neb.rx) neb.x = -neb.rx;
        if (neb.x < -neb.rx) neb.x = W + neb.rx;
        if (neb.y > H + neb.ry) neb.y = -neb.ry;
        if (neb.y < -neb.ry) neb.y = H + neb.ry;

        const pulseFactor = Math.sin(t * 0.3 + neb.phase) * 0.4 + 0.6;
        const grad = ctx.createRadialGradient(neb.x, neb.y, 0, neb.x, neb.y, neb.rx);
        grad.addColorStop(0, `${neb.color}${(neb.opacity * pulseFactor).toFixed(3)})`);
        grad.addColorStop(0.5, `${neb.color}${(neb.opacity * pulseFactor * 0.4).toFixed(3)})`);
        grad.addColorStop(1, `${neb.color}0)`);
        ctx.save();
        ctx.scale(1, neb.ry / neb.rx);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(neb.x, neb.y * (neb.rx / neb.ry), neb.rx, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // --- Draw Stars ---
      stars.forEach((star) => {
        const twinkle = Math.sin(t * star.twinkleSpeed * 100 + star.twinklePhase);
        const opacity = star.opacity * (0.5 + 0.5 * twinkle);
        const size = star.size * (0.85 + 0.15 * twinkle);

        if (size > 1.2) {
          // Larger stars get a glow
          const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, size * 4);
          glow.addColorStop(0, `rgba(255,255,255,${opacity.toFixed(3)})`);
          glow.addColorStop(0.3, `rgba(212,175,55,${(opacity * 0.3).toFixed(3)})`);
          glow.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(star.x, star.y, size * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = `rgba(255,255,255,${opacity.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
        ctx.fill();
      });

      // --- Shooting Stars ---
      nextShoot -= delta;
      if (nextShoot <= 0) {
        spawnShootingStar();
        nextShoot = seededRng(Math.floor(Date.now() / 100))() * 5000 + 3000;
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.life++;
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.opacity = 1 - s.life / s.maxLife;

        const tailX = s.x - Math.cos(s.angle) * s.length;
        const tailY = s.y - Math.sin(s.angle) * s.length;

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(0.7, `rgba(212,175,55,${(s.opacity * 0.5).toFixed(3)})`);
        grad.addColorStop(1, `rgba(255,255,255,${s.opacity.toFixed(3)})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();

        if (s.life >= s.maxLife) shootingStars.splice(i, 1);
      }

      // --- Particles ---
      if (Math.random() < 0.03) spawnParticle();

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        const alpha = (1 - p.life / p.maxLife) * p.opacity;

        ctx.fillStyle = `${p.color}${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.life >= p.maxLife || p.y < -10) particles.splice(i, 1);
      }

      // --- Volumetric light rays (static, drawn last) ---
      ctx.save();
      const centerX = W * 0.5;
      for (let r = 0; r < 5; r++) {
        const rayAngle = -Math.PI / 2 + (r - 2) * 0.22 + Math.sin(t * 0.08 + r) * 0.03;
        const rayLen = H * 1.4;
        const rayGrad = ctx.createLinearGradient(
          centerX, 0,
          centerX + Math.cos(rayAngle) * rayLen,
          Math.sin(rayAngle) * rayLen
        );
        const rayOpacity = 0.025 + Math.sin(t * 0.1 + r * 1.3) * 0.015;
        rayGrad.addColorStop(0, `rgba(212,175,55,${rayOpacity.toFixed(3)})`);
        rayGrad.addColorStop(0.4, `rgba(180,130,50,${(rayOpacity * 0.5).toFixed(3)})`);
        rayGrad.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        const spreadAngle = 0.04;
        ctx.moveTo(centerX, 0);
        ctx.lineTo(
          centerX + Math.cos(rayAngle - spreadAngle) * rayLen,
          Math.sin(rayAngle - spreadAngle) * rayLen
        );
        ctx.lineTo(
          centerX + Math.cos(rayAngle + spreadAngle) * rayLen,
          Math.sin(rayAngle + spreadAngle) * rayLen
        );
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      frameRef.current = requestAnimationFrame(draw);
    }

    frameRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    // Full clear on resize
    ctx.fillStyle = "#00000a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    initScene(canvas, ctx);

    return () => {
      window.removeEventListener("resize", resize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [initScene]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ mixBlendMode: "screen" }}
      aria-hidden="true"
    />
  );
}
