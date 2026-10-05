import { Link } from "react-router-dom";
import { cn, isExternalUrl } from "../../lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-150 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants = {
  primary: "bg-accent text-accent-foreground hover:opacity-90",
  secondary: "border border-border bg-card text-card-foreground hover:bg-muted",
  ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
  danger: "bg-red-600 text-white hover:bg-red-700",
  link: "text-accent hover:underline px-0",
};

const sizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-9 px-4 text-sm",
  lg: "h-10 px-5 text-base",
};

/**
 * <Button>Save</Button>
 * <Button to="/projects">Projects</Button>          (internal link)
 * <Button href="https://github.com/..." >GitHub</Button>  (external link)
 */
export default function Button({
  variant = "primary",
  size = "md",
  to,
  href,
  className,
  children,
  type = "button",
  ...props
}) {
  const classes = cn(
    base,
    variants[variant],
    variant === "link" ? "h-auto" : sizes[size],
    className
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    const external = isExternalUrl(href);
    return (
      <a
        href={href}
        className={classes}
        {...(external && !href.startsWith("mailto:")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}