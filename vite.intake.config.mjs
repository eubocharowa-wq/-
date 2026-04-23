import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    cssCodeSplit: false,
    emptyOutDir: true,
    outDir: "src/assets/investment-intake",
    rollupOptions: {
      input: resolve(__dirname, "src/react-intake/main.tsx"),
      output: {
        format: "iife",
        name: "CBIInvestmentIntake",
        entryFileNames: "investment-intake.js",
        assetFileNames: "investment-intake.css",
        inlineDynamicImports: true,
      },
    },
  },
});
