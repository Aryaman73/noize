import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base so the same build works at any GitHub Pages sub-path
// (e.g. you.github.io/noize/), behind a custom domain, or at the site root.
export default defineConfig({
  base: "./",
  plugins: [react()],
});
