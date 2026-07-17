import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

export function resolvePath(metaUrl) {
  const __dirname = path.dirname(fileURLToPath(metaUrl || import.meta.url));
  const __workspace = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../');
  const { INPUT_DIR, OUTPUT_DIR } = process.env;
  const INPUT_PATH = path.resolve(__dirname, process.env.INPUT_DIR);
  const OUTPUT_PATH = path.resolve(__dirname, process.env.OUTPUT_DIR);

  return {
    __dirname,
    __workspace,
    INPUT_DIR,
    OUTPUT_DIR,
    INPUT_PATH,
    OUTPUT_PATH,
  };
}

export function removeBuild(metaUrl) {
  const { OUTPUT_DIR } = resolvePath(metaUrl);

  fs.remove(OUTPUT_DIR);
}

export function updatePackageJson(localPackageJson) {
  const { __workspace } = resolvePath();
  const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(__workspace, './package.json'), { encoding: 'utf8', flag: 'r' }),
  );
  const pkg = JSON.parse(fs.readFileSync(localPackageJson, { encoding: 'utf8', flag: 'r' }));

  pkg.version = packageJson.version;
  pkg.author = packageJson.author;
  pkg.homepage = packageJson.homepage;
  pkg.license = packageJson.license;
  pkg.repository = { ...pkg.repository, ...packageJson.repository };
  pkg.bugs = { ...pkg.bugs, ...packageJson.bugs };
  pkg.engines = { ...pkg.engines, ...packageJson.engines };

  fs.writeFileSync(localPackageJson, JSON.stringify(pkg, null, 4) + '\n', { encoding: 'utf8' });
}

export function clearPackageJson(localPackageJson) {
  const { __workspace } = resolvePath();
  const pkg = JSON.parse(fs.readFileSync(localPackageJson, { encoding: 'utf8', flag: 'r' }));

  applyPublishConfig(pkg);
  normalizeWorkspaceDependencies(pkg, __workspace);

  delete pkg?.scripts;
  delete pkg?.devDependencies;
  delete pkg?.publishConfig?.directory;
  delete pkg?.publishConfig?.linkDirectory;

  fs.writeFileSync(localPackageJson, JSON.stringify(pkg, null, 4) + '\n', { encoding: 'utf8' });
}

export function normalizeWorkspaceDependencies(pkg, workspaceRoot) {
  const workspaceVersions = getWorkspacePackageVersions(workspaceRoot);
  const dependencyFields = [
    'dependencies',
    'peerDependencies',
    'optionalDependencies',
    'devDependencies',
  ];

  dependencyFields.forEach(field => {
    const dependencies = pkg[field];

    if (!dependencies) return;

    Object.entries(dependencies).forEach(([name, version]) => {
      if (typeof version !== 'string' || !version.startsWith('workspace:')) return;

      const localVersion = workspaceVersions.get(name);

      if (!localVersion) return;

      dependencies[name] = resolveWorkspaceRange(version, localVersion);
    });
  });
}

function applyPublishConfig(pkg) {
  const publishConfig = pkg.publishConfig;

  if (!publishConfig) return;

  ['main', 'module', 'types', 'exports'].forEach(key => {
    if (publishConfig[key] !== undefined) {
      pkg[key] = publishConfig[key];
    }
  });
}

function resolveWorkspaceRange(range, version) {
  const specifier = range.replace(/^workspace:/, '');

  if (!specifier || specifier === '*' || specifier === '^') {
    return `^${version}`;
  }

  if (specifier === '~') {
    return `~${version}`;
  }

  return specifier;
}

function getWorkspacePackageVersions(workspaceRoot) {
  const packagesRoot = path.resolve(workspaceRoot, 'packages');
  const versions = new Map();

  if (!fs.existsSync(packagesRoot)) return versions;

  fs.readdirSync(packagesRoot, { withFileTypes: true }).forEach(entry => {
    if (!entry.isDirectory()) return;

    const packageJsonPath = path.resolve(packagesRoot, entry.name, 'package.json');

    if (!fs.existsSync(packageJsonPath)) return;

    const workspacePkg = JSON.parse(
      fs.readFileSync(packageJsonPath, { encoding: 'utf8', flag: 'r' }),
    );

    if (workspacePkg.name && workspacePkg.version) {
      versions.set(workspacePkg.name, workspacePkg.version);
    }
  });

  return versions;
}

export function copyDependencies(inFolder, outFolder, subFolder) {
  fs.readdirSync(inFolder, { withFileTypes: true }).forEach(entry => {
    const fileName = entry.name;
    const sourcePath = path.join(inFolder, fileName);
    const destPath = path.join(outFolder, fileName);

    if (entry.isDirectory()) {
      copyDependencies(sourcePath, destPath, subFolder);
    } else {
      if (fileName.endsWith('d.ts') || fileName.endsWith('.vue')) {
        if (subFolder && sourcePath.includes(subFolder)) {
          const subDestPath = path.join(outFolder, fileName.replace(subFolder, ''));

          fs.ensureDirSync(path.dirname(subDestPath));
          fs.copyFileSync(sourcePath, subDestPath);
        } else {
          fs.ensureDirSync(path.dirname(destPath));
          fs.copyFileSync(sourcePath, destPath);
        }
      }
    }
  });
}

export async function renameDTSFile(dir, newName, resolver) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await renameDTSFile(fullPath, newName);
    } else if (entry.name.endsWith('.d.ts') && (resolver?.(entry.name, dir) ?? true)) {
      const newFullPath = path.join(dir, `${newName}.d.ts`);

      await fs.rename(fullPath, newFullPath);
    }
  }
}
