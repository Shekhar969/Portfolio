import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Container from "../components/layout/Container";
import Badge from "../components/ui/Badge";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import ArchitectureFlow from "../components/projects/ArchitectureFlow";
import ProjectGallery from "../components/projects/ProjectGallery";
import ProjectCard from "../components/projects/ProjectCard";
import ArticleContent from "../components/blog/ArticleContent";
import NotFound from "./NotFound";
import { useProject, useProjects } from "../hooks/useProjects";
import { PROJECT_STATUSES, ROUTES } from "../lib/constants";
import { cn, getFirebaseErrorMessage } from "../lib/utils";

/** One line of text: bold, italic, strikethrough, code, and links only. */
function Inline({ text }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      allowedElements={["p", "strong", "em", "del", "code", "a"]}
      unwrapDisallowed
      components={{
        p: ({ children }) => <>{children}</>,
        a: ({ href = "", children }) => (
          <a
            href={href}
            {...(/^https?:/i.test(href)
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="text-accent underline underline-offset-2"
          >
            {children}
          </a>
        ),
        code: ({ children }) => (
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]">
            {children}
          </code>
        ),
      }}
    >
      {text}
    </ReactMarkdown>
  );
}

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

/** Bullets by default; if every line starts with 1. 2. 3. it becomes numbered. */
function BulletList({ items }) {
  if (!items?.length) return null;

  const numbered = items.every((item) => /^\d+[.)]\s+/.test(item));
  const clean = items.map((item) =>
    item.replace(numbered ? /^\d+[.)]\s+/ : /^[-*•]\s+/, "")
  );
  const Tag = numbered ? "ol" : "ul";

  return (
    <Tag
      className={cn(
        "space-y-1 pl-5 leading-relaxed marker:text-muted-foreground",
        numbered ? "list-decimal" : "list-disc"
      )}
    >
      {clean.map((item, index) => (
        <li key={`${index}-${item}`}>
          <Inline text={item} />
        </li>
      ))}
    </Tag>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data: project, loading, error, reload } = useProject(slug);
  const { data: allProjects } = useProjects();

  if (loading) {
    return (
      <Container className="py-16">
        <LoadingState />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-16">
        <ErrorState message={getFirebaseErrorMessage(error)} onRetry={reload} />
      </Container>
    );
  }

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

  const related = (allProjects ?? [])
    .filter(
      (p) =>
        p.id !== project.id && p.category?.some((c) => category.includes(c))
    )
    .slice(0, 2);

  return (
    <Container  className="py-16">
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
            {caseStudy.problem && <ArticleContent content={caseStudy.problem} />}
          </Section>
          <Section title="Goals">
            <BulletList items={caseStudy.goals} />
          </Section>
          <Section title="The solution">
            {caseStudy.solution && <ArticleContent content={caseStudy.solution} />}
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
              <ArticleContent content={caseStudy.implementation} />
            )}
          </Section>
          <Section title="Challenges">
            <BulletList items={caseStudy.challenges} />
          </Section>
          <Section title="Trade-offs">
            <BulletList items={caseStudy.tradeoffs} />
          </Section>
          <Section title="Results">
            {caseStudy.results && <ArticleContent content={caseStudy.results} />}
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