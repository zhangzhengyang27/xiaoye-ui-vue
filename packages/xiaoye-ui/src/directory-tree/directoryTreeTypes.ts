import type { ExtractPropTypes } from 'vue';
import { treeProps } from '../tree/Tree';
import { someType } from '../_util/type';

// 目录树展开触发动作：false 不响应 / 'click' 单击 / 'dblclick'|'doubleclick' 双击
export type ExpandAction = false | 'click' | 'doubleclick' | 'dblclick';

export const directoryTreeProps = () => ({
  ...treeProps(),
  expandAction: someType<ExpandAction>([Boolean, String]),
});

export type DirectoryTreeProps = Partial<ExtractPropTypes<ReturnType<typeof directoryTreeProps>>>;
