import type { CSSObject } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { resetComponent } from '../../style';

/** 组件专属 Token */
export interface ComponentToken {
  zIndexPopup: number;
}

interface BackTopToken extends FullToken<'BackTop'> {
  backTopSize: number;
  backTopIconSize: number;
  backTopInsetBlockEnd: number;
  backTopInsetInlineEnd: number;
  lineWidthFocus: number;
}

// ============================== Shared ==============================
const genSharedBackTopStyle: GenerateStyle<BackTopToken, CSSObject> = (token): CSSObject => {
  const {
    componentCls,
    backTopSize,
    backTopIconSize,
    backTopInsetBlockEnd,
    backTopInsetInlineEnd,
    boxShadowSecondary,
    colorBgElevated,
    controlItemBgHover,
    colorText,
    motionDurationMid,
    zIndexBase,
  } = token;

  return {
    [componentCls]: {
      ...resetComponent(token),
      position: 'fixed',
      insetInlineEnd: backTopInsetInlineEnd,
      insetBlockEnd: backTopInsetBlockEnd,
      width: backTopSize,
      height: backTopSize,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      borderRadius: '50%',
      backgroundColor: colorBgElevated,
      color: colorText,
      boxShadow: boxShadowSecondary,
      transition: `all ${motionDurationMid}`,
      zIndex: zIndexBase + 10,
      opacity: 0,
      pointerEvents: 'none',

      '&-visible': {
        opacity: 1,
        pointerEvents: 'auto',
      },

      '&-rtl': {
        direction: 'rtl',
      },

      '&:hover': {
        backgroundColor: controlItemBgHover,
      },

      '&:focus-visible': {
        outline: `${token.lineWidthFocus}px solid ${token.colorPrimary}`,
        outlineOffset: token.lineWidthFocus,
      },

      [`${componentCls}-content`]: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },

      [`${componentCls}-icon`]: {
        fontSize: backTopIconSize,
        color: colorText,
      },
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook<'BackTop'>('BackTop', token => {
  const { controlHeightLG, marginXXL, marginLG, fontSizeIcon } = token;
  const backTopToken = mergeToken<BackTopToken>(token, {
    backTopSize: controlHeightLG,
    backTopIconSize: fontSizeIcon * 1.5,
    backTopInsetBlockEnd: marginXXL,
    backTopInsetInlineEnd: marginLG,
    lineWidthFocus: token.lineWidth,
  });
  return [genSharedBackTopStyle(backTopToken)];
});
