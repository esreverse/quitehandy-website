/**
 * Root-relative URL that respects the configured `base` path.
 * Locally and on the final domain the base is "/"; on the GitHub Pages
 * preview (esreverse.github.io/quitehandy.app/) it is "/quitehandy.app/".
 */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
