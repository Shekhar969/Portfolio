import Container from "../components/layout/Container";
import Hero from "../components/home/Hero";
import ExperienceSwitcher from "../components/home/ExperienceSwitcher";
import FeaturedProjects from "../components/home/FeaturedProjects";
import RecentPosts from "../components/home/RecentPosts";
import DataBoundary from "../components/ui/DataBoundary";
import { useEducation, useExperience } from "../hooks/useExperience";
import { useFeaturedProjects } from "../hooks/useProjects";
import { usePosts } from "../hooks/useBlog";
import { FEATURES } from "../lib/constants";

function RecentPostsSection() {
  const { data, loading, error, reload } = usePosts();
  return (
    <Container>
      <DataBoundary loading={loading} error={error} onRetry={reload}>
        <RecentPosts posts={data ?? []} />
      </DataBoundary>
    </Container>
  );
}

export default function Home() {
  const experience = useExperience();
  const education = useEducation();
  const projects = useFeaturedProjects();

  return (
    <>
      <Hero />

      <Container>
        <DataBoundary
          loading={experience.loading || education.loading}
          error={experience.error || education.error}
          onRetry={() => {
            experience.reload();
            education.reload();
          }}
        >
          <ExperienceSwitcher
            experience={experience.data ?? []}
            education={education.data ?? []}
          />
        </DataBoundary>
      </Container>

      <Container>
        <DataBoundary
          loading={projects.loading}
          error={projects.error}
          onRetry={projects.reload}
        >
          <FeaturedProjects projects={projects.data ?? []} />
        </DataBoundary>
      </Container>

      {FEATURES.blog && <RecentPostsSection />}
    </>
  );
}