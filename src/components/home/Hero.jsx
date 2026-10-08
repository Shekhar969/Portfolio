import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDownRight } from "lucide-react";
import Container from "../layout/Container";
import SocialLinks from "./SocialLinks";
import { useSite } from "../../hooks/useSite";
import { ROUTES } from "../../lib/constants";
import { cn } from "../../lib/utils";

const SWIPE_DISTANCE = 40; // px you must drag before the photo moves on
const FLING_MS = 220;
const BEHIND = [
  "",
  "translateX(-8px) rotate(-6deg)",
  "translate(12px, 5px) rotate(3.5deg)",
];

function ProfileStack({ images, name }) {
  const count = images.length;
  const key = images.join("|");

  const [order, setOrder] = useState(() => images.map((_, i) => i));
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [instant, setInstant] = useState(false);
  const [failed, setFailed] = useState(() => new Set());
  const startX = useRef(0);
  const busy = useRef(false);
  const timer = useRef(null);

  useEffect(() => {
    setOrder(images.map((_, i) => i));
    setFailed(new Set());
    setDragX(0);
    setDragging(false);
    busy.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const altFor = (i) =>
    count === 1 ? `Photo of ${name}` : `${name}, photo ${i + 1} of ${count}`;

  const advance = (direction) => {
    if (count < 2 || busy.current) return;
    busy.current = true;
    setDragging(false);
    setDragX(direction * 520);
    timer.current = setTimeout(() => {
      setInstant(true);
      setOrder((o) => [...o.slice(1), o[0]]);
      setDragX(0);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setInstant(false);
          busy.current = false;
        })
      );
    }, FLING_MS);
  };

  const back = () => {
    if (count < 2 || busy.current) return;
    setOrder((o) => [o[o.length - 1], ...o.slice(0, -1)]);
  };

  const onPointerDown = (event) => {
    if (count < 2 || busy.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    startX.current = event.clientX;
    setDragging(true);
  };

  const onPointerMove = (event) => {
    if (dragging) setDragX(event.clientX - startX.current);
  };

  const endDrag = () => {
    if (!dragging) return;
    setDragging(false);
    if (Math.abs(dragX) > SWIPE_DISTANCE) advance(dragX > 0 ? 1 : -1);
    else setDragX(0);
  };

  const onKeyDown = (event) => {
    if (event.key === "ArrowRight") advance(-1);
    if (event.key === "ArrowLeft") back();
  };

  // Top card follows the finger; cards behind sit tilted like in the reference.
  const topStyle = () => {
    const gone = Math.abs(dragX) >= 500;
    return {
      zIndex: count + 1,
      opacity: gone ? 0 : 1,
      transform: `translateX(${dragX}px) rotate(${dragX / 25}deg)`,
      transition:
        dragging || instant
          ? "none"
          : `transform ${FLING_MS}ms ease-out, opacity ${FLING_MS}ms ease-out`,
    };
  };

  const behindStyle = (depth, zIndex) => ({
    zIndex,
    opacity: depth > 2 ? 0 : 1,
    transform: BEHIND[depth] || "scale(0.94)",
    transition: instant
      ? "none"
      : "transform 300ms ease-out, opacity 300ms ease-out",
  });

  // With fewer than 3 photos, plain cards fill the stack so it keeps its shape.
  const decorative = Array.from(
    { length: Math.max(0, 3 - count) },
    (_, i) => count + i
  );

  const cardBase =
    "absolute inset-0 select-none overflow-hidden rounded-xl border border-border bg-card shadow-md";

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={`Photos of ${name}`}
      onKeyDown={onKeyDown}
      className="mx-auto w-[clamp(10rem,52vw,13rem)] md:ml-auto md:mr-0 md:w-[88%]"
    >
      <div className="relative aspect-[3/4] w-full">
        {decorative.map((depth) => (
          <div
            key={`decor-${depth}`}
            aria-hidden="true"
            style={behindStyle(depth, 1)}
            className={cn(
              "absolute inset-0 rounded-xl border border-border",
              depth === 1 ? "bg-muted" : "bg-card"
            )}
          />
        ))}

        {order
          .map((imageIndex, depth) => ({ imageIndex, depth }))
          .sort((a, b) => b.depth - a.depth)
          .map(({ imageIndex, depth }) => {
            const isTop = depth === 0;
            return (
              <div
                key={imageIndex}
                aria-hidden={!isTop}
                style={
                  isTop ? topStyle() : behindStyle(depth, count + 1 - depth)
                }
                {...(isTop && count > 1
                  ? {
                      onPointerDown,
                      onPointerMove,
                      onPointerUp: endDrag,
                      onPointerCancel: endDrag,
                    }
                  : {})}
                className={cn(
                  cardBase,
                  isTop &&
                    count > 1 &&
                    "cursor-grab touch-pan-y active:cursor-grabbing"
                )}
              >
                {failed.has(imageIndex) ? (
                  <div
                    role="img"
                    aria-label={altFor(imageIndex)}
                    className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground"
                  >
                    {altFor(imageIndex)}
                  </div>
                ) : (
                  <img
                    src={images[imageIndex]}
                    alt={isTop ? altFor(imageIndex) : ""}
                    width="400"
                    height="540"
                    decoding="async"
                    draggable={false}
                    onError={() =>
                      setFailed((prev) => new Set(prev).add(imageIndex))
                    }
                    className="pointer-events-none h-full w-full object-cover"
                  />
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default function Hero() {
  const { site } = useSite();
  const images = (site.profileImages ?? []).filter(Boolean);
  const hasImages = images.length > 0;
  const firstName = site.name.trim().split(/\s+/)[0];

  return (
    <section
      aria-labelledby="hero-heading"
      className="overflow-x-clip  pt-10 sm:pt-14"
    >
      <Container
        className={cn(
          "grid items-center gap-8 sm:gap-10",
          hasImages &&
            "md:grid-cols-[minmax(0,1fr)_clamp(10.5rem,28%,16.5rem)]"
        )}
      >
        <div>
          <h1
            id="hero-heading"
            className="font-serif text-[clamp(2rem,5dvh,3.25rem)] font-bold lowercase leading-[1.05] tracking-tight"
          >
            hi {firstName} here. <span aria-hidden="true">👋</span>
          </h1>

          <p className="mt-2 text-[clamp(0.9375rem,1.5dvh,1.125rem)] leading-snug text-foreground">
            22yo {site.role}
            {site.location
              ? ` from ${site.location}${/nepal/i.test(site.location) ? " 🇳🇵" : ""}`
              : ""}
          </p>

          <p className="mt-5 max-w-md text-[clamp(0.875rem,1.5vw,1rem)] leading-relaxed text-foreground/90">
            {site.shortBio}
          </p>

          <p className="mt-6 text-[clamp(0.8rem,2vw,1.1rem)] font-semibold">
            <Link
              to={ROUTES.contact}
              className="inline-flex items-center gap-2 rounded hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Questions or opportunities? Send a message
              <ArrowDownRight
                className="h-[1.1em] w-[1.1em]"
                aria-hidden="true"
              />
            </Link>
          </p>
          <p className="mt-1.5 whitespace-nowrap text-[clamp(0.6rem,2vw,0.9rem)] text-muted-foreground">
            For any escalations, please find my{" "}
            <a
              href="https://www.instagram.com/shku.06/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded underline underline-offset-2 transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Quick Lead
            </a>{" "}
            instead.
          </p>

          <SocialLinks className="mt-5" />
        </div>

        {hasImages && (
          <div className="order-first md:order-none">
            <ProfileStack images={images} name={site.name} />
          </div>
        )}
      </Container>
    </section>
  );
}