import { ArrowDown } from "lucide-react";

export default function ArchitectureFlow({ steps = [] }) {
  if (!steps.length) return null;

  return (
    <ol className="mx-auto flex max-w-sm flex-col items-center">
      {steps.map((step, index) => (
        <li key={step} className="flex w-full flex-col items-center">
          <span className="w-full rounded-md border border-border bg-card px-4 py-2 text-center font-mono text-sm">
            {step}
          </span>
          {index < steps.length - 1 && (
            <ArrowDown
              size={16}
              aria-hidden="true"
              className="my-1.5 text-muted-foreground"
            />
          )}
        </li>
      ))}
    </ol>
  );
}