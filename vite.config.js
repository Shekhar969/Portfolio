import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // The site is served from the root (Cloudflare Pages or a custom domain).
  base: "/",
});