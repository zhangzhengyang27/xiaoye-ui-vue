import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// 与 package.json exports 子路径对齐
const entries = {
  index: resolve(__dirname, 'src/index.ts'),
  'utils/index': resolve(__dirname, 'src/utils/index.ts'),
  'composables/index': resolve(__dirname, 'src/composables/index.ts'),
  'api/index': resolve(__dirname, 'src/api/index.ts'),
  'config/index': resolve(__dirname, 'src/config/index.ts'),
};

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    dts({
      entryRoot: 'src',
      outDir: 'dist',
      tsconfigPath: './tsconfig.json',
    }),
  ],
  build: {
    lib: {
      entry: entries,
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', /^@xiaoye-ui\//],
      output: {
        entryFileNames: '[name].mjs',
        chunkFileNames: '[name].mjs',
        assetFileNames: '[name][extname]',
      },
    },
    minify: false,
    sourcemap: false,
    emptyOutDir: true,
    outDir: 'dist',
  },
});
