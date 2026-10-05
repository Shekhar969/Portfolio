import { useRef } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { THEMES } from "../../lib/constants";
import { cn } from "../../lib/utils";

const OPTIONS = [
  { value: THEMES.light, label: "Light", Icon: Sun },
  { value: THEMES.dark, label: "Dark", Icon: Moon },
  { value: THEMES.system, label: "System", Icon: Monitor },
];

export default function ThemeToggle({ className }) {
  const { theme, setTheme } = useTheme();
  const refs = useRef([]);

  const handleKeyDown = (event, index) => {
    let next = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = (index + 1) % OPTIONS.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = (index - 1 + OPTIONS.length) % OPTIONS.length;
    }
    if (next !== null) {
      event.preventDefault();
      setTheme(OPTIONS[next].value);
      refs.current[next]?.focus();
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className={cn(
        "inline-flex items-center rounded-full border border-border p-0.5",
        className
      )}
    >
      {OPTIONS.map(({ value, label, Icon }, index) => {
        const selected = theme === value;
        return (
          <button
            key={value}
            ref={(el) => (refs.current[index] = el)}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={label}
            title={label}
            tabIndex={selected ? 0 : -1}
            onClick={() => setTheme(value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              "inline-flex h-7 w-7 items-center justify-center rounded-full",
              "transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              selected
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon size={14} aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}