import type { Theme } from 'slidev/types'

export const theme: Theme = {
  name: 'clean-corp',
  layouts: {
    default: './layouts/two-cols.vue',
    cover: 'cover',
    full: './layouts/full-image.vue',
  },
  css: './styles.css',
}
