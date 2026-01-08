const BASE_URL: string | undefined = (import.meta as any).env?.VITE_API_BASE_URL;
if (!BASE_URL) {
  throw new Error(
    "VITE_API_BASE_URL is not set. Define it in frontend/.env (e.g., VITE_API_BASE_URL=http://127.0.0.1:8000)."
  );
}

let authToken: string | null = typeof localStorage !== "undefined" ? localStorage.getItem("auth_token") : null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) localStorage.setItem("auth_token", token);
  else localStorage.removeItem("auth_token");
}

type FetchOptions = Omit<RequestInit, "headers"> & { extraHeaders?: Record<string, string> };

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"));
  return match ? match[1] : null;
}

async function request(path: string, options: FetchOptions = {}) {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.extraHeaders || {}),
  };
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }
  // Include XSRF token for Laravel Sanctum if present
  const xsrf = getCookie("XSRF-TOKEN");
  if (xsrf && !("X-XSRF-TOKEN" in headers)) {
    try {
      headers["X-XSRF-TOKEN"] = decodeURIComponent(xsrf);
    } catch {
      headers["X-XSRF-TOKEN"] = xsrf;
    }
  }
  const res = await fetch(url, {
    credentials: "include",
    ...options,
    headers,
  });
  return res;
}

export async function get<T = any>(path: string) {
  const res = await request(path, { method: "GET" });
  return parseJson<T>(res);
}

export async function post<T = any>(path: string, body?: any, extraHeaders?: Record<string, string>) {
  const res = await request(path, {
    method: "POST",
    body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    extraHeaders,
  });
  return parseJson<T>(res);
}

export async function put<T = any>(path: string, body?: any, extraHeaders?: Record<string, string>) {
  const res = await request(path, {
    method: "PUT",
    body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    extraHeaders,
  });
  return parseJson<T>(res);
}

export async function del<T = any>(path: string, body?: any, extraHeaders?: Record<string, string>) {
  const res = await request(path, {
    method: "DELETE",
    body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    extraHeaders,
  });
  return parseJson<T>(res);
}

async function parseJson<T>(res: Response): Promise<{ ok: boolean; status: number; data: T | null; raw: Response } > {
  let data: any = null;
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    try { data = await res.json(); } catch {}
  }
  return { ok: res.ok, status: res.status, data, raw: res };
}
