import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // GitHub Pages serves this repo under /Portfolio/. Local dev stays at "/".
  base: command === "build" ? "/Portfolio/" : "/",
}));