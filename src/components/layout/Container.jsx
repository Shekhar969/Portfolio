import { cn } from "../../lib/utils";

/**
 * Centered content wrapper.
 * size="default" -> ~1100px (pages), size="prose" -> ~720px (articles)
 */
export default function Container({
  as: Tag = "div",
  size = "default",
  className,
  children,
  ...props
}) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-10",
        size === "prose" ? "max-w-prose" : "max-w-content",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}