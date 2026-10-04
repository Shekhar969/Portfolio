import Button from "./Button";
import { cn } from "../../lib/utils";

export default function ErrorState({
  title = "Something went wrong.",
  message = "Please try again.",
  onRetry,
  className,
}) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-md border border-border bg-muted px-4 py-8 text-center",
        className
      )}
    >
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}