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

export async function del<T = any>(path: string) {
  const res = await request(path, { method: "DELETE" });
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
