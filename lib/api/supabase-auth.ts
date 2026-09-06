import { setAuthToken } from './client';

type SupabaseSessionResponse = {
  access_token?: string;
  refresh_token?: string;
  user?: { id: string; email?: string | null };
};

const authUrl = () => process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
const anonKey = () => process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function authRequest(path: string, body?: Record<string, unknown>): Promise<SupabaseSessionResponse> {
  const url = authUrl();
  const key = anonKey();
  if (!url || !key) throw new Error('Supabase authentication is not configured for this deployment.');
  const response = await fetch(`${url}/auth/v1/${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { apikey: key, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) throw new Error('Unable to sign in. Check your credentials and try again.');
  return response.json() as Promise<SupabaseSessionResponse>;
}

/** Sign in through Supabase GoTrue and make the JWT available to FastAPI. */
export async function signInWithPassword(email: string, password: string) {
  const session = await authRequest('token?grant_type=password', { email, password });
  if (!session.access_token) throw new Error('Supabase did not return an access token.');
  setAuthToken(session.access_token);
  return session;
}

/** Create a Supabase account using the public anon key. Email confirmation may be required by the project. */
export async function signUpWithPassword(email: string, password: string) {
  const session = await authRequest('signup', { email, password });
  if (session.access_token) setAuthToken(session.access_token);
  return session;
}

/** Redirect to a configured Supabase OAuth provider (Google by default). */
export function signInWithOAuth(provider: 'google' = 'google') {
  const url = authUrl();
  const key = anonKey();
  if (!url || !key) throw new Error('Supabase authentication is not configured for this deployment.');
  const redirectTo = window.location.origin;
  window.location.assign(`${url}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(redirectTo)}&apikey=${encodeURIComponent(key)}`);
}

/** Restore an implicit OAuth access token after Supabase redirects back to the application. */
export function restoreOAuthSession() {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.hash.slice(1));
  const token = params.get('access_token');
  if (token) { setAuthToken(token); window.history.replaceState({}, document.title, window.location.pathname); }
  return token;
}

/** Clear the browser JWT; no privileged Supabase credential is ever used here. */
export function signOut() {
  setAuthToken(null);
}
