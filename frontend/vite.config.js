import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  chunkSizeWarningLimit: 1000,

  server: {
    open: true,
    proxy: {
      "/api": {
        target: "https://back-eeanjogabriel-vercel-nine.vercel.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
