import { Link } from "react-router-dom";
import Container from "./Container";
import {
  FOOTER_LINKS,
  ROUTES,
  SITE,
  SOCIAL_LINKS,
} from "../../lib/constants";
import { cn } from "../../lib/utils";

const linkClass = cn(
  "rounded text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
);

export default function Footer() {
  const socials = SOCIAL_LINKS.filter((item) => item.href);

  return (
    <footer className="mt-24 border-t border-border">
      <Container className="py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div>
            <p className="font-semibold">{SITE.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{SITE.tagline}</p>
          </div>

          <nav aria-label="Footer" className="flex gap-10">
            <ul className="space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {socials.length > 0 && (
              <ul className="space-y-2">
                {socials.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className={linkClass}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name}
          </p>
          <Link to={ROUTES.privacy} className={linkClass}>
            Privacy
          </Link>
        </div>
      </Container>
    </footer>
  );
}