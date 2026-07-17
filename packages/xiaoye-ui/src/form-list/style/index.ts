import type { CSSObject } from '../../_util/cssinjs';
import { genComponentStyleHook } from '../../theme/internal';

export interface ComponentToken {}

// FormList 仅渲染 slot，无根元素；保留 style 入口以对齐导出链路（被消费时可 import 该样式）。
export default genComponentStyleHook('FormList', token => {
  const { componentCls } = token;
  return {
    [componentCls]: {
      display: 'block',
    },
  } as CSSObject;
});
