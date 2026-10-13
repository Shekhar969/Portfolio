import Container from "../components/layout/Container";
import Seo from "../components/Seo";
import DataBoundary from "../components/ui/DataBoundary";
import EmptyState from "../components/ui/EmptyState";
import Experience from "../components/home/Experience";
import Education from "../components/home/Education";
import { useEducation, useExperience } from "../hooks/useExperience";

function CareerPage({
  heading,
  seoTitle,
  seoDescription,
  emptyTitle,
  Items,
  state,
}) {
  const { data, loading, error, reload } = state;
  const items = data ?? [];

  return (
    <Container className="py-12 sm:py-16">
      <Seo title={seoTitle} description={seoDescription} />

      <h1 className="font-serif text-[clamp(2rem,5.5vw,3.5rem)] font-bold lowercase leading-[1.05] tracking-tight">
        {heading}
      </h1>

      <div className="mt-8">
        <DataBoundary loading={loading} error={error} onRetry={reload}>
          {items.length > 0 ? (
            <Items items={items} />
          ) : (
            <EmptyState title={emptyTitle} />
          )}
        </DataBoundary>
      </div>
    </Container>
  );
}

export function ExperiencePage() {
  const state = useExperience();
  return (
    <CareerPage
      heading="my experience."
      seoTitle="Experience"
      seoDescription="Work experience, roles, and what I worked on."
      emptyTitle="No experience added yet."
      Items={Experience}
      state={state}
    />
  );
}

export function EducationPage() {
  const state = useEducation();
  return (
    <CareerPage
      heading="my education."
      seoTitle="Education"
      seoDescription="Education, programs, and qualifications."
      emptyTitle="No education added yet."
      Items={Education}
      state={state}
    />
  );
}