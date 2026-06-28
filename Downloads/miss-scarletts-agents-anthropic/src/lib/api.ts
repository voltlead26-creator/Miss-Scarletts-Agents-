export function apiUrl(path: string) {
  const origin = import.meta.env.VITE_API_ORIGIN?.trim();
  if (origin) {
    return new URL(path, origin).toString();
  }

  return path.startsWith('/') ? path : `/${path}`;
}
