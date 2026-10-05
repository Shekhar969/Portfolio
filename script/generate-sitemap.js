import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { SITE } from "../src/lib/constants.js";

// Read .env locally; on Netlify/Vercel the variables already exist.
if (existsSync(".env")) {
  for (const line of readFileSync(".env", "utf8").split("\n")) {
    const match = line.match(/^\s*([\w]+)\s*=\s*(.*)\s*$/);
    if (match && !(match[1] in process.env)) process.env[match[1]] = match[2];
  }
}

const base = SITE.url.replace(/\/$/, "");
const today = new Date().toISOString().slice(0, 10);
const paths = ["/", "/projects", "/contact", "/resume", "/privacy"];

async function publishedProjectSlugs() {
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
  if (!projectId) throw new Error("VITE_FIREBASE_PROJECT_ID is not set");

  const response = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: "projects" }],
          where: {
            fieldFilter: {
              field: { fieldPath: "published" },
              op: "EQUAL",
              value: { booleanValue: true },
            },
          },
        },
      }),
    }
  );
  if (!response.ok) throw new Error(`Firestore responded ${response.status}`);

  const rows = await response.json();
  return rows
    .map((row) => row.document?.fields?.slug?.stringValue)
    .filter(Boolean);
}

try {
  const slugs = await publishedProjectSlugs();
  paths.push(...slugs.map((slug) => `/projects/${slug}`));
} catch (error) {
  console.warn(`Sitemap: project pages skipped (${error.message})`);
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${base}${p}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`;

writeFileSync("public/sitemap.xml", xml);
console.log(`sitemap.xml written with ${paths.length} URLs`);