import React from 'react';
import { cn } from '../../lib/utils';
import { Skeleton } from "@/components/ui/skeleton";

// Skeleton optimisé pour les statistiques
export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-6 border rounded-lg">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Skeleton optimisé pour les listes
export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}

// Skeleton optimisé pour les cartes
export function CardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-6 border rounded-lg">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex justify-between">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Skeleton optimisé pour les tableaux
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Skeleton pour les formulaires
export function FormSkeleton({ fields = 4, className }: { fields?: number; className?: string }) {
  return (
    <div className={cn('space-y-6', className)}>
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex space-x-4 pt-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

// Skeleton pour les avatars
export function AvatarSkeleton({ size = 'md', className }: { 
  size?: 'sm' | 'md' | 'lg'; 
  className?: string;
}) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  return (
    <Skeleton className={cn('rounded-full', sizeClasses[size], className)} />
  );
}

// Skeleton pour les boutons
export function ButtonSkeleton({ size = 'md', className }: { 
  size?: 'sm' | 'md' | 'lg'; 
  className?: string;
}) {
  const sizeClasses = {
    sm: 'h-8 px-3',
    md: 'h-10 px-4',
    lg: 'h-12 px-6',
  };

  return (
    <Skeleton className={cn('rounded-md', sizeClasses[size], className)} />
  );
}

// Skeleton pour les badges
export function BadgeSkeleton({ className }: { className?: string }) {
  return (
    <Skeleton className={cn('h-6 w-16 rounded-full', className)} />
  );
}

// Skeleton pour les graphiques
export function ChartSkeleton({ height = 300, className }: { 
  height?: number; 
  className?: string;
}) {
  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <div className="flex items-end justify-between h-full space-x-2">
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className="flex-1 bg-muted animate-pulse rounded-t"
            style={{ 
              height: `${Math.random() * 60 + 20}%`,
              animationDelay: `${index * 0.1}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Skeleton pour les notifications
export function NotificationSkeleton({ count = 3, className }: { 
  count?: number; 
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
          <Skeleton className="h-8 w-8 rounded-full mt-1" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Skeleton pour les commentaires
export function CommentSkeleton({ count = 3, className }: { 
  count?: number; 
  className?: string;
}) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex space-x-3">
          <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
