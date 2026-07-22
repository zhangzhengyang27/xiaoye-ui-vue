/**
 * 多入口生成器
 * 扫描 src/ 下所有组件目录，生成 Vite 库模式所需的入口映射
 * 被 vite.config.mts 的 getEntries() 调用
 */
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, readdirSync, statSync } from 'node:fs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const srcDir = resolve(__dirname, '../src');

// 非组件目录，不作为多入口
// locale 由下方显式扫描处理；config 为内部工具模块，无需构建
const EXCLUDE_DIRS = ['_util', 'style', 'theme', 'version', 'locale', 'config'];

/**
 * 扫描 src/ 生成多入口映射
 * @returns {Record<string, string>} 入口名 → 绝对路径
 */
export function getEntries() {
  const entries = {};

  // 主入口
  const mainEntry = resolve(srcDir, 'index.ts');
  if (existsSync(mainEntry)) {
    entries['index'] = mainEntry;
  }

  // 组件入口
  const dirs = readdirSync(srcDir).filter(name => {
    if (name.startsWith('_') || name.startsWith('.') || name.startsWith('vc-')) return false;
    if (EXCLUDE_DIRS.includes(name)) return false;
    return statSync(resolve(srcDir, name)).isDirectory();
  });

  for (const dir of dirs) {
    // 主入口 index.ts / index.tsx
    for (const entry of ['index.ts', 'index.tsx']) {
      const entryPath = resolve(srcDir, dir, entry);
      if (existsSync(entryPath)) {
        entries[dir] = entryPath;
        break;
      }
    }

    // style 入口
    for (const entry of ['index.ts', 'index.tsx']) {
      const stylePath = resolve(srcDir, dir, 'style', entry);
      if (existsSync(stylePath)) {
        entries[`${dir}/style`] = stylePath;
        break;
      }
    }
  }

  // locale 入口：扫描 src/locale/ 下所有 .ts/.tsx 文件，生成 locale/<name> 入口
  const localeDir = resolve(srcDir, 'locale');
  if (existsSync(localeDir) && statSync(localeDir).isDirectory()) {
    const localeFiles = readdirSync(localeDir).filter(
      name => (name.endsWith('.ts') || name.endsWith('.tsx')) && !name.endsWith('.d.ts'),
    );
    for (const file of localeFiles) {
      const name = file.replace(/\.(ts|tsx)$/, '');
      entries[`locale/${name}`] = resolve(localeDir, file);
    }
  }

  return entries;
}

// CLI 直接运行时打印入口列表
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const entries = getEntries();
  const count = Object.keys(entries).length;
  console.log(`[source-entry] 共扫描到 ${count} 个入口:`);
  console.log(JSON.stringify(entries, null, 2));
}
