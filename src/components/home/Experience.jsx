import { Globe } from "lucide-react";
import Badge from "../ui/Badge";
import InitialAvatar from "../ui/InitialAvatar";
import { formatDateRange } from "../../lib/utils";

/**
 * Groups neighbouring items that share a title (company or school), so the
 * name is shown once with several roles under it.
 */
export function groupConsecutive(items, titleKey) {
  const groups = [];
  for (const item of items) {
    const title = String(item[titleKey] || "").trim();
    const last = groups[groups.length - 1];
    if (last && last.title.toLowerCase() === title.toLowerCase()) {
      last.items.push(item);
      if (!last.logoUrl && item.logoUrl) last.logoUrl = item.logoUrl;
    } else {
      groups.push({ key: item.id, title, logoUrl: item.logoUrl, items: [item] });
    }
  }
  return groups;
}

export function Timeline({ groups, subtitleOf }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border">
      {/* The thin vertical line that runs through the logos */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-[38px] w-px bg-border sm:left-[45px] lg:left-[40px]"
      />

      <ol className="relative space-y-8 p-4 sm:space-y-10 sm:p-5">
        {groups.map((group) => (
          <li key={group.key} className="flex gap-4 sm:gap-5">
            <InitialAvatar name={group.title} src={group.logoUrl} />

            <div className="min-w-0 flex-1">
              <h3 className="text-base font-medium leading-tight sm:text-lg">
                {group.title}
              </h3>

              {group.items.map((item, index) => {
                const date =
                  item.dateLabel ||
                  formatDateRange(item.startDate, item.endDate, item.current);
                const links = (item.links ?? []).filter((l) => l?.url);

                return (
                  <div key={item.id} className={index === 0 ? "mt-1" : "mt-5"}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <p className="text-sm text-muted-foreground sm:text-[15px]">
                        {subtitleOf(item)}
                      </p>
                      {date && (
                        <p className="shrink-0 text-xs text-muted-foreground">
                          {date}
                        </p>
                      )}
                    </div>

                    {item.description && (
                      <p className="mt-2 text-[13px] leading-relaxed sm:text-sm">
                        {item.description}
                      </p>
                    )}

                    {item.achievements?.length > 0 && (
                      <ul className="mt-2 list-disc space-y-0.5 pl-5 text-[13px] leading-relaxed marker:text-muted-foreground sm:text-sm">
                        {item.achievements.map((achievement, i) => (
                          <li key={i}>{achievement}</li>
                        ))}
                      </ul>
                    )}

                    {links.length > 0 && (
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {links.map((link) => (
                          <li key={link.url}>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-2.5 py-1 text-xs font-medium text-background transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            >
                              <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}

                    {item.technologies?.length > 0 && (
                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {item.technologies.map((tech) => (
                          <li key={tech}>
<span className="inline-flex items-center rounded border border-border px-2 py-0.5 font-mono text-xs text-foreground/80">
                              {tech}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Experience({ items }) {
  return (
    <Timeline
      groups={groupConsecutive(items, "organization")}
      subtitleOf={(item) =>
        `${item.role}${item.employmentType ? ` (${item.employmentType})` : ""}`
      }
    />
  );
}