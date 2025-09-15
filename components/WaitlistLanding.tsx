"use client";

import { useEffect, useRef, useState } from "react";

export default function WaitlistLanding() {
  // ------- State & Refs -------
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [justSucceeded, setJustSucceeded] = useState(false);
  const honeypotRef = useRef<HTMLInputElement | null>(null);

  // Base path for sub-path deployment (e.g. /golden-eyes)
  const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const ENDPOINT = `${BASE_PATH}/api/waitlist`;

  // Lightweight runtime smoke-tests (dev only)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const form = document.querySelector(
      'form[aria-label="Join waitlist form"]'
    ) as HTMLFormElement | null;
    console.assert(form, "[test] Waitlist form should exist");

    const emailEl = document.getElementById("email") as HTMLInputElement | null;
    console.assert(
      !!emailEl && emailEl.type === "email",
      "[test] Email input should be type=email"
    );

    const submit = form?.querySelector('button[type="submit"]');
    console.assert(!!submit, "[test] Submit button should exist");

    const live = document.getElementById("form-status");
    console.assert(!!live, "[test] Live region (#form-status) should exist");
  }, []);

  // ------- Handlers -------
  function isValidEmail(value: string) {
    return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // Honeypot — silently ignore bots
    if (honeypotRef.current?.value) {
      setStatus("success");
      microCelebrate();
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      setStatus("success");
      microCelebrate();
    } catch (err) {
      console.error("[waitlist] submit error", err);
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  function microCelebrate() {
    setJustSucceeded(true);
    // brief scale pop
    setTimeout(() => setJustSucceeded(false), 220);
  }

  const isBusy = status === "loading";
  const succeeded = status === "success";
  const hasError = status === "error" && !!error;

  return (
    <main className="relative min-h-screen bg-[#0B0B0B] text-slate-100 overflow-hidden">
      {/* Background: Fullscreen video */}
      <div className="absolute inset-0">
        <video
          className="hidden h-full w-full object-cover motion-safe:block"
          autoPlay
          muted
          loop
          playsInline
          poster={`${BASE_PATH}/media/goldeye-poster.jpg`}
          aria-label="Background video: a golden eye ignites in darkness; human and dragon overlap"
          preload="metadata"
          style={{ objectPosition: "70% center" }}
        >
          <source src={`${BASE_PATH}/media/kling_20250914_图生视频_少年正对镜头_注视镜_5699_0.mp4`} type="video/mp4" />
          <source src={`${BASE_PATH}/media/kling_20250915_图生视频_龙正对镜头_注视镜头_3262_0.mp4`} type="video/mp4" />
        </video>
        <img
          src={`${BASE_PATH}/media/goldeye-poster.jpg`}
          alt="Minimal black-gold poster: golden iris positioned ~65% from the left (right third)"
          className="block h-full w-full object-cover motion-safe:hidden"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
      </div>

      {/* Headings: left-centered, transparent */}
      <section className="relative z-10 flex min-h-screen items-center px-6 lg:px-12">
        <div className="max-w-2xl">
          <h1 className="mb-4 text-[clamp(2.2rem,6vw,5rem)] font-semibold leading-[0.98] tracking-[-0.01em]">
            The Golden Eye Open.
          </h1>
          <p className="max-w-prose text-slate-200">
            The book coming soon.
            <br className="hidden sm:block" />
            Enter your email to get the Prologue.
          </p>
        </div>
      </section>

      {/* Form: centered near bottom with glassmorphism */}
      <div className="absolute left-1/2 bottom-8 md:bottom-12 z-10 w-full -translate-x-1/2 px-6">
        <div className="mx-auto w-full max-w-xl rounded-3xl border border-white/15 bg-white/10 p-3 sm:p-4 backdrop-blur-md shadow-2xl">
          <form
            data-testid="waitlist-form"
            method="POST"
            action={ENDPOINT}
            className="space-y-3"
            aria-label="Join waitlist form"
            aria-busy={isBusy}
            onSubmit={handleSubmit}
          >
            <div className="hidden">
              <label htmlFor="website">Please do not fill this field</label>
              <input ref={honeypotRef} id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                inputMode="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={hasError}
                aria-errormessage={hasError ? "email-error" : undefined}
                disabled={isBusy || succeeded}
                className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-base text-white placeholder:text-slate-400 outline-none ring-0 transition focus:border-white/25 focus:bg-white/15 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
              />
            </div>

            <button
              type="submit"
              disabled={isBusy || succeeded}
              className={[
                "w-full rounded-2xl px-4 py-4 text-center text-base font-medium transition focus-visible:outline-none focus-visible:ring-2",
                succeeded ? "bg-emerald-400 text-black" : "bg-[#D4AF37] text-black",
                isBusy ? "opacity-80" : "",
                justSucceeded ? "scale-[1.03]" : "",
                "focus-visible:ring-[#D4AF37]/60",
              ].join(" ")}
            >
              {isBusy ? "Joining…" : succeeded ? "Joined ✓" : "Join the Waitlist"}
            </button>

            {hasError && (
              <p id="email-error" className="text-xs text-red-400">
                {error}
              </p>
            )}

            <p id="form-status" role="status" aria-live="polite" className="text-xs leading-relaxed text-slate-300">
              {succeeded
                ? "You're in! Check your inbox for the prelude and add us to your contacts."
                : "We only send updates, you can unsubscribe anytime."}
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
