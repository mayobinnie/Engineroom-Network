"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CommentFormProps {
  targetType: "ARTICLE" | "VESSEL_CLASS";
  targetId: string;
  parentCommentId?: string;
  onSuccess?: () => void;
  placeholder?: string;
}

export function CommentForm({
  targetType,
  targetId,
  parentCommentId,
  onSuccess,
  placeholder,
}: CommentFormProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/comments/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          targetType,
          targetId,
          parentCommentId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post");

      setContent("");
      router.refresh();
      onSuccess?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={parentCommentId ? "" : "mb-8"}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={parentCommentId ? 3 : 4}
        maxLength={5000}
        placeholder={
          placeholder ??
          (parentCommentId
            ? "Write your reply..."
            : "Share your thoughts. Corrections, additions, your experience as an engineer.")
        }
        className="w-full border border-mist rounded-sm px-3 py-2 text-hull text-sm focus:outline-none focus:border-signal"
        required
      />
      <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
        <p className="text-xs text-steel">
          {content.length} / 5000 characters · Markdown is not supported, plain text only.
        </p>
        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="bg-signal text-sail font-semibold px-4 py-2 text-sm rounded-sm hover:bg-signal/90 transition-colors disabled:opacity-50"
        >
          {submitting ? "Posting..." : parentCommentId ? "Post reply" : "Post comment"}
        </button>
      </div>
      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 text-red-800 rounded-sm text-xs">
          {error}
        </div>
      )}
    </form>
  );
}
