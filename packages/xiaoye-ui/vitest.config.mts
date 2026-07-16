import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { resolve } from 'path';
import { existsSync, readFileSync } from 'node:fs';

export default defineConfig({
  plugins: [
    vue({
      script: {
        fs: {
          fileExists(file) {
            return existsSync(file);
          },
          readFile(file) {
            try {
              return existsSync(file) ? readFileSync(file, 'utf-8') : undefined;
            } catch {
              return undefined;
            }
          },
        },
      },
    }),
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
    ],
    exclude: [],
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
