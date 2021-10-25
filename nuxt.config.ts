import { defineNuxtConfig } from "nuxt3";

export default defineNuxtConfig({
  css: ["@/assets/styles/reset.css"],
  nitro: {
    preset: "server",
  },
});
