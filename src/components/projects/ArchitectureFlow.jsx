import { ArrowDown } from "lucide-react";
import { InlineMarkdown } from "../home/Experience";

export default function ArchitectureFlow({ steps = [] }) {
  if (!steps.length) return null;

  const clean = steps.map((step) => step.replace(/^([-*]|\d+[.)])\s+/, ""));

  return (
    <ol className="mx-auto flex max-w-sm flex-col items-center">
      {clean.map((step, index) => (
        <li key={`${index}-${step}`} className="flex w-full flex-col items-center">
          <span className="w-full rounded-md border border-border bg-card px-4 py-2 text-center font-mono text-sm">
            <InlineMarkdown text={step} />
          </span>
          {index < clean.length - 1 && (
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