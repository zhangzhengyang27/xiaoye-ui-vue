import fs from 'fs-extra';
import path from 'path';
import { normalizeWorkspaceDependencies, resolvePath } from '../../../scripts/build-helper.mjs';

const { __dirname, __workspace } = resolvePath(import.meta.url);
const packageJsonPath = path.resolve(__dirname, '../package.json');
const pkg = fs.readJsonSync(packageJsonPath);
const publishManifest = structuredClone(pkg);

normalizeWorkspaceDependencies(publishManifest, __workspace);

const publishedDependencyFields = ['dependencies', 'peerDependencies', 'optionalDependencies'];
const serializedManifest = JSON.stringify(
  Object.fromEntries(publishedDependencyFields.map(field => [field, publishManifest[field] ?? {}])),
);

if (serializedManifest.includes('workspace:') || serializedManifest.includes('catalog:')) {
  throw new Error(
    '@xiaoye-ui/nuxt-module published dependencies contain workspace: or catalog: ranges.',
  );
}

const publishDir = pkg.publishConfig?.directory
  ? path.resolve(__dirname, '..', pkg.publishConfig.directory)
  : path.resolve(__dirname, '..');
const requiredEntries = [pkg.publishConfig?.main, pkg.publishConfig?.types].filter(Boolean);

for (const entry of requiredEntries) {
  const target = path.resolve(publishDir, entry);

  if (!fs.existsSync(target)) {
    throw new Error(`@xiaoye-ui/nuxt-module publish entry is missing: ${target}`);
  }
}
