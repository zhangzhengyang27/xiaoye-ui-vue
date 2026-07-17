import type { CSSInterpolation } from '../../_util/cssinjs';
import { Keyframes } from '../../_util/cssinjs';
import type { AliasToken } from '../../theme/internal';
import type { TokenWithCommonCls } from '../../theme/util/genComponentStyleHook';
import { initMotion } from './motion';

export const zoomIn = new Keyframes('xyZoomIn', {
  '0%': {
    transform: 'scale(0.2)',
    opacity: 0,
  },

  '100%': {
    transform: 'scale(1)',
    opacity: 1,
  },
});

export const zoomOut = new Keyframes('xyZoomOut', {
  '0%': {
    transform: 'scale(1)',
  },

  '100%': {
    transform: 'scale(0.2)',
    opacity: 0,
  },
});

export const zoomBigIn = new Keyframes('xyZoomBigIn', {
  '0%': {
    transform: 'scale(0.8)',
    opacity: 0,
  },

  '100%': {
    transform: 'scale(1)',
    opacity: 1,
  },
});

export const zoomBigOut = new Keyframes('xyZoomBigOut', {
  '0%': {
    transform: 'scale(1)',
  },

  '100%': {
    transform: 'scale(0.8)',
    opacity: 0,
  },
});

export const zoomUpIn = new Keyframes('xyZoomUpIn', {
  '0%': {
    transform: 'scale(0.8)',
    transformOrigin: '50% 0%',
    opacity: 0,
  },

  '100%': {
    transform: 'scale(1)',
    transformOrigin: '50% 0%',
  },
});

export const zoomUpOut = new Keyframes('xyZoomUpOut', {
  '0%': {
    transform: 'scale(1)',
    transformOrigin: '50% 0%',
  },

  '100%': {
    transform: 'scale(0.8)',
    transformOrigin: '50% 0%',
    opacity: 0,
  },
});

export const zoomLeftIn = new Keyframes('xyZoomLeftIn', {
  '0%': {
    transform: 'scale(0.8)',
    transformOrigin: '0% 50%',
    opacity: 0,
  },

  '100%': {
    transform: 'scale(1)',
    transformOrigin: '0% 50%',
  },
});

export const zoomLeftOut = new Keyframes('xyZoomLeftOut', {
  '0%': {
    transform: 'scale(1)',
    transformOrigin: '0% 50%',
  },

  '100%': {
    transform: 'scale(0.8)',
    transformOrigin: '0% 50%',
    opacity: 0,
  },
});

export const zoomRightIn = new Keyframes('xyZoomRightIn', {
  '0%': {
    transform: 'scale(0.8)',
    transformOrigin: '100% 50%',
    opacity: 0,
  },

  '100%': {
    transform: 'scale(1)',
    transformOrigin: '100% 50%',
  },
});

export const zoomRightOut = new Keyframes('xyZoomRightOut', {
  '0%': {
    transform: 'scale(1)',
    transformOrigin: '100% 50%',
  },

  '100%': {
    transform: 'scale(0.8)',
    transformOrigin: '100% 50%',
    opacity: 0,
  },
});

export const zoomDownIn = new Keyframes('xyZoomDownIn', {
  '0%': {
    transform: 'scale(0.8)',
    transformOrigin: '50% 100%',
    opacity: 0,
  },

  '100%': {
    transform: 'scale(1)',
    transformOrigin: '50% 100%',
  },
});

export const zoomDownOut = new Keyframes('xyZoomDownOut', {
  '0%': {
    transform: 'scale(1)',
    transformOrigin: '50% 100%',
  },

  '100%': {
    transform: 'scale(0.8)',
    transformOrigin: '50% 100%',
    opacity: 0,
  },
});

type ZoomMotionTypes =
  'zoom' | 'zoom-big' | 'zoom-big-fast' | 'zoom-left' | 'zoom-right' | 'zoom-up' | 'zoom-down';
const zoomMotion: Record<ZoomMotionTypes, { inKeyframes: Keyframes; outKeyframes: Keyframes }> = {
  zoom: {
    inKeyframes: zoomIn,
    outKeyframes: zoomOut,
  },
  'zoom-big': {
    inKeyframes: zoomBigIn,
    outKeyframes: zoomBigOut,
  },
  'zoom-big-fast': {
    inKeyframes: zoomBigIn,
    outKeyframes: zoomBigOut,
  },
  'zoom-left': {
    inKeyframes: zoomLeftIn,
    outKeyframes: zoomLeftOut,
  },
  'zoom-right': {
    inKeyframes: zoomRightIn,
    outKeyframes: zoomRightOut,
  },
  'zoom-up': {
    inKeyframes: zoomUpIn,
    outKeyframes: zoomUpOut,
  },
  'zoom-down': {
    inKeyframes: zoomDownIn,
    outKeyframes: zoomDownOut,
  },
};

export const initZoomMotion = (
  token: TokenWithCommonCls<AliasToken>,
  motionName: ZoomMotionTypes,
): CSSInterpolation => {
  const { rootCls } = token;
  const motionCls = `${rootCls}-${motionName}`;
  const { inKeyframes, outKeyframes } = zoomMotion[motionName];

  return [
    initMotion(
      motionCls,
      inKeyframes,
      outKeyframes,
      motionName === 'zoom-big-fast' ? token.motionDurationFast : token.motionDurationMid,
    ),
    {
      [`
        ${motionCls}-enter,
        ${motionCls}-appear
      `]: {
        transform: 'scale(0)',
        opacity: 0,
        animationTimingFunction: token.motionEaseOutCirc,

        '&-prepare': {
          transform: 'none',
        },
      },

      [`${motionCls}-leave`]: {
        animationTimingFunction: token.motionEaseInOutCirc,
      },
    },
  ];
};
