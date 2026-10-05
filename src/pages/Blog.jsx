import { useMemo, useState } from "react";
import Container from "../components/layout/Container";
import BlogSearch from "../components/blog/BlogSearch";
import BlogFilters from "../components/blog/BlogFilters";
import BlogCard from "../components/blog/BlogCard";
import EmptyState from "../components/ui/EmptyState";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { matchesQuery, toDate } from "../lib/utils";
import { samplePosts } from "../data/sampleData";

const time = (post) => toDate(post.publishedAt)?.getTime() || 0;

export default function Blog() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("All");
  const [sort, setSort] = useState("newest");
  const debouncedQuery = useDebouncedValue(query);

  // Phase 9: replace samplePosts with published posts from Firestore.
  const published = useMemo(() => samplePosts.filter((p) => p.published), []);

  const tags = useMemo(
    () => ["All", ...new Set(published.flatMap((p) => p.tags || []))],
    [published]
  );

  const posts = useMemo(() => {
    const result = published.filter((post) => {
      const inTag = tag === "All" || post.tags?.includes(tag);
      const inQuery = matchesQuery(debouncedQuery, post.title, post.excerpt, post.tags);
      return inTag && inQuery;
    });
    result.sort((a, b) => (sort === "newest" ? time(b) - time(a) : time(a) - time(b)));
    return result;
  }, [published, debouncedQuery, tag, sort]);

  const clearAll = () => {
    setQuery("");
    setTag("All");
  };

  return (
    <Container className="py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Blog</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Notes on things I build and learn, covering software, systems, and ideas.
      </p>

      <div className="mt-8 space-y-4">
        <BlogSearch value={query} onChange={setQuery} />
        <BlogFilters
          tags={tags}
          activeTag={tag}
          onTagChange={setTag}
          sort={sort}
          onSortChange={setSort}
        />
      </div>

      <p aria-live="polite" className="mt-6 font-mono text-xs text-muted-foreground">
        {posts.length} {posts.length === 1 ? "post" : "posts"}
      </p>

      <div className="mt-2">
        {posts.length ? (
          <div className="divide-y divide-border">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No results found."
            message="Try a different search or tag."
            actionLabel="Clear search"
            onAction={clearAll}
          />
        )}
      </div>
    </Container>
  );
}