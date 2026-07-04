import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { bootstrap, project } from "./api";
import {
  User,
  Project,
  Task,
  Post,
  Comment,
  INITIAL_USERS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  byId,
} from "./data";

export type Role = "member" | "admin";

let counter = 1000;
const genId = (prefix: string) => `${prefix}${counter++}`;

interface PostInput {
  projectId: string;
  taskId?: string | null;
  text: string;
  state?: string | null;
}

interface NewTaskInput {
  projectId: string;
  name: string;
  dueDate?: string | null;
}

interface NewProjectInput {
  name: string;
  description: string;
  startDate: string;
  targetEndDate: string;
}

interface CommentTarget {
  taskId?: string;
  projectId?: string;
}

interface AppContextValue {
  users: User[];
  projects: Project[];
  tasks: Task[];
  role: Role;
  actingUser: User;
  setRole: (r: Role) => void;
  postUpdate: (input: PostInput) => void;
  createTask: (input: NewTaskInput) => string;
  editTask: (taskId: string, patch: { name?: string; dueDate?: string | null }) => void;
  addSubtask: (taskId: string, name: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addComment: (target: CommentTarget, postId: string, text: string) => void;
  addResource: (projectId: string, name: string, url: string) => void;
  createProject: (input: NewProjectInput) => Promise<void>;
  editProject: (id: string, patch: Partial<Project>) => Promise<void>;
  toggleProjectArchive: (id: string) => void;
  addPerson: (name: string) => void;
  editPerson: (id: string, name: string) => void;
  togglePersonActive: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [role, setRole] = useState<Role>("member");

  useEffect(() => {
    let cancelled = false;

    const loadBootstrapData = async () => {
      try {
        const data = await bootstrap();
        if (cancelled || !data?.success) return;

        const remoteUsers = Array.isArray(data.users) ? data.users : [];
        const remoteProjects = Array.isArray(data.projects) ? data.projects : [];
        const remoteTasks = Array.isArray(data.tasks) ? data.tasks : [];

        if (remoteUsers.length) {
          setUsers(remoteUsers);
        }
        if (remoteProjects.length) {
          setProjects(remoteProjects);
        }
        if (remoteTasks.length) {
          setTasks(remoteTasks);
        }
      } catch {
        // Fall back to the existing local demo data if the bootstrap request fails.
      }
    };

    loadBootstrapData();

    return () => {
      cancelled = true;
    };
  }, []);

  // No real login yet — the role toggle simulates whichever kind of
  // person is currently "logged in" for demo purposes.
  const actingUser = useMemo(() => {
    return (
      users.find((u) => (role === "admin" ? u.role === "Admin" : u.role === "Member") && u.active) ||
      users[0]
    );
  }, [users, role]);

  const postUpdate = ({ projectId, taskId, text, state }: PostInput) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const post: Post = {
      id: genId("post"),
      author: actingUser.name,
      time: "Just now",
      text: trimmed,
      state: state || null,
      comments: [],
    };

    if (taskId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                timeline: [post, ...t.timeline],
                state: state || t.state,
                overdue: state === "Done" || state === "Cancelled" ? false : t.overdue,
                completedDate: state === "Done" ? "Just now" : t.completedDate,
              }
            : t,
        ),
      );
    } else {
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, timeline: [post, ...p.timeline] } : p)),
      );
    }
  };

  const createTask = ({ projectId, name, dueDate }: NewTaskInput) => {
    const trimmed = name.trim();
    if (!trimmed) return "";
    const id = genId("t");
    const newTask: Task = {
      id,
      name: trimmed,
      projectId,
      leadId: actingUser.id, // task creator becomes lead — ownership never changes after this
      state: "To Do",
      dueDate: dueDate || null,
      subtasks: [],
      timeline: [],
      managerNotes: [],
    };
    setTasks((prev) => [newTask, ...prev]);
    return id;
  };

  const editTask = (taskId: string, patch: { name?: string; dueDate?: string | null }) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const next = { ...t };
        if (patch.name !== undefined && patch.name.trim()) next.name = patch.name.trim();
        if (patch.dueDate !== undefined) next.dueDate = patch.dueDate || null;
        return next;
        // Current State is intentionally untouched here — it can only
        // change by posting an update, per the spec's task rules.
      }),
    );
  };

  const addSubtask = (taskId: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, subtasks: [...t.subtasks, { id: genId("st"), name: trimmed, completed: false }] }
          : t,
      ),
    );
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          subtasks: t.subtasks.map((st) =>
            st.id === subtaskId
              ? st.completed
                ? { ...st, completed: false, completedBy: undefined, completedAt: undefined }
                : { ...st, completed: true, completedBy: actingUser.name, completedAt: "Just now" }
              : st,
          ),
        };
      }),
    );
  };

  const addComment = (target: CommentTarget, postId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const comment: Comment = { id: genId("c"), author: actingUser.name, text: trimmed };

    if (target.taskId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === target.taskId
            ? {
                ...t,
                timeline: t.timeline.map((p) =>
                  p.id === postId ? { ...p, comments: [...p.comments, comment] } : p,
                ),
              }
            : t,
        ),
      );
    } else if (target.projectId) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === target.projectId
            ? {
                ...p,
                timeline: p.timeline.map((post) =>
                  post.id === postId ? { ...post, comments: [...post.comments, comment] } : post,
                ),
              }
            : p,
        ),
      );
    }
  };

  const addResource = (projectId: string, name: string, url: string) => {
    const trimmedName = name.trim();
    const trimmedUrl = url.trim();
    if (!trimmedName || !trimmedUrl) return;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              resources: [...p.resources, { id: genId("r"), name: trimmedName, url: trimmedUrl, type: "Link" }],
            }
          : p,
      ),
    );
  };

  const createProject = async ({ name, description, startDate, targetEndDate }: NewProjectInput) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    try {
      const response = await project("create", {
        name: trimmed,
        description: description.trim(),
        startDate: startDate.trim() || "Unscheduled",
        targetEndDate: targetEndDate.trim() || "Unscheduled",
      });

      if (response.success === true && response.project) {
        setProjects((prev) => [...prev, response.project]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const editProject = async (id: string, patch: Partial<Project>) => {
    const currentProject = projects.find((project) => project.id === id);
    if (!currentProject) return;

    const mergedProject = {
      ...currentProject,
      ...patch,
    };

    try {
      const response = await project("edit", {
        id,
        name: mergedProject.name,
        description: mergedProject.description,
        startDate: mergedProject.startDate,
        targetEndDate: mergedProject.targetEndDate,
      });

      if (response.success === true && response.project) {
        setProjects((prev) => prev.map((project) => (project.id === id ? response.project : project)));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleProjectArchive = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: p.status === "Archived" ? "Active" : "Archived" } : p)),
    );
  };

  const addPerson = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setUsers((prev) => [
      ...prev,
      { id: genId("m"), name: trimmed, role: "Member", active: true, joined: "Just now" },
    ]);
  };

  const editPerson = (id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, name: trimmed } : u)));
  };

  const togglePersonActive = (id: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u)));
  };

  const value: AppContextValue = {
    users,
    projects,
    tasks,
    role,
    actingUser,
    setRole,
    postUpdate,
    createTask,
    editTask,
    addSubtask,
    toggleSubtask,
    addComment,
    addResource,
    createProject,
    editProject,
    toggleProjectArchive,
    addPerson,
    editPerson,
    togglePersonActive,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function useUsersById() {
  const { users } = useApp();
  return useMemo(() => byId(users), [users]);
}

export function useProjectsById() {
  const { projects } = useApp();
  return useMemo(() => byId(projects), [projects]);
}

export function useTasksById() {
  const { tasks } = useApp();
  return useMemo(() => byId(tasks), [tasks]);
}
