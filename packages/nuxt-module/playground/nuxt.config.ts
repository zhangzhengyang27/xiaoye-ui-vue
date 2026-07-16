import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  compatibilityDate: '2025-02-27',
  devtools: { enabled: true },
  modules: ['../src/module'],
  xiaoyeUi: {
    useXiaoyeUI: true,
    options: {
      // inputStyle etc.
    },
    components: {
      prefix: '',
      include: '*',
      exclude: undefined,
    },
    directives: {
      prefix: '',
      include: undefined,
      exclude: '*',
    },
    composables: {
      include: undefined,
      exclude: undefined,
    },
  },
});
