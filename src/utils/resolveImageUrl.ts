export function resolveImageUrl(url: string): string {
  if (!url) return '';

  const isAbsolute = /^(https?:)?\/\//i.test(url);
  if (isAbsolute) {
    return url;
  }

  const base =
    (import.meta.env.VITE_API_URL as string | undefined) ||
    'http://localhost:3000';

  const normalizedBase = base.replace(/\/$/, '');
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`;

  return `${normalizedBase}${normalizedUrl}`;
}
