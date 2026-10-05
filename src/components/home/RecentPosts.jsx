import Container from "../layout/Container";
import SectionHeading from "../ui/SectionHeading";
import EmptyState from "../ui/EmptyState";
import BlogCard from "../blog/BlogCard";
import { ROUTES } from "../../lib/constants";

export default function RecentPosts({ posts = [] }) {
  const recent = posts.filter((p) => p.published).slice(0, 5);

  return (
    <section aria-labelledby="recent-posts" className="py-12">
      <Container>
        <SectionHeading
          title="Recent posts"
          linkTo={ROUTES.blog}
          linkLabel="View all posts"
        />
        <h2 id="recent-posts" className="sr-only">
          Recent posts
        </h2>
        {recent.length ? (
          <div className="divide-y divide-border">
            {recent.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyState title="No posts yet." message="Check back soon." />
        )}
      </Container>
    </section>
  );
}