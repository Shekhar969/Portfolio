/**
 * Join class names, skipping falsy values.
 * cn("px-2", isActive && "text-accent", undefined) -> "px-2 text-accent"
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Convert any date-like value to a JS Date, or null if invalid.
 * Accepts Date, ISO string, number, or a Firestore Timestamp (has toDate()).
 */
export function toDate(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** "Oct 4, 2026" */
export function formatDate(value, options = {}) {
  const date = toDate(value);
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  });
}

/** "Oct 2026" */
export function formatMonthYear(value) {
  return formatDate(value, { day: undefined });
}

/**
 * "Jan 2025 — Present" or "Jan 2025 — Jun 2025"
 */
export function formatDateRange(start, end, isCurrent = false) {
  const from = formatMonthYear(start);
  const to = isCurrent || !end ? "Present" : formatMonthYear(end);
  if (!from) return to;
  return `${from} — ${to}`;
}

/** "My First Post!" -> "my-first-post" */
export function slugify(text = "") {
  return text
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Estimated reading time in whole minutes (minimum 1). */
export function calculateReadingTime(text = "", wordsPerMinute = 200) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

/** "5 min read" */
export function formatReadingTime(minutes) {
  return `${minutes || 1} min read`;
}

/** Shorten text and add an ellipsis. */
export function truncate(text = "", maxLength = 120) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

/** True for links that leave the site (http/https/mailto). */
export function isExternalUrl(url = "") {
  return /^(https?:)?\/\//i.test(url) || url.startsWith("mailto:");
}

/**
 * Return a debounced version of fn that waits `delay` ms after the last call.
 * The returned function has a .cancel() method.
 */
export function debounce(fn, delay = 250) {
  let timer;
  const debounced = (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}

/** Case-insensitive "does any field contain the query?" check. */
export function matchesQuery(query, ...fields) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return fields
    .flat()
    .filter(Boolean)
    .some((field) => String(field).toLowerCase().includes(q));
}

/** Sort comparator helper: newest first by a date-like field. */
export function byDateDesc(getDate) {
  return (a, b) => (toDate(getDate(b))?.getTime() || 0) - (toDate(getDate(a))?.getTime() || 0);
}

/** Friendly text for Firebase errors. */
export function getFirebaseErrorMessage(error) {
  switch (error?.code) {
    case "permission-denied":
      return "You don't have permission to view this content.";
    case "unavailable":
      return "Can't reach the server. Check your connection and try again.";
    case "not-found":
      return "That content could not be found.";
    default:
      return "Something went wrong. Please try again.";
  }
}

/** Ascending comparator on a numeric sortOrder field. */
export function bySortOrder(a, b) {
  return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
}
/** Prefixes site-relative paths (like /images/me.webp) with the base path. */
export function assetUrl(path) {
  if (!path || /^(https?:)?\/\//i.test(path) || path.startsWith("data:")) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}