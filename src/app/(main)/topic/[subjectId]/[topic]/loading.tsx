import { GlassSkeleton } from "@/components/glass/GlassSkeleton";

export default function TopicLoading() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-4">
      <div>
        <GlassSkeleton className="h-4 w-24" />
        <GlassSkeleton className="mt-2 h-8 w-64" />
      </div>
      <GlassSkeleton className="h-40" />
      <GlassSkeleton className="h-32" />
      <GlassSkeleton className="h-24" />
    </div>
  );
}
