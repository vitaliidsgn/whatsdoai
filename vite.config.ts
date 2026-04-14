import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    __BACKEND_URL__: JSON.stringify(
      process.env.BACKEND_URL || "http://localhost:8000"
    ),
  },
  server: {
    proxy: {
      "/api": {
        target: process.env.BACKEND_URL || "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
