import type { CSSObject } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';

// 组件 Token
export interface ComponentToken {
  /** 展示区 hover 背景色 */
  inplaceDisplayHoverBg?: string;
  /** 展示区内边距（数值，单位 px） */
  inplaceDisplayPadding?: number;
  /** 关闭按钮尺寸 */
  inplaceCloseSize?: number;
}

interface InplaceToken extends FullToken<'Inplace'> {
  inplaceDisplayHoverBg: string;
  inplaceDisplayPadding: number;
  inplaceCloseSize: number;
}

const genInplaceStyle: GenerateStyle<InplaceToken, CSSObject> = (
  token: InplaceToken,
): CSSObject => {
  const {
    componentCls,
    colorBgLayout,
    colorText,
    colorTextDisabled,
    colorPrimary,
    borderRadius,
    paddingXS,
    motionDurationMid,
    fontSizeIcon,
    inplaceDisplayHoverBg,
    inplaceDisplayPadding,
    inplaceCloseSize,
  } = token;

  return {
    [componentCls]: {
      display: 'inline-block',

      [`&-rtl`]: {
        direction: 'rtl',
      },

      // 展示区
      [`${componentCls}-display`]: {
        display: 'inline-block',
        padding: inplaceDisplayPadding,
        color: 'inherit',
        cursor: 'pointer',
        background: 'transparent',
        border: `${token.lineWidth}px ${token.lineType} transparent`,
        borderRadius,
        transition: `background ${motionDurationMid}, color ${motionDurationMid}, box-shadow ${motionDurationMid}`,
        outlineColor: 'transparent',
        userSelect: 'none',

        '&:not(&-disabled):hover': {
          color: colorText,
          background: inplaceDisplayHoverBg,
        },

        '&:focus-visible': {
          boxShadow: 'none',
          outline: `${token.lineWidth * 2}px solid ${colorPrimary}`,
          outlineOffset: '2px',
        },

        '&-disabled': {
          cursor: 'not-allowed',
          color: colorTextDisabled,
          opacity: 0.6,
        },
      },

      // 编辑区
      [`${componentCls}-content`]: {
        display: 'inline-flex',
        alignItems: 'flex-start',
        gap: paddingXS,
        padding: inplaceDisplayPadding,
        background: colorBgLayout,
        borderRadius,

        [`&-inner`]: {
          flex: 'auto',
          minWidth: 0,
        },
      },

      // 关闭按钮
      [`${componentCls}-close`]: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 'none',
        width: inplaceCloseSize,
        height: inplaceCloseSize,
        padding: 0,
        border: 'none',
        background: 'transparent',
        color: colorTextDisabled,
        cursor: 'pointer',
        borderRadius,
        transition: `color ${motionDurationMid}, background ${motionDurationMid}`,

        '&:hover': {
          color: colorText,
          background: colorBgLayout,
        },

        '&:focus-visible': {
          outline: `${token.lineWidth * 2}px solid ${colorPrimary}`,
          outlineOffset: '2px',
        },

        // 图标尺寸跟随父级
        [`${token.iconCls}`]: {
          fontSize: fontSizeIcon,
          lineHeight: 1,
        },
      },
    },
  } as CSSObject;
};

// ============================== Export ==============================
export default genComponentStyleHook(
  'Inplace',
  token => {
    const inplaceToken = mergeToken<InplaceToken>(token, {
      inplaceDisplayHoverBg: token.colorBgLayout,
      inplaceDisplayPadding: token.paddingXS,
      inplaceCloseSize: token.controlHeightSM,
    });
    return [genInplaceStyle(inplaceToken)];
  },
  {
    inplaceDisplayHoverBg: 'transparent',
    inplaceDisplayPadding: 8,
    inplaceCloseSize: 24,
  },
);
