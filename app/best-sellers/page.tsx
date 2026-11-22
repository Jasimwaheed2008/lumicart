import Listing from "@/components/Listing";
export const metadata = { title: "Best sellers" };
export default async function Page({ searchParams }: { searchParams: Promise<any> }) { return <Listing title="Best Sellers" base="/best-sellers" sp={await searchParams} kind="best" />; }
