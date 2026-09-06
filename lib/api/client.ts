// Central HTTP client. All browser-to-FastAPI calls go through this module.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api/v1';
const TOKEN_STORAGE_KEY = 'kisanmitra.supabase.access-token';

let authToken: string | null = typeof window === 'undefined' ? null : window.localStorage.getItem(TOKEN_STORAGE_KEY);

export function setAuthToken(token: string | null) {
  authToken = token;
  if (typeof window !== 'undefined') {
    if (token) window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    else window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export function getAuthToken(): string | null {
  return authToken;
}

class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public detail?: string,
  ) {
    super(detail ?? statusText);
    this.name = 'ApiError';
  }
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401) return 'Please sign in to continue.';
    if (error.status === 403) return 'Your account does not have permission for this action.';
    if (error.status === 404) return 'The requested record is no longer available.';
    if (error.status === 422) return error.detail ?? 'Please check the information and try again.';
    if (error.status >= 500) return 'The service is temporarily unavailable. Please try again.';
    return error.detail ?? 'The request could not be completed.';
  }
  return 'Unable to reach KisanMitra. Check your connection and try again.';
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const url = `${API_BASE_URL}${path}`;
  let response: Response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch {
    throw new ApiError(0, 'Network Error', 'Unable to connect to the KisanMitra service.');
  }

  if (!response.ok) {
    let detail: string | undefined;
    try {
      const body = await response.json() as { detail?: string; message?: string };
      detail = body?.detail ?? body?.message;
    } catch {
      // ignore parse error
    }
    throw new ApiError(response.status, response.statusText, detail);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

async function upload<T>(path: string, body: FormData): Promise<T> {
  const headers: Record<string, string> = {};
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  const response = await fetch(`${API_BASE_URL}${path}`, { method: 'POST', body, headers });
  if (!response.ok) throw new ApiError(response.status, response.statusText, 'The file could not be uploaded.');
  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string, options?: RequestInit) => request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestInit) =>
    request<T>(path, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown, options?: RequestInit) =>
    request<T>(path, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown, options?: RequestInit) =>
    request<T>(path, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string, options?: RequestInit) => request<T>(path, { ...options, method: 'DELETE' }),
  upload: <T>(path: string, body: FormData) => upload<T>(path, body),
};

export { ApiError };
export default api;
