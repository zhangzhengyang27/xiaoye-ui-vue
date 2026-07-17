import type { App, Plugin } from 'vue';
import TreeTable from './TreeTable';
import { registerComponent } from '../_util/registerComponent';

export { treeTableProps } from './treeTableTypes';
export type {
  TreeTableProps,
  TreeTableSelectionMode,
  TreeTablePaginationPosition,
  TreeTableLoadingMode,
  TreeTableSortMode,
  TreeTableFilterMode,
  TreeTableColumnResizeMode,
  TreeTableSize,
  TreeTableFilterMetaData,
  TreeTableOperatorFilterMetaData,
  TreeTableFilterMeta,
  TreeTableSortMeta,
  TreeTableExpandedKeys,
  TreeTableSelectionKeys,
  TreeTableSortEvent,
  TreeTablePageEvent,
  TreeTableFilterEvent,
  TreeTableRowContextMenuEvent,
} from './treeTableTypes';

/* istanbul ignore next */
TreeTable.install = function (app: App) {
  registerComponent(app, TreeTable);
  return app;
};

export default TreeTable as typeof TreeTable & Plugin;
