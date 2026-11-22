"use client";
export default function Error({ reset }: { error: Error; reset: () => void }) { return <div className="mx-auto max-w-md px-4 py-28 text-center"><h1 className="text-2xl font-bold">Something went wrong</h1><p className="mt-2 text-muted">Please try again in a moment.</p><button onClick={reset} className="mt-6 rounded-full bg-primary px-7 py-3 text-white">Try again</button></div>; }
