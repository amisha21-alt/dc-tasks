import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useApp } from "@/lib/store";
import { getProjectsList } from "@/lib/data";

const StateBadge = ({ state }: { state: string | null }) => {
  if (!state) return null;
  return (
    <span className="inline-block px-2 py-0.5 border border-black text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
      {state}
    </span>
  );
};

export default function Projects() {
  const { projects, tasks, role, createProject } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", startDate: "", targetEndDate: "" });

  const projectsList = getProjectsList(projects, tasks);

  const submit = () => {
    if (!form.name.trim()) return;
    createProject(form);
    setForm({ name: "", description: "", startDate: "", targetEndDate: "" });
    setIsOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 lg:px-8 space-y-16 animate-in fade-in duration-500 pb-32">

      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <h1 className="text-3xl font-normal tracking-tight text-black leading-tight">
          Projects
        </h1>
        {role === "admin" && (
          <Button onClick={() => setIsOpen(true)} className="rounded-none bg-black text-white hover:bg-gray-800 px-8 w-full sm:w-auto shrink-0">
            + New Project
          </Button>
        )}
      </header>

      <section>
        <div className="flex flex-col border-t border-black">
          {projectsList.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <div className="group flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors gap-4 px-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <span className="font-medium text-black group-hover:underline underline-offset-4 decoration-1">
                    {project.name}
                  </span>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <span className="text-sm text-muted-foreground w-20 text-right">
                    {project.activeTasks} task{project.activeTasks !== 1 ? 's' : ''}
                  </span>
                  <span className="text-sm text-muted-foreground w-24 text-right hidden sm:inline-block">
                    {project.lastUpdated}
                  </span>
                  <div className="w-20 text-right flex justify-end">
                    <StateBadge state={project.status} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="rounded-none border-black sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-normal">New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Project Name</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-none border-black focus-visible:ring-0 focus-visible:border-black" />
            </div>
            <div className="space-y-2">
              <label className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Description</label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="rounded-none border-black focus-visible:ring-0 focus-visible:border-black" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Start Date</label>
                <Input value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  placeholder="e.g. Sep 1, 2023" className="rounded-none border-black focus-visible:ring-0 focus-visible:border-black" />
              </div>
              <div className="space-y-2">
                <label className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Target End</label>
                <Input value={form.targetEndDate} onChange={(e) => setForm({ ...form, targetEndDate: e.target.value })}
                  placeholder="e.g. Nov 30, 2023" className="rounded-none border-black focus-visible:ring-0 focus-visible:border-black" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)} className="rounded-none border-black text-black hover:bg-gray-100 text-xs uppercase tracking-wider h-8">
              Cancel
            </Button>
            <Button onClick={submit} className="rounded-none bg-black text-white hover:bg-gray-800 text-xs uppercase tracking-wider h-8">
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
