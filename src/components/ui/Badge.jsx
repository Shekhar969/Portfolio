import { cn } from "../../lib/utils";

const variants = {
  default: "border-border bg-muted text-muted-foreground",
  accent: "border-accent/30 bg-accent/10 text-accent",
  outline: "border-border text-muted-foreground",
};

export default function Badge({ variant = "default", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-2 py-0.5 font-mono text-xs",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}