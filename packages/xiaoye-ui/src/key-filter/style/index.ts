import type { CSSObject } from '../../_util/cssinjs';
import type { FullToken } from '../../theme/internal';
import { genComponentStyleHook } from '../../theme/internal';

export interface ComponentToken {}

export interface KeyFilterToken extends FullToken<'KeyFilter'> {}

const genKeyFilterStyle = (token: KeyFilterToken): CSSObject => {
  const { componentCls } = token;
  return {
    // wrapper 组件使用 display: contents 避免引入额外布局层
    [componentCls]: {
      display: 'contents',
    },
    // 源项目保留 data-xy-keyfilter 标记样式（空规则，仅作标识）
    '[data-xy-keyfilter]': {},
  } as CSSObject;
};

export default genComponentStyleHook('KeyFilter', token => [
  genKeyFilterStyle(token as KeyFilterToken),
]);
