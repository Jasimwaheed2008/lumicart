export const metadata = { title: "About us" };
export default function Page() { return <div className="mx-auto max-w-3xl px-4 py-14"><h1 className="text-4xl font-bold tracking-tight">About LumiCart</h1>
  <p className="mt-5 text-lg text-muted">We believe shopping online should feel effortless: honest prices, carefully chosen products and delivery you can count on.</p>
  <div className="mt-10 grid gap-4 sm:grid-cols-3">{[["Curated", "Every product is reviewed before it reaches the store."], ["Transparent", "Clear prices, shipping costs and stock levels."], ["Supportive", "Real people answer every message."]].map(([t, d]) => <div key={t} className="rounded-3xl bg-bg-alt p-6"><h2 className="font-semibold">{t}</h2><p className="mt-2 text-sm text-muted">{d}</p></div>)}</div></div>; }
