/**
 * postbuild 脚本
 * 在 vite build 完成后执行：
 * 1. 复制 package.json 到 dist/ 目录
 * 2. applyPublishConfig：把 main/module/types/exports 从指向 src/ 重写为指向 dist/
 * 3. normalizeWorkspaceDependencies：把 workspace:* 转成 ^x.y.z
 * 4. 清理临时字段（scripts、devDependencies）
 */
import {
  readFileSync,
  writeFileSync,
  existsSync,
  copyFileSync,
  rmSync,
  readdirSync,
} from 'node:fs';
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
 * - types 条件：./src/<name>/index.ts → ./<name>/index.d.ts
 * - import 条件：./src/<name>/index.ts → ./<name>/index.mjs
 * - style 副作用入口：./src/<name>/style/index.ts → ./<name>/style/index.mjs
 */
function generateDistExports(devExports) {
  const distExports = {};
  for (const [key, value] of Object.entries(devExports)) {
    if (key === './package.json') {
      distExports[key] = './package.json';
      continue;
    }
    if (key === '.') {
      // 根入口强制带 types + import
      const rootVal = typeof value === 'object' ? value : {};
      distExports[key] = {
        types: rootVal.types ? srcToDistTypes(rootVal.types) : './index.d.ts',
        import: rootVal.import ? srcToDistImport(rootVal.import) : './index.mjs',
      };
      continue;
    }
    if (typeof value === 'string' && value.startsWith('./src/')) {
      // style 等副作用入口：直接转 .mjs
      distExports[key] = srcToDistImport(value);
    } else if (typeof value === 'object') {
      // 条件导出对象：types 生成 .d.ts，其他生成 .mjs
      distExports[key] = {};
      for (const [cond, val] of Object.entries(value)) {
        if (typeof val !== 'string' || !val.startsWith('./src/')) {
          distExports[key][cond] = val;
          continue;
        }
        if (cond === 'types' || cond === 'typings') {
          distExports[key][cond] = srcToDistTypes(val);
        } else {
          distExports[key][cond] = srcToDistImport(val);
        }
      }
    } else {
      distExports[key] = value;
    }
  }
  return distExports;
}

/**
 * 将源码路径转换为 dist 产物路径（import 条件）
 *
 * Vite lib 模式 + preserveModules 下：
 * - 入口文件 src/<name>/index.ts → dist/<name>.mjs（用入口 key 命名，去掉 /index）
 * - style 入口 src/<name>/style/index.ts → dist/<name>/style.mjs
 * - 根入口 src/index.ts → dist/index.mjs
 *
 * 注意：与 srcToDistTypes 不同！vite-plugin-dts 生成的 .d.ts 保留目录结构
 * （dist/<name>/index.d.ts），但 Vite 构建的 .mjs 入口文件不保留 /index。
 */
function srcToDistImport(srcPath) {
  return srcPath
    .replace(/^\.\/src\//, './')
    .replace(/^\.\/index\.(ts|tsx)$/, './index.mjs') // 根入口：./index.ts → ./index.mjs
    .replace(/\/index\.(ts|tsx)$/, '.mjs') // 子入口：/<name>/index.ts → /<name>.mjs
    .replace(/\.(ts|tsx)$/, '.mjs'); // 非入口文件：.ts → .mjs
}

/**
 * ./src/<name>/index.ts → ./<name>/index.d.ts
 */
function srcToDistTypes(srcPath) {
  return srcPath
    .replace(/^\.\/src\//, './')
    .replace(/\.(ts|tsx)$/, '.d.ts')
    .replace(/\/index\.d\.ts$/, '/index.d.ts');
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
// 删除 files 字段：源 package.json 的 files: ["dist"] 用于开发期，
// 但发布时 publishConfig.directory 已指向 dist，dist/package.json 中不应再保留 files，
// 否则 npm 会在 dist 目录内查找 dist 子目录，导致发布空包
delete pkg.files;
console.log('[postbuild] 已清理临时字段');

// 3. 写入 dist/package.json
writeJson(distPkgPath, pkg);
console.log('[postbuild] 完成');

// 清理 declarationMap 文件（.d.ts.map）
// 这些文件由 tsconfig.declarationMap:true 生成，用于本地调试
// 但发布后 sources 指向 src/ 路径会失效，且增加包体积，故发布前删除
function cleanDeclarationMaps(dir) {
  if (!existsSync(dir)) return 0;
  let count = 0;
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      count += cleanDeclarationMaps(fullPath);
    } else if (entry.name.endsWith('.d.ts.map')) {
      rmSync(fullPath);
      count++;
    }
  }
  return count;
}

const distDir = resolve(pkgRoot, 'dist');
const removedMaps = cleanDeclarationMaps(distDir);
if (removedMaps > 0) {
  console.log(`[postbuild] removed ${removedMaps} declaration map files (*.d.ts.map)`);
}
