import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

export default function SectionHeading({ title, linkTo, linkLabel, className }) {
  return (
    <div className={cn("mb-6 flex items-baseline justify-between gap-4", className)}>
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      {linkTo && (
        <Link
          to={linkTo}
          className="rounded text-sm text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}