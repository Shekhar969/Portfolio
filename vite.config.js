import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const ALLOWED_EXTENSIONS = new Set([
  ".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif", ".mp4", ".webm", ".pdf",
]);
const MAX_BYTES = 25 * 1024 * 1024;
const LOCAL_ADDRESSES = new Set(["127.0.0.1", "::1", "::ffff:127.0.0.1"]);

const cleanSegment = (segment) => segment.replace(/[^A-Za-z0-9_-]/g, "");

/**
 * Development only: lets the admin page save uploaded files into /public.
 * It does not exist in the production build.
 */
function devUploads() {
  return {
    name: "dev-uploads",
    apply: "serve",
    configureServer(server) {
      const publicDir = path.resolve(server.config.root, "public");

      server.middlewares.use("/__dev/upload", (req, res) => {
        const reply = (status, body) => {
          res.statusCode = status;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(body));
        };

        if (req.method !== "POST") return reply(405, { error: "Use POST." });
        if (!LOCAL_ADDRESSES.has(req.socket.remoteAddress)) {
          return reply(403, { error: "Uploads are only allowed from this computer." });
        }

        const params = new URL(req.url, "http://localhost").searchParams;
        const folder = (params.get("folder") || "")
          .split("/")
          .map(cleanSegment)
          .filter(Boolean)
          .join("/");

        const rawName = path.basename(params.get("name") || "");
        const ext = path.extname(rawName).toLowerCase();
        const base =
          rawName
            .slice(0, rawName.length - ext.length)
            .replace(/\s+/g, "-")
            .replace(/[^A-Za-z0-9._-]/g, "")
            .replace(/^\.+/, "") || "file";

        if (!ALLOWED_EXTENSIONS.has(ext)) {
          return reply(400, { error: `${ext || "That"} files are not allowed.` });
        }

        const targetDir = path.join(publicDir, folder);
        if (targetDir !== publicDir && !targetDir.startsWith(publicDir + path.sep)) {
          return reply(400, { error: "Invalid folder." });
        }

        const chunks = [];
        let size = 0;
        let rejected = false;

        req.on("data", (chunk) => {
          if (rejected) return;
          size += chunk.length;
          if (size > MAX_BYTES) {
            rejected = true;
            reply(413, { error: "File is larger than 25 MB." });
            req.resume();
            return;
          }
          chunks.push(chunk);
        });

        req.on("end", () => {
          if (rejected) return;
          if (!size) return reply(400, { error: "The file is empty." });

          fs.mkdirSync(targetDir, { recursive: true });
          let name = `${base}${ext}`;
          if (params.get("overwrite") !== "1") {
            let n = 1;
            while (fs.existsSync(path.join(targetDir, name))) {
              name = `${base}-${n++}${ext}`;
            }
          }

          fs.writeFileSync(path.join(targetDir, name), Buffer.concat(chunks));
          reply(200, { path: "/" + [folder, name].filter(Boolean).join("/") });
        });

        req.on("error", () => reply(500, { error: "Upload failed." }));
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), devUploads()],
  // The site is served from the root (Cloudflare Pages or a custom domain).
  base: "/",
});