import type { CSSObject } from '../../_util/cssinjs';
import { genComponentStyleHook } from '../../theme/internal';
import genCardLikeStyle from '../../_shared/style/genCardLikeStyle';

export interface ComponentToken {}

// 修复源项目 bug：
// 1) 去掉第三参数 'xy-panel'，让 genComponentStyleHook('Panel') 自动推导 componentCls = '.xy-panel'
// 2) genCardLikeStyle 现在返回带点 key（'.xy-panel'），与 componentCls 一致，cardLike[componentCls] 能取到值
export default genComponentStyleHook('Panel', token => {
  const { componentCls, colorTextSecondary, colorText } = token;
  const cardLike = genCardLikeStyle('xy-panel', token);
  const panelRoot = (cardLike[componentCls] || {}) as CSSObject;

  return {
    [componentCls]: {
      ...panelRoot,

      '&-toggle-button': {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        color: colorTextSecondary,
        fontSize: 'inherit',
        lineHeight: 1,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        outline: 'none',
        transition: 'color 0.2s',

        '&:hover': {
          color: colorText,
        },

        '&:focus-visible': {
          color: colorText,
        },
      },

      '&-toggle-icon': {
        width: '1em',
        height: '1em',
        transition: 'transform 0.3s',

        '&-collapsed': {
          transform: 'rotate(-90deg)',
        },
      },
    },
  } as CSSObject;
});
