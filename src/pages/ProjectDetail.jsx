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

const CASE_SECTIONS = [
  { key: "problem", title: "The problem", kind: "text" },
  { key: "goals", title: "Goals", kind: "list" },
  { key: "solution", title: "The solution", kind: "text" },
  { key: "architecture", title: "Architecture", kind: "flow" },
  { key: "implementedFeatures", title: "Implemented features", kind: "list" },
  { key: "plannedFeatures", title: "Planned features", kind: "list" },
  { key: "implementation", title: "Implementation", kind: "text" },
  { key: "challenges", title: "Challenges", kind: "list" },
  { key: "tradeoffs", title: "Trade-offs", kind: "list" },
  { key: "results", title: "Results", kind: "text" },
  { key: "lessons", title: "Lessons learned", kind: "list" },
  { key: "future", title: "Future work", kind: "list" },
];

/** True only when there is something real to show (not empty or just spaces). */
function hasContent(kind, value) {
  if (kind === "text") return typeof value === "string" && value.trim() !== "";
  return Array.isArray(value) && value.some((item) => String(item).trim() !== "");
}
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

      {(() => {
        const visible = CASE_SECTIONS.filter((section) =>
          hasContent(section.kind, caseStudy?.[section.key])
        );

        if (!visible.length) {
          return (
            <p className="mt-12 text-muted-foreground">Case study coming soon.</p>
          );
        }

        return visible.map((section) => {
          const value = caseStudy[section.key];
          return (
            <Section key={section.key} title={section.title}>
              {section.kind === "text" && <ArticleContent content={value} />}
              {section.kind === "list" && <BulletList items={value} />}
              {section.kind === "flow" && (
                <>
                  <ArchitectureFlow steps={value} />
                  {status === "planned" && (
                    <p className="mt-3 text-center text-sm text-muted-foreground">
                      Planned design, not yet implemented.
                    </p>
                  )}
                </>
              )}
            </Section>
          );
        });
      })()}

      {gallery.length > 0 && (
        <Section title="Screenshots">
          <ProjectGallery images={gallery} title={title} />
        </Section>
      )}

      {related.length > 0 && (
        <Section title="Related projects">
          <div className="grid gap-4">
            {related.map((item) => (
              <ProjectCard key={item.id} project={item} />
            ))}
          </div>
        </Section>
      )}
    </Container>
  );
}