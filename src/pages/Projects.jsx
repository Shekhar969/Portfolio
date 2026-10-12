import { useMemo, useState } from "react";
import Container from "../components/layout/Container";
import ProjectFilters from "../components/projects/ProjectFilters";
import ProjectList from "../components/projects/ProjectList";
import DataBoundary from "../components/ui/DataBoundary";
import { useProjects } from "../hooks/useProjects";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { matchesQuery } from "../lib/utils";

export default function Projects() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const debouncedQuery = useDebouncedValue(query);

  const { data, loading, error, reload } = useProjects();
  const projects = useMemo(() => data ?? [], [data]);

  const filtered = useMemo(
    () =>
      projects.filter((project) => {
        const inCategory =
          category === "All" || project.category?.includes(category);
        const inQuery = matchesQuery(
          debouncedQuery,
          project.title,
          project.subtitle,
          project.summary,
          project.technologies
        );
        return inCategory && inQuery;
      }),
    [projects, debouncedQuery, category]
  );

  const clearFilters = () => {
    setQuery("");
    setCategory("All");
  };

  return (
    <Container className="py-12 sm:py-16">
      <h1 className="font-serif text-[clamp(2rem,5.5vw,3.5rem)] font-bold lowercase leading-[1.05] tracking-tight">
        my projects.
      </h1>

      <div className="mt-8">
        <ProjectFilters
          query={query}
          onQueryChange={setQuery}
          category={category}
          onCategoryChange={setCategory}
        />
      </div>

      <DataBoundary loading={loading} error={error} onRetry={reload}>
        <p
          aria-live="polite"
          className="mt-6 font-mono text-xs text-muted-foreground"
        >
          {filtered.length} {filtered.length === 1 ? "project" : "projects"}
        </p>

        <div className="mt-3">
          <ProjectList projects={filtered} onClearFilters={clearFilters} />
        </div>
      </DataBoundary>
    </Container>
  );
}