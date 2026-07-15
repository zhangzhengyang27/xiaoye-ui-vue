import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getEntries } from './scripts/source-entry.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// 读取 package.json，将 dependencies + peerDependencies 全部 external 化
const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'));
const externalDeps = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

// ESM-only 库模式构建配置
export default defineConfig({
  plugins: [vue(), vueJsx()],
  build: {
    lib: {
      entry: getEntries(),
      formats: ['es'],
    },
    rollupOptions: {
      external(source) {
        if (source === 'vue') return true;
        if (source.startsWith('@xiaoye-ui/')) return true;
        // 将 package.json 中声明的依赖（含子路径导入）全部 external 化
        for (const dep of externalDeps) {
          if (source === dep || source.startsWith(dep + '/')) return true;
        }
        return false;
      },
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].mjs',
        chunkFileNames: '[name].mjs',
        assetFileNames: '[name][extname]',
      },
    },
    cssCodeSplit: true,
    minify: false,
    sourcemap: false,
    emptyOutDir: true,
    outDir: 'dist',
  },
});
