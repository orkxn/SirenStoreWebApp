import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded ${className}`} />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col border border-zinc-950/5 dark:border-white/10 rounded-2xl p-4 bg-zinc-950/[0.01] dark:bg-white/[0.01]">
      <Skeleton className="aspect-square w-full rounded-xl mb-4" />
      <div className="flex justify-between items-center mb-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-20 rounded-full" />
      </div>
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-full mb-1" />
      <Skeleton className="h-3 w-5/6 mb-4" />
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-950/5 dark:border-white/5">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
};

export const OrderRowSkeleton: React.FC = () => {
  return (
    <div className="border border-zinc-950/5 dark:border-white/10 rounded-2xl p-6 bg-zinc-950/[0.01] dark:bg-white/[0.01]">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4 pb-4 border-b border-zinc-950/5 dark:border-white/5">
        <div className="flex gap-4">
          <div>
            <Skeleton className="h-3 w-12 mb-1.5" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div>
            <Skeleton className="h-3 w-12 mb-1.5" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <Skeleton className="h-7 w-20 rounded-full" />
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-lg" />
          <div className="flex-grow">
            <Skeleton className="h-4 w-1/3 mb-2" />
            <Skeleton className="h-3 w-8" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
};
