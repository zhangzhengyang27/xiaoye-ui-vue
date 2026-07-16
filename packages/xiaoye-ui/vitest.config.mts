import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    {
      name: 'ignore-vue-docs-block',
      enforce: 'pre',
      load(id) {
        if (/\.vue\?vue&type=docs/.test(id)) {
          return 'export default {}';
        }
      },
    },
    vue(),
    vueJsx({
      include: [/\.test\.[jt]sx?$/, /\.jsx?$/, /\.tsx?$/],
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: [
      'tests/**/*.test.{js,ts,jsx,tsx}',
      'src/**/*.test.{js,ts,jsx,tsx}',
      'src/**/__tests__/*.{js,ts,jsx,tsx}',
    ],
    exclude: [
      'src/upload/__tests__/mock.js',
      'src/upload/__tests__/requests.js',
      'src/**/__tests__/utils.js',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules', 'tests', 'dist', '**/*.d.ts', '**/*.config.*', '**/virtual:*'],
    },
  },
  resolve: {
    alias: {
      'xiaoye-ui': resolve(__dirname, './src'),
      'xiaoye-ui/es': resolve(__dirname, './src'),
    },
  },
});
