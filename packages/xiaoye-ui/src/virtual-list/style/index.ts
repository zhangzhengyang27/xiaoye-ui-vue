import type { CSSObject } from '../../_util/cssinjs';
import { genComponentStyleHook } from '../../theme/internal';

// 组件专属 Token（占位，可按需扩展）
export interface ComponentToken {}

export default genComponentStyleHook('VirtualList', token => {
  const { componentCls, colorBgContainer, colorTextSecondary, fontSizeLG } = token;
  const maskBg = `color-mix(in srgb, ${colorBgContainer} 80%, transparent)`;
  return {
    [componentCls]: {
      position: 'relative',
      overflow: 'auto',
      contain: 'strict',
      transform: 'translateZ(0)',
      willChange: 'scroll-position',
      outline: '0 none',
      '&-content': {
        position: 'absolute',
        top: 0,
        left: 0,
        minHeight: '100%',
        minWidth: '100%',
        willChange: 'transform',
        '&-loading': {
          transform: 'none !important',
          minHeight: 0,
          position: 'sticky',
          insetBlockStart: 0,
          insetInlineStart: 0,
        },
      },
      '&-spacer': {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '1px',
        width: '1px',
        transformOrigin: '0 0',
        pointerEvents: 'none',
      },
      '&-loader': {
        position: 'sticky',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        '&-mask': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: maskBg,
          color: colorTextSecondary,
        },
      },
      '&-loading-icon': {
        fontSize: fontSizeLG,
        width: fontSizeLG,
        height: fontSizeLG,
      },
      '&-horizontal > &-content': {
        display: 'flex',
      },
      '&-inline &-content': {
        position: 'static',
      },
    },
  } as CSSObject;
});
