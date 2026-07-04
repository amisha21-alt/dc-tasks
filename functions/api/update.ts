import { errorResponse, parseJsonBody, type FunctionContext } from "./_shared";

export async function onRequestPost(context: FunctionContext) {
  const { request } = context;
  const body = await parseJsonBody(request);
  const action = body?.action ?? "unknown";

  return errorResponse(`TODO: update handler for action "${action}" is not implemented yet`, 501);
}
