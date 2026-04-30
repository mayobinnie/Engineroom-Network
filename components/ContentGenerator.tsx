"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ContentType = "ARTICLE" | "COMMENTARY" | "LINKEDIN" | "EMAIL";

export function ContentGenerator() {
  const router = useRouter();
  const [type, setType] = useState<ContentType>("ARTICLE");
  const [topic, setTopic] = useState("");
  const [seoKeyword, setSeoKeyword] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleGenerate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const payload: Record<string, string> = {
      type,
      topic: topic.trim(),
    };
    if (seoKeyword.trim()) payload.seoKeyword = seoKeyword.trim();
    if (type === "COMMENTARY") {
      if (sourceUrl.trim()) payload.sourceUrl = sourceUrl.trim();
      if (sourceName.trim()) payload.sourceName = sourceName.trim();
    }

    try {
      const res = await fetch("/api/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setSuccess(`Generated draft: ${data.title}. Reviewing now will refresh the queue.`);
      setTopic("");
      setSeoKeyword("");
      setSourceUrl("");
      setSourceName("");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleQuickAction(endpoint: string, body: Record<string, unknown>) {
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");

      // Different responses from different endpoints
      if (data.results) {
        setSuccess(`Generated ${data.succeeded} of ${data.total} pieces. ${data.failed > 0 ? `${data.failed} failed (see logs).` : ""}`);
      } else if (data.title) {
        setSuccess(`Generated: ${data.title}`);
      } else if (data.sourceArticle) {
        setSuccess(`LinkedIn draft created from article "${data.sourceArticle}"`);
      } else {
        setSuccess("Done.");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="border border-mist rounded-sm p-6 bg-white">
        <h2 className="font-display font-bold text-lg text-hull mb-4">Generate content</h2>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-hull mb-1">Type</label>
            <div className="flex flex-wrap gap-2">
              {(["ARTICLE", "COMMENTARY", "LINKEDIN", "EMAIL"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`px-4 py-2 text-sm font-mono uppercase rounded-sm border transition-colors ${
                    type === t
                      ? "bg-signal text-sail border-signal"
                      : "bg-white text-hull border-mist hover:border-signal"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="topic" className="block text-sm font-semibold text-hull mb-1">
              {type === "COMMENTARY"
                ? "What story are you commenting on? (title or summary)"
                : type === "LINKEDIN"
                ? "What should the post be about?"
                : type === "EMAIL"
                ? "What should the newsletter cover?"
                : "Article topic / title"}
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              placeholder={
                type === "ARTICLE"
                  ? "e.g. Common faults on MAN B&W ME-C engines"
                  : type === "COMMENTARY"
                  ? "e.g. MAN announces methanol retrofit programme expansion"
                  : type === "LINKEDIN"
                  ? "e.g. The state of marine engineering recruitment"
                  : "e.g. Monthly newsletter, April 2026"
              }
              className="w-full border border-mist rounded-sm px-3 py-2 text-hull"
            />
          </div>

          {(type === "ARTICLE" || type === "COMMENTARY") && (
            <div>
              <label htmlFor="seoKeyword" className="block text-sm font-semibold text-hull mb-1">
                SEO keyword (optional)
              </label>
              <input
                id="seoKeyword"
                type="text"
                value={seoKeyword}
                onChange={(e) => setSeoKeyword(e.target.value)}
                placeholder="e.g. marine engine fault diagnosis"
                className="w-full border border-mist rounded-sm px-3 py-2 text-hull"
              />
            </div>
          )}

          {type === "COMMENTARY" && (
            <>
              <div>
                <label htmlFor="sourceUrl" className="block text-sm font-semibold text-hull mb-1">
                  Source article URL
                </label>
                <input
                  id="sourceUrl"
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://www.tradewindsnews.com/..."
                  className="w-full border border-mist rounded-sm px-3 py-2 text-hull"
                />
              </div>
              <div>
                <label htmlFor="sourceName" className="block text-sm font-semibold text-hull mb-1">
                  Source publication name
                </label>
                <input
                  id="sourceName"
                  type="text"
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  placeholder="e.g. TradeWinds, Lloyd's List, Splash247"
                  className="w-full border border-mist rounded-sm px-3 py-2 text-hull"
                />
              </div>
            </>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-sm text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-sm text-sm">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !topic.trim()}
            className="bg-signal text-sail font-semibold px-6 py-3 rounded-sm hover:bg-signal/90 transition-colors disabled:opacity-50"
          >
            {submitting ? "Generating..." : "Generate draft"}
          </button>
        </form>
      </div>

      <div className="border border-mist rounded-sm p-6 bg-mist/20">
        <h3 className="font-display font-bold text-sm text-hull mb-3 uppercase tracking-wide">
          Quick actions
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={submitting}
            onClick={() =>
              handleQuickAction("/api/content/social-from-blog", {})
            }
            className="px-4 py-2 text-sm bg-white border border-mist rounded-sm hover:border-signal transition-colors disabled:opacity-50"
          >
            LinkedIn from latest article
          </button>
        </div>
        <p className="text-xs text-steel mt-3">
          The weekly SEO batch runs automatically every Wednesday 9am UTC. Drafts appear in this queue for review.
        </p>
      </div>
    </div>
  );
}
