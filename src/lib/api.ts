/** API client wrapper for authenticated frontend requests. */
import { getToken } from './auth';

const API_BASE_RAW = (import.meta as any).env?.VITE_API_BASE;
const API_BASE =
  typeof API_BASE_RAW === 'string' && API_BASE_RAW.trim().length > 0 ? API_BASE_RAW.trim() : 'http://localhost:4000';

export type ApiError = { error: any };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const url = `${API_BASE}${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: {
        'content-type': 'application/json',
        ...(token ? { authorization: `Bearer ${token}` } : {}),
        ...(init?.headers ?? {}),
      },
    });
  } catch (e: any) {
    // network / API not running
    throw { error: `Network error: cannot reach API at ${API_BASE}` };
  }

  const contentType = res.headers.get('content-type') ?? '';
  const text = await res.text();
  const isJson = contentType.includes('application/json') || contentType.includes('+json');
  let data: any = null;
  if (text && isJson) {
    try {
      data = JSON.parse(text);
    } catch {
      // fall through - handled below with better message
      data = null;
    }
  }

  if (!res.ok) {
    if (data) throw data;
    const snippet = text ? text.slice(0, 160) : '';
    throw { error: `HTTP ${res.status} from ${url}${snippet ? `: ${snippet}` : ''}` };
  }

  // Successful response but not JSON (common when hitting Vite dev server => index.html)
  if (res.status === 204 || !text) {
    return undefined as T;
  }

  if (!isJson) {
    const snippet = text ? text.slice(0, 160) : '';
    throw { error: `Expected JSON from ${url} but got ${contentType || 'unknown content-type'}${snippet ? `: ${snippet}` : ''}` };
  }

  return data as T;
}

export const api = {
  health: () => request<{ ok: boolean }>('/health'),

  register: (body: { email: string; password: string; username: string; displayName: string; timezone: string }) =>
    request<{ token: string }>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    request<{ token: string }>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  me: () => request<any>('/me'),
  googleCalendarConnectUrl: () => request<{ url: string }>('/me/google-calendar/connect-url'),
  googleCalendarDisconnect: () => request<{ ok: boolean }>('/me/google-calendar/disconnect', { method: 'POST' }),
  updateAvailability: (body: any, eventTypeId?: string) =>
    request<any>(
      `/me/availability${eventTypeId ? `?eventTypeId=${encodeURIComponent(eventTypeId)}` : ''}`,
      { method: 'PUT', body: JSON.stringify(body) },
    ),
  myBookings: () => request<{ items: any[] }>('/me/bookings'),

  listEventTypes: () => request<{ items: any[] }>('/event-types'),
  createEventType: (body: any) => request<any>('/event-types', { method: 'POST', body: JSON.stringify(body) }),
  updateEventType: (id: string, body: any) =>
    request<any>(`/event-types/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteEventType: (id: string) => request<any>(`/event-types/${id}`, { method: 'DELETE' }),
  eventTypeAvailability: (id: string) => request<any>(`/event-types/${id}/availability`),
  updateEventTypeAvailability: (id: string, body: any) =>
    request<any>(`/event-types/${id}/availability`, { method: 'PUT', body: JSON.stringify(body) }),

  publicEventTypes: (username: string) => request<any>(`/public/users/${username}/event-types`),
  publicSlots: (username: string, slug: string, startUtcISO: string, endUtcISO: string) =>
    request<any>(
      `/public/users/${username}/event-types/${slug}/slots?startUtcISO=${encodeURIComponent(
        startUtcISO,
      )}&endUtcISO=${encodeURIComponent(endUtcISO)}`,
    ),
  publicBook: (username: string, slug: string, body: any) =>
    request<any>(`/public/users/${username}/event-types/${slug}/book`, { method: 'POST', body: JSON.stringify(body) }),
};

