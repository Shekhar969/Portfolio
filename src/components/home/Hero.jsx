import Container from "../layout/Container";
import SocialLinks from "./SocialLinks";
import { SITE } from "../../lib/constants";

export default function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="pb-12 pt-16 sm:pt-24">
      <Container>
        <h1
          id="hero-heading"
          className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
        >
          Hi, I'm {SITE.name}.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
          {SITE.role} based in {SITE.location}.
        </p>
        <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
          {SITE.shortBio}
        </p>
        <SocialLinks className="mt-8" />
      </Container>
    </section>
  );
}