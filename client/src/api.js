/**
 * Shared API base URL for AyushConnect
 * Uses relative URLs so the Vite proxy (port 3000 → 5000) handles routing correctly
 */
export const API_BASE = '';

export const apiFetch = (path, options = {}) => {
  return fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
};
