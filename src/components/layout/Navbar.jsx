import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Container from "./Container";
import ThemeToggle from "../ui/ThemeToggle";
import { NAV_LINKS, ROUTES, SITE } from "../../lib/constants";
import { cn } from "../../lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function desktopLinkClass({ isActive }) {
  return cn(
    "relative rounded px-1 py-1 text-sm transition-colors duration-150",
    focusRing,
    isActive
      ? "text-foreground after:absolute after:inset-x-1 after:-bottom-0.5 after:h-px after:bg-accent"
      : "text-muted-foreground hover:text-foreground"
  );
}

function mobileLinkClass({ isActive }) {
  return cn(
    "block rounded px-2 py-2 text-base transition-colors duration-150",
    focusRing,
    isActive
      ? "bg-muted text-foreground"
      : "text-muted-foreground hover:text-foreground"
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const { pathname } = useLocation();

  // Close the menu whenever the route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape closes the menu and returns focus to the button
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Reset if the window grows past the mobile breakpoint
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const onChange = (e) => e.matches && setOpen(false);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <Container className="flex h-14 items-center justify-between">
        <Link
          to={ROUTES.home}
          className={cn(
            "rounded text-base font-semibold tracking-tight",
            focusRing
          )}
        >
          {SITE.name}
        </Link>

        {/* Desktop */}
        <nav aria-label="Main" className="hidden items-center gap-5 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === ROUTES.home}
              className={desktopLinkClass}
            >
              {link.label}
            </NavLink>
          ))}
          <ThemeToggle className="ml-1" />
        </nav>

        {/* Mobile toggle */}
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded text-foreground md:hidden",
            focusRing
          )}
        >
          {open ? (
            <X size={20} aria-hidden="true" />
          ) : (
            <Menu size={20} aria-hidden="true" />
          )}
        </button>
      </Container>

      {/* Mobile panel */}
      {open && (
        <div id="mobile-menu" className="border-t border-border md:hidden">
          <Container className="py-3">
            <nav aria-label="Mobile" className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === ROUTES.home}
                  className={mobileLinkClass}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-3 flex items-center justify-between border-t border-border px-2 pt-3">
              <span className="text-sm text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}