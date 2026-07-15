/**
 * 共享构建工具
 * 参考 xiaoye-ui-vue 项目的 scripts/build-helper.mjs
 */
import {
  readFileSync,
  writeFileSync,
  existsSync,
  rmSync,
  mkdirSync,
  copyFileSync,
  readdirSync,
  statSync,
} from 'node:fs';
import { resolve, dirname, basename, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const projectRoot = resolve(__dirname, '..');

/**
 * 解析项目根目录下的路径
 */
export function resolvePath(...paths) {
  return resolve(projectRoot, ...paths);
}

/**
 * 读取 JSON 文件
 */
export function readJson(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

/**
 * 写入 JSON 文件
 */
export function writeJson(filePath, data) {
  const content = JSON.stringify(data, null, 2) + '\n';
  writeFileSync(filePath, content, 'utf-8');
}

/**
 * 删除构建产物目录
 */
export function removeBuild(buildDir) {
  const target = resolvePath(buildDir);
  if (existsSync(target)) {
    rmSync(target, { recursive: true, force: true });
    console.log(`[build-helper] 已删除 ${buildDir}`);
  }
}

/**
 * 更新 package.json
 */
export function updatePackageJson(pkgPath, updater) {
  const pkg = readJson(pkgPath);
  const result = updater(pkg);
  writeJson(pkgPath, result || pkg);
}

/**
 * 清理 package.json 中的临时字段
 */
export function clearPackageJson(pkgPath) {
  updatePackageJson(pkgPath, pkg => {
    delete pkg.scripts;
    delete pkg.devDependencies;
    return pkg;
  });
}

/**
 * 将 workspace:* 协议转换为 ^x.y.z
 */
export function normalizeWorkspaceDependencies(pkgPath) {
  updatePackageJson(pkgPath, pkg => {
    const normalize = deps => {
      if (!deps) return deps;
      const result = {};
      for (const [name, version] of Object.entries(deps)) {
        if (version === 'workspace:*') {
          // 从对应 workspace 包的 package.json 读取版本
          const depPkgPath = resolvePath(
            'packages',
            name.replace('@xiaoye-ui/', ''),
            'package.json',
          );
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
    return pkg;
  });
}

/**
 * 应用 publishConfig：将开发期指向 src 的入口重写为发布期指向 dist
 */
export function applyPublishConfig(pkgPath) {
  updatePackageJson(pkgPath, pkg => {
    const { publishConfig } = pkg;
    if (!publishConfig) return pkg;

    if (publishConfig.main) pkg.main = publishConfig.main;
    if (publishConfig.module) pkg.module = publishConfig.module;
    if (publishConfig.types) pkg.types = publishConfig.types;
    if (publishConfig.exports) pkg.exports = publishConfig.exports;

    return pkg;
  });
}

/**
 * 复制依赖项
 */
export function copyDependencies(from, to) {
  const fromPkg = readJson(resolvePath(from, 'package.json'));
  updatePackageJson(resolvePath(to, 'package.json'), pkg => {
    pkg.dependencies = fromPkg.dependencies;
    pkg.peerDependencies = fromPkg.peerDependencies;
    return pkg;
  });
}

/**
 * 重命名 .d.ts 文件
 */
export function renameDTSFile(dir, from, to) {
  const fromPath = resolvePath(dir, from);
  const toPath = resolvePath(dir, to);
  if (existsSync(fromPath)) {
    copyFileSync(fromPath, toPath);
    rmSync(fromPath);
    console.log(`[build-helper] 重命名 ${from} -> ${to}`);
  }
}

/**
 * 递归复制目录
 */
export function copyDir(src, dest) {
  if (!existsSync(src)) return;
  mkdirSync(dest, { recursive: true });
  const entries = readdirSync(src);
  for (const entry of entries) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    if (statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * 扫描组件目录生成入口映射
 */
export function scanComponentEntries(
  srcDir,
  excludeDirs = [
    '_util',
    'style',
    'theme',
    'locale',
    'locale-provider',
    'config-provider',
    'version',
  ],
) {
  const entries = {};
  const componentsRoot = resolvePath(srcDir);

  if (!existsSync(componentsRoot)) return entries;

  const dirs = readdirSync(componentsRoot).filter(name => {
    if (name.startsWith('_') || name.startsWith('.')) return false;
    if (name.startsWith('vc-')) return false;
    if (excludeDirs.includes(name)) return false;
    return statSync(join(componentsRoot, name)).isDirectory();
  });

  for (const dir of dirs) {
    // 主入口
    const possibleEntries = ['index.ts', 'index.tsx', `${dir}.ts`, `${dir}.tsx`];
    for (const entry of possibleEntries) {
      const entryPath = join(componentsRoot, dir, entry);
      if (existsSync(entryPath)) {
        entries[dir] = entryPath;
        break;
      }
    }

    // style 入口
    const styleEntry = join(componentsRoot, dir, 'style', 'index.ts');
    const styleEntryTsx = join(componentsRoot, dir, 'style', 'index.tsx');
    if (existsSync(styleEntry)) {
      entries[`${dir}/style`] = styleEntry;
    } else if (existsSync(styleEntryTsx)) {
      entries[`${dir}/style`] = styleEntryTsx;
    }
  }

  return entries;
}
