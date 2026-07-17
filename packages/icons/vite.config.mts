import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { resolve } from 'node:path';
import { readdirSync, statSync } from 'node:fs';

const srcDir = resolve(process.cwd(), 'src');

// 扫描所有图标目录，生成多入口映射
function getEntries() {
  const entries: Record<string, string> = {};

  // 主入口
  entries['index'] = resolve(srcDir, 'index.js');

  // 每个图标目录
  const dirs = readdirSync(srcDir).filter(name => {
    if (name.startsWith('.') || name.startsWith('_')) return false;
    return statSync(resolve(srcDir, name)).isDirectory();
  });

  for (const dir of dirs) {
    // 查找目录下的 .vue 文件作为入口
    const vueFiles = readdirSync(resolve(srcDir, dir)).filter(
      f => f.endsWith('.vue') && f !== 'BaseIcon.vue',
    );
    if (vueFiles.length > 0) {
      entries[dir] = resolve(srcDir, dir, vueFiles[0]);
    }
  }

  return entries;
}

export default defineConfig({
  plugins: [vue(), vueJsx()],
  build: {
    lib: {
      entry: getEntries(),
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', /^@xiaoye-ui\//],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
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
