import { clearToken, getToken } from "./auth";

// Prefer explicit env; fall back to relative paths (use Vite proxy in dev or same-origin in prod).
const ENV_BASE = import.meta.env.VITE_API_URL;
const API_BASE = ENV_BASE ? ENV_BASE.replace(/\/$/, "") : "";

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = path.startsWith("http")
    ? path
    : API_BASE
    ? `${API_BASE}${path}`
    : path;

  const headers = new Headers(options.headers || {});
  headers.set("Accept", "application/json");
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (err) {
    console.error("API network error", err);
    throw new Error("Unable to reach server. Is the backend running?");
  }

  if (response.status === 401) {
    clearToken();
    // Redirect to login on unauthorized
    window.location.href = "/login";
    throw new Error("Unauthorized. Redirecting to login.  Please log in again. ");
  }

  let parsed: ApiEnvelope<T>;
  try {
    parsed = (await response.json()) as ApiEnvelope<T>;
  } catch (err) {
    console.error("Failed to parse response", err);
    throw new Error("Failed to parse server response");
  }

  if (!response.ok || !parsed.success) {
    console.error("API error", parsed);
    throw new Error(parsed?.message || "Request failed  with status " + response.status);
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
