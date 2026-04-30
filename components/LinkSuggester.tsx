"use client";

import { useEffect, useState, useMemo } from "react";

interface LinkTarget {
  url: string;
  label: string;
  type: "vessel" | "location" | "category" | "oem" | "article";
  keywords: string[];
  isPublished: boolean;
}

interface Suggestion {
  target: LinkTarget;
  matchedKeyword: string;
  matchPosition: number; // index in content
  alreadyLinked: boolean;
}

const TYPE_COLORS: Record<LinkTarget["type"], string> = {
  vessel: "text-signal",
  location: "text-brass",
  category: "text-steel",
  oem: "text-hull",
  article: "text-signal",
};

const TYPE_LABELS: Record<LinkTarget["type"], string> = {
  vessel: "Vessel",
  location: "Location",
  category: "Parts",
  oem: "OEM",
  article: "Article",
};

export function LinkSuggester({
  content,
  onInsertLink,
  currentArticleSlug,
}: {
  content: string;
  onInsertLink: (markdown: string, replacementText: string, position: number) => void;
  currentArticleSlug: string;
}) {
  const [targets, setTargets] = useState<LinkTarget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load targets once on mount
  useEffect(() => {
    fetch("/api/admin/link-targets")
      .then((res) => res.json())
      .then((data) => {
        if (data.targets) {
          setTargets(data.targets);
        } else {
          setError(data.error || "Failed to load link targets");
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Find all keyword matches in current content
  const suggestions = useMemo(() => {
    if (!targets.length || !content) return [];

    const found: Suggestion[] = [];
    const seenUrls = new Set<string>();

    for (const target of targets) {
      // Skip self-references and unpublished pages
      if (target.url === `/articles/${currentArticleSlug}`) continue;
      if (!target.isPublished) continue;
      if (seenUrls.has(target.url)) continue;

      for (const keyword of target.keywords) {
        if (!keyword || keyword.length < 3) continue;

        // Case-insensitive search for the keyword as a whole word/phrase
        const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`\\b${escaped}\\b`, "i");
        const match = content.match(regex);

        if (match && match.index !== undefined) {
          // Check if this exact text is already linked in markdown: [text](url)
          const linkedRegex = new RegExp(
            `\\[[^\\]]*${escaped}[^\\]]*\\]\\(`,
            "i"
          );
          const alreadyLinked = linkedRegex.test(content);

          found.push({
            target,
            matchedKeyword: match[0], // preserve original case
            matchPosition: match.index,
            alreadyLinked,
          });
          seenUrls.add(target.url);
          break; // one suggestion per target
        }
      }
    }

    // Sort: unlinked suggestions first, then by position in content
    return found.sort((a, b) => {
      if (a.alreadyLinked !== b.alreadyLinked) {
        return a.alreadyLinked ? 1 : -1;
      }
      return a.matchPosition - b.matchPosition;
    });
  }, [targets, content, currentArticleSlug]);

  function handleInsert(s: Suggestion) {
    const markdown = `[${s.matchedKeyword}](${s.target.url})`;
    onInsertLink(markdown, s.matchedKeyword, s.matchPosition);
  }

  const unlinkedCount = suggestions.filter((s) => !s.alreadyLinked).length;

  return (
    <div className="border border-mist rounded-sm bg-white p-4 sticky top-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-sm text-hull">Internal links</h3>
        {!loading && (
          <span className="text-xs font-mono text-steel">
            {unlinkedCount} suggested
          </span>
        )}
      </div>

      {loading && <p className="text-xs text-steel">Loading...</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}

      {!loading && !error && suggestions.length === 0 && (
        <p className="text-xs text-steel">
          No matches yet. Mention vessel types, ports, OEMs, or part categories in your article and they'll appear here.
        </p>
      )}

      {!loading && !error && suggestions.length > 0 && (
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {suggestions.map((s) => (
            <div
              key={s.target.url}
              className={`border rounded-sm p-2 text-xs ${
                s.alreadyLinked
                  ? "border-mist bg-mist/20 opacity-60"
                  : "border-mist hover:border-signal"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`font-mono uppercase text-[10px] ${TYPE_COLORS[s.target.type]}`}
                >
                  {TYPE_LABELS[s.target.type]}
                </span>
                {s.alreadyLinked && (
                  <span className="text-[10px] text-steel">already linked</span>
                )}
              </div>
              <p className="text-hull mb-1 break-words">
                Matched: <span className="font-semibold">{s.matchedKeyword}</span>
              </p>
              <p className="text-steel mb-2 truncate">→ {s.target.url}</p>
              {!s.alreadyLinked && (
                <button
                  type="button"
                  onClick={() => handleInsert(s)}
                  className="w-full px-2 py-1 bg-signal/10 text-signal text-xs font-semibold rounded-sm hover:bg-signal/20 transition-colors"
                >
                  Insert link
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-[10px] text-steel mt-3 leading-relaxed">
        Internal links boost SEO by helping Google understand the topical depth of your site. Insert links where the match occurs naturally in your text.
      </p>
    </div>
  );
}
