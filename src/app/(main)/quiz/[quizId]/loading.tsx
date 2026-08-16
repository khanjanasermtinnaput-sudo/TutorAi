import { GlassSkeleton } from "@/components/glass/GlassSkeleton";

export default function QuizTakingLoading() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 p-4">
      <GlassSkeleton className="h-3 w-full rounded-full" />
      <GlassSkeleton className="h-40" />
      <div className="flex justify-between">
        <GlassSkeleton className="h-11 w-28" />
        <GlassSkeleton className="h-11 w-28" />
      </div>
    </div>
  );
}
