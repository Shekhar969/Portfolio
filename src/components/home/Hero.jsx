import Container from "../components/layout/Container";
import Seo from "../components/Seo";
import Hero from "../components/home/Hero";
import ExperienceSwitcher from "../components/home/ExperienceSwitcher";
import FeaturedProjects from "../components/home/FeaturedProjects";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import { useSite } from "../hooks/useSite";
import { useEducation, useExperience } from "../hooks/useExperience";
import { useFeaturedProjects } from "../hooks/useProjects";
import { getFirebaseErrorMessage } from "../lib/utils";

function Boundary({ loading, error, onRetry, children }) {
  if (loading) return <LoadingState className="py-12" />;
  if (error) {
    return (
      <Container className="py-8">
        <ErrorState message={getFirebaseErrorMessage(error)} onRetry={onRetry} />
      </Container>
    );
  }
  return children;
}

export default function Home() {
  const site = useSite();
  const experience = useExperience();
  const education = useEducation();
  const projects = useFeaturedProjects();

  const sameAs = site.socialLinks
    .map((l) => l.href)
    .filter((href) => href && !href.startsWith("mailto:"));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: site.name,
      jobTitle: site.role,
      url: site.url,
      sameAs,
    },
    { "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: site.url },
  ];

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

      <Boundary
        loading={projects.loading}
        error={projects.error}
        onRetry={projects.reload}
      >
        <FeaturedProjects projects={projects.data ?? []} />
      </Boundary>
    </>
  );
}