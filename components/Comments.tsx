import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";
import Link from "next/link";

interface CommentsProps {
  targetType: "ARTICLE" | "VESSEL_CLASS";
  targetId: string;
}

export async function Comments({ targetType, targetId }: CommentsProps) {
  const { userId: clerkId } = await auth();
  const adminFlag = await isAdmin();

  // Get current user's internal id (if authenticated) for "is author" checks
  let currentUserId: string | null = null;
  if (clerkId) {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });
    currentUserId = user?.id ?? null;
  }

  // Fetch top-level comments + their replies (one level)
  const topLevelComments = await prisma.comment.findMany({
    where: {
      targetType,
      targetId,
      parentCommentId: null,
      ...(adminFlag ? {} : { isHidden: false }),
    },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    include: {
      author: {
        select: {
          id: true,
          email: true,
          profile: { select: { displayName: true, rank: true } },
        },
      },
      replies: {
        where: adminFlag ? {} : { isHidden: false },
        orderBy: { createdAt: "asc" },
        include: {
          author: {
            select: {
              id: true,
              email: true,
              profile: { select: { displayName: true, rank: true } },
            },
          },
        },
      },
    },
  });

  const visibleCount = topLevelComments.reduce(
    (sum, c) => sum + 1 + c.replies.length,
    0
  );

  return (
    <section className="border-t border-mist mt-12 pt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-2xl text-hull">
          Discussion
          {visibleCount > 0 && (
            <span className="ml-2 text-base text-steel font-normal">({visibleCount})</span>
          )}
        </h2>
      </div>

      {/* Comment form for members, sign-in prompt for others */}
      {clerkId ? (
        <CommentForm targetType={targetType} targetId={targetId} />
      ) : (
        <div className="border border-mist bg-mist/20 rounded-sm p-5 mb-8">
          <p className="text-steel text-sm">
            <Link href="/sign-in" className="text-signal font-semibold hover:underline">
              Sign in
            </Link>{" "}
            or{" "}
            <Link href="/sign-up" className="text-signal font-semibold hover:underline">
              create an account
            </Link>{" "}
            to join the discussion. EngineRoom Network is free for marine engineers.
          </p>
        </div>
      )}

      {/* Comments list */}
      {topLevelComments.length === 0 ? (
        <div className="text-center py-10 text-steel text-sm">
          {clerkId
            ? "No comments yet. Be the first to share your perspective."
            : "No comments yet."}
        </div>
      ) : (
        <div className="space-y-6">
          {topLevelComments.map((comment) => {
            const authorIsCurrentUser = currentUserId === comment.author.id;

            return (
              <div key={comment.id}>
                <CommentItem
                  comment={{
                    id: comment.id,
                    content: comment.content,
                    createdAt: comment.createdAt.toISOString(),
                    isEdited: comment.isEdited,
                    isHidden: comment.isHidden,
                    isPinned: comment.isPinned,
                    isReported: comment.isReported,
                    reportCount: comment.reportCount,
                    authorName:
                      comment.author.profile?.displayName ?? comment.author.email.split("@")[0],
                    authorRank: comment.author.profile?.rank ?? null,
                  }}
                  targetType={targetType}
                  targetId={targetId}
                  isAuthor={authorIsCurrentUser}
                  isAdmin={adminFlag}
                  isAuthenticated={!!clerkId}
                  canReply
                />

                {comment.replies.length > 0 && (
                  <div className="ml-6 md:ml-12 mt-4 space-y-4 border-l-2 border-mist pl-4 md:pl-6">
                    {comment.replies.map((reply) => {
                      const replyIsCurrentUsers = currentUserId === reply.author.id;
                      return (
                        <CommentItem
                          key={reply.id}
                          comment={{
                            id: reply.id,
                            content: reply.content,
                            createdAt: reply.createdAt.toISOString(),
                            isEdited: reply.isEdited,
                            isHidden: reply.isHidden,
                            isPinned: false,
                            isReported: reply.isReported,
                            reportCount: reply.reportCount,
                            authorName:
                              reply.author.profile?.displayName ??
                              reply.author.email.split("@")[0],
                            authorRank: reply.author.profile?.rank ?? null,
                          }}
                          targetType={targetType}
                          targetId={targetId}
                          isAuthor={replyIsCurrentUsers}
                          isAdmin={adminFlag}
                          isAuthenticated={!!clerkId}
                          canReply={false}
                          isReply
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
