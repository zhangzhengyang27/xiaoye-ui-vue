import type { CSSObject } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { resetComponent } from '../../style';

/** 组件专属 Token */
export interface ComponentToken {}

/** DarkModeToggle 派生 Token */
export interface DarkModeToggleToken extends FullToken<'DarkModeToggle'> {
  /** 切换按钮尺寸 */
  darkModeToggleSize: number;
  /** 切换按钮内图标尺寸 */
  darkModeToggleIconSize: number;
  /** 切换按钮圆角 */
  darkModeToggleBorderRadius: number | string;
}

// ============================== Button Variant ==============================
const genButtonVariantStyle: GenerateStyle<DarkModeToggleToken, CSSObject> = (token): CSSObject => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      ...resetComponent(token),

      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
      width: token.darkModeToggleSize,
      height: token.darkModeToggleSize,
      margin: 0,
      padding: 0,
      borderRadius: token.darkModeToggleBorderRadius,
      border: `${token.lineWidth}px ${token.lineType} ${token.colorBorderSecondary}`,
      backgroundColor: token.colorBgContainer,
      color: token.colorText,
      cursor: 'pointer',
      transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
      userSelect: 'none',
      fontSize: token.darkModeToggleIconSize,
      lineHeight: 1,
      outline: 'none',

      '&:hover:not(&-disabled)': {
        color: token.colorPrimaryHover,
        borderColor: token.colorPrimaryHover,
        backgroundColor: token.colorBgTextHover,
      },

      '&:focus-visible:not(&-disabled)': {
        borderColor: token.colorPrimary,
        boxShadow: `0 0 0 ${token.controlOutlineWidth}px ${token.controlOutline}`,
      },

      '&:active:not(&-disabled)': {
        color: token.colorPrimaryActive,
        borderColor: token.colorPrimaryActive,
      },

      // 暗色模式选中态
      [`&${componentCls}-checked`]: {
        color: token.colorPrimary,
        borderColor: token.colorPrimary,
        backgroundColor: token.colorPrimaryBg,
      },

      // 禁用态
      [`&${componentCls}-disabled`]: {
        cursor: 'not-allowed',
        color: token.colorTextDisabled,
        borderColor: token.colorBorder,
        backgroundColor: token.colorBgContainerDisabled,
      },

      // 图标过渡
      [`> .xyicon`]: {
        transition: `transform ${token.motionDurationMid} ${token.motionEaseInOut}`,
      },

      [`&${componentCls}-checked > .xyicon`]: {
        transform: 'rotate(360deg)',
      },

      // RTL
      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },
    },
  };
};

// ============================== Size ==============================
const genSizeStyle: GenerateStyle<DarkModeToggleToken, CSSObject> = (token): CSSObject => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      [`&${componentCls}-small`]: {
        width: token.controlHeightSM,
        height: token.controlHeightSM,
        fontSize: token.fontSizeSM,
      },
      [`&${componentCls}-large`]: {
        width: token.controlHeightLG,
        height: token.controlHeightLG,
        fontSize: token.fontSizeLG,
      },
    },
  };
};

// ============================== Switch Variant ==============================
const genSwitchVariantStyle: GenerateStyle<DarkModeToggleToken, CSSObject> = (token): CSSObject => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      // switch 风格直接复用 Switch 样式，这里仅处理内联图标布局
      [`&${componentCls}-switch`]: {
        width: 'auto',
        height: 'auto',
        border: 'none',
        backgroundColor: 'transparent',

        '&:hover:not(&-disabled)': {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        },

        '&:active:not(&-disabled)': {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        },

        [`&${componentCls}-checked`]: {
          color: token.colorTextLightSolid,
          borderColor: 'transparent',
          backgroundColor: 'transparent',
        },
      },
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook('DarkModeToggle', token => {
  const darkModeToggleToken = mergeToken<DarkModeToggleToken>(token, {
    darkModeToggleSize: token.controlHeight,
    darkModeToggleIconSize: token.fontSizeIcon,
    darkModeToggleBorderRadius: '50%',
  });

  return [
    genButtonVariantStyle(darkModeToggleToken),
    genSizeStyle(darkModeToggleToken),
    genSwitchVariantStyle(darkModeToggleToken),
  ];
});
