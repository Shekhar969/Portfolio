import { Link } from "react-router-dom";
import Container from "../components/layout/Container";
import { ROUTES } from "../lib/constants";

export default function NotFound() {
  return (
    <Container className="py-32">
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        This page couldn't be found.
      </h1>
      <Link
        to={ROUTES.home}
        className="mt-6 inline-block text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        Back home →
      </Link>
    </Container>
  );
}