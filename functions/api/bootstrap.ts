import {
  errorResponse,
  getD1Database,
  jsonResponse,
  normalizeComment,
  normalizePost,
  normalizeProject,
  normalizeResource,
  normalizeSubtask,
  normalizeTask,
  normalizeUser,
  readTable,
  toBootstrapPayload,
  type FunctionContext,
} from "./_shared";

export async function onRequestGet(context: FunctionContext) {
  const { env } = context;
  const db = getD1Database(env);

  if (!db) {
    return errorResponse("D1 database binding is not available", 500);
  }

  try {
    const [usersRows, projectsRows, tasksRows, subtasksRows, postsRows, commentsRows, resourcesRows] = await Promise.all([
      readTable<Record<string, unknown>>(db, "users"),
      readTable<Record<string, unknown>>(db, "projects"),
      readTable<Record<string, unknown>>(db, "tasks"),
      readTable<Record<string, unknown>>(db, "subtasks"),
      readTable<Record<string, unknown>>(db, "posts"),
      readTable<Record<string, unknown>>(db, "comments"),
      readTable<Record<string, unknown>>(db, "resources"),
    ]);

    const users = usersRows.map((row) => normalizeUser(row));
    const resources = resourcesRows.map((row) => normalizeResource(row));
    const subtasks = subtasksRows.map((row) => normalizeSubtask(row));
    const comments = commentsRows.map((row) => normalizeComment(row));

    const posts = postsRows.map((row) => normalizePost(row));

    const projects = projectsRows.map((row) => normalizeProject(row, [], []));
    const tasks = tasksRows.map((row) => normalizeTask(row, [], []));

    return jsonResponse(
      toBootstrapPayload({
        users,
        projects,
        tasks,
        subtasks,
        posts,
        comments,
        resources,
      }),
    );
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Bootstrap failed", 500);
  }
}
