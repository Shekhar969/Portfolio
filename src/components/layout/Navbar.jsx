import { NavLink } from "react-router-dom";
import Container from "./Container";
import ThemeSwitch from "../ui/ThemeToggle";
import { NAV_LINKS, ROUTES } from "../../lib/constants";
import { cn } from "../../lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function linkClass({ isActive }) {
  return cn(
    "relative shrink-0 whitespace-nowrap rounded px-0.5 py-1 lowercase",
    "text-[clamp(0.8125rem,2.4vw,1.0625rem)]",
    "transition-colors duration-150",
    focusRing,
    isActive
      ? "text-foreground after:absolute after:inset-x-0.5 after:-bottom-0.5 after:h-px after:bg-accent"
      : "text-muted-foreground hover:text-foreground"
  );
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <Container className="flex items-center justify-between gap-3 py-2 sm:min-h-16">
        <nav
          aria-label="Main"
          className="flex flex-wrap items-center gap-x-[clamp(0.625rem,3.2vw,2rem)] gap-y-1"
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === ROUTES.home}
              className={linkClass}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <ThemeSwitch />
      </Container>
    </header>
  );
}