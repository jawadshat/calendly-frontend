export function formatApiError(err: any): string {
  // fetch() network errors
  if (err instanceof Error) return err.message;

  // our API wrapper throws the parsed JSON body directly
  const payload = err?.error ?? err;
  if (!payload) return 'Something went wrong';

  if (typeof payload === 'string') return payload;

  // zod flatten format: { formErrors, fieldErrors }
  const fieldErrors = payload?.fieldErrors;
  const formErrors = payload?.formErrors;
  if (fieldErrors && typeof fieldErrors === 'object') {
    const parts: string[] = [];
    for (const [k, v] of Object.entries(fieldErrors)) {
      if (Array.isArray(v) && v.length) parts.push(`${k}: ${v.join(', ')}`);
    }
    if (Array.isArray(formErrors) && formErrors.length) parts.push(...formErrors);
    if (parts.length) return parts.join(' • ');
  }

  // fallback
  try {
    return JSON.stringify(payload);
  } catch {
    return String(payload);
  }
}

