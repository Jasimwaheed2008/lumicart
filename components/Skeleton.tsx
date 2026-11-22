export const Skeleton = ({ className = "" }: { className?: string }) => <div className={`animate-pulse rounded-xl bg-slate-200/70 ${className}`} />;
export const ProductCardSkeleton = () => <div className="space-y-3"><Skeleton className="aspect-square" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/3" /></div>;
