import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useApp } from "@/lib/store";
import {
  getNeedsAttention,
  getRecentUpdates,
  getActiveProjects,
  getTeamMembers,
  getWeeklyReview,
  TASK_STATES,
} from "@/lib/data";

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

const selectStyles =
  "bg-transparent border-b border-border py-1 text-xs focus:outline-none focus:border-foreground text-muted-foreground";

export default function Home() {
  const { tasks, projects, users, postUpdate, createTask } = useApp();

  const [updateText, setUpdateText] = useState("");
  const [postProjectId, setPostProjectId] = useState(projects[0]?.id || "");
  const [postTaskId, setPostTaskId] = useState("");
  const [postState, setPostState] = useState("");

  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskProjectId, setNewTaskProjectId] = useState(projects[0]?.id || "");
  const [newTaskDue, setNewTaskDue] = useState("");

  const needsAttention = getNeedsAttention(tasks, projects);
  const recentUpdates = getRecentUpdates(tasks, projects);
  const activeProjects = getActiveProjects(projects, tasks);
  const teamMembers = getTeamMembers(users, tasks, projects);
  const weeklyReview = getWeeklyReview(tasks);

  const tasksForPostProject = tasks.filter((t) => t.projectId === postProjectId);

  const handlePostUpdate = () => {
    if (!updateText.trim()) return;
    postUpdate({
      projectId: postProjectId,
      taskId: postTaskId || null,
      text: updateText,
      state: postState || null,
    });
    setUpdateText("");
    setPostTaskId("");
    setPostState("");
  };

  const submitNewTask = () => {
    if (!newTaskName.trim()) return;
    createTask({ projectId: newTaskProjectId, name: newTaskName, dueDate: newTaskDue || null });
    setNewTaskName("");
    setNewTaskDue("");
    setIsNewTaskOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 lg:px-8 space-y-24 animate-in fade-in duration-500 pb-32">

      {/* 1. NEW UPDATE */}
      <section>
        <SectionHeader title="New Update" />
        <div className="space-y-4">
          <Textarea
            value={updateText}
            onChange={(e) => setUpdateText(e.target.value)}
            placeholder="What did you work on?"
            className="min-h-[120px] rounded-none border-black resize-y text-base p-4 placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-black focus-visible:border-black"
          />

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <label className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Project</span>
              <select
                value={postProjectId}
                onChange={(e) => { setPostProjectId(e.target.value); setPostTaskId(""); }}
                className={selectStyles}
              >
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </label>
            <label className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Task</span>
              <select value={postTaskId} onChange={(e) => setPostTaskId(e.target.value)} className={selectStyles}>
                <option value="">No specific task</option>
                {tasksForPostProject.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </label>
            {postTaskId && (
              <label className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Set state</span>
                <select value={postState} onChange={(e) => setPostState(e.target.value)} className={selectStyles}>
                  <option value="">Keep current state</option>
                  {TASK_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handlePostUpdate}
              disabled={!updateText.trim()}
              className="rounded-none bg-black text-white hover:bg-gray-800 px-8 disabled:opacity-40"
            >
              Post Update
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsNewTaskOpen(true)}
              className="rounded-none border-black text-black hover:bg-gray-100 px-8"
            >
              New Task
            </Button>
          </div>
        </div>
      </section>

      {/* NEW TASK DIALOG */}
      <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
        <DialogContent className="rounded-none border-black sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-normal">New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Task Name</label>
              <Input
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="e.g. Visit Ajrakh artisan"
                className="rounded-none border-black focus-visible:ring-0 focus-visible:border-black"
              />
            </div>
            <div className="space-y-2">
              <label className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Project</label>
              <select
                value={newTaskProjectId}
                onChange={(e) => setNewTaskProjectId(e.target.value)}
                className="h-10 px-3 w-full border border-black rounded-none focus:outline-none focus:ring-1 focus:ring-black text-sm"
              >
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Due Date (optional)</label>
              <Input
                value={newTaskDue}
                onChange={(e) => setNewTaskDue(e.target.value)}
                placeholder="e.g. Oct 12, 2023"
                className="rounded-none border-black focus-visible:ring-0 focus-visible:border-black"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              You'll be set as Task Lead automatically — ownership can't be changed later.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewTaskOpen(false)} className="rounded-none border-black text-black hover:bg-gray-100 text-xs uppercase tracking-wider h-8">
              Cancel
            </Button>
            <Button onClick={submitNewTask} className="rounded-none bg-black text-white hover:bg-gray-800 text-xs uppercase tracking-wider h-8">
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Separator className="bg-border" />

      {/* 2. NEEDS ATTENTION */}
      <section>
        <SectionHeader title="Needs Attention" />
        {needsAttention.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing needs attention right now.</p>
        ) : (
          <div className="flex flex-col border-t border-black">
            {needsAttention.map((task) => (
              <Link key={task.id} href={`/tasks/${task.id}`}>
                <div className="group flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors gap-4 px-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                    <span className="font-medium text-black group-hover:underline underline-offset-4 decoration-1">
                      {task.name}
                    </span>
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

      {/* 3. RECENT UPDATES */}
      <section>
        <SectionHeader title="Recent Updates" />
        {recentUpdates.length === 0 ? (
          <p className="text-sm text-muted-foreground">No updates yet.</p>
        ) : (
          <div className="space-y-12">
            {recentUpdates.map((update) => (
              <div key={update.id} className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between gap-4">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-bold text-black">{update.author}</span>
                    <span className="text-xs text-muted-foreground">{update.time}</span>
                    <span className="text-muted-foreground text-sm px-2 hidden sm:inline">|</span>
                    <span className="text-sm font-medium">{update.project}</span>
                    {update.task && (
                      <>
                        <span className="text-muted-foreground text-sm">/</span>
                        <Link href={`/tasks/${update.taskId}`} className="text-sm text-muted-foreground hover:text-black hover:underline underline-offset-2">
                          {update.task}
                        </Link>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-base leading-relaxed text-black max-w-3xl">
                  {update.text}
                </div>

                <div className="flex items-center gap-4 mt-2">
                  <StateBadge state={update.state} />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {update.comments > 0 ? `${update.comments} Comment${update.comments !== 1 ? "s" : ""}` : "No comments"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Separator className="bg-border" />

      {/* 4. PROJECTS */}
      <section>
        <SectionHeader title="Projects" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {activeProjects.map((project) => (
            <div key={project.id} className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between border-b border-black pb-2">
                <h3 className="font-bold text-black text-lg">{project.name}</h3>
                <Link href={`/projects/${project.id}`} className="text-xs font-medium text-muted-foreground hover:text-black uppercase tracking-wider shrink-0">
                  View
                </Link>
              </div>
              <ul className="space-y-2">
                {project.updates.map((update, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground truncate">
                    &bull; {update}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PEOPLE */}
      <section>
        <SectionHeader title="People" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between border-b border-gray-300 pb-2">
                <h3 className="font-medium text-black">{member.name}</h3>
                <Link href={`/people/${member.id}`} className="text-xs font-medium text-muted-foreground hover:text-black uppercase tracking-wider shrink-0">
                  Profile
                </Link>
              </div>
              <ul className="space-y-2">
                {member.updates.map((update, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground truncate">
                    &bull; {update}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <Separator className="bg-border" />

      {/* 6. WEEKLY REVIEW */}
      <section>
        <SectionHeader title="Weekly Review" />
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-8 sm:gap-16 flex-wrap">
          <div className="flex flex-col gap-1">
            <span className="text-4xl font-light text-black tracking-tighter">{weeklyReview.completed}</span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Completed</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-4xl font-light text-black tracking-tighter">{weeklyReview.active}</span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Active</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-4xl font-light text-black tracking-tighter">{weeklyReview.waiting}</span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Waiting</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-4xl font-light text-black tracking-tighter">{weeklyReview.review}</span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Review</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-4xl font-light text-black tracking-tighter">{weeklyReview.overdue}</span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Overdue</span>
          </div>
        </div>
      </section>

    </div>
  );
}
