const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:1337/api";
const TOKEN_KEY = "timbertop_token";
const USER_KEY = "timbertop_user";

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
  const token = window.localStorage.getItem(TOKEN_KEY);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
  const body = response.status === 204 ? null : await response.json();
  if (!response.ok)
    throw new ApiError(
      body?.error || "The request could not be completed",
      response.status,
    );
  return body;
}

export function setAuthSession(session) {
  window.localStorage.setItem(TOKEN_KEY, session.token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  window.dispatchEvent(new Event("timbertop-auth-change"));
}

export function clearAuthSession() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("timbertop-auth-change"));
}

export function getStoredUser() {
  try {
    return JSON.parse(window.localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}
