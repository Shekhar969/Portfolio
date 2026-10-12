import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Globe } from "lucide-react";
import { GithubIcon } from "../home/SocialLinks";
import Badge from "../ui/Badge";
import { PROJECT_STATUSES } from "../../lib/constants";
import { cn } from "../../lib/utils";

const button =
  "relative z-10 inline-flex items-center gap-2 rounded-lg bg-foreground px-3.5 py-2 text-sm font-medium text-background " +
  "transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function LinkIcon({ url }) {
  return /github\.com/i.test(url) ? (
    <GithubIcon className="h-4 w-4" />
  ) : (
    <Globe className="h-4 w-4" aria-hidden="true" />
  );
}

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
    previewVideo,
    links = [],
    gallery = [],
  } = project;

  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const thumb = gallery[0];

  const start = () => {
    const el = videoRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const attempt = el.play();
    if (attempt?.catch) attempt.catch(() => {});
  };

  const stop = () => {
    const el = videoRef.current;
    setPlaying(false);
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
  };

  const buttons = [
    liveUrl && { label: "Website", url: liveUrl },
    githubUrl && { label: "Source", url: githubUrl },
    ...links.filter((l) => l?.url && l?.label),
  ].filter(Boolean);

  return (
    <article
      onMouseEnter={start}
      onMouseLeave={stop}
      className={cn(
        "relative flex h-full flex-col rounded-2xl border border-border p-5 transition-colors duration-150 hover:bg-muted/40 sm:p-6",
        className
      )}
    >
      {(thumb?.url || previewVideo) && (
        <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-muted">
          {thumb?.url && (
            <img
              src={thumb.thumbUrl || thumb.url}
              alt={thumb.alt || `${title} preview`}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          )}
          {previewVideo && (
            <video
              ref={videoRef}
              src={previewVideo}
              poster={thumb?.url}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
              tabIndex={-1}
              onPlaying={() => setPlaying(true)}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-200",
                playing ? "opacity-100" : "opacity-0"
              )}
            />
          )}
        </div>
      )}

      <div className="mt-5 flex flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
            <Link
              to={`/projects/${slug}`}
              onFocus={start}
              onBlur={stop}
              className="rounded after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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

        <p className="mt-2 line-clamp-3 text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base">
          {summary}
        </p>

        {technologies.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <li key={tech}>
                <span className="inline-flex rounded-md bg-muted px-2.5 py-1 text-sm font-medium">
                  {tech}
                </span>
              </li>
            ))}
          </ul>
        )}

        {buttons.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2 pt-6">
            {buttons.map((item) => (
              <a
                key={`${item.label}-${item.url}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={button}
              >
                <LinkIcon url={item.url} />
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}