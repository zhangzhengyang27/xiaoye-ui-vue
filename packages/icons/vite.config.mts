import { defineConfig, type Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const srcDir = resolve(__dirname, 'src');
const distDir = resolve(__dirname, 'dist');

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

// 复制每个图标目录下手工编写的 .d.ts，并为每个目录生成 package.json
// 让子路径导入（@xiaoye-ui/icons/align-center）能解析到类型与产物
function copyIconDeclarations(): Plugin {
  return {
    name: 'copy-icon-declarations',
    apply: 'build',
    closeBundle() {
      const items = readdirSync(srcDir);
      for (const name of items) {
        if (name.startsWith('.') || name.startsWith('_')) continue;
        const srcItemDir = resolve(srcDir, name);
        if (!statSync(srcItemDir).isDirectory()) continue;

        const files = readdirSync(srcItemDir);
        const dtsFiles = files.filter(f => f.endsWith('.d.ts'));
        const vueFiles = files.filter(f => f.endsWith('.vue'));

        // 复制 .d.ts（保留目录结构）
        for (const dts of dtsFiles) {
          const srcPath = resolve(srcItemDir, dts);
          const destPath = resolve(distDir, name, dts);
          mkdirSync(resolve(distDir, name), { recursive: true });
          copyFileSync(srcPath, destPath);
        }

        // 为有 .vue 的目录生成 package.json，指向 .vue.mjs 与 .d.ts
        if (vueFiles.length > 0) {
          const baseName = vueFiles[0].replace(/\.vue$/, '');
          const pkgJson = {
            main: `./${baseName}.vue.mjs`,
            module: `./${baseName}.vue.mjs`,
            types: `./${baseName}.d.ts`,
            sideEffects: ['*.vue'],
          };
          const destPkgPath = resolve(distDir, name, 'package.json');
          writeFileSync(destPkgPath, JSON.stringify(pkgJson, null, 2) + '\n', 'utf-8');

          // 清理 rollup preserveModules 模式下生成的重名冲突文件（如 BaseIcon2.vue.mjs）
          // 这些文件仅 re-export 原始 .vue.mjs，多余且易混淆
          const destDir = resolve(distDir, name);
          if (existsSync(destDir)) {
            const distFiles = readdirSync(destDir);
            for (const f of distFiles) {
              if (/^\w+2\.vue\.mjs$/.test(f) && f !== `${baseName}.vue.mjs`) {
                rmSync(resolve(destDir, f));
              }
            }
          }
        }

        // 复制子目录（如 baseicon/style/），保留其 package.json 与入口文件
        const subDirs = files.filter(f => {
          const fp = resolve(srcItemDir, f);
          return statSync(fp).isDirectory();
        });
        for (const sub of subDirs) {
          const srcSubDir = resolve(srcItemDir, sub);
          const destSubDir = resolve(distDir, name, sub);
          mkdirSync(destSubDir, { recursive: true });
          const subFiles = readdirSync(srcSubDir);
          for (const sf of subFiles) {
            const sfPath = resolve(srcSubDir, sf);
            if (statSync(sfPath).isFile()) {
              // .less/.css/.js 等资源文件复制到 dist；.ts 由 vite 处理（已生成 .mjs）
              if (!sf.endsWith('.ts')) {
                copyFileSync(sfPath, resolve(destSubDir, sf));
              }
            }
          }
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    dts({
      entryRoot: 'src',
      outDir: 'dist',
      tsconfigPath: './tsconfig.json',
    }),
    copyIconDeclarations(),
  ],
  build: {
    lib: {
      entry: getEntries(),
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', /^@xiaoye-ui\//, '@ant-design/icons-vue'],
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
