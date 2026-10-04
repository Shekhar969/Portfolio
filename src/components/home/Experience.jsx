import Badge from "../ui/Badge";
import { formatDateRange } from "../../lib/utils";

export default function Experience({ items }) {
  return (
    <ol className="space-y-10 border-l border-border pl-6">
      {items.map((item) => (
        <li key={item.id} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[29px] top-2 h-1.5 w-1.5 rounded-full bg-border"
          />
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <h3 className="font-semibold">{item.organization}</h3>
            <p className="font-mono text-xs text-muted-foreground">
              {item.dateLabel ||
                formatDateRange(item.startDate, item.endDate, item.current)}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {item.role}
            {item.employmentType ? ` · ${item.employmentType}` : ""}
          </p>

          {item.description && (
            <p className="mt-3 text-sm leading-relaxed">{item.description}</p>
          )}

          {item.achievements?.length > 0 && (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed marker:text-muted-foreground">
              {item.achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          )}

          {item.technologies?.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {item.technologies.map((tech) => (
                <li key={tech}>
                  <Badge>{tech}</Badge>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  );
}