import { errorResponse, getD1Database, jsonResponse, parseJsonBody, type FunctionContext } from "./_shared";

export async function onRequestPost(context: FunctionContext) {
  const { request, env } = context;
  const body = await parseJsonBody(request);
  const action = typeof body?.action === "string" ? body.action : "unknown";

  // The first write path only supports project creation.
  // Any other action keeps the existing HTTP 501 behavior.
  if (action !== "create") {
    return errorResponse(`TODO: project handler for action "${action}" is not implemented yet`, 501);
  }

  // Read the create payload from the request body.
  const payload = body?.payload && typeof body.payload === "object" ? body.payload : {};
  const name = String((payload as Record<string, unknown>).name ?? "").trim();
  const description = String((payload as Record<string, unknown>).description ?? "").trim();
  const startDate = String((payload as Record<string, unknown>).startDate ?? "").trim();
  const targetEndDate = String((payload as Record<string, unknown>).targetEndDate ?? "").trim();

  if (!name) {
    return errorResponse("Project name is required", 400);
  }

  // Resolve the D1 database binding from the shared helper.
  const db = getD1Database(env);
  if (!db) {
    return errorResponse("No D1 binding found", 500);
  }

  // Create a stable, unique project id using a prefixed UUID.
  const id = `p_${crypto.randomUUID()}`;
  const status = "Active";

  try {
    // Insert the new project row into the projects table.
    const result = await db
      .prepare(
        "INSERT INTO projects (id, name, description, start_date, target_end_date, status) VALUES (?, ?, ?, ?, ?, ?)",
      )
      .bind(id, name, description, startDate, targetEndDate, status)
      .run();

    if (!result.success) {
      return errorResponse("Failed to create project", 500);
    }

    // Return the created project payload in the shape expected by the app.
    return jsonResponse({
      success: true,
      project: {
        id,
        name,
        description,
        startDate,
        targetEndDate,
        status,
        resources: [],
        timeline: [],
      },
    });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to create project", 500);
  }
}
