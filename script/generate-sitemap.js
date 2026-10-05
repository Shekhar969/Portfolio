import { writeFileSync } from "node:fs";
import { FEATURES, SITE } from "../src/lib/constants.js";
import { posts, projects } from "../src/data/content.js";

const base = SITE.url.replace(/\/$/, "");
const today = new Date().toISOString().slice(0, 10);

const paths = [
  "/",
  "/projects",
  "/contact",
  "/resume",
  "/privacy",
  ...projects.map((p) => `/projects/${p.slug}`),
];

if (FEATURES.blog) {
  paths.push("/blog", ...posts.map((p) => `/blog/${p.slug}`));
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map((p) => `  <url><loc>${base}${p}</loc><lastmod>${today}</lastmod></url>`)
  .join("\n")}
</urlset>
`;

writeFileSync("public/sitemap.xml", xml);
console.log(`sitemap.xml written with ${paths.length} URLs`);