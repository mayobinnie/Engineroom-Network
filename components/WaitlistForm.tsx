"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function WaitlistForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      (event.target as HTMLFormElement).reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-pale border-l-4 border-signal p-8 rounded-sm">
        <p className="font-mono text-xs tracking-wider text-signal font-bold mb-3">
          YOU&apos;RE ON THE LIST
        </p>
        <h3 className="font-display text-2xl font-bold text-hull mb-3">
          Thank you. We&apos;ll be in touch.
        </h3>
        <p className="text-steel leading-relaxed">
          We&apos;ll send you updates as the platform comes together, and reach out directly when early access opens. In the meantime, if you know other senior maritime engineering professionals who might be interested, we&apos;d be grateful for the introduction.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot for bots - hidden from real users */}
      <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-xs font-mono tracking-wider text-steel uppercase mb-2">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Your name"
            className="w-full px-4 py-3 bg-white border border-mist rounded-sm focus:border-signal focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-mono tracking-wider text-steel uppercase mb-2">
            Email <span className="text-signal">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full px-4 py-3 bg-white border border-mist rounded-sm focus:border-signal focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div>
        <label htmlFor="interest" className="block text-xs font-mono tracking-wider text-steel uppercase mb-2">
          I am a
        </label>
        <select
          id="interest"
          name="interest"
          className="w-full px-4 py-3 bg-white border border-mist rounded-sm focus:border-signal focus:outline-none transition-colors text-char"
          defaultValue=""
        >
          <option value="">Select your role</option>
          <option value="engineer">Marine engineer</option>
          <option value="fleet_operator">Fleet operator / shipping company</option>
          <option value="supplier">Supplier / equipment vendor</option>
          <option value="recruiter">Recruiter</option>
          <option value="other">Something else</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="rank" className="block text-xs font-mono tracking-wider text-steel uppercase mb-2">
            Rank or role <span className="text-silver">(optional)</span>
          </label>
          <select
            id="rank"
            name="rank"
            className="w-full px-4 py-3 bg-white border border-mist rounded-sm focus:border-signal focus:outline-none transition-colors text-char"
            defaultValue=""
          >
            <option value="">Select rank</option>
            <option value="cadet">Cadet / Junior Engineer</option>
            <option value="4th_engineer">4th Engineer</option>
            <option value="3rd_engineer">3rd Engineer</option>
            <option value="2nd_engineer">2nd Engineer</option>
            <option value="chief_engineer">Chief Engineer</option>
            <option value="superintendent">Marine Superintendent</option>
            <option value="shipyard">Shipyard Engineer</option>
            <option value="offshore">Offshore Engineer</option>
            <option value="eto">Electro-Technical Officer (ETO)</option>
            <option value="surveyor">Surveyor / Class</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="vesselType" className="block text-xs font-mono tracking-wider text-steel uppercase mb-2">
            Vessel type <span className="text-silver">(optional)</span>
          </label>
          <select
            id="vesselType"
            name="vesselType"
            className="w-full px-4 py-3 bg-white border border-mist rounded-sm focus:border-signal focus:outline-none transition-colors text-char"
            defaultValue=""
          >
            <option value="">Select vessel type</option>
            <option value="tankers">Tankers</option>
            <option value="container">Container ships</option>
            <option value="bulk">Bulk carriers</option>
            <option value="lng">LNG / LPG carriers</option>
            <option value="offshore">Offshore vessels</option>
            <option value="cruise">Cruise / Passenger</option>
            <option value="specialised">Specialised vessels</option>
            <option value="multiple">Multiple vessel types</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-xs font-mono tracking-wider text-steel uppercase mb-2">
          Anything else? <span className="text-silver">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          placeholder="What you'd most like the platform to do for you, or any context you'd like to share."
          className="w-full px-4 py-3 bg-white border border-mist rounded-sm focus:border-signal focus:outline-none transition-colors resize-none"
        />
      </div>

      {status === "error" && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-sm">
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center pt-2">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-hull text-white font-semibold rounded-sm hover:bg-signal transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          {status === "submitting" ? "Joining..." : "Join the waitlist"}
          {status !== "submitting" && (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7H13M13 7L7 1M13 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </button>
        <p className="text-xs text-steel">
          We&apos;ll only contact you about EngineRoom Network. No spam, no third-party sharing.
        </p>
      </div>
    </form>
  );
}
