export default function ProjectGallery({ images = [], title }) {
  if (!images.length) return null;

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {images.map((image, index) => (
        <li key={image.url || index}>
          <a
            href={image.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block overflow-hidden rounded-md border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <img
              src={image.thumbUrl || image.url}
              alt={image.alt || `${title} screenshot ${index + 1}`}
              loading="lazy"
              decoding="async"
              className="aspect-video w-full object-cover"
            />
          </a>
        </li>
      ))}
    </ul>
  );
}