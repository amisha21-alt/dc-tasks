import { useState } from "react";
import { useParams, Link } from "wouter";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/lib/store";
import { getPersonProfile } from "@/lib/data";

const SectionHeader = ({ title }: { title: string }) => (
  <h2 className="text-xs font-semibold tracking-widest uppercase mb-6 text-muted-foreground">
    {title}
  </h2>
);

const StateBadge = ({ state }: { state: string | null }) => {
  if (!state) return null;
  return (
    <span className="inline-block px-2 py-0.5 border border-black text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
      {state}
    </span>
  );
};

export default function Person() {
  const params = useParams();
  const personId = params.id || "";
  const { users, tasks, projects, addComment } = useApp();
  const person = getPersonProfile(users, tasks, projects, personId);

  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const toggleComments = (postId: string) => setExpandedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));

  const submitComment = (post: any) => {
    const text = commentDrafts[post.id];
    if (!text || !text.trim()) return;
    if (post.taskId) addComment({ taskId: post.taskId }, post.id, text);
    else addComment({ projectId: projects.find((p) => p.name === post.project)?.id }, post.id, text);
    setCommentDrafts((prev) => ({ ...prev, [post.id]: "" }));
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 lg:px-8 space-y-16 animate-in fade-in duration-500 pb-32">
      <header className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <h1 className="text-3xl font-normal tracking-tight text-black leading-tight max-w-2xl">
              {person.name}
            </h1>
            <div className="shrink-0 flex items-center gap-4">
              <StateBadge state={person.role} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Joined</span>
              <span className="font-medium text-black">{person.joined}</span>
            </div>
          </div>
        </div>
      </header>

      <Separator className="bg-border" />

      {/* ACTIVE TASKS */}
      <section>
        <SectionHeader title="Active Tasks" />
        {person.activeTasks.length === 0 ? (
          <p className="text-muted-foreground text-sm">No active tasks.</p>
        ) : (
          <div className="flex flex-col border-t border-black">
            {person.activeTasks.map((task: any) => (
              <Link key={task.id} href={`/tasks/${task.id}`}>
                <div className="group flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors gap-4 px-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                    <span className="font-medium text-black group-hover:underline underline-offset-4 decoration-1">{task.name}</span>
                    <span className="text-sm text-muted-foreground hidden sm:inline">—</span>
                    <span className="text-sm text-muted-foreground">{task.project}</span>
                  </div>
                  <div className="shrink-0">
                    <StateBadge state={task.state} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* COMPLETED TASKS */}
      <section>
        <SectionHeader title="Completed Tasks" />
        {person.completedTasks.length === 0 ? (
          <p className="text-muted-foreground text-sm">No completed tasks yet.</p>
        ) : (
          <div className="flex flex-col border-t border-gray-300">
            {person.completedTasks.map((task: any) => (
              <Link key={task.id} href={`/tasks/${task.id}`}>
                <div className="group flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors gap-4 px-2">
                  <span className="font-medium text-black group-hover:underline underline-offset-4 decoration-1 text-muted-foreground line-through">
                    {task.name}
                  </span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">{task.completedDate}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Separator className="bg-border" />

      {/* RECENT POSTS */}
      <section>
        <SectionHeader title="Recent Posts" />
        {person.posts.length === 0 ? (
          <p className="text-muted-foreground text-sm">No recent posts.</p>
        ) : (
          <div className="space-y-12">
            {person.posts.map((post: any) => {
              const isExpanded = expandedPosts[post.id];
              const commentCount = post.comments?.length || 0;

              return (
                <div key={post.id} className="flex flex-col gap-3">
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-bold text-black">{post.author}</span>
                      <span className="text-xs text-muted-foreground">{post.time}</span>
                      {post.project && (
                        <>
                          <span className="text-muted-foreground text-sm px-2 hidden sm:inline">|</span>
                          <span className="text-sm font-medium">{post.project}</span>
                        </>
                      )}
                      {post.task && (
                        <>
                          <span className="text-muted-foreground text-sm">/</span>
                          <Link href={`/tasks/${post.taskId}`} className="text-sm text-muted-foreground hover:text-black hover:underline underline-offset-2">
                            {post.task}
                          </Link>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-base leading-relaxed text-black max-w-3xl">{post.text}</div>

                  <div className="flex items-center gap-4 mt-1">
                    <StateBadge state={post.state} />
                    <button onClick={() => toggleComments(post.id)} className="text-xs font-medium text-muted-foreground hover:text-black uppercase tracking-wider">
                      {commentCount > 0 ? `${commentCount} Comment${commentCount !== 1 ? "s" : ""} ${isExpanded ? "↓" : "→"}` : "Add Comment"}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="pl-4 mt-2 border-l border-gray-200 space-y-4">
                      {post.comments.map((comment: any) => (
                        <div key={comment.id} className="text-sm">
                          <span className="font-bold text-black mr-2">{comment.author}</span>
                          <span className="text-black">{comment.text}</span>
                        </div>
                      ))}
                      <div className="pt-2 flex items-center gap-3">
                        <input
                          type="text"
                          value={commentDrafts[post.id] || ""}
                          onChange={(e) => setCommentDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyDown={(e) => e.key === "Enter" && submitComment(post)}
                          placeholder="Write a comment..."
                          className="flex-1 text-sm bg-transparent border-b border-gray-300 pb-1 focus:outline-none focus:border-black placeholder:text-muted-foreground"
                        />
                        <button onClick={() => submitComment(post)} className="text-xs font-medium text-black hover:underline uppercase tracking-wider shrink-0">
                          Post
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}
