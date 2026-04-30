"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ArticleListItem {
  id: string;
  slug: string;
  type: string;
  status: string;
  title: string;
  excerpt: string | null;
  createdAt: string;
  publishedAt: string | null;
  generatedByAI: boolean;
  sourceName: string | null;
}

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "DRAFT", label: "Draft" },
  { value: "APPROVED", label: "Approved" },
  { value: "PUBLISHED", label: "Published" },
  { value: "REJECTED", label: "Rejected" },
];

const TYPE_OPTIONS = [
  { value: "", label: "All types" },
  { value: "ARTICLE", label: "Article" },
  { value: "COMMENTARY", label: "Commentary" },
  { value: "LINKEDIN", label: "LinkedIn" },
  { value: "EMAIL", label: "Email" },
];

export function ContentQueueList({
  articles,
  currentStatus,
  currentType,
}: {
  articles: ArticleListItem[];
  currentStatus?: string;
  currentType?: string;
}) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  function buildUrl(status?: string, type?: string) {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (type) params.set("type", type);
    const qs = params.toString();
    return qs ? `/admin/content?${qs}` : "/admin/content";
  }

  async function handleStatusChange(id: string, status: string) {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/content/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(`Failed: ${data.error}`);
        return;
      }
      router.refresh();
    } catch (e) {
      alert(`Error: ${e instanceof Error ? e.message : "Unknown"}`);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Filter pills */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <Link
              key={opt.value}
              href={buildUrl(opt.value, currentType)}
              className={`px-3 py-1 text-xs font-mono uppercase rounded-sm border transition-colors ${
                (currentStatus ?? "") === opt.value
                  ? "bg-hull text-sail border-hull"
                  : "bg-white text-hull border-mist hover:border-signal"
              }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {TYPE_OPTIONS.map((opt) => (
            <Link
              key={opt.value}
              href={buildUrl(currentStatus, opt.value)}
              className={`px-3 py-1 text-xs font-mono uppercase rounded-sm border transition-colors ${
                (currentType ?? "") === opt.value
                  ? "bg-hull text-sail border-hull"
                  : "bg-white text-hull border-mist hover:border-signal"
              }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Articles list */}
      {articles.length === 0 ? (
        <div className="border border-mist rounded-sm p-8 bg-white text-center">
          <p className="text-steel">
            No items. Generate some content above or wait for the weekly agent to run.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((a) => (
            <div
              key={a.id}
              className="border border-mist rounded-sm p-4 bg-white"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 text-xs font-mono uppercase">
                    <span className="text-signal">{a.type}</span>
                    <span className="text-steel">·</span>
                    <span
                      className={
                        a.status === "PUBLISHED"
                          ? "text-green-700"
                          : a.status === "APPROVED"
                          ? "text-signal"
                          : a.status === "REJECTED"
                          ? "text-red-600"
                          : "text-brass"
                      }
                    >
                      {a.status}
                    </span>
                    {a.generatedByAI && (
                      <>
                        <span className="text-steel">·</span>
                        <span className="text-steel">AI draft</span>
                      </>
                    )}
                  </div>
                  <Link
                    href={`/admin/content/${a.id}`}
                    className="font-display font-bold text-base text-hull hover:text-signal block"
                  >
                    {a.title}
                  </Link>
                  {a.excerpt && (
                    <p className="text-sm text-steel mt-1 line-clamp-2">{a.excerpt}</p>
                  )}
                  <p className="text-xs text-steel mt-2">
                    Created {new Date(a.createdAt).toLocaleDateString("en-GB")}
                    {a.publishedAt && ` · Published ${new Date(a.publishedAt).toLocaleDateString("en-GB")}`}
                    {a.sourceName && ` · Source: ${a.sourceName}`}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 items-start">
                  <Link
                    href={`/admin/content/${a.id}`}
                    className="px-3 py-1 text-xs border border-mist rounded-sm hover:border-signal transition-colors"
                  >
                    Edit
                  </Link>
                  {a.status === "DRAFT" && (
                    <>
                      <button
                        type="button"
                        disabled={updatingId === a.id}
                        onClick={() => handleStatusChange(a.id, "APPROVED")}
                        className="px-3 py-1 text-xs bg-signal text-sail rounded-sm hover:bg-signal/90 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={updatingId === a.id}
                        onClick={() => handleStatusChange(a.id, "REJECTED")}
                        className="px-3 py-1 text-xs border border-red-300 text-red-700 rounded-sm hover:bg-red-50 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {a.status === "APPROVED" && (
                    <button
                      type="button"
                      disabled={updatingId === a.id}
                      onClick={() => handleStatusChange(a.id, "PUBLISHED")}
                      className="px-3 py-1 text-xs bg-green-700 text-white rounded-sm hover:bg-green-800 disabled:opacity-50"
                    >
                      Publish
                    </button>
                  )}
                  {(a.status === "PUBLISHED") && (a.type === "ARTICLE" || a.type === "COMMENTARY") && (
                    <a
                      href={`/articles/${a.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 text-xs border border-mist rounded-sm hover:border-signal transition-colors"
                    >
                      View →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
