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
    rollupOptions: {
      external: ["rollup/parseAst"],
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "framer-motion"],
          table: ["@tanstack/react-table", "@tanstack/react-virtual"],
        },
      },
    },
    sourcemap: true,
    outDir: "dist",
  },
  optimizeDeps: {
    include: ["rollup"],
  },
  server: {
    port: 3000,
    open: true,
  },
});
