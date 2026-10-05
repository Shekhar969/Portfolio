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
          className="flex gap-6 border-b border-border"
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
                  "-mb-px border-b-2 py-2 text-sm font-medium transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  selected
                    ? "border-accent text-foreground"
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
        "animate-fade-in pt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        className
      )}
    >
      {children}
    </div>
  );
}