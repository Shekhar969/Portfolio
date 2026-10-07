export default function InitialAvatar({ name = "" }) {
  const initial = name.trim().charAt(0).toUpperCase() || "•";
  return (
    <span
      aria-hidden="true"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted font-mono text-sm text-muted-foreground"
    >
      {initial}
    </span>
  );
}