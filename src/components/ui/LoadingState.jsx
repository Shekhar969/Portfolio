import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export default function LoadingState({ message = "Loading…", className }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground",
        className
      )}
    >
      <Loader2 size={16} className="animate-spin" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}