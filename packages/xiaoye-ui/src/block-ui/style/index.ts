import type { CSSObject } from '../../_util/cssinjs';
import { Keyframes } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';

// 组件 Token
export interface ComponentToken {
  /** 遮罩背景色 */
  colorBgMask?: string;
  /** 遮罩圆角 */
  maskBorderRadius?: number;
  /** 遮罩透明度 */
  maskOpacity?: number;
  /** 内容最小高度（用于居中加载图标） */
  contentMinHeight?: number;
}

interface BlockUIToken extends FullToken<'BlockUI'> {
  blockUIMaskBg: string;
  blockUIMaskOpacity: number;
  blockUIMaskBorderRadius: number;
  blockUIContentMinHeight: number;
}

// 进场动画
const xyBlockUIIn = new Keyframes('xyBlockUIIn', {
  from: { opacity: 0 },
  to: { opacity: 1 },
});

// 离场动画
const xyBlockUIOut = new Keyframes('xyBlockUIOut', {
  from: { opacity: 1 },
  to: { opacity: 0 },
});

const genBlockUIStyle: GenerateStyle<BlockUIToken> = (token: BlockUIToken): CSSObject => {
  const { componentCls } = token;

  return {
    // 全屏阻塞时锁定 body 滚动
    [`body.xy-block-ui-overflow-hidden`]: {
      overflow: 'hidden !important',
    },

    [componentCls]: {
      position: 'relative',

      // 遮罩层
      [`${componentCls}-mask`]: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: token.blockUIMaskBg,
        opacity: token.blockUIMaskOpacity,
        borderRadius: token.blockUIMaskBorderRadius,
        zIndex: 1,
        userSelect: 'none',
        pointerEvents: 'auto',

        // 全屏遮罩为 fixed 定位
        [`&${componentCls}-mask-fullscreen`]: {
          position: 'fixed',
        },

        // 进入动画（配合 Vue Transition name="xy-blockui-mask"）
        '&-enter-active': {
          animationName: xyBlockUIIn,
          animationDuration: token.motionDurationMid,
          animationTimingFunction: token.motionEaseOut,
          animationFillMode: 'both',
        },

        // 离开动画
        '&-leave-active': {
          animationName: xyBlockUIOut,
          animationDuration: token.motionDurationMid,
          animationTimingFunction: token.motionEaseInOut,
          animationFillMode: 'forwards',
        },
      },

      // 遮罩内居中内容（Spin 容器）
      [`${componentCls}-content`]: {
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: token.blockUIContentMinHeight,
        color: token.colorTextLightSolid,
        gap: token.paddingXS,
      },

      // 遮罩文案
      [`${componentCls}-tip`]: {
        color: token.colorTextLightSolid,
        fontSize: token.fontSize,
        lineHeight: token.lineHeight,
        textShadow: `0 1px 2px ${token.colorBgMask}`,
      },
    },
  } as CSSObject;
};

// ============================== Export ==============================
export default genComponentStyleHook(
  'BlockUI',
  token => {
    const blockUIToken = mergeToken<BlockUIToken>(token, {
      blockUIMaskBg: token.colorBgMask || 'rgba(0, 0, 0, 0.45)',
      blockUIMaskOpacity: 1,
      blockUIMaskBorderRadius: token.borderRadius,
      blockUIContentMinHeight: token.controlHeightLG,
    });
    return [genBlockUIStyle(blockUIToken)];
  },
  {
    colorBgMask: 'rgba(0, 0, 0, 0.45)',
    maskBorderRadius: 0,
    maskOpacity: 1,
    contentMinHeight: 32,
  },
);
