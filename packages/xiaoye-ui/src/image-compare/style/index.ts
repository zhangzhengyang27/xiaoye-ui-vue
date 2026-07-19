import type { CSSObject } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';

export interface ComponentToken {}

export interface ImageCompareToken extends FullToken<'ImageCompare'> {}

const genImageCompareStyle: GenerateStyle<ImageCompareToken> = token => {
  const {
    componentCls,
    colorBgContainer,
    colorBorder,
    colorPrimary,
    boxShadowTertiary,
    motionDurationFast,
  } = token;

  const handleSize = token.controlHeight / 2;

  return {
    [componentCls]: {
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
      aspectRatio: '16 / 9',

      [`${componentCls}-layer`]: {
        position: 'absolute',
        inset: 0,

        '& > *': {
          width: '100%',
          height: '100%',
        },

        img: {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          userSelect: 'none',
        },
      },

      [`${componentCls}-layer-left`]: {
        zIndex: 1,
      },

      [`${componentCls}-layer-right`]: {
        zIndex: 2,
        clipPath:
          'polygon(0 0, var(--xy-image-compare-scope-x, 50%) 0, var(--xy-image-compare-scope-x, 50%) 100%, 0 100%)',
      },

      [`&${componentCls}-rtl ${componentCls}-layer-right`]: {
        clipPath:
          'polygon(calc(100% - var(--xy-image-compare-scope-x, 50%)) 0, 100% 0, 100% 100%, calc(100% - var(--xy-image-compare-scope-x, 50%)) 100%)',
      },

      [`${componentCls}-slider`]: {
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        WebkitAppearance: 'none',
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0,
        backgroundColor: 'transparent',
        outline: 'none',
        cursor: 'ew-resize',

        '&::-webkit-slider-runnable-track': {
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
        },

        '&::-moz-range-track': {
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
        },

        '&::-webkit-slider-thumb': {
          WebkitAppearance: 'none',
          height: handleSize,
          width: handleSize,
          background: colorBgContainer,
          border: `2px solid ${colorBorder}`,
          borderRadius: '50%',
          cursor: 'ew-resize',
          transition: `all ${motionDurationFast}`,
        },

        '&::-moz-range-thumb': {
          height: handleSize,
          width: handleSize,
          background: colorBgContainer,
          border: `2px solid ${colorBorder}`,
          borderRadius: '50%',
          cursor: 'ew-resize',
          transition: `all ${motionDurationFast}`,
        },

        '&:focus-visible::-webkit-slider-thumb': {
          boxShadow: boxShadowTertiary,
          outline: `2px solid ${colorPrimary}`,
          outlineOffset: '2px',
        },

        '&:focus-visible::-moz-range-thumb': {
          boxShadow: boxShadowTertiary,
          outline: `2px solid ${colorPrimary}`,
          outlineOffset: '2px',
        },

        '&:hover::-webkit-slider-thumb': {
          borderColor: colorPrimary,
          transform: 'scale(1.15)',
        },

        '&:hover::-moz-range-thumb': {
          borderColor: colorPrimary,
          transform: 'scale(1.15)',
        },
      },

      [`&${componentCls}-disabled`]: {
        [`${componentCls}-slider`]: {
          cursor: 'not-allowed',

          '&::-webkit-slider-thumb': {
            cursor: 'not-allowed',
            opacity: 0.6,
          },

          '&::-moz-range-thumb': {
            cursor: 'not-allowed',
            opacity: 0.6,
          },
        },
      },
    },
  } as CSSObject;
};

export default genComponentStyleHook('ImageCompare', token => {
  const imageCompareToken = mergeToken<ImageCompareToken>(token, {});
  return [genImageCompareStyle(imageCompareToken)];
});
