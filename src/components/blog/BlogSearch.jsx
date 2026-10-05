import { Search, X } from "lucide-react";
import Input from "../ui/Input";

export default function BlogSearch({ value, onChange }) {
  return (
    <div className="relative">
      <Search
        size={16}
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-3 text-muted-foreground"
      />
      <Input
        type="search"
        label="Search posts"
        hideLabel
        placeholder="Search by title, excerpt, or tag"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="[&_input]:pl-9 [&_input]:pr-9"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <X size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}