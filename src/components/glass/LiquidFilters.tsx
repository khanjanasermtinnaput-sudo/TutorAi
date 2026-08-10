// Shared SVG refraction filter, mounted once in the root layout. Every glass
// surface's edge layer references filter: url(#liquid-refract) — a single
// feTurbulence + feDisplacementMap pair is how "refraction, not just blur"
// (master prompt §2.1.1) gets implemented without per-component filter cost.
export function LiquidFilters() {
  return (
    <svg aria-hidden focusable="false" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
      <defs>
        <filter id="liquid-refract" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves={2} seed={7} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={8} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}
