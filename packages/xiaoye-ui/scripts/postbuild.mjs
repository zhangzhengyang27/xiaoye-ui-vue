/**
 * postbuild 脚本
 * 在 vite build 完成后执行：
 * 1. 复制 package.json 到 dist/ 目录
 * 2. applyPublishConfig：把 main/module/types/exports 从指向 src/ 重写为指向 dist/
 * 3. normalizeWorkspaceDependencies：把 workspace:* 转成 ^x.y.z
 * 4. 清理临时字段（scripts、devDependencies）
 */
import { readFileSync, writeFileSync, existsSync, copyFileSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(__dirname, '..');
const srcPkgPath = resolve(pkgRoot, 'package.json');
const distPkgPath = resolve(pkgRoot, 'dist', 'package.json');

/**
 * 读取 JSON
 */
function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf-8'));
}

/**
 * 写入 JSON
 */
function writeJson(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

/**
 * 生成发布期的 exports（指向 dist 产物）
 * 从开发期 exports 的 ./src/<name>/index.ts 转换为 ./<name>/index.mjs
 */
function generateDistExports(devExports) {
  const distExports = {};
  for (const [key, value] of Object.entries(devExports)) {
    if (key === '.' || key === './package.json') {
      distExports[key] = key === '.' ? './index.mjs' : './package.json';
      continue;
    }
    // ./button → ./button/index.mjs（从 ./src/button/index.ts 转换）
    if (typeof value === 'string' && value.startsWith('./src/')) {
      // ./src/button/index.ts → ./button/index.mjs
      const distPath = value
        .replace(/^\.\/src\//, './')
        .replace(/\/index\.(ts|tsx)$/, '/index.mjs');
      distExports[key] = distPath;
    } else if (typeof value === 'object') {
      // 处理条件导出对象
      distExports[key] = {};
      for (const [cond, val] of Object.entries(value)) {
        if (typeof val === 'string' && val.startsWith('./src/')) {
          distExports[key][cond] = val
            .replace(/^\.\/src\//, './')
            .replace(/\/index\.(ts|tsx)$/, '/index.mjs');
        } else {
          distExports[key][cond] = val;
        }
      }
    } else {
      distExports[key] = value;
    }
  }
  return distExports;
}

// === 主流程 ===
console.log('[postbuild] 开始处理发布期 package.json...');

// 1. 复制 package.json 到 dist/
if (!existsSync(distPkgPath)) {
  copyFileSync(srcPkgPath, distPkgPath);
  console.log('[postbuild] 已复制 package.json 到 dist/');
}

// 2. 读取并转换
const pkg = readJson(distPkgPath);

// 应用 publishConfig
const { publishConfig } = pkg;
if (publishConfig) {
  if (publishConfig.main) pkg.main = publishConfig.main;
  if (publishConfig.module) pkg.module = publishConfig.module;
  if (publishConfig.types) pkg.types = publishConfig.types;
  if (publishConfig.exports) {
    // 使用 publishConfig.exports 作为基础，但需要动态生成
    pkg.exports = generateDistExports(pkg.exports || {});
  }
  console.log('[postbuild] 已应用 publishConfig');
}

// 规范化 workspace 依赖
const normalize = deps => {
  if (!deps) return deps;
  const result = {};
  for (const [name, version] of Object.entries(deps)) {
    if (version === 'workspace:*') {
      // 从源 package.json 对应的 workspace 包读取版本
      const depPkgPath = resolve(pkgRoot, '..', name.replace('@xiaoye-ui/', ''), 'package.json');
      if (existsSync(depPkgPath)) {
        const depPkg = readJson(depPkgPath);
        result[name] = `^${depPkg.version}`;
      } else {
        result[name] = version;
      }
    } else {
      result[name] = version;
    }
  }
  return result;
};
if (pkg.dependencies) pkg.dependencies = normalize(pkg.dependencies);
if (pkg.peerDependencies) pkg.peerDependencies = normalize(pkg.peerDependencies);
console.log('[postbuild] 已规范化 workspace 依赖');

// 清理临时字段
delete pkg.scripts;
delete pkg.devDependencies;
delete pkg.publishConfig;
console.log('[postbuild] 已清理临时字段');

// 3. 写入 dist/package.json
writeJson(distPkgPath, pkg);
console.log('[postbuild] 完成');
