import { forwardRef, useId } from "react";
import { cn } from "../../lib/utils";

const Input = forwardRef(function Input(
  { label, error, hideLabel = false, className, id, ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className={cn("mb-1.5 block text-sm font-medium", hideLabel && "sr-only")}
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "h-10 w-full rounded-md border bg-card px-3 text-sm text-card-foreground",
          "placeholder:text-muted-foreground transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          error ? "border-red-500" : "border-border"
        )}
        {...props}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;