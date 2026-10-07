import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { THEMES } from "../../lib/constants";
import { cn } from "../../lib/utils";

export default function ThemeSwitch({ className }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === THEMES.dark;
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? THEMES.light : THEMES.dark)}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md sm:h-9 sm:w-9",
        "text-muted-foreground transition-colors duration-150 hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
    >
      {isDark ? (
        <Sun className="h-[18px] w-[18px] text-amber-400 sm:h-5 sm:w-5" aria-hidden="true" />
      ) : (
        <Moon className="h-[18px] w-[18px] sm:h-5 sm:w-5" aria-hidden="true" />
      )}
    </button>
  );
}