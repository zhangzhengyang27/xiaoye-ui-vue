import type { CSSObject } from '../../../_util/cssinjs';
import genComponentStyleHook from '../../../theme/util/genComponentStyleHook';

export interface ComponentToken {}

// ColumnGroup 为逻辑列分组组件（无独立 DOM 样式），保留 style 子路径导出占位。
export default genComponentStyleHook(
  'DataTableColumnGroup',
  () => {
    return {} as CSSObject;
  },
  'xy-columngroup',
);
