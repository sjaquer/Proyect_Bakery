export function resolveImageUrl(url: string): string {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  let base =
    (import.meta.env.VITE_ASSETS_URL as string | undefined) ||
    (import.meta.env.VITE_API_URL as string | undefined) ||
    (typeof window !== 'undefined' ? window.location.origin : '');
  if (!base) return url;
  base = base.replace(/\/api\/?$/, '');
  const sanitizedBase = base.replace(/\/$/, '');
  const sanitizedUrl = url.replace(/^\//, '');
  return `${sanitizedBase}/${sanitizedUrl}`;
}
