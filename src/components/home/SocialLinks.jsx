import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useSite } from "../../hooks/useSite";
import { ROUTES } from "../../lib/constants";
import { cn } from "../../lib/utils";

const linkClass =
  "inline-flex items-center gap-1 rounded text-sm text-muted-foreground transition-colors duration-150 hover:text-accent " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export default function SocialLinks({ className }) {
  const site = useSite();
  const links = site.socialLinks.filter((item) => item.href);

  return (
    <ul className={cn("flex flex-wrap items-center gap-x-5 gap-y-2", className)}>
      {links.map((item) => {
        const isMail = item.href.startsWith("mailto:");
        return (
          <li key={item.id}>
            <a
              href={item.href}
              className={linkClass}
              {...(isMail ? {} : { target: "_blank", rel: "noopener noreferrer" })}
            >
              {item.label}
              {!isMail && <ArrowUpRight size={13} aria-hidden="true" />}
            </a>
          </li>
        );
      })}
      <li>
        <Link to={ROUTES.resume} className={linkClass}>
          Resume
        </Link>
      </li>
    </ul>
  );
}