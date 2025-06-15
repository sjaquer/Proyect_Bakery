export function resolveImageUrl(url: string): string {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  const base = (import.meta.env.VITE_API_URL as string | undefined) || '';
  if (!base) return url;
  const sanitizedBase = base.replace(/\/$/, '');
  const sanitizedUrl = url.replace(/^\//, '');
  return `${sanitizedBase}/${sanitizedUrl}`;
}
