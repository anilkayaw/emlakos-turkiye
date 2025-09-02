import React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse rounded-md bg-gray-200',
          className
        )}
        {...props}
      />
    )
  }
)

Skeleton.displayName = 'Skeleton'

// Property Card Skeleton
export const PropertyCardSkeleton = () => (
  <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
    <Skeleton className="w-full h-48" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  </div>
)

// Property List Skeleton
export const PropertyListSkeleton = () => (
  <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 p-4">
    <div className="flex space-x-4">
      <Skeleton className="w-32 h-24 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </div>
  </div>
)

// Filter Skeleton
export const FilterSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-4 w-20" />
    <Skeleton className="h-10 w-full" />
  </div>
)

export { Skeleton }
