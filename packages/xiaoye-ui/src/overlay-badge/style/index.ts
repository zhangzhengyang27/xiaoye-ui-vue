import type { CSSObject } from '../../_util/cssinjs';
import type { FullToken } from '../../theme/internal';
import { genComponentStyleHook } from '../../theme/internal';

export interface ComponentToken {}

export interface OverlayBadgeToken extends FullToken<'OverlayBadge'> {}

const genOverlayBadgeStyle = (token: OverlayBadgeToken): CSSObject => {
  const { componentCls, colorBgContainer } = token;
  return {
    [componentCls]: {
      position: 'relative',
      display: 'inline-flex',
      // 目标项目 Badge 根类名为 xy-badge，这里定位其到右上角
      '.xy-badge': {
        position: 'absolute',
        insetBlockStart: 0,
        insetInlineEnd: 0,
        transform: 'translate(50%, -50%)',
        transformOrigin: '100% 0',
        margin: 0,
        outlineWidth: '2px',
        outlineStyle: 'solid',
        outlineColor: colorBgContainer,
      },
      '.xy-badge:dir(rtl)': {
        transform: 'translate(-50%, -50%)',
      },
    },
  } as CSSObject;
};

export default genComponentStyleHook('OverlayBadge', token => [
  genOverlayBadgeStyle(token as OverlayBadgeToken),
]);
