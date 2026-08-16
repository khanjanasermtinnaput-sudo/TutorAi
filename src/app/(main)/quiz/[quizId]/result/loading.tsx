import { GlassSkeleton } from "@/components/glass/GlassSkeleton";

export default function QuizResultLoading() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 p-4">
      <GlassSkeleton className="h-40" />
      <GlassSkeleton className="h-32" />
      <GlassSkeleton className="h-32" />
    </div>
  );
}
