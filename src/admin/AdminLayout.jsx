import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import Seo from "../components/Seo";
import Button from "../components/ui/Button";
import ThemeToggle from "../components/ui/ThemeToggle";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../lib/constants";
import { cn } from "../lib/utils";

const LINKS = [
  { label: "Dashboard", to: ROUTES.admin, end: true },
  { label: "Projects", to: `${ROUTES.admin}/projects` },
  { label: "Experience", to: `${ROUTES.admin}/experience` },
  { label: "Education", to: `${ROUTES.admin}/education` },
  { label: "Messages", to: `${ROUTES.admin}/messages` },
  { label: "Settings", to: `${ROUTES.admin}/settings` },
];

const linkClass = ({ isActive }) =>
  cn(
    "whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
    isActive
      ? "bg-muted text-foreground"
      : "text-muted-foreground hover:text-foreground"
  );

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate(ROUTES.adminLogin, { replace: true });
  };

  return (
    <div className="min-h-screen md:grid md:grid-cols-[200px_1fr]">
      <Seo title="Admin" noIndex />

      <aside className="border-b border-border md:border-b-0 md:border-r">
        <p className="px-4 py-4 font-semibold">Admin</p>
        <nav
          aria-label="Admin"
          className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:pb-4"
        >
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="min-w-0">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
          <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
          <div className="flex items-center gap-3">
            <Link
              to={ROUTES.home}
              className="rounded text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              View site
            </Link>
            <ThemeToggle />
            <Button variant="secondary" size="sm" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
        </header>

        <main className="px-4 py-8 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}