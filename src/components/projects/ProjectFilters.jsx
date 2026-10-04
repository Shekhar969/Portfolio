import { Search, X } from "lucide-react";
import Input from "../ui/Input";
import { PROJECT_CATEGORIES } from "../../lib/constants";
import { cn } from "../../lib/utils";

export default function ProjectFilters({
  query,
  onQueryChange,
  category,
  onCategoryChange,
}) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-3 text-muted-foreground"
        />
        <Input
          type="search"
          label="Search projects"
          hideLabel
          placeholder="Search by title, description, or technology"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="[&_input]:pl-9 [&_input]:pr-9"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            aria-label="Clear search"
            className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <X size={14} aria-hidden="true" />
          </button>
        )}
      </div>

      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
        {PROJECT_CATEGORIES.map((item) => {
          const active = category === item;
          return (
            <button
              key={item}
              type="button"
              aria-pressed={active}
              onClick={() => onCategoryChange(item)}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                active
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}