import { createContext, useContext, useId, useRef } from "react";
import { cn } from "../../lib/utils";

const TabsContext = createContext(null);

/**
 * <Tabs tabs={[{id:"work",label:"Work"},{id:"education",label:"Education"}]}
 *       value={tab} onChange={setTab} label="Experience">
 *   <TabPanel id="work">...</TabPanel>
 *   <TabPanel id="education">...</TabPanel>
 * </Tabs>
 */
export default function Tabs({ tabs, value, onChange, label, className, children }) {
  const prefix = useId();
  const refs = useRef([]);

  const focusTab = (index) => {
    const next = (index + tabs.length) % tabs.length;
    onChange(tabs[next].id);
    refs.current[next]?.focus();
  };

  const onKeyDown = (event, index) => {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        focusTab(index + 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        focusTab(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusTab(0);
        break;
      case "End":
        event.preventDefault();
        focusTab(tabs.length - 1);
        break;
      default:
    }
  };

  return (
    <TabsContext.Provider value={{ prefix, value }}>
      <div className={className}>
        <div
          role="tablist"
          aria-label={label}
          className="grid gap-1 rounded-xl border border-border bg-muted p-1"
          style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
        >
          {tabs.map((tab, index) => {
            const selected = tab.id === value;
            return (
              <button
                key={tab.id}
                ref={(el) => (refs.current[index] = el)}
                id={`${prefix}-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${prefix}-panel-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => onChange(tab.id)}
                onKeyDown={(e) => onKeyDown(e, index)}
                className={cn(
                  "rounded-lg border py-1.5 text-center text-sm transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  selected
                    ? "border-border bg-background text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabPanel({ id, className, children }) {
  const { prefix, value } = useContext(TabsContext);
  if (id !== value) return null;

  return (
    <div
      role="tabpanel"
      id={`${prefix}-panel-${id}`}
      aria-labelledby={`${prefix}-tab-${id}`}
      tabIndex={0}
      className={cn(
        "animate-fade-in pt-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        className
      )}
    >
      {children}
    </div>
  );
}