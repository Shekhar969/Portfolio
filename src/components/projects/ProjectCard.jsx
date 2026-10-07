import { Link } from "react-router-dom";
import Badge from "../ui/Badge";
import { PROJECT_STATUSES } from "../../lib/constants";
import { cn } from "../../lib/utils";

const pill =
  "inline-flex items-center rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors duration-150 " +
  "hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

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
    caseStudy,
    gallery = [],
  } = project;

  const thumb = gallery[0];

  return (
    <article
      className={cn(
        "-mx-3 rounded-md px-3 py-5 transition-colors duration-150 hover:bg-muted/60",
        className
      )}
    >
      {thumb?.url && (
        <Link
          to={`/projects/${slug}`}
          tabIndex={-1}
          aria-hidden="true"
          className="mb-4 block"
        >
          <img
            src={thumb.thumbUrl || thumb.url}
            alt=""
            loading="lazy"
            decoding="async"
            className="aspect-video w-full rounded-md border border-border object-cover"
          />
        </Link>
      )}

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
        {status && (
          <Badge variant="outline">{PROJECT_STATUSES[status] || status}</Badge>
        )}
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

      {(liveUrl || githubUrl || caseStudy) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {liveUrl && (
            <a href={liveUrl} target="_blank" rel="noopener noreferrer" className={pill}>
              Website
            </a>
          )}
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className={pill}>
              Source
            </a>
          )}
          {caseStudy && (
            <Link to={`/projects/${slug}`} className={pill}>
              Case study
            </Link>
          )}
        </div>
      )}
    </article>
  );
}