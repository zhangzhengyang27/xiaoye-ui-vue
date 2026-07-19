import type { CSSObject } from '../../_util/cssinjs';
import { TinyColor } from '@ctrl/tinycolor';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';

export interface ComponentToken {}

export interface ScrollPanelToken extends FullToken<'ScrollPanel'> {}

const genScrollPanelStyle: GenerateStyle<ScrollPanelToken> = token => {
  const { componentCls, borderRadius, colorTextSecondary, motionDurationMid } = token;
  const barSize = token.sizeXS || 9;
  const barBackground = new TinyColor(colorTextSecondary).setAlpha(0.3).toRgbString();

  return {
    [componentCls]: {
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
      height: '100%',

      [`${componentCls}-content-container`]: {
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        position: 'relative',
        zIndex: 1,
      },

      [`${componentCls}-content`]: {
        height: `calc(100% + ${barSize * 2}px)`,
        width: `calc(100% + ${barSize * 2}px)`,
        paddingInline: `0 ${barSize * 2}px`,
        paddingBlock: `0 ${barSize * 2}px`,
        position: 'relative',
        overflow: 'auto',
        boxSizing: 'border-box',
        scrollbarWidth: 'none',

        '&::-webkit-scrollbar': {
          display: 'none',
        },
      },

      [`${componentCls}-bar`]: {
        position: 'absolute',
        borderRadius,
        zIndex: 2,
        cursor: 'pointer',
        opacity: 0,
        outlineColor: 'transparent',
        background: barBackground,
        border: '0 none',
        transition: `outline-color ${motionDurationMid}, opacity ${motionDurationMid}`,

        '&:focus-visible': {
          boxShadow: 'none',
          outline: '0 none transparent',
          outlineOffset: 0,
        },
      },

      [`${componentCls}-bar-y`]: {
        width: barSize,
        insetBlockStart: 0,
      },

      [`${componentCls}-bar-x`]: {
        height: barSize,
        insetBlockEnd: 0,
      },

      [`&-hidden`]: {
        visibility: 'hidden',
      },

      [`&:hover ${componentCls}-bar, &:active ${componentCls}-bar`]: {
        opacity: 1,
      },

      [`&-grabbed, ${componentCls}-grabbed`]: {
        userSelect: 'none',
      },
    },
  } as CSSObject;
};

export default genComponentStyleHook('ScrollPanel', token => {
  const scrollPanelToken = mergeToken<ScrollPanelToken>(token, {});
  return [genScrollPanelStyle(scrollPanelToken)];
});
