import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/lib/store";
import { getWeeklyReview } from "@/lib/data";

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

const inputStyles = "h-10 px-3 w-full border border-black rounded-none focus:outline-none focus:ring-1 focus:ring-black text-sm placeholder:text-muted-foreground";

export default function Admin() {
  const {
    users, projects, tasks, role,
    addPerson, editPerson, togglePersonActive,
    createProject, editProject, toggleProjectArchive,
  } = useApp();

  const weeklyReview = getWeeklyReview(tasks);

  // People UI state
  const [isAddingPerson, setIsAddingPerson] = useState(false);
  const [newPersonName, setNewPersonName] = useState("");
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
  const [editPersonName, setEditPersonName] = useState("");
  const [resetSentFor, setResetSentFor] = useState<string | null>(null);

  // Project UI state
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "", startDate: "", targetEndDate: "" });
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editProjectData, setEditProjectData] = useState({ name: "", description: "", startDate: "", targetEndDate: "" });

  const handleAddPerson = () => {
    if (!newPersonName.trim()) return;
    addPerson(newPersonName);
    setNewPersonName("");
    setIsAddingPerson(false);
  };

  const handleSavePerson = (id: string) => {
    if (!editPersonName.trim()) return;
    editPerson(id, editPersonName);
    setEditingPersonId(null);
  };

  const handleResetPassword = (id: string) => {
    setResetSentFor(id);
    setTimeout(() => setResetSentFor(null), 3000);
  };

  const handleAddProject = () => {
    if (!newProject.name.trim()) return;
    createProject(newProject);
    setNewProject({ name: "", description: "", startDate: "", targetEndDate: "" });
    setIsAddingProject(false);
  };

  const handleSaveProject = (id: string) => {
    if (!editProjectData.name.trim()) return;
    editProject(id, editProjectData);
    setEditingProjectId(null);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 lg:px-8 space-y-16 animate-in fade-in duration-500 pb-32">

      <header className="space-y-6">
        <h1 className="text-3xl font-normal tracking-tight text-black leading-tight max-w-2xl">
          Administration
        </h1>
      </header>

      {role === "member" ? (
        <p className="text-black text-sm">This page is only visible to Admins.</p>
      ) : (
        <>
          <Separator className="bg-border" />

          {/* 1. PEOPLE */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">People</h2>
              <Button variant="outline" size="sm" onClick={() => setIsAddingPerson(!isAddingPerson)}
                className="rounded-none border-black text-black hover:bg-gray-100 text-xs uppercase tracking-wider h-8">
                {isAddingPerson ? "Cancel" : "Add New Member"}
              </Button>
            </div>

            {isAddingPerson && (
              <div className="mb-6 p-4 border border-black space-y-4 bg-gray-50">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-2">Member Name</label>
                  <input type="text" value={newPersonName} onChange={(e) => setNewPersonName(e.target.value)} className={inputStyles} placeholder="E.g. Priya" />
                </div>
                <Button onClick={handleAddPerson} className="rounded-none bg-black text-white hover:bg-gray-800 text-xs uppercase tracking-wider h-8 px-6">
                  Save Member
                </Button>
              </div>
            )}

            <div className="flex flex-col border-t border-black">
              {users.map((person) => (
                <div key={person.id} className={`flex flex-col py-4 border-b border-gray-200 gap-4 px-2 ${!person.active ? 'opacity-50' : ''}`}>
                  {editingPersonId === person.id ? (
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                      <div className="w-full sm:w-64">
                        <label className="block text-[10px] font-bold uppercase tracking-wider mb-2">Name</label>
                        <input type="text" value={editPersonName} onChange={(e) => setEditPersonName(e.target.value)} className={inputStyles} />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleSavePerson(person.id)} className="rounded-none bg-black text-white hover:bg-gray-800 text-xs uppercase tracking-wider h-10">Save</Button>
                        <Button variant="ghost" onClick={() => setEditingPersonId(null)} className="rounded-none text-black hover:bg-gray-100 text-xs uppercase tracking-wider h-10">Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <span className={`font-medium text-black ${!person.active ? 'line-through text-muted-foreground' : ''}`}>{person.name}</span>
                        <StateBadge state={person.role} />
                        {!person.active && <StateBadge state="Inactive" />}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-medium uppercase tracking-wider">
                        <button onClick={() => { setEditingPersonId(person.id); setEditPersonName(person.name); }} className="text-muted-foreground hover:text-black transition-colors">
                          Edit
                        </button>
                        <span className="text-gray-300">|</span>
                        <button onClick={() => handleResetPassword(person.id)} className="text-muted-foreground hover:text-black transition-colors">
                          {resetSentFor === person.id ? "Link Sent ✓" : "Reset Password"}
                        </button>
                        <span className="text-gray-300">|</span>
                        <button onClick={() => togglePersonActive(person.id)} className="text-muted-foreground hover:text-black transition-colors">
                          {person.active ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <Separator className="bg-border" />

          {/* 2. PROJECTS */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Projects</h2>
              <Button variant="outline" size="sm" onClick={() => setIsAddingProject(!isAddingProject)}
                className="rounded-none border-black text-black hover:bg-gray-100 text-xs uppercase tracking-wider h-8">
                {isAddingProject ? "Cancel" : "Create New Project"}
              </Button>
            </div>

            {isAddingProject && (
              <div className="mb-6 p-6 border border-black space-y-4 bg-gray-50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-2">Project Name</label>
                    <input type="text" value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} className={inputStyles} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-2">Description</label>
                    <input type="text" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} className={inputStyles} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-2">Start Date</label>
                    <input type="text" value={newProject.startDate} onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })} className={inputStyles} placeholder="e.g. Sep 1, 2023" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-2">Target End Date</label>
                    <input type="text" value={newProject.targetEndDate} onChange={(e) => setNewProject({ ...newProject, targetEndDate: e.target.value })} className={inputStyles} placeholder="e.g. Nov 30, 2023" />
                  </div>
                </div>
                <div className="pt-2">
                  <Button onClick={handleAddProject} className="rounded-none bg-black text-white hover:bg-gray-800 text-xs uppercase tracking-wider h-8 px-6">Save Project</Button>
                </div>
              </div>
            )}

            <div className="flex flex-col border-t border-black">
              {projects.map((project) => (
                <div key={project.id} className="flex flex-col py-4 border-b border-gray-200 gap-4 px-2">
                  {editingProjectId === project.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider mb-2">Name</label>
                          <input type="text" value={editProjectData.name} onChange={(e) => setEditProjectData({ ...editProjectData, name: e.target.value })} className={inputStyles} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider mb-2">Description</label>
                          <input type="text" value={editProjectData.description} onChange={(e) => setEditProjectData({ ...editProjectData, description: e.target.value })} className={inputStyles} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider mb-2">Start Date</label>
                          <input type="text" value={editProjectData.startDate} onChange={(e) => setEditProjectData({ ...editProjectData, startDate: e.target.value })} className={inputStyles} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider mb-2">Target End Date</label>
                          <input type="text" value={editProjectData.targetEndDate} onChange={(e) => setEditProjectData({ ...editProjectData, targetEndDate: e.target.value })} className={inputStyles} />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleSaveProject(project.id)} className="rounded-none bg-black text-white hover:bg-gray-800 text-xs uppercase tracking-wider h-8">Save</Button>
                        <Button variant="ghost" onClick={() => setEditingProjectId(null)} className="rounded-none text-black hover:bg-gray-100 text-xs uppercase tracking-wider h-8">Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-4">
                          <span className={`font-medium text-black ${project.status === 'Archived' ? 'text-muted-foreground' : ''}`}>{project.name}</span>
                          <StateBadge state={project.status} />
                        </div>
                        <div className="text-sm text-muted-foreground">{project.startDate} &mdash; {project.targetEndDate}</div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-medium uppercase tracking-wider shrink-0">
                        <button onClick={() => { setEditingProjectId(project.id); setEditProjectData({ name: project.name, description: project.description, startDate: project.startDate, targetEndDate: project.targetEndDate }); }} className="text-muted-foreground hover:text-black transition-colors">
                          Edit
                        </button>
                        <span className="text-gray-300">|</span>
                        <button onClick={() => toggleProjectArchive(project.id)} className="text-muted-foreground hover:text-black transition-colors">
                          {project.status === "Archived" ? "Reopen" : "Archive"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <Separator className="bg-border" />

          {/* 3. WEEKLY REVIEW */}
          <section>
            <SectionHeader title="Weekly Review Stats" />
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-8 sm:gap-16 flex-wrap">
              <div className="flex flex-col gap-1">
                <span className="text-4xl font-light text-black tracking-tighter">{weeklyReview.completed}</span>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Completed Tasks</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-4xl font-light text-black tracking-tighter">{weeklyReview.active}</span>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Active Tasks</span>
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

        </>
      )}
    </div>
  );
}
