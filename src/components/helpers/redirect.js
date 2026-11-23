// Returns the ?redirect= target as a same-origin path, or null. Blocks
// //host, \host, javascript: and other values that would leave the site.
export function getSafeRedirect(search, origin = window.location.origin) {
  const target = new URLSearchParams(search).get("redirect");
  if (!target) return null;

  try {
    const url = new URL(target, `${origin}/`);
    if (url.origin !== origin) return null;
    return `${url.pathname.replace(/^\/+/, "/")}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}
