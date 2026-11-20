import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import vue from "@astrojs/vue"
import stylex from "@stylexjs/unplugin"

export default defineConfig({
  integrations: [react(), vue()],
  vite: {
    plugins: [stylex.rollup()],
  },
})
