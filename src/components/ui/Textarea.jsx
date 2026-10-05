import { forwardRef, useId } from "react";
import { cn } from "../../lib/utils";

const Textarea = forwardRef(function Textarea(
  { label, error, maxLength, value = "", className, id, rows = 6, ...props },
  ref
) {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const errorId = `${fieldId}-error`;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={fieldId}
        rows={rows}
        value={value}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "w-full resize-y rounded-md border bg-card px-3 py-2 text-sm text-card-foreground",
          "placeholder:text-muted-foreground transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          error ? "border-red-500" : "border-border"
        )}
        {...props}
      />
      <div className="mt-1.5 flex justify-between gap-4">
        {error ? (
          <p id={errorId} className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        ) : (
          <span />
        )}
        {maxLength && (
          <p className="font-mono text-xs text-muted-foreground">
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
});

export default Textarea;