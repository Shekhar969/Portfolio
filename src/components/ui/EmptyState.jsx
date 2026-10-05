import Button from "./Button";
import { cn } from "../../lib/utils";

export default function EmptyState({
  title = "Nothing here yet.",
  message,
  actionLabel,
  onAction,
  className,
}) {
  return (
    <div className={cn("py-16 text-center", className)}>
      <p className="font-medium">{title}</p>
      {message && (
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      )}
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}