export default function SkeletonCard() {
  return (
    <div className="bg-white overflow-hidden">
      {/* Image skeleton */}
      <div className="aspect-square skeleton" />
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-2.5 w-16 skeleton rounded" />
          <div className="h-2.5 w-10 skeleton rounded" />
        </div>
        <div className="h-4 w-3/4 skeleton rounded" />
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-2 w-2 skeleton rounded-full" />
          ))}
          <div className="h-2 w-8 skeleton rounded ml-1" />
        </div>
        <div className="h-5 w-1/2 skeleton rounded" />
        <div className="h-9 w-full skeleton rounded" />
      </div>
    </div>
  );
}
