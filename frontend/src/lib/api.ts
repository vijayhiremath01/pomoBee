import { clearToken, getToken } from "./auth";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;

  const headers = new Headers(options.headers || {});
  headers.set("Accept", "application/json");
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    clearToken();
    // Redirect to login on unauthorized
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  let parsed: ApiEnvelope<T>;
  try {
    parsed = (await response.json()) as ApiEnvelope<T>;
  } catch (err) {
    throw new Error("Failed to parse server response");
  }

  if (!response.ok || !parsed.success) {
    throw new Error(parsed?.message || "Request failed");
  }

  return parsed.data;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
};
