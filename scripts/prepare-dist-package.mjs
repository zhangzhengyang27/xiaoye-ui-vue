/* eslint-disable no-console */
/**
 * 为 publishConfig.directory: dist 的包生成 dist/package.json
 * 1. 复制根 package.json
 * 2. 应用 publishConfig 中的 main/module/types/exports
 * 3. 把 src/ 路径的入口/导出转换为 dist/ 路径
 * 4. 子路径若无对应 dist 产物，则回退到根入口（保证可用）
 * 5. 替换 workspace:* 为具体版本
 * 6. 清理 scripts、devDependencies、publishConfig
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(__dirname, '..');

const pkgDir = process.argv[2] ? resolve(process.cwd(), process.argv[2]) : process.cwd();
const srcPkgPath = resolve(pkgDir, 'package.json');
const distPkgPath = resolve(pkgDir, 'dist', 'package.json');
const distDir = resolve(pkgDir, 'dist');

if (!existsSync(srcPkgPath)) {
  throw new Error(`package.json not found: ${srcPkgPath}`);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf-8'));
}

function writeJson(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

function getWorkspaceVersions() {
  const versions = new Map();
  const packagesDir = resolve(workspaceRoot, 'packages');
  if (!existsSync(packagesDir)) return versions;

  const entries = readdirSync(packagesDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const pkgPath = resolve(packagesDir, entry.name, 'package.json');
    if (!existsSync(pkgPath)) continue;
    const pkg = readJson(pkgPath);
    if (pkg.name && pkg.version) {
      versions.set(pkg.name, pkg.version);
    }
  }
  return versions;
}

function normalizeWorkspaceDependencies(deps, versions) {
  if (!deps) return;
  for (const [name, version] of Object.entries(deps)) {
    if (typeof version === 'string' && version.startsWith('workspace:')) {
      const localVersion = versions.get(name);
      if (localVersion) {
        const specifier = version.replace(/^workspace:/, '');
        if (!specifier || specifier === '*' || specifier === '^') {
          deps[name] = `^${localVersion}`;
        } else if (specifier === '~') {
          deps[name] = `~${localVersion}`;
        } else {
          deps[name] = specifier;
        }
      }
    }
  }
}

// 确定根产物扩展名
const defaultExt = existsSync(resolve(distDir, 'index.mjs'))
  ? 'mjs'
  : existsSync(resolve(distDir, 'index.js'))
    ? 'js'
    : 'js';
const rootImport = `./index.${defaultExt}`;
const rootTypes = './index.d.ts';

function srcToDist(srcPath, isTypes = false) {
  if (typeof srcPath !== 'string') return srcPath;
  const distPath = srcPath.replace(/^\.\/src\//, './');
  const target = isTypes
    ? distPath.replace(/\.(ts|tsx)$/, '.d.ts').replace(/\/index\.d\.ts$/, '/index.d.ts')
    : distPath
        .replace(/\.(ts|tsx)$/, `.${defaultExt}`)
        .replace(/\/index\.(ts|tsx)$/, `/index.${defaultExt}`);

  // 如果对应 dist 产物存在则使用，否则回退到根入口
  const absoluteTarget = resolve(distDir, target.replace(/^\.\//, ''));
  if (existsSync(absoluteTarget)) {
    return target;
  }
  return isTypes ? rootTypes : rootImport;
}

function transformExports(exportsObj) {
  if (!exportsObj) return undefined;
  const result = {};
  for (const [key, value] of Object.entries(exportsObj)) {
    if (key === './package.json') {
      result[key] = './package.json';
    } else if (typeof value === 'string') {
      result[key] = srcToDist(value);
    } else if (typeof value === 'object') {
      result[key] = {};
      for (const [cond, val] of Object.entries(value)) {
        const isTypes = cond === 'types' || cond === 'typings';
        result[key][cond] = typeof val === 'string' ? srcToDist(val, isTypes) : val;
      }
    } else {
      result[key] = value;
    }
  }
  return result;
}

const pkg = readJson(srcPkgPath);
const distPkg = { ...pkg };
const publishConfig = distPkg.publishConfig || {};

// 应用 publishConfig 入口
if (publishConfig.main) distPkg.main = publishConfig.main;
if (publishConfig.module) distPkg.module = publishConfig.module;
if (publishConfig.types) distPkg.types = publishConfig.types;

// 如果 publishConfig 指定了 exports，优先使用（避免与根入口不一致）
if (publishConfig.exports) {
  distPkg.exports = publishConfig.exports;
}

// 兜底入口：如果还没 main/module/types，或仍指向 src/，则指向 dist 根入口
function ensureDistEntry(field, fallback) {
  const val = distPkg[field];
  if (!val || (typeof val === 'string' && val.startsWith('./src/'))) {
    distPkg[field] = fallback;
  }
}
ensureDistEntry('main', rootImport);
ensureDistEntry('module', rootImport);
ensureDistEntry('types', rootTypes);

// 转换 exports：src/ -> dist/
if (distPkg.exports) {
  distPkg.exports = transformExports(distPkg.exports);
}

// 替换 workspace:*
const versions = getWorkspaceVersions();
normalizeWorkspaceDependencies(distPkg.dependencies, versions);
normalizeWorkspaceDependencies(distPkg.peerDependencies, versions);
normalizeWorkspaceDependencies(distPkg.optionalDependencies, versions);

// 清理字段：保留 publishConfig 中未应用的配置（如 access）
delete distPkg.scripts;
delete distPkg.devDependencies;
const cleanedPublishConfig = { ...publishConfig };
delete cleanedPublishConfig.directory;
delete cleanedPublishConfig.main;
delete cleanedPublishConfig.module;
delete cleanedPublishConfig.types;
delete cleanedPublishConfig.exports;
if (Object.keys(cleanedPublishConfig).length > 0) {
  distPkg.publishConfig = cleanedPublishConfig;
} else {
  delete distPkg.publishConfig;
}

writeJson(distPkgPath, distPkg);
console.log(`[prepare-dist-package] wrote ${distPkgPath}`);
