import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

const base =
  "relative z-10 flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border sm:h-12 sm:w-12";

export default function InitialAvatar({ name = "", src }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className={cn(base, "bg-white object-contain p-1.5")}
      />
    );
  }

  const initial = name.trim().charAt(0).toUpperCase() || "•";
  return (
    <span
      aria-hidden="true"
      className={cn(base, "bg-muted font-mono text-base text-muted-foreground")}
    >
      {initial}
    </span>
  );
}