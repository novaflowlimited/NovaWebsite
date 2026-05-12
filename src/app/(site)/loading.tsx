import { Skeleton } from "@/components/ui/Skeleton";

export default function SiteLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-16 md:px-6">
      <Skeleton className="h-12 w-2/3 max-w-lg" />
      <Skeleton className="h-6 w-full max-w-xl" />
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  );
}
