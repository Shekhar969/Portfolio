import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Container from "../components/layout/Container";
import Badge from "../components/ui/Badge";
import ArticleContent from "../components/blog/ArticleContent";
import TableOfContents from "../components/blog/TableOfContents";
import BlogCard from "../components/blog/BlogCard";
import NotFound from "./NotFound";
import { ROUTES, SITE } from "../lib/constants";
import {
  calculateReadingTime,
  formatDate,
  formatReadingTime,
  toDate,
} from "../lib/utils";
import { samplePosts } from "../data/sampleData";

const time = (post) => toDate(post.publishedAt)?.getTime() || 0;

export default function BlogPost() {
  const { slug } = useParams();
  const articleRef = useRef(null);
  const [headings, setHeadings] = useState([]);

  // Phase 9: replace with getPostBySlug(slug) and a published-posts query.
  const sorted = useMemo(
    () => samplePosts.filter((p) => p.published).sort((a, b) => time(b) - time(a)),
    []
  );
  const index = sorted.findIndex((p) => p.slug === slug);
  const post = index >= 0 ? sorted[index] : null;

  // Build the table of contents from the headings React actually rendered.
  useEffect(() => {
    const root = articleRef.current;
    if (!root) {
      setHeadings([]);
      return;
    }
    const nodes = root.querySelectorAll("h2[id], h3[id]");
    setHeadings(
      Array.from(nodes).map((node) => ({
        id: node.id,
        text: node.textContent,
        level: Number(node.tagName[1]),
      }))
    );
  }, [slug]);

  if (!post) return <NotFound />;

  const published = toDate(post.publishedAt);
  const updated = toDate(post.updatedAt);
  const showUpdated = updated && (!published || updated.getTime() !== published.getTime());
  const reading = post.readingTime || calculateReadingTime(post.content);

  const older = sorted[index + 1];
  const newer = sorted[index - 1];
  const related = sorted
    .filter((p) => p.id !== post.id && p.tags?.some((t) => post.tags?.includes(t)))
    .slice(0, 3);

  return (
    <Container className="py-16">
      <div className="lg:grid lg:grid-cols-[minmax(0,720px)_220px] lg:justify-center lg:gap-12">
        <div>
          <Link
            to={ROUTES.blog}
            className="inline-flex items-center gap-1 rounded text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <ArrowLeft size={14} aria-hidden="true" /> Back to Blog
          </Link>

          <header className="mt-6">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-3 text-lg text-muted-foreground">{post.excerpt}</p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground">
              <span>{post.author || SITE.name}</span>
              {published && (
                <time dateTime={published.toISOString()}>{formatDate(published)}</time>
              )}
              {showUpdated && (
                <span>
                  Updated <time dateTime={updated.toISOString()}>{formatDate(updated)}</time>
                </span>
              )}
              <span>{formatReadingTime(reading)}</span>
              {post.isPlaceholder && <Badge variant="accent">Sample</Badge>}
            </div>

            {post.tags?.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <Badge>{tag}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </header>

          {post.coverImageUrl && (
            <img
              src={post.coverImageUrl}
              alt={`Cover image for ${post.title}`}
              className="mt-8 w-full rounded-md border border-border"
            />
          )}

          {/* Mobile table of contents */}
          {headings.length > 1 && (
            <details className="mt-8 rounded-md border border-border px-4 py-3 lg:hidden">
              <summary className="cursor-pointer text-sm font-semibold">
                On this page
              </summary>
              <div className="mt-3">
                <TableOfContents items={headings} />
              </div>
            </details>
          )}

          <article ref={articleRef} className="mt-10">
            <ArticleContent content={post.content} />
          </article>

          {(older || newer) && (
            <nav
              aria-label="Post navigation"
              className="mt-14 grid gap-4 border-t border-border pt-6 sm:grid-cols-2"
            >
              {older ? (
                <Link
                  to={`/blog/${older.slug}`}
                  className="rounded-md border border-border p-4 transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <span className="text-xs text-muted-foreground">← Previous post</span>
                  <span className="mt-1 block font-medium">{older.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {newer && (
                <Link
                  to={`/blog/${newer.slug}`}
                  className="rounded-md border border-border p-4 transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:text-right"
                >
                  <span className="text-xs text-muted-foreground">Next post →</span>
                  <span className="mt-1 block font-medium">{newer.title}</span>
                </Link>
              )}
            </nav>
          )}

          {related.length > 0 && (
            <section aria-label="Related posts" className="mt-14">
              <h2 className="mb-2 text-xl font-semibold tracking-tight">Related posts</h2>
              <div className="divide-y divide-border">
                {related.map((item) => (
                  <BlogCard key={item.id} post={item} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Desktop table of contents */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <TableOfContents items={headings} />
          </div>
        </aside>
      </div>
    </Container>
  );
}