import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Container from "../components/layout/Container";
import Badge from "../components/ui/Badge";
import ArchitectureFlow from "../components/projects/ArchitectureFlow";
import ProjectGallery from "../components/projects/ProjectGallery";
import ProjectCard from "../components/projects/ProjectCard";
import NotFound from "./NotFound";
import { projects } from "../data/content";
import { PROJECT_STATUSES, ROUTES } from "../lib/constants";

const linkClass =
  "inline-flex items-center gap-1 rounded text-sm text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

function Section({ title, children }) {
  if (!children) return null;
  return (
    <section className="mt-12">
      <h2 className="mb-4 text-xl font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function BulletList({ items }) {
  if (!items?.length) return null;
  return (
    <ul className="list-disc space-y-1 pl-5 leading-relaxed marker:text-muted-foreground">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  if (!project) return <NotFound />;

  const {
    title,
    subtitle,
    summary,
    category = [],
    technologies = [],
    year,
    status,
    githubUrl,
    liveUrl,
    caseStudy,
    gallery = [],
  } = project;

  const related = projects
    .filter(
      (p) =>
        p.id !== project.id && p.category?.some((c) => category.includes(c))
    )
    .slice(0, 2);

  return (
    <Container size="prose" className="py-16">
      <Link
        to={ROUTES.projects}
        className="inline-flex items-center gap-1 rounded text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <ArrowLeft size={14} aria-hidden="true" /> Back to Projects
      </Link>

      <h1 className="mt-6 text-4xl font-semibold tracking-tight">{title}</h1>
      {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
      <p className="mt-4 leading-relaxed">{summary}</p>

      <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-border py-4 text-sm sm:grid-cols-3">
        {status && (
          <div>
            <dt className="text-muted-foreground">Status</dt>
            <dd className="mt-0.5">{PROJECT_STATUSES[status] || status}</dd>
          </div>
        )}
        {year && (
          <div>
            <dt className="text-muted-foreground">Year</dt>
            <dd className="mt-0.5">{year}</dd>
          </div>
        )}
        {category.length > 0 && (
          <div>
            <dt className="text-muted-foreground">Category</dt>
            <dd className="mt-0.5">{category.join(", ")}</dd>
          </div>
        )}
      </dl>

      {(githubUrl || liveUrl) && (
        <div className="mt-4 flex gap-4">
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
              GitHub <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          )}
          {liveUrl && (
            <a href={liveUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
              Live demo <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          )}
        </div>
      )}

      {technologies.length > 0 && (
        <Section title="Technology stack">
          <ul className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <li key={tech}>
                <Badge>{tech}</Badge>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {caseStudy ? (
        <>
          <Section title="The problem">
            {caseStudy.problem && <p className="leading-relaxed">{caseStudy.problem}</p>}
          </Section>
          <Section title="Goals">
            <BulletList items={caseStudy.goals} />
          </Section>
          <Section title="The solution">
            {caseStudy.solution && <p className="leading-relaxed">{caseStudy.solution}</p>}
          </Section>
          <Section title="Architecture">
            {caseStudy.architecture?.length > 0 && (
              <>
                <ArchitectureFlow steps={caseStudy.architecture} />
                {status === "planned" && (
                  <p className="mt-3 text-center text-sm text-muted-foreground">
                    Planned design, not yet implemented.
                  </p>
                )}
              </>
            )}
          </Section>
          <Section title="Implemented features">
            <BulletList items={caseStudy.implementedFeatures} />
          </Section>
          <Section title="Planned features">
            <BulletList items={caseStudy.plannedFeatures} />
          </Section>
          <Section title="Implementation">
            {caseStudy.implementation && (
              <p className="leading-relaxed">{caseStudy.implementation}</p>
            )}
          </Section>
          <Section title="Challenges">
            <BulletList items={caseStudy.challenges} />
          </Section>
          <Section title="Trade-offs">
            <BulletList items={caseStudy.tradeoffs} />
          </Section>
          <Section title="Results">
            {caseStudy.results && <p className="leading-relaxed">{caseStudy.results}</p>}
          </Section>
          <Section title="Lessons learned">
            <BulletList items={caseStudy.lessons} />
          </Section>
          <Section title="Future work">
            <BulletList items={caseStudy.future} />
          </Section>
        </>
      ) : (
        <p className="mt-12 text-muted-foreground">Case study coming soon.</p>
      )}

      {gallery.length > 0 && (
        <Section title="Screenshots">
          <ProjectGallery images={gallery} title={title} />
        </Section>
      )}

      {related.length > 0 && (
        <Section title="Related projects">
          <div className="divide-y divide-border">
            {related.map((item) => (
              <ProjectCard key={item.id} project={item} />
            ))}
          </div>
        </Section>
      )}
    </Container>
  );
}