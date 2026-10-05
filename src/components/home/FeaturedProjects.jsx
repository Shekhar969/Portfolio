import Container from "../layout/Container";
import SectionHeading from "../ui/SectionHeading";
import EmptyState from "../ui/EmptyState";
import ProjectCard from "../projects/ProjectCard";
import { ROUTES } from "../../lib/constants";

export default function FeaturedProjects({ projects = [] }) {
  const featured = projects.filter((p) => p.featured).slice(0, 6);

  return (
    <section aria-labelledby="featured-projects" className="py-12">
      <Container>
        <SectionHeading
          title="Featured projects"
          linkTo={ROUTES.projects}
          linkLabel="View all projects"
          className="[&_h2]:scroll-mt-20"
        />
        <h2 id="featured-projects" className="sr-only">
          Featured projects
        </h2>
        {featured.length ? (
          <div className="divide-y divide-border">
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