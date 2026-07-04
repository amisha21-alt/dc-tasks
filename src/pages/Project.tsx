import { useState } from "react";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/lib/store";
import { getProjectDetail } from "@/lib/data";

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

export default function Project() {
  const params = useParams();
  const projectId = params.id || "";
  const { projects, tasks, addComment, addResource } = useApp();
  const project = getProjectDetail(projects, tasks, projectId);

  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const toggleComments = (postId: string) => setExpandedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));

  const allGroups = ["To Do", "In Progress", "Waiting", "Review", "Done", "Cancelled"];
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const toggleGroup = (group: string) => setCollapsedGroups((prev) => ({ ...prev, [group]: !prev[group] }));

  const [isAddingResource, setIsAddingResource] = useState(false);
  const [resourceName, setResourceName] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6 lg:px-8 space-y-16 animate-in fade-in duration-500 pb-32">
        <h1 className="text-3xl font-normal tracking-tight text-black">Project not found</h1>
      </div>
    );
  }

  const submitResource = () => {
    if (!resourceName.trim() || !resourceUrl.trim()) return;
    addResource(projectId, resourceName, resourceUrl);
    setResourceName("");
    setResourceUrl("");
    setIsAddingResource(false);
  };

  const submitComment = (postId: string) => {
    const text = commentDrafts[postId];
    if (!text || !text.trim()) return;
    addComment({ projectId }, postId, text);
    setCommentDrafts((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 lg:px-8 space-y-16 animate-in fade-in duration-500 pb-32">

      <header className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <h1 className="text-3xl font-normal tracking-tight text-black leading-tight max-w-2xl">
              {project.name}
            </h1>
            <div className="shrink-0 flex items-center gap-4">
              <StateBadge state={project.status} />
            </div>
          </div>

          <div className="text-base leading-relaxed text-black max-w-3xl">
            {project.description}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Start</span>
              <span className="font-medium text-black">{project.startDate}</span>
            </div>
            <span className="text-muted-foreground hidden sm:inline">—</span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Target</span>
              <span className="font-medium text-black">{project.targetEndDate}</span>
            </div>
          </div>
        </div>
      </header>

      <Separator className="bg-border" />

      <section>
        <SectionHeader title="Resources" />
        <div className="space-y-3">
          {project.resources.length === 0 && !isAddingResource && (
            <p className="text-sm text-muted-foreground">No resources yet.</p>
          )}
          {project.resources.map((res: any) => (
            <div key={res.id} className="flex items-center gap-4 group">
              <a href={res.url} target="_blank" rel="noreferrer" className="text-base text-black group-hover:underline underline-offset-4 decoration-1">
                {res.name}
              </a>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{res.type}</span>
            </div>
          ))}

          <div className="pt-4">
            {isAddingResource ? (
              <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-muted-foreground">Name</label>
                  <input value={resourceName} onChange={(e) => setResourceName(e.target.value)} placeholder="e.g. Costing Sheet"
                    className="w-full text-sm bg-transparent border-b border-gray-300 pb-1 focus:outline-none focus:border-black" />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-muted-foreground">Link</label>
                  <input value={resourceUrl} onChange={(e) => setResourceUrl(e.target.value)} placeholder="https://…"
                    className="w-full text-sm bg-transparent border-b border-gray-300 pb-1 focus:outline-none focus:border-black" />
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button onClick={submitResource} className="rounded-none bg-black text-white hover:bg-gray-800 text-xs uppercase tracking-wider h-8">Add</Button>
                  <Button variant="ghost" onClick={() => setIsAddingResource(false)} className="h-8 p-0 px-3 text-sm font-medium text-black hover:bg-transparent">Cancel</Button>
                </div>
              </div>
            ) : (
              <Button variant="ghost" onClick={() => setIsAddingResource(true)} className="h-auto p-0 text-sm font-medium text-muted-foreground hover:text-black hover:bg-transparent">
                + Add Resource
              </Button>
            )}
          </div>
        </div>
      </section>

      <Separator className="bg-border" />

      <section>
        <SectionHeader title="Timeline" />
        {project.timeline.length === 0 ? (
          <p className="text-muted-foreground text-sm">No updates yet.</p>
        ) : (
          <div className="space-y-12">
            {project.timeline.map((post: any) => {
              const isExpanded = expandedPosts[post.id];
              const commentCount = post.comments?.length || 0;

              return (
                <div key={post.id} className="flex flex-col gap-3">
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-bold text-black">{post.author}</span>
                      <span className="text-xs text-muted-foreground">{post.time}</span>
                      {post.taskName && (
                        <>
                          <span className="text-muted-foreground text-sm px-2 hidden sm:inline">|</span>
                          <Link href={`/tasks/${post.taskId}`} className="text-sm text-muted-foreground hover:text-black hover:underline underline-offset-2">
                            {post.taskName}
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
                          onKeyDown={(e) => e.key === "Enter" && submitComment(post.id)}
                          placeholder="Write a comment..."
                          className="flex-1 text-sm bg-transparent border-b border-gray-300 pb-1 focus:outline-none focus:border-black placeholder:text-muted-foreground"
                        />
                        <button onClick={() => submitComment(post.id)} className="text-xs font-medium text-black hover:underline uppercase tracking-wider shrink-0">
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

      <Separator className="bg-border" />

      <section>
        <SectionHeader title="Tasks" />
        <div className="space-y-8">
          {allGroups.map((group) => {
            const groupTasks = project.tasks.filter((t: any) => t.status === group);
            if (groupTasks.length === 0) return null;
            const isCollapsed = collapsedGroups[group];

            return (
              <div key={group} className="space-y-2">
                <button onClick={() => toggleGroup(group)} className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-black hover:text-gray-600 transition-colors">
                  <span>{group}</span>
                  <span className="text-muted-foreground font-normal">({groupTasks.length})</span>
                  <span className="text-muted-foreground text-xs ml-2">{isCollapsed ? '+' : '−'}</span>
                </button>

                {!isCollapsed && (
                  <div className="flex flex-col border-t border-black">
                    {groupTasks.map((task: any) => (
                      <Link key={task.id} href={`/tasks/${task.id}`}>
                        <div className="group flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors gap-4 px-2">
                          <span className="font-medium text-black group-hover:underline underline-offset-4 decoration-1">
                            {task.name}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
