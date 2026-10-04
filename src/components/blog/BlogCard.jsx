import { Link } from "react-router-dom";
import Badge from "../ui/Badge";
import { cn, formatDate, formatReadingTime, toDate } from "../../lib/utils";

export default function BlogCard({ post, className }) {
  const {
    slug,
    title,
    excerpt,
    tags = [],
    publishedAt,
    readingTime,
    isPlaceholder,
  } = post;

  const parsedDate = toDate(publishedAt);

  return (
    <article
      className={cn(
        "-mx-3 rounded-md px-3 py-4 transition-colors duration-150 hover:bg-muted/60",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground">
        {parsedDate && (
          <time dateTime={parsedDate.toISOString()}>
            {formatDate(parsedDate)}
          </time>
        )}
        <span>{formatReadingTime(readingTime)}</span>
        {isPlaceholder && <Badge variant="accent">Sample</Badge>}
      </div>

      <h3 className="mt-1 text-lg font-semibold tracking-tight">
        <Link
          to={`/blog/${slug}`}
          className="rounded hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {title}
        </Link>
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {excerpt}
      </p>

      {tags.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag}>
              <Badge>{tag}</Badge>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}