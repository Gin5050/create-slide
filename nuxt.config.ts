import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devServer: {
    port: 3000
  },
  typescript: {
    strict: true
  },
  runtimeConfig: {
    OPENAI_API_KEY: '',
  }
})
