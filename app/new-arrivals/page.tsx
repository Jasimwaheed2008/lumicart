import Listing from "@/components/Listing";
export const metadata = { title: "New arrivals" };
export default async function Page({ searchParams }: { searchParams: Promise<any> }) { return <Listing title="New Arrivals" base="/new-arrivals" sp={{ sort: "newest", ...(await searchParams) }} />; }
