const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:1337/api";
let authSession = null;

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers);
  if (options.body && !(options.body instanceof FormData))
    headers.set("Content-Type", "application/json");
  const token = authSession?.token;
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
  // 204 responses deliberately have no json body to parse.
  const body = response.status === 204 ? null : await response.json();
  // keep the status available so callers can handle specific failures.
  if (!response.ok)
    throw new ApiError(
      body?.error || "The request could not be completed",
      response.status,
    );
  return body;
}

export function setAuthSession(session) {
  authSession = session;
  window.dispatchEvent(new Event("timbertop-auth-change"));
}

export function clearAuthSession() {
  authSession = null;
  window.dispatchEvent(new Event("timbertop-auth-change"));
}

export function getStoredUser() {
  return authSession?.user || null;
}
