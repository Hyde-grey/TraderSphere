import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    rollupOptions: {
      external: [/^node:.*/, "rollup", "rollup/parseAst"],
    },
    sourcemap: true,
    outDir: "dist",
  },
  optimizeDeps: {
    exclude: ["vitest"],
  },
  server: {
    port: 3000,
    open: true,
  },
});
