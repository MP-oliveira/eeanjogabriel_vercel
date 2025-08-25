import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        format: 'es',
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  chunkSizeWarningLimit: 1000,

  server: {
    open: true,
    proxy: {
      "/api": {
        target: "https://backend-nhw7n6sha-mauricio-silva-oliveiras-projects.vercel.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
