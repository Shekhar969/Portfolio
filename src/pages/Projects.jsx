import { useMemo, useState } from "react";
import Container from "../components/layout/Container";
import ProjectFilters from "../components/projects/ProjectFilters";
import ProjectList from "../components/projects/ProjectList";
import { projects } from "../data/content";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { matchesQuery } from "../lib/utils";

export default function Projects() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const debouncedQuery = useDebouncedValue(query);

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
    [debouncedQuery, category]
  );

  const clearFilters = () => {
    setQuery("");
    setCategory("All");
  };

  return (
    <Container className="py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Projects</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Things I build, from computer vision experiments to IoT systems and web apps.
      </p>

      <div className="mt-8">
        <ProjectFilters
          query={query}
          onQueryChange={setQuery}
          category={category}
          onCategoryChange={setCategory}
        />
      </div>

      <p aria-live="polite" className="mt-6 font-mono text-xs text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? "project" : "projects"}
      </p>

      <div className="mt-2">
        <ProjectList projects={filtered} onClearFilters={clearFilters} />
      </div>
    </Container>
  );
}