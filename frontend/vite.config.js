import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        format: "iife", // Ensures compatibility with importScripts
      },
    },
  },
  plugins: [react()],
});
