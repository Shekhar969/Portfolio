import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Badge from "../ui/Badge";
import { PROJECT_STATUSES } from "../../lib/constants";
import { cn } from "../../lib/utils";

const smallLink =
  "inline-flex items-center gap-1 rounded text-sm text-muted-foreground transition-colors duration-150 hover:text-accent " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

export default function ProjectCard({ project, className }) {
  const {
    slug,
    title,
    subtitle,
    summary,
    technologies = [],
    year,
    status,
    githubUrl,
    liveUrl,
    caseStudyContent,
    isPlaceholder,
  } = project;

  return (
    <article
      className={cn(
        "-mx-3 rounded-md px-3 py-4 transition-colors duration-150 hover:bg-muted/60",
        className
      )}
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="text-lg font-semibold tracking-tight">
          <Link
            to={`/projects/${slug}`}
            className="rounded hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {title}
          </Link>
        </h3>
        {year && (
          <span className="font-mono text-xs text-muted-foreground">{year}</span>
        )}
        {status && <Badge variant="outline">{PROJECT_STATUSES[status] || status}</Badge>}
        {isPlaceholder && <Badge variant="accent">Sample</Badge>}
      </div>

      {subtitle && (
        <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
      )}

      <p className="mt-2 text-sm leading-relaxed">{summary}</p>

      {technologies.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <li key={tech}>
              <Badge>{tech}</Badge>
            </li>
          ))}
        </ul>
      )}

      {(githubUrl || liveUrl || caseStudyContent) && (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className={smallLink}>
              GitHub <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          )}
          {liveUrl && (
            <a href={liveUrl} target="_blank" rel="noopener noreferrer" className={smallLink}>
              Demo <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          )}
          {caseStudyContent && (
            <Link to={`/projects/${slug}`} className={smallLink}>
              Case study →
            </Link>
          )}
        </div>
      )}
    </article>
  );
}