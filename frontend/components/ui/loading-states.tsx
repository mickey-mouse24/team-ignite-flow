import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Composant de chargement pour les cartes de statistiques
export function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-20" />
      </CardContent>
    </Card>
  );
}

// Composant de chargement pour les listes
export function ListItemSkeleton() {
  return (
    <div className="flex items-center space-x-4 p-4 border rounded-lg">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-6 w-16" />
    </div>
  );
}

// Composant de chargement pour les tableaux
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center space-x-4 p-4 border-b">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
  );
}

// Composant de chargement pour les formulaires
export function FormFieldSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

// Composant de chargement pour les pages
export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, j) => (
                <ListItemSkeleton key={j} />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Composant de chargement pour les graphiques
export function ChartSkeleton({ height = 200 }: { height?: number }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-20" />
      </div>
      <Skeleton 
        className="w-full rounded-lg" 
        style={{ height: `${height}px` }}
      />
    </div>
  );
}

// Composant de chargement pour les modales
export function ModalSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <FormFieldSkeleton key={i} />
        ))}
      </div>
      <div className="flex justify-end space-x-2">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

// Composant de chargement pour les notifications
export function NotificationSkeleton() {
  return (
    <div className="flex items-start space-x-3 p-4 border rounded-lg">
      <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
  );
}

// Composant de chargement pour les avatars
export function AvatarSkeleton({ size = "default" }: { size?: "sm" | "default" | "lg" }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    default: "h-10 w-10",
    lg: "h-12 w-12"
  };

  return (
    <Skeleton className={cn("rounded-full", sizeClasses[size])} />
  );
}

// Composant de chargement pour les badges
export function BadgeSkeleton() {
  return (
    <Skeleton className="h-6 w-16 rounded-full" />
  );
}

// Composant de chargement pour les boutons
export function ButtonSkeleton({ size = "default" }: { size?: "sm" | "default" | "lg" }) {
  const sizeClasses = {
    sm: "h-8 w-16",
    default: "h-10 w-20",
    lg: "h-12 w-24"
  };

  return (
    <Skeleton className={cn("rounded-md", sizeClasses[size])} />
  );
}

// Composant de chargement pour les barres de progression
export function ProgressSkeleton() {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-12" />
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
    </div>
  );
}

// Composant de chargement pour les cartes de projet/initiative
export function ProjectCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <BadgeSkeleton />
        </div>
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-3 w-full" />
        <ProgressSkeleton />
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AvatarSkeleton size="sm" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

// Composant de chargement pour les graphiques de statistiques
export function StatsChartSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-2 w-full rounded-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
