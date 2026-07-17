import type { App } from 'vue';
import Tree from './Tree';
import { TreeNode as VcTreeNode } from '../vc-tree';
import DirectoryTree from './DirectoryTree';
import { registerComponent } from '../_util/registerComponent';

export type { EventDataNode, DataNode } from '../vc-tree/interface';

export type {
  TreeProps,
  AntTreeNodeMouseEvent,
  AntTreeNodeExpandedEvent,
  AntTreeNodeCheckedEvent,
  AntTreeNodeSelectedEvent,
  AntTreeNodeDragEnterEvent,
  AntTreeNodeDropEvent,
  XyTreeNodeAttribute,
  TreeDataItem,
} from './Tree';

export type {
  ExpandAction as DirectoryTreeExpandAction,
  DirectoryTreeProps,
} from './DirectoryTree';

/* istanbul ignore next */

const TreeNode = VcTreeNode;

export { DirectoryTree, TreeNode };

export default Object.assign(Tree, {
  DirectoryTree,
  TreeNode,
  install: (app: App) => {
    registerComponent(app, Tree);
    registerComponent(app, TreeNode);
    registerComponent(app, DirectoryTree);
    return app;
  },
});
