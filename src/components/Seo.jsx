import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useSite } from "../hooks/useSite";
import { OG_IMAGE } from "../lib/constants";

export default function Seo({ title, description, noIndex = false, jsonLd }) {
  const { site } = useSite();
  const { pathname } = useLocation();

  const base = site.url.replace(/\/$/, "");
  const metaDescription = description ?? site.shortBio;
  const fullTitle = title ? `${title} | ${site.name}` : `${site.name} | ${site.role}`;
  const url = `${base}${pathname}`;
  const image = OG_IMAGE ? `${base}${OG_IMAGE}` : "";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={url} />
      {noIndex && <meta name="robots" content="noindex" />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {image && <meta name="twitter:image" content={image} />}

      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}