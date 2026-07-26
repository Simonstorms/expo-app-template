const CUSTOM_SCHEME = /^[a-z-]+:\/*/i;
const SURROUNDING_SLASHES = /^\/+|\/+$/g;
const WEB_URL = /^https?:\/\//i;

export function redirectSystemPath({ path }: { path: string; initial: boolean }): string {
  if (WEB_URL.test(path)) return path;
  const route = path.replace(CUSTOM_SCHEME, '').replace(SURROUNDING_SLASHES, '');
  return route.length > 0 ? `/${route}` : '/';
}
