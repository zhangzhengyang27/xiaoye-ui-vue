import type { CSSObject } from '../../_util/cssinjs';
import { genComponentStyleHook } from '../../theme/internal';

export interface ComponentToken {}

// Chart 仅作为 chart.js 的容器，样式最小化
export default genComponentStyleHook('Chart', token => {
  const { componentCls, borderRadius } = token;
  return {
    [componentCls]: {
      position: 'relative',
      display: 'block',
      background: 'transparent',
      borderRadius: `${borderRadius}px`,
      padding: 0,
    },
    [`${componentCls}-canvas`]: {
      display: 'block',
      maxWidth: '100%',
    },
  } as CSSObject;
});
