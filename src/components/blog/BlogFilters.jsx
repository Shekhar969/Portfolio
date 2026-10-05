import { BLOG_SORT_OPTIONS } from "../../lib/constants";
import { cn } from "../../lib/utils";

export default function BlogFilters({
  tags,
  activeTag,
  onTagChange,
  sort,
  onSortChange,
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div role="group" aria-label="Filter by tag" className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const active = activeTag === tag;
          return (
            <button
              key={tag}
              type="button"
              aria-pressed={active}
              onClick={() => onTagChange(tag)}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                active
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {tag}
            </button>
          );
        })}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <label htmlFor="blog-sort" className="text-sm text-muted-foreground">
          Sort
        </label>
        <select
          id="blog-sort"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="h-9 rounded-md border border-border bg-card px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {BLOG_SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}