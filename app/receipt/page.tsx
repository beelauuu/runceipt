"use client";

import { useEffect, useRef, useState } from "react";
import Receipt from "@/components/Receipt";
import type { StravaActivity } from "@/lib/strava";

export default function ReceiptPage() {
  const [activities, setActivities] = useState<StravaActivity[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/activities")
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then((data: StravaActivity[]) => setActivities(data))
      .catch((err: Error) => setError(err.message));
  }, []);

  async function handleDownload() {
    if (!receiptRef.current) return;
    const { default: html2canvas } = await import("html2canvas-pro");
    const canvas = await html2canvas(receiptRef.current, { scale: 3 });
    const link = document.createElement("a");
    link.download = "runceipt.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
        <p className="text-red-600 font-mono">Error: {error}</p>
        <a href="/" className="text-orange-500 underline text-sm">
          Go back and reconnect
        </a>
      </main>
    );
  }

  if (!activities) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
        <p className="font-mono text-gray-500 animate-pulse">
          Fetching your runs...
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-8 py-12 px-4">
      <div ref={receiptRef}>
        <Receipt activities={activities} />
      </div>

      <button
        onClick={handleDownload}
        className="rounded-full bg-black text-white px-8 py-3 font-semibold hover:bg-gray-800 transition-colors"
      >
        Download PNG
      </button>

      <a href="/" className="text-xs text-gray-400 hover:underline">
        ← Back to home
      </a>
    </main>
  );
}
