import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { seedDesignPlugin } from "@seed-design/vite-plugin";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [react(), seedDesignPlugin({ colorMode: "light-only" }), viteSingleFile()],
  build: {
    assetsInlineLimit: 100_000_000,
  },
});
