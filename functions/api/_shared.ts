import type { Comment, Post, Project, Resource, Subtask, Task, User } from "../../src/lib/data";

export interface Env {
  DB?: D1DatabaseLike;
  D1?: D1DatabaseLike;
  DATABASE?: D1DatabaseLike;
  DB_BINDING?: D1DatabaseLike;
}

interface D1Result<T = Record<string, unknown>> {
  results: T[];
  success: boolean;
  error?: string;
}

interface D1PreparedStatementLike {
  bind(...values: unknown[]): D1PreparedStatementLike;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  run(): Promise<{ success: boolean; error?: string }>;
}

interface D1DatabaseLike {
  prepare(query: string): D1PreparedStatementLike;
}

export interface FunctionContext {
  request: Request;
  env: Env;
  params: Record<string, string>;
}

export function getD1Database(env: Env): D1DatabaseLike | null {
  return env.DB || env.D1 || env.DATABASE || env.DB_BINDING || null;
}

export function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
}

export function errorResponse(message: string, status = 500) {
  return jsonResponse({ success: false, message }, status);
}

export async function parseJsonBody(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

async function getTableColumns(db: D1DatabaseLike | null, table: string): Promise<string[]> {
  if (!db) return [];

  try {
    const result = await db.prepare(`PRAGMA table_info(${table})`).all<Record<string, unknown>>();
    return (result.results || [])
      .map((row) => String((row.name as string | undefined) || "").trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

export async function readTable<T = Record<string, unknown>>(db: D1DatabaseLike | null, table: string) {
  if (!db) return [] as T[];

  try {
    const columns = await getTableColumns(db, table);
    if (!columns.length) return [] as T[];

    const selectClause = columns.map((col) => `"${col}"`).join(", ");
    const result = await db.prepare(`SELECT ${selectClause} FROM ${table}`).all<T>();
    return (result.results || []) as T[];
  } catch {
    return [] as T[];
  }
}

function getValue(row: Record<string, unknown>, candidates: string[]) {
  for (const key of candidates) {
    if (Object.prototype.hasOwnProperty.call(row, key) && row[key] !== undefined && row[key] !== null) {
      return row[key];
    }
  }
  return undefined;
}

export function normalizeUser(row: Record<string, unknown>): User {
  return {
    id: String(getValue(row, ["id", "userId", "user_id"]) ?? ""),
    name: String(getValue(row, ["name"]) ?? ""),
    role: getValue(row, ["role"]) === "Admin" ? "Admin" : "Member",
    active: Boolean(getValue(row, ["active", "isActive", "is_active"]) ?? true),
    joined: String(getValue(row, ["joined", "joinedAt", "joined_at"]) ?? ""),
  };
}

export function normalizeResource(row: Record<string, unknown>): Resource {
  return {
    id: String(getValue(row, ["id", "resourceId", "resource_id"]) ?? ""),
    name: String(getValue(row, ["name"]) ?? ""),
    url: String(getValue(row, ["url", "link"]) ?? ""),
    type: String(getValue(row, ["type"]) ?? "Link"),
  };
}

export function normalizeSubtask(row: Record<string, unknown>): Subtask {
  return {
    id: String(getValue(row, ["id", "subtaskId", "subtask_id"]) ?? ""),
    name: String(getValue(row, ["name"]) ?? ""),
    completed: Boolean(getValue(row, ["completed", "isCompleted", "is_completed"]) ?? false),
    completedBy: getValue(row, ["completedBy", "completed_by"]) ? String(getValue(row, ["completedBy", "completed_by"])) : undefined,
    completedAt: getValue(row, ["completedAt", "completed_at"]) ? String(getValue(row, ["completedAt", "completed_at"])) : undefined,
  };
}

export function normalizeComment(row: Record<string, unknown>): Comment {
  return {
    id: String(getValue(row, ["id", "commentId", "comment_id"]) ?? ""),
    author: String(getValue(row, ["author"]) ?? ""),
    text: String(getValue(row, ["text", "comment"]) ?? ""),
  };
}

export function normalizePost(row: Record<string, unknown>): Post {
  return {
    id: String(getValue(row, ["id", "postId", "post_id"]) ?? ""),
    author: String(getValue(row, ["author"]) ?? ""),
    time: String(getValue(row, ["time", "createdAt", "created_at"]) ?? ""),
    text: String(getValue(row, ["text", "message"]) ?? ""),
    state: (getValue(row, ["state"]) as string | null | undefined) ?? null,
    comments: [],
    projectId: getValue(row, ["projectId", "project_id"]) ? String(getValue(row, ["projectId", "project_id"])) : undefined,
    projectName: getValue(row, ["projectName", "project_name"]) ? String(getValue(row, ["projectName", "project_name"])) : undefined,
    taskId: getValue(row, ["taskId", "task_id"]) ? String(getValue(row, ["taskId", "task_id"])) : undefined,
    taskName: getValue(row, ["taskName", "task_name"]) ? String(getValue(row, ["taskName", "task_name"])) : undefined,
  };
}

export function normalizeProject(row: Record<string, unknown>, resources: Resource[] = [], timeline: Post[] = []): Project {
  return {
    id: String(getValue(row, ["id", "projectId", "project_id"]) ?? ""),
    name: String(getValue(row, ["name"]) ?? ""),
    description: String(getValue(row, ["description"]) ?? ""),
    startDate: String(getValue(row, ["startDate", "start_date"]) ?? ""),
    targetEndDate: String(getValue(row, ["targetEndDate", "target_end_date"]) ?? ""),
    status: String(getValue(row, ["status"]) ?? "Active"),
    resources,
    timeline,
  };
}

export function normalizeTask(row: Record<string, unknown>, subtasks: Subtask[] = [], timeline: Post[] = []): Task {
  return {
    id: String(getValue(row, ["id", "taskId", "task_id"]) ?? ""),
    name: String(getValue(row, ["name"]) ?? ""),
    projectId: String(getValue(row, ["projectId", "project_id"]) ?? ""),
    leadId: String(getValue(row, ["leadId", "lead_id"]) ?? ""),
    state: String(getValue(row, ["state"]) ?? "To Do"),
    dueDate: getValue(row, ["dueDate", "due_date"]) ? String(getValue(row, ["dueDate", "due_date"])) : null,
    overdue: Boolean(getValue(row, ["overdue"]) ?? false),
    completedDate: getValue(row, ["completedDate", "completed_date"]) ? String(getValue(row, ["completedDate", "completed_date"])) : undefined,
    subtasks,
    timeline,
    managerNotes: [],
  };
}

export function toBootstrapPayload(payload: {
  users: User[];
  projects: Project[];
  tasks: Task[];
  subtasks: Subtask[];
  posts: Post[];
  comments: Comment[];
  resources: Resource[];
}) {
  return {
    success: true,
    ...payload,
  };
}
