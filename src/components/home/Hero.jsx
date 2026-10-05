import Container from "../layout/Container";
import SocialLinks from "./SocialLinks";
import { useSite } from "../../hooks/useSite";

export default function Hero() {
  const { site } = useSite();

  return (
    <section aria-labelledby="hero-heading" className="pb-12 pt-16 sm:pt-24">
      <Container>
        {site.profileImage && (
          <img
            src={site.profileImage}
            alt={`Photo of ${site.name}`}
            width="96"
            height="96"
            className="mb-6 h-24 w-24 rounded-full border border-border object-cover"
          />
        )}
        <h1
          id="hero-heading"
          className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
        >
          Hi, I'm {site.name}.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
          {site.role}
          {site.location ? ` based in ${site.location}` : ""}.
        </p>
        <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
          {site.shortBio}
        </p>
        <SocialLinks className="mt-8" />
      </Container>
    </section>
  );
}