"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CommentForm } from "./CommentForm";

interface CommentData {
  id: string;
  content: string;
  createdAt: string;
  isEdited: boolean;
  isHidden: boolean;
  isPinned: boolean;
  isReported: boolean;
  reportCount: number;
  authorName: string;
  authorRank: string | null;
}

interface CommentItemProps {
  comment: CommentData;
  targetType: "ARTICLE" | "VESSEL_CLASS";
  targetId: string;
  isAuthor: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  canReply: boolean;
  isReply?: boolean;
}

const RANK_LABELS: Record<string, string> = {
  CADET: "Cadet",
  FOURTH_ENGINEER: "4th Engineer",
  THIRD_ENGINEER: "3rd Engineer",
  SECOND_ENGINEER: "2nd Engineer",
  CHIEF_ENGINEER: "Chief Engineer",
  MARINE_SUPERINTENDENT: "Marine Superintendent",
  SHIPYARD_ENGINEER: "Shipyard Engineer",
  OFFSHORE_ENGINEER: "Offshore Engineer",
  ETO: "ETO",
  SURVEYOR: "Surveyor",
  OTHER: "Engineer",
};

export function CommentItem({
  comment,
  targetType,
  targetId,
  isAuthor,
  isAdmin,
  isAuthenticated,
  canReply,
  isReply = false,
}: CommentItemProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [busy, setBusy] = useState(false);

  function formatDate(isoString: string): string {
    const d = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    if (diffHours < 1) {
      const mins = Math.max(1, Math.round(diffMs / 60000));
      return `${mins}m ago`;
    }
    if (diffHours < 24) return `${Math.round(diffHours)}h ago`;
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  async function handleSaveEdit() {
    if (!editContent.trim() || editContent === comment.content) {
      setEditing(false);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/comments/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: comment.id, content: editContent.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setEditing(false);
      router.refresh();
    } catch (e) {
      alert(`Edit failed: ${e instanceof Error ? e.message : "Unknown"}`);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this comment? This cannot be undone.")) return;
    setBusy(true);
    try {
      const res = await fetch("/api/comments/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: comment.id, delete: true }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed");
      }
      router.refresh();
    } catch (e) {
      alert(`Delete failed: ${e instanceof Error ? e.message : "Unknown"}`);
    } finally {
      setBusy(false);
    }
  }

  async function handleReport() {
    if (!confirm("Report this comment to admins?")) return;
    setBusy(true);
    try {
      const res = await fetch("/api/comments/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: comment.id }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed");
      }
      alert("Thanks. Admins will review this comment.");
      router.refresh();
    } catch (e) {
      alert(`Report failed: ${e instanceof Error ? e.message : "Unknown"}`);
    } finally {
      setBusy(false);
    }
  }

  async function handleAdminAction(action: string) {
    setBusy(true);
    try {
      const res = await fetch("/api/comments/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: comment.id, action }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed");
      }
      router.refresh();
    } catch (e) {
      alert(`Action failed: ${e instanceof Error ? e.message : "Unknown"}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className={`${
        comment.isHidden ? "opacity-50 bg-mist/20 border-mist" : "bg-white border-mist"
      } border rounded-sm p-4`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-hull text-sm">{comment.authorName}</span>
          {comment.authorRank && (
            <span className="text-xs font-mono uppercase text-steel">
              {RANK_LABELS[comment.authorRank] ?? comment.authorRank}
            </span>
          )}
          <span className="text-xs text-steel">·</span>
          <span className="text-xs text-steel">{formatDate(comment.createdAt)}</span>
          {comment.isEdited && (
            <span className="text-xs text-steel italic">(edited)</span>
          )}
          {comment.isPinned && (
            <span className="text-xs font-mono uppercase text-signal">Pinned</span>
          )}
          {comment.isHidden && isAdmin && (
            <span className="text-xs font-mono uppercase text-red-600">Hidden</span>
          )}
          {comment.isReported && isAdmin && (
            <span className="text-xs font-mono uppercase text-brass">
              Reported ({comment.reportCount})
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      {editing ? (
        <div className="space-y-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={4}
            maxLength={5000}
            className="w-full border border-mist rounded-sm px-3 py-2 text-hull text-sm"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSaveEdit}
              disabled={busy}
              className="text-xs bg-signal text-sail font-semibold px-3 py-1 rounded-sm hover:bg-signal/90 disabled:opacity-50"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setEditContent(comment.content);
              }}
              disabled={busy}
              className="text-xs border border-mist text-hull px-3 py-1 rounded-sm hover:border-signal disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-steel text-sm leading-relaxed whitespace-pre-wrap break-words">
          {comment.content}
        </p>
      )}

      {/* Actions */}
      {!editing && (
        <div className="flex items-center gap-3 mt-3 flex-wrap text-xs">
          {canReply && isAuthenticated && !isReply && !comment.isHidden && (
            <button
              type="button"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-steel hover:text-signal transition-colors"
            >
              Reply
            </button>
          )}
          {isAuthor && !comment.isHidden && (
            <>
              <button
                type="button"
                onClick={() => setEditing(true)}
                disabled={busy}
                className="text-steel hover:text-signal transition-colors"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={busy}
                className="text-steel hover:text-red-600 transition-colors"
              >
                Delete
              </button>
            </>
          )}
          {isAuthenticated && !isAuthor && !comment.isHidden && (
            <button
              type="button"
              onClick={handleReport}
              disabled={busy || comment.isReported}
              className="text-steel hover:text-brass transition-colors disabled:opacity-50"
            >
              {comment.isReported ? "Reported" : "Report"}
            </button>
          )}
          {isAdmin && (
            <>
              <span className="text-steel/50">|</span>
              {!comment.isHidden ? (
                <button
                  type="button"
                  onClick={() => handleAdminAction("hide")}
                  disabled={busy}
                  className="text-red-600 hover:underline disabled:opacity-50"
                >
                  Hide
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleAdminAction("unhide")}
                  disabled={busy}
                  className="text-signal hover:underline disabled:opacity-50"
                >
                  Unhide
                </button>
              )}
              {!isReply && (
                <button
                  type="button"
                  onClick={() => handleAdminAction(comment.isPinned ? "unpin" : "pin")}
                  disabled={busy}
                  className="text-steel hover:text-signal disabled:opacity-50"
                >
                  {comment.isPinned ? "Unpin" : "Pin"}
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (
                    confirm(
                      "Ban this user from posting comments? Existing comments stay visible. Their account remains active."
                    )
                  ) {
                    handleAdminAction("ban-author");
                  }
                }}
                disabled={busy}
                className="text-red-600 hover:underline disabled:opacity-50"
              >
                Ban author
              </button>
            </>
          )}
        </div>
      )}

      {/* Reply form */}
      {showReplyForm && (
        <div className="mt-4 pt-4 border-t border-mist">
          <CommentForm
            targetType={targetType}
            targetId={targetId}
            parentCommentId={comment.id}
            onSuccess={() => setShowReplyForm(false)}
          />
        </div>
      )}
    </div>
  );
}
