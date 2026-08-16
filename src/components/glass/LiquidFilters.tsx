"use client";

import { useEffect, useRef } from "react";

// Shared SVG refraction filter, mounted once in the root layout. Every glass
// surface's edge layer references filter: url(#liquid-refract) — a single
// feTurbulence + feDisplacementMap pair is how "refraction, not just blur"
// (master prompt §2.1.1) gets implemented without per-component filter cost.
//
// baseFrequency drifts slowly via a throttled rAF loop so the refraction
// reads as living liquid rather than a frozen distortion. feTurbulence
// recompute is expensive, so updates are throttled to a few times a second
// (not every frame) and skipped entirely under prefers-reduced-motion.
const BASE_FREQ_X = 0.012;
const BASE_FREQ_Y = 0.018;
const DRIFT_AMPLITUDE = 0.002;
const UPDATE_INTERVAL_MS = 150;

export function LiquidFilters() {
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frameId: number;
    let lastUpdate = 0;
    const start = performance.now();

    function tick(now: number) {
      frameId = requestAnimationFrame(tick);
      if (now - lastUpdate < UPDATE_INTERVAL_MS) return;
      lastUpdate = now;
      const t = (now - start) / 1000;
      const fx = BASE_FREQ_X + Math.sin(t * 0.15) * DRIFT_AMPLITUDE;
      const fy = BASE_FREQ_Y + Math.cos(t * 0.11) * DRIFT_AMPLITUDE;
      turbulenceRef.current?.setAttribute("baseFrequency", `${fx.toFixed(4)} ${fy.toFixed(4)}`);
    }

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <svg aria-hidden focusable="false" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
      <defs>
        <filter id="liquid-refract" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            ref={turbulenceRef}
            type="fractalNoise"
            baseFrequency={`${BASE_FREQ_X} ${BASE_FREQ_Y}`}
            numOctaves={2}
            seed={7}
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={8} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}
