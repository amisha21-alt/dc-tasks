async function request(path: string, init?: RequestInit) {
  const response = await fetch(path, {
    headers: {
      "content-type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export async function bootstrap() {
  return request("/api/bootstrap");
}

export async function task(action: string, payload: unknown) {
  return request("/api/task", {
    method: "POST",
    body: JSON.stringify({ action, payload }),
  });
}

export async function project(action: string, payload: unknown) {
  return request("/api/project", {
    method: "POST",
    body: JSON.stringify({ action, payload }),
  });
}

export async function person(action: string, payload: unknown) {
  return request("/api/person", {
    method: "POST",
    body: JSON.stringify({ action, payload }),
  });
}

export async function update(action: string, payload: unknown) {
  return request("/api/update", {
    method: "POST",
    body: JSON.stringify({ action, payload }),
  });
}

export async function search(query: string) {
  const params = new URLSearchParams({ q: query });
  return request(`/api/search?${params.toString()}`);
}
