import { useState } from "react";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useApp, useUsersById, useProjectsById } from "@/lib/store";
import { defaultTask } from "@/lib/data";

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

export default function Task() {
  const params = useParams();
  const taskId = params.id || "";
  const { tasks, role, editTask, addSubtask, toggleSubtask, addComment } = useApp();
  const usersById = useUsersById();
  const projectsById = useProjectsById();

  const rawTask = tasks.find((t) => t.id === taskId);
  const taskData = rawTask
    ? { ...rawTask, project: projectsById[rawTask.projectId]?.name || "General", lead: usersById[rawTask.leadId]?.name || "Unassigned" }
    : { ...defaultTask, name: `Task ${taskId}`, project: "General", lead: "Unassigned" };

  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
  const toggleComments = (postId: string) => setExpandedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});

  const [newSubtask, setNewSubtask] = useState("");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [draftName, setDraftName] = useState(taskData.name);
  const [draftDueDate, setDraftDueDate] = useState(taskData.dueDate || "");

  const openEditDialog = () => {
    setDraftName(taskData.name);
    setDraftDueDate(taskData.dueDate || "");
    setIsEditOpen(true);
  };

  const saveEditDialog = () => {
    editTask(taskId, { name: draftName, dueDate: draftDueDate || null });
    setIsEditOpen(false);
  };

  const submitSubtask = () => {
    if (!newSubtask.trim()) return;
    addSubtask(taskId, newSubtask);
    setNewSubtask("");
  };

  const submitComment = (postId: string) => {
    const text = commentDrafts[postId];
    if (!text || !text.trim()) return;
    addComment({ taskId }, postId, text);
    setCommentDrafts((prev) => ({ ...prev, [postId]: "" }));
  };

  if (!rawTask) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6 lg:px-8 space-y-16 animate-in fade-in duration-500 pb-32">
        <h1 className="text-3xl font-normal tracking-tight text-black">Task not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 lg:px-8 space-y-16 animate-in fade-in duration-500 pb-32">

      {/* 1. TASK HEADER */}
      <header className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <h1 className="text-3xl font-normal tracking-tight text-black leading-tight max-w-2xl">
              {taskData.name}
            </h1>
            <div className="shrink-0 flex items-center gap-4">
              <Button variant="outline" onClick={openEditDialog} className="rounded-none border-black text-black hover:bg-gray-100 text-xs uppercase tracking-wider h-8">
                Edit Task
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Project</span>
              <Link href={`/projects/${taskData.projectId}`} className="font-medium text-black hover:underline underline-offset-4">
                {taskData.project}
              </Link>
            </div>
            <span className="text-muted-foreground hidden sm:inline">—</span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Task Lead</span>
              <span className="font-medium text-black">{taskData.lead}</span>
            </div>
            <span className="text-muted-foreground hidden sm:inline">—</span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Current State</span>
              <span className="font-medium text-black">{taskData.state}</span>
              <span className="text-[10px] text-muted-foreground italic">(post an update to change)</span>
            </div>
            {taskData.dueDate && (
              <>
                <span className="text-muted-foreground hidden sm:inline">—</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Due Date</span>
                  <span className="font-medium text-black">{taskData.dueDate}</span>
                  {taskData.overdue && <span className="text-xs text-muted-foreground italic">(Overdue)</span>}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* EDIT TASK DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="rounded-none border-black sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-normal">Edit Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Task Name</label>
              <Input value={draftName} onChange={(e) => setDraftName(e.target.value)} className="rounded-none border-black focus-visible:ring-0 focus-visible:border-black" />
            </div>
            <div className="space-y-2">
              <label className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Due Date</label>
              <Input value={draftDueDate} onChange={(e) => setDraftDueDate(e.target.value)} placeholder="e.g. Oct 12, 2023" className="rounded-none border-black focus-visible:ring-0 focus-visible:border-black" />
            </div>
            <p className="text-xs text-muted-foreground">Current State can't be changed here — post an update instead.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)} className="rounded-none border-black text-black hover:bg-gray-100 text-xs uppercase tracking-wider h-8">Cancel</Button>
            <Button onClick={saveEditDialog} className="rounded-none bg-black text-white hover:bg-gray-800 text-xs uppercase tracking-wider h-8">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Separator className="bg-border" />

      {/* 2. SUBTASKS */}
      <section>
        <SectionHeader title="Subtasks" />
        <div className="space-y-3">
          {taskData.subtasks.map((st: any) => {
            const isChecked = st.completed;
            return (
              <div key={st.id} className="flex items-start gap-3 group">
                <div className="pt-0.5">
                  <Checkbox
                    id={st.id}
                    checked={isChecked}
                    onCheckedChange={() => toggleSubtask(taskId, st.id)}
                    className="rounded-none border-black data-[state=checked]:bg-black data-[state=checked]:text-white"
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <label htmlFor={st.id} className={`text-base cursor-pointer select-none transition-colors ${isChecked ? 'text-muted-foreground line-through' : 'text-black'}`}>
                    {st.name}
                  </label>
                  {isChecked && st.completedBy && (
                    <span className="text-xs text-muted-foreground">
                      Completed by {st.completedBy} &mdash; {st.completedAt || "just now"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          <div className="pt-4 flex items-center gap-3 max-w-md">
            <input
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitSubtask()}
              placeholder="Add a subtask…"
              className="flex-1 text-sm bg-transparent border-b border-gray-300 pb-1 focus:outline-none focus:border-black placeholder:text-muted-foreground"
            />
            <button onClick={submitSubtask} className="text-xs font-medium text-black hover:underline uppercase tracking-wider shrink-0">
              Add
            </button>
          </div>
        </div>
      </section>

      <Separator className="bg-border" />

      {/* 3. TIMELINE & COMMENTS */}
      <section>
        <SectionHeader title="Timeline" />
        {taskData.timeline.length === 0 ? (
          <p className="text-muted-foreground text-sm">No updates yet.</p>
        ) : (
          <div className="space-y-12">
            {taskData.timeline.map((post: any) => {
              const isExpanded = expandedPosts[post.id];
              const commentCount = post.comments?.length || 0;

              return (
                <div key={post.id} className="flex flex-col gap-3">
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-bold text-black">{post.author}</span>
                      <span className="text-xs text-muted-foreground">{post.time}</span>
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

      {/* 4. MANAGER NOTES (Admin only) */}
      {role === "admin" && (
        <>
          <Separator className="bg-border" />
          <section className="bg-gray-50 p-6 -mx-6 lg:mx-0 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <SectionHeader title="Manager Notes" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-6">Admin Only</span>
            </div>
            {taskData.managerNotes.length === 0 ? (
              <p className="text-muted-foreground text-sm">No manager notes.</p>
            ) : (
              <div className="space-y-4">
                {taskData.managerNotes.map((note: any, i: number) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-black text-sm">{note.author}</span>
                      <span className="text-xs text-muted-foreground">{note.date}</span>
                    </div>
                    <div className="text-sm text-black leading-relaxed">{note.note}</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}

    </div>
  );
}
