"use client";

import { useEffect, useState } from "react";
import Receipt from "@/components/Receipt";
import ControlsPanel from "@/components/ControlsPanel";
import type { StravaActivity } from "@/lib/strava";
import { ReceiptOptions, DEFAULT_OPTIONS } from "@/lib/receiptOptions";

export default function ReceiptPage() {
  const [activities, setActivities] = useState<StravaActivity[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<ReceiptOptions>(DEFAULT_OPTIONS);

  // Effect 1: Fetch activities (past 3 months), seed sport types
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/activities", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then((data: StravaActivity[]) => {
        setActivities(data);
        setOptions((prev) => ({
          ...prev,
          enabledSportTypes: new Set(data.map((a) => a.sport_type)),
        }));
      })
      .catch((err: Error) => {
        if (err.name === "AbortError") return;
        setError(err.message);
      });
    return () => controller.abort();
  }, []);

  // Effect 2: Fetch athlete name
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/athlete", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data: { firstname: string; id: number } | null) => {
        if (data) {
          setOptions((prev) => ({
            ...prev,
            ...(data.firstname ? { athleteName: data.firstname } : {}),
            ...(data.id ? { athleteId: data.id } : {}),
          }));
        }
      })
      .catch(() => {
        // ignore athlete fetch errors
      });
    return () => controller.abort();
  }, []);

  async function handleDownload() {
    const el = document.getElementById("receipt");
    if (!el) return;
    const { default: html2canvas } = await import("html2canvas-pro");
    const canvas = await html2canvas(el, { scale: 10, backgroundColor: "#ffffff" });
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
    <main className="flex min-h-screen flex-col items-center py-12 px-4">
      <div className="flex flex-col lg:flex-row items-start gap-8 w-full max-w-4xl">
        {/* Controls — left column, excluded from PNG */}
        <div className="lg:sticky lg:top-12 flex flex-col gap-4">
          <ControlsPanel
            activities={activities}
            options={options}
            onChange={setOptions}
          />
          <button
            onClick={handleDownload}
            className="rounded-full bg-black text-white px-8 py-3 font-semibold hover:bg-gray-800 transition-colors"
          >
            Download PNG
          </button>
          <a href="/" className="text-xs text-gray-400 hover:underline text-center">
            ← Back to home
          </a>
        </div>

        {/* Receipt — right column, captured for PNG */}
        <div className="lg:flex-1">
          <Receipt activities={activities} options={options} />
        </div>
      </div>
    </main>
  );
}
