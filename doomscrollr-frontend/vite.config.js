import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: path.resolve(__dirname, "postcss.config.js"), // ✅ Force Vite to use *this* config only
  },
  server: {
    port: 5173,
    open: true,
  },
});
