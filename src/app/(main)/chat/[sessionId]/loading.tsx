import { GlassSkeleton } from "@/components/glass/GlassSkeleton";

export default function ChatSessionLoading() {
  return (
    <div className="flex h-full flex-col gap-3">
      <GlassSkeleton className="h-9 w-40" />
      <div className="flex flex-1 flex-col gap-3 overflow-hidden px-1 py-2">
        <GlassSkeleton className="h-14 w-3/5 self-start rounded-[20px]" />
        <GlassSkeleton className="h-10 w-2/5 self-end rounded-[20px]" />
        <GlassSkeleton className="h-20 w-3/4 self-start rounded-[20px]" />
      </div>
      <GlassSkeleton className="h-14 w-full rounded-xl" />
    </div>
  );
}
