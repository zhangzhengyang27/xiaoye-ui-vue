import type { CSSObject } from '../../_util/cssinjs';
import type { FullToken } from '../../theme/internal';
import { genComponentStyleHook } from '../../theme/internal';

// 组件 Token 接口（预留扩展）
export interface ComponentToken {}

// 扩展 Token
export interface MegaMenuToken extends FullToken<'MegaMenu'> {
  megaMenuItemPaddingHorizontal: number;
  megaMenuOverlayPadding: number;
}

// 生成基础样式
const genBaseStyle = (token: MegaMenuToken): CSSObject => {
  const {
    componentCls,
    colorBgContainer,
    colorText,
    colorTextSecondary,
    colorBorder,
    colorPrimary,
    colorPrimaryHover,
    colorTextLightSolid,
    borderRadius,
    borderRadiusSM,
    borderRadiusLG,
    paddingXS,
    paddingSM,
    paddingMD,
    boxShadow,
    motionDurationMid,
    fontSize,
    controlItemBgHover,
    controlOutline,
    controlOutlineWidth,
  } = token;

  const itemHoverBg = controlItemBgHover;
  const itemFocusShadow = `0 0 0 ${controlOutlineWidth}px ${controlOutline}`;

  return {
    [componentCls]: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: paddingXS,
      padding: `${paddingSM} ${paddingMD}`,
      background: colorBgContainer,
      border: `1px solid ${colorBorder}`,
      borderRadius,
      color: colorText,
      fontSize,

      [`${componentCls}-start, ${componentCls}-end`]: {
        display: 'flex',
        alignItems: 'center',
      },

      [`${componentCls}-root-list`]: {
        margin: 0,
        padding: 0,
        listStyle: 'none',
        outline: '0 none',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: paddingXS,
      },

      [`${componentCls}-submenu`]: {
        margin: 0,
        padding: `${paddingSM} 0`,
        listStyle: 'none',
        minWidth: '12.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: paddingXS,
      },

      [`${componentCls}-submenu-label`]: {
        padding: `${paddingSM} ${paddingMD}`,
        color: colorTextSecondary,
        fontWeight: 600,
        background: 'transparent',

        '&-disabled': {
          opacity: 0.6,
          pointerEvents: 'none',
        },
      },

      [`${componentCls}-item`]: {
        position: 'relative',

        '&-disabled': {
          opacity: 0.6,
          pointerEvents: 'none',
        },
      },

      [`${componentCls}-item-content`]: {
        borderRadius: borderRadiusSM,
        color: colorText,
        transition: `background ${motionDurationMid}, color ${motionDurationMid}`,
        cursor: 'pointer',

        [`&:hover:not(${componentCls}-item-disabled &)`]: {
          color: colorPrimaryHover,
          background: itemHoverBg,
        },
      },

      [`${componentCls}-root-list > ${componentCls}-item > ${componentCls}-item-content`]: {
        borderRadius: borderRadiusSM,
      },

      [`${componentCls}-root-list > ${componentCls}-item > ${componentCls}-item-content > ${componentCls}-item-link`]:
        {
          padding: `${paddingSM} ${paddingMD}`,
        },

      [`${componentCls}-item-link`]: {
        display: 'flex',
        alignItems: 'center',
        gap: paddingXS,
        padding: `${paddingSM} ${paddingMD}`,
        textDecoration: 'none',
        color: 'inherit',
        cursor: 'pointer',
        userSelect: 'none',
        outline: '0 none',
        overflow: 'hidden',
        position: 'relative',
      },

      [`${componentCls}-item-label`]: {
        lineHeight: 1,
      },

      [`${componentCls}-item-icon`]: {
        display: 'inline-flex',
        alignItems: 'center',
        color: colorTextSecondary,
      },

      [`${componentCls}-submenu-icon`]: {
        width: '14px',
        height: '14px',
        color: colorTextSecondary,
        transition: `transform ${motionDurationMid}`,
      },

      [`${componentCls}-item-active > ${componentCls}-item-content`]: {
        color: colorTextLightSolid,
        background: colorPrimary,
      },

      [`${componentCls}-item-active > ${componentCls}-item-content ${componentCls}-item-icon`]: {
        color: colorTextLightSolid,
      },

      [`${componentCls}-item-active > ${componentCls}-item-content ${componentCls}-submenu-icon`]: {
        color: colorTextLightSolid,
      },

      // 子菜单面板
      [`${componentCls}-overlay`]: {
        display: 'none',
        position: 'absolute',
        left: 0,
        top: '100%',
        zIndex: 1,
        minWidth: '100%',
        padding: token.megaMenuOverlayPadding,
        background: colorBgContainer,
        border: `1px solid ${colorBorder}`,
        borderRadius: borderRadiusLG,
        boxShadow,
      },

      [`${componentCls}-root-list > ${componentCls}-item-active > ${componentCls}-overlay`]: {
        display: 'block',
      },

      // 栅格
      [`${componentCls}-grid`]: {
        display: 'flex',
      },

      [`${componentCls}-column`]: {
        flex: '0 0 auto',
        padding: paddingXS,

        '&-2': {
          width: '16.6667%',
        },

        '&-3': {
          width: '25%',
        },

        '&-4': {
          width: '33.3333%',
        },

        '&-6': {
          width: '50%',
        },

        '&-12': {
          width: '100%',
        },
      },

      [`${componentCls}-separator`]: {
        borderBlockStart: `1px solid ${colorBorder}`,
      },
    },

    // 水平方向
    [`${componentCls}-horizontal`]: {
      alignItems: 'center',

      [`${componentCls}-end`]: {
        marginLeft: 'auto',
        alignSelf: 'center',
      },

      [`${componentCls}-root-list > ${componentCls}-item-active > ${componentCls}-item-content ${componentCls}-submenu-icon`]:
        {
          transform: 'rotate(180deg)',
        },
    },

    // 垂直方向
    [`${componentCls}-vertical`]: {
      display: 'inline-flex',
      minWidth: '12.5rem',
      flexDirection: 'column',
      alignItems: 'stretch',

      [`${componentCls}-root-list`]: {
        alignItems: 'stretch',
        flexDirection: 'column',
      },

      [`${componentCls}-root-list > ${componentCls}-item > ${componentCls}-item-content ${componentCls}-submenu-icon`]:
        {
          marginLeft: 'auto',
        },

      [`${componentCls}-root-list > ${componentCls}-item-active > ${componentCls}-overlay`]: {
        left: '100%',
        top: 0,
      },
    },

    // 禁用态
    [`${componentCls}-disabled`]: {
      cursor: 'not-allowed',
      opacity: 0.6,
      pointerEvents: 'none',
    },

    // RTL
    [`${componentCls}-rtl`]: {
      direction: 'rtl',
    },

    // 焦点样式
    [`${componentCls}-root-list:focus-visible`]: {
      boxShadow: itemFocusShadow,
      outline: 'none',
    },
  } as CSSObject;
};

// ============================== Export ==============================
export default genComponentStyleHook('MegaMenu', token => {
  const megaMenuToken: MegaMenuToken = {
    ...token,
    megaMenuItemPaddingHorizontal: token.paddingContentHorizontal,
    megaMenuOverlayPadding: token.paddingMD,
  } as MegaMenuToken;

  return [genBaseStyle(megaMenuToken)];
});
