import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devServer: {
    port: 3000
  },
  typescript: {
    strict: true
  },
  runtimeConfig: {
    OPENAI_API_KEY: process.env.NITRO_OPENAI_API_KEY,
    public: {
      OPENAI_API_KEY: process.env.NITRO_OPENAI_API_KEY
    }
  }
})
