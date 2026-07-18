import type { App, Plugin } from 'vue';
import DirectoryTree from './DirectoryTree';
import { registerComponent } from '../_util/registerComponent';

// 仅导出 directory-tree 独有的命名导出，避免与 tree 模块的 DirectoryTreeProps 等类型在
// components.ts 的 export * 聚合时产生同名歧义（DirectoryTreeProps 类型请从 'xiaoye-ui' 获取）。
export { directoryTreeProps } from './directoryTreeTypes';
export type { ExpandAction } from './directoryTreeTypes';

/* istanbul ignore next */
DirectoryTree.install = function (app: App) {
  registerComponent(app, DirectoryTree);
  return app;
};

export default DirectoryTree as typeof DirectoryTree & Plugin;
