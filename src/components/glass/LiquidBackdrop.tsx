/** Decorative gradient wash sitting behind every page. Without it, glass
 * surfaces sit over a flat canvas color — backdrop-filter has nothing to
 * blur/refract, so a "glass" card reads as a plain opaque white/dark card
 * (verified: this was exactly what screenshots showed before this existed).
 * Real Liquid Glass demos always put frosted panels over something with
 * visual texture; this is the minimum texture that makes the effect legible. */
export function LiquidBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-32 -top-40 h-[36rem] w-[36rem] rounded-full bg-accent-primary opacity-[0.16] blur-[110px]" />
      <div className="absolute -right-40 top-1/4 h-[30rem] w-[30rem] rounded-full bg-accent-secondary opacity-[0.14] blur-[110px]" />
      <div className="absolute bottom-[-10rem] left-1/3 h-[34rem] w-[34rem] rounded-full bg-[#22D3EE] opacity-[0.12] blur-[120px]" />
    </div>
  );
}
