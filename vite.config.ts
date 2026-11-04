import { defineConfig } from "vite";
import { cpSync, mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

// Serve a landing page diretamente, sem carregar uma aplicação React apenas
// para envolvê-la em um iframe. Isso preserva o HTML/CSS/JS existente e reduz
// JavaScript, CSS e trabalho de renderização desnecessários.
export default defineConfig({
  root: "public/landing",
  publicDir: false,
  plugins: [
    {
      name: "inline-landing-css",
      transformIndexHtml: {
        order: "pre",
        handler(html) {
          const css = readFileSync(resolve("public/landing/styles.css"), "utf8");
          return html.replace(
            '<link rel="stylesheet" href="styles.css">',
            `<style>${css}</style>`,
          );
        },
      },
    },
    {
      name: "copy-landing-images",
      closeBundle() {
        const target = resolve("dist/assets");
        mkdirSync(target, { recursive: true });
        cpSync(resolve("public/landing/assets"), target, { recursive: true });
      },
    },
  ],
  build: {
    outDir: "../../dist",
    emptyOutDir: true,
  },
  server: {
    host: "::",
    port: 8080,
  },
});
