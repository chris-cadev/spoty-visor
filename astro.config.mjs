// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  integrations: [
    react({
      experimentalReactChildren: true,
    }),
    mdx(),
  ],
  i18n: {
    locales: ["es", "en"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
