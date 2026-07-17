import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  declaration: 'node16',
  outDir: 'dist',
  failOnWarn: false,
  entries: [
    'src/module',
    {
      input: 'src/runtime/',
      outDir: 'dist/runtime',
      addRelativeDeclarationExtensions: true,
      ext: 'js',
      pattern: [
        '**',
        '!**/*.stories.{js,cts,mts,ts,jsx,tsx}',
        '!**/*.{spec,test}.{js,cts,mts,ts,jsx,tsx}',
      ],
      esbuild: {
        jsxImportSource: 'vue',
        jsx: 'automatic',
        jsxFactory: 'h',
      },
    },
  ],
  rollup: {
    esbuild: {
      target: 'esnext',
    },
    emitCJS: false,
    cjsBridge: false,
  },
  externals: [
    /dist[\\/]runtime[\\/]/,
    '@nuxt/schema',
    '@nuxt/schema-nightly',
    '@nuxt/schema-edge',
    '@nuxt/kit',
    '@nuxt/kit-nightly',
    '@nuxt/kit-edge',
    '#app',
    '#app/nuxt',
    'nuxt',
    'nuxt-nightly',
    'nuxt-edge',
    'nuxt3',
    'vue',
    'vue-demi',
  ],
});
