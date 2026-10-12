import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Container from "../layout/Container";
import EmptyState from "../ui/EmptyState";
import ProjectCard from "../projects/ProjectCard";
import { ROUTES } from "../../lib/constants";

export default function FeaturedProjects({ projects = [] }) {
  const featured = projects.filter((p) => p.featured).slice(0, 6);

  return (
    <section aria-label="Featured projects" className="py-8 sm:py-10">
      <Container>
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="font-serif text-[clamp(1.75rem,4.2vw,2.75rem)] font-bold lowercase leading-tight tracking-tight">
            featured projects
          </h2>
          <Link
            to={ROUTES.projects}
            className="inline-flex shrink-0 items-center gap-2 rounded text-[clamp(0.9375rem,1.8vw,1.25rem)] text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            view more
            <ArrowRight className="h-[1.1em] w-[1.1em]" aria-hidden="true" />
          </Link>
        </div>

        {featured.length ? (
          <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
            {featured.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <EmptyState title="No featured projects yet." />
        )}
      </Container>
    </section>
  );
}