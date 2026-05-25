export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-surface-container-high ${className}`}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-1.5 w-full" />
    </div>
  )
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-9 w-9" />
        </div>
      ))}
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6 mb-8">
      <Skeleton className="h-24 w-24 rounded-full" />
      <div className="flex-1 space-y-3 text-center sm:text-left">
        <Skeleton className="h-6 w-48 mx-auto sm:mx-0" />
        <Skeleton className="h-4 w-36 mx-auto sm:mx-0" />
        <Skeleton className="h-5 w-28 mx-auto sm:mx-0 rounded-full" />
      </div>
    </div>
  )
}
