import { Skeleton } from "./ui/skeleton";

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-y-3">
      <Skeleton className="h-72 w-full rounded-lg" />
      <div className="flex flex-col space-y-3">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-3/5 h-4" />
        <Skeleton className="w-1/2 h-4" />
      </div>
    </div>
  );
}
export default SkeletonCard;
