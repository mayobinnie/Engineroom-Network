"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { LinkSuggester } from "./LinkSuggester";

interface ArticleData {
  id: string;
  slug: string;
  type: string;
  status: string;
  title: string;
  excerpt: string | null;
  content: string;
  seoKeyword: string | null;
  sourceTitle: string | null;
  sourceUrl: string | null;
  sourceName: string | null;
  authorName: string | null;
  reviewedBy: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  tags: string[];
}

export function ArticleEditForm({ article }: { article: ArticleData }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [title, setTitle] = useState(article.title);
  const [slug, setSlug] = useState(article.slug);
  const [excerpt, setExcerpt] = useState(article.excerpt ?? "");
  const [content, setContent] = useState(article.content);
  const [authorName, setAuthorName] = useState(article.authorName ?? "");
  const [reviewedBy, setReviewedBy] = useState(article.reviewedBy ?? "");
  const [metaTitle, setMetaTitle] = useState(article.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(article.metaDescription ?? "");
  const [tagsStr, setTagsStr] = useState(article.tags.join(", "));

  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Replace the FIRST occurrence of replacementText (case-insensitive) starting
  // at position with the markdown link. Uses the suggester's match position
  // to be precise.
  function handleInsertLink(markdown: string, replacementText: string, position: number) {
    const before = content.slice(0, position);
    const after = content.slice(position + replacementText.length);
    const newContent = before + markdown + after;
    setContent(newContent);

    // Focus textarea so user sees the change
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.focus();
        const newCursor = position + markdown.length;
        contentRef.current.setSelectionRange(newCursor, newCursor);
      }
    }, 0);
  }


  async function handleSave() {
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    const tags = tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      const res = await fetch("/api/content/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: article.id,
          title,
          slug: article.status !== "PUBLISHED" ? slug : undefined,
          excerpt,
          content,
          authorName,
          reviewedBy,
          metaTitle,
          metaDescription,
          tags,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save failed");
      }
      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(newStatus: string) {
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    // Save current edits first, then change status
    const tags = tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      const res = await fetch("/api/content/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: article.id,
          title,
          slug: article.status !== "PUBLISHED" ? slug : undefined,
          excerpt,
          content,
          authorName,
          reviewedBy,
          metaTitle,
          metaDescription,
          tags,
          status: newStatus,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Status change failed");
      }
      router.refresh();
      router.push("/admin/content");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setSubmitting(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-6">
      <div className="space-y-6 min-w-0">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-sm">{error}</div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-sm">
          Saved successfully.
        </div>
      )}

      <fieldset className="border border-mist rounded-sm p-6 bg-white">
        <legend className="font-display font-bold text-lg text-hull px-2">Editorial</legend>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-hull mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-mist rounded-sm px-3 py-2 text-hull"
            />
          </div>

          {article.status !== "PUBLISHED" && (
            <div>
              <label className="block text-sm font-semibold text-hull mb-1">URL slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                pattern="[a-z0-9-]+"
                className="w-full border border-mist rounded-sm px-3 py-2 text-hull font-mono text-sm"
              />
              <p className="text-xs text-steel mt-1">
                Will appear as engineroomnetwork.com/articles/{slug || "..."}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-hull mb-1">
              Excerpt (1-2 sentences)
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full border border-mist rounded-sm px-3 py-2 text-hull text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-hull mb-1">
              Content (markdown)
            </label>
            <textarea
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              className="w-full border border-mist rounded-sm px-3 py-2 text-hull text-sm font-mono"
            />
            <p className="text-xs text-steel mt-1">
              Markdown supported. ## for H2, ** for bold, [link text](url) for links.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-hull mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              className="w-full border border-mist rounded-sm px-3 py-2 text-hull text-sm"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="border border-mist rounded-sm p-6 bg-white">
        <legend className="font-display font-bold text-lg text-hull px-2">Attribution</legend>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-hull mb-1">Author name</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g. Adam Surname"
              className="w-full border border-mist rounded-sm px-3 py-2 text-hull"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-hull mb-1">
              Reviewed by (technical reviewer)
            </label>
            <input
              type="text"
              value={reviewedBy}
              onChange={(e) => setReviewedBy(e.target.value)}
              placeholder="e.g. Adam Surname, Chief Engineer"
              className="w-full border border-mist rounded-sm px-3 py-2 text-hull"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="border border-mist rounded-sm p-6 bg-white">
        <legend className="font-display font-bold text-lg text-hull px-2">SEO meta (optional)</legend>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-hull mb-1">Meta title</label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              maxLength={60}
              placeholder="Defaults to: [Title] | EngineRoom Network"
              className="w-full border border-mist rounded-sm px-3 py-2 text-hull text-sm"
            />
            <p className="text-xs text-steel mt-1">{metaTitle.length} / 60 characters</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-hull mb-1">
              Meta description
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              maxLength={160}
              rows={2}
              placeholder="Defaults to excerpt"
              className="w-full border border-mist rounded-sm px-3 py-2 text-hull text-sm"
            />
            <p className="text-xs text-steel mt-1">{metaDescription.length} / 160 characters</p>
          </div>
        </div>
      </fieldset>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={submitting}
          className="bg-signal text-sail font-semibold px-6 py-3 rounded-sm hover:bg-signal/90 transition-colors disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save changes"}
        </button>

        {article.status === "DRAFT" && (
          <>
            <button
              type="button"
              onClick={() => handleStatusChange("APPROVED")}
              disabled={submitting}
              className="border border-signal text-signal font-semibold px-6 py-3 rounded-sm hover:bg-signal/10 disabled:opacity-50"
            >
              Save & Approve
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange("REJECTED")}
              disabled={submitting}
              className="border border-red-300 text-red-700 font-semibold px-6 py-3 rounded-sm hover:bg-red-50 disabled:opacity-50"
            >
              Reject
            </button>
          </>
        )}

        {article.status === "APPROVED" && (
          <button
            type="button"
            onClick={() => handleStatusChange("PUBLISHED")}
            disabled={submitting}
            className="bg-green-700 text-white font-semibold px-6 py-3 rounded-sm hover:bg-green-800 disabled:opacity-50"
          >
            Save & Publish
          </button>
        )}

        {article.status === "PUBLISHED" && (article.type === "ARTICLE" || article.type === "COMMENTARY") && (
          <a
            href={`/articles/${article.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-mist text-hull font-semibold px-6 py-3 rounded-sm hover:border-signal transition-colors"
          >
            View public page →
          </a>
        )}
      </div>
      </div>

      {/* Right sidebar: link suggester */}
      <aside className="hidden lg:block">
        <LinkSuggester
          content={content}
          onInsertLink={handleInsertLink}
          currentArticleSlug={article.slug}
        />
      </aside>
    </div>
  );
}
