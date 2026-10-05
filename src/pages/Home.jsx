import { useMemo } from "react";
import Container from "../components/layout/Container";
import Seo from "../components/Seo";
import Hero from "../components/home/Hero";
import ExperienceSwitcher from "../components/home/ExperienceSwitcher";
import FeaturedProjects from "../components/home/FeaturedProjects";
import DataBoundary from "../components/ui/DataBoundary";
import { useEducation, useExperience } from "../hooks/useExperience";
import { useFeaturedProjects } from "../hooks/useProjects";
import { useSite } from "../hooks/useSite";

function Boundary({ loading, error, onRetry, children }) {
  if (loading || error) {
    return (
      <Container>
        <DataBoundary loading={loading} error={error} onRetry={onRetry} />
      </Container>
    );
  }
  return children;
}

export default function Home() {
  const { site } = useSite();
  const experience = useExperience();
  const education = useEducation();
  const projects = useFeaturedProjects();

  const jsonLd = useMemo(
    () => [
      {
        "@context": "https://schema.org",
        "@type": "Person",
        name: site.name,
        jobTitle: site.role,
        url: site.url,
        sameAs: site.socialLinks
          .map((l) => l.href)
          .filter((href) => href && !href.startsWith("mailto:")),
      },
      { "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: site.url },
    ],
    [site]
  );

  return (
    <>
      <Seo jsonLd={jsonLd} />
      <Hero />

      <Boundary
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
      </Boundary>

      <Boundary loading={projects.loading} error={projects.error} onRetry={projects.reload}>
        <FeaturedProjects projects={projects.data ?? []} />
      </Boundary>
    </>
  );
}