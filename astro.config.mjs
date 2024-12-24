// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import auth from "auth-astro";
import vercelAdapter from "@astrojs/vercel";
export default defineConfig({
  site: "https://example.com",
  output: "server",
  adapter: vercelAdapter(),
  integrations: [
    react({
      experimentalReactChildren: true,
    }),
    mdx(),
    auth(),
  ],
  i18n: {
    locales: ["es", "en"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
