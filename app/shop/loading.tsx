import { ProductCardSkeleton } from "@/components/Skeleton";
export default function Loading() { return <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-10 md:grid-cols-4">{Array.from({ length: 8 }, (_, i) => <ProductCardSkeleton key={i} />)}</div>; }
