import { GlassSkeleton } from "@/components/glass/GlassSkeleton";

export default function QuizComposerLoading() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 p-4">
      <GlassSkeleton className="h-8 w-48" />
      <GlassSkeleton className="h-52" />
      <GlassSkeleton className="h-64" />
    </div>
  );
}
