"use client";

import { useEffect, useState } from "react";
import Receipt from "@/components/Receipt";
import ControlsPanel from "@/components/ControlsPanel";
import type { StravaActivity } from "@/lib/strava";
import { RUN_SPORT_TYPES } from "@/lib/strava";
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
        const runTypes = new Set(
          data.map((a) => a.sport_type).filter((t) => (RUN_SPORT_TYPES as readonly string[]).includes(t))
        );
        setOptions((prev) => ({
          ...prev,
          enabledSportTypes: runTypes,
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

  async function renderCanvas() {
    const el = document.getElementById("receipt");
    if (!el) return null;
    const { default: html2canvas } = await import("html2canvas-pro");
    return html2canvas(el, { scale: 10, backgroundColor: "#ffffff" });
  }

  async function handleDownload() {
    const canvas = await renderCanvas();
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "runceipt.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  async function handleInstagramShare() {
    const canvas = await renderCanvas();
    if (!canvas) return;

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png")
    );
    if (!blob) return;

    const file = new File([blob], "runceipt.png", { type: "image/png" });

    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: "My Runceipt" });
    } else {
      // Desktop fallback: download + prompt
      const link = document.createElement("a");
      link.download = "runceipt.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      alert("Instagram sharing works best on mobile. Your receipt has been downloaded — open Instagram and share it from your camera roll!");
    }
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
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="flex-1 rounded-full bg-black text-white px-6 py-3 font-semibold hover:bg-gray-800 transition-colors"
            >
              Download
            </button>
            <button
              onClick={handleInstagramShare}
              title="Share to Instagram"
              className="rounded-full px-4 py-3 font-semibold text-white transition-opacity hover:opacity-90"
              style={{
                background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
              }}
            >
              {/* Instagram icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </button>
          </div>
          <a href="/api/auth/logout" className="text-xs text-gray-400 hover:underline text-center">
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
