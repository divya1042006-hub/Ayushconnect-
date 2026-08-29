/**
 * Shared API base URL for AyushConnect
 * - Locally: empty string → Vite proxy (port 3000 → 5000) handles routing
 * - Production: VITE_API_BASE_URL points to the Render backend URL
 */
export const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export const apiFetch = (path, options = {}) => {
  return fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
};
