import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { OG_IMAGE, SITE } from "../lib/constants";

const base = SITE.url.replace(/\/$/, "");

export default function Seo({
  title,
  description = SITE.shortBio,
  noIndex = false,
  jsonLd,
}) {
  const { pathname } = useLocation();
  const fullTitle = title
    ? `${title} | ${SITE.name}`
    : `${SITE.name} | ${SITE.role}`;
  const url = `${base}${pathname}`;
  const image = OG_IMAGE ? `${base}${OG_IMAGE}` : "";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noIndex && <meta name="robots" content="noindex" />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}