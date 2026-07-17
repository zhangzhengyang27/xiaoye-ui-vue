import type { CSSObject } from '../../_util/cssinjs';
import { genComponentStyleHook } from '../../theme/internal';

// 组件专属 Token（占位，后续按需扩展）
export interface ComponentToken {}

// Portal 不需要默认样式，仅占位以保持与其他组件一致的样式 hook 调用
export default genComponentStyleHook('Portal', () => {
  return {} as CSSObject;
});
