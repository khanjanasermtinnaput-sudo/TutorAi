/** Decorative ambient glow sitting behind every page. Without it, glass
 * surfaces sit over a flat canvas color — backdrop-filter has nothing to
 * blur/refract, so a "glass" card reads as a plain opaque white/dark card
 * (verified: this was exactly what screenshots showed before this existed).
 * A single restrained light source (Gemini-style) rather than several
 * colored blobs — enough texture for the glass effect to read, without
 * competing hues. */
export function LiquidBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute left-1/2 top-[-20rem] h-[50rem] w-[50rem] -translate-x-1/2 rounded-full bg-accent-primary opacity-[0.10] blur-[140px]" />
    </div>
  );
}
