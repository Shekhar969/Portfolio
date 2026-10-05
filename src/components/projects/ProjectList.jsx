import ProjectCard from "./ProjectCard";
import EmptyState from "../ui/EmptyState";

export default function ProjectList({ projects, onClearFilters }) {
  if (!projects.length) {
    return (
      <EmptyState
        title="No projects found."
        message="Try a different search or category."
        actionLabel="Clear filters"
        onAction={onClearFilters}
      />
    );
  }

  return (
    <div className="divide-y divide-border">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}