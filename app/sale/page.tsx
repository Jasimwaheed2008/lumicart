import Listing from "@/components/Listing";
export const metadata = { title: "Sale & offers" };
export default async function Page({ searchParams }: { searchParams: Promise<any> }) { return <Listing title="Sale & Offers" base="/sale" sp={await searchParams} kind="sale" />; }
