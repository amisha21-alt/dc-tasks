import { errorResponse, getD1Database, jsonResponse, readTable, type FunctionContext } from "./_shared";

export async function onRequestGet(context: FunctionContext) {
  const { request, env } = context;
  const db = getD1Database(env);
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim() || "";

  if (!db) {
    return errorResponse("D1 database binding is not available", 500);
  }

  if (!query) {
    return jsonResponse({ success: true, tasks: [], projects: [], people: [] });
  }

  try {
    const tasksRows = await readTable<Record<string, unknown>>(db, "tasks");
    const projectsRows = await readTable<Record<string, unknown>>(db, "projects");
    const peopleRows = await readTable<Record<string, unknown>>(db, "users");

    const normalizedQuery = query.toLowerCase();
    const tasks = tasksRows
      .filter((row) => String(row.name || "").toLowerCase().includes(normalizedQuery))
      .slice(0, 6)
      .map((row) => ({ id: row.id, name: row.name }));

    const projects = projectsRows
      .filter((row) => String(row.name || "").toLowerCase().includes(normalizedQuery))
      .slice(0, 6)
      .map((row) => ({ id: row.id, name: row.name }));

    const people = peopleRows
      .filter((row) => Boolean(row.active) && String(row.name || "").toLowerCase().includes(normalizedQuery))
      .slice(0, 6)
      .map((row) => ({ id: row.id, name: row.name }));

    return jsonResponse({ success: true, tasks, projects, people });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Search failed", 500);
  }
}
