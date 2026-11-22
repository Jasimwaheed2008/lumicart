import Listing from "@/components/Listing";
export const metadata = { title: "Shop all products" };
export default async function Page({ searchParams }: { searchParams: Promise<any> }) { return <Listing title="Shop" base="/shop" sp={await searchParams} />; }
