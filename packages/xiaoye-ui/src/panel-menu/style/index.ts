import type { CSSObject } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';

// 组件专属 Token（暂为空，预留扩展位）
export interface ComponentToken {}

export interface PanelMenuToken extends FullToken<'PanelMenu'> {
  panelMenuHeaderPadding: string;
  panelMenuItemPadding: string;
}

// 共享样式：根容器、面板、头部、内容容器
const genSharedPanelMenuStyle: GenerateStyle<PanelMenuToken, CSSObject> = (token): CSSObject => {
  const {
    componentCls,
    colorBgContainer,
    colorBorder,
    borderRadius,
    borderRadiusSM,
    colorText,
    colorTextSecondary,
    colorBgLayout,
    paddingXS,
    paddingSM,
    paddingLG,
    motionDurationMid,
  } = token;

  return {
    [componentCls]: {
      display: 'flex',
      flexDirection: 'column',
      gap: paddingXS,

      // 面板容器
      [`${componentCls}-panel`]: {
        background: colorBgContainer,
        border: `1px solid ${colorBorder}`,
        borderRadius,
        padding: 0,
      },

      // 面板头部
      [`${componentCls}-header`]: {
        outline: '0 none',

        '&-disabled': {
          opacity: 0.6,
          pointerEvents: 'none',
        },
      },

      [`${componentCls}-header-content`]: {
        borderRadius: borderRadiusSM,
        color: colorText,
        outlineColor: 'transparent',
        transition: `background ${motionDurationMid}, color ${motionDurationMid}, outline-color ${motionDurationMid}, box-shadow ${motionDurationMid}`,
      },

      [`${componentCls}-header:not(${componentCls}-header-disabled):focus-visible ${componentCls}-header-content, ${componentCls}-header:not(${componentCls}-header-disabled) ${componentCls}-header-content:hover`]:
        {
          color: colorText,
          background: colorBgLayout,
        },

      // 头部链接区域（包含图标 + 文本）
      [`${componentCls}-header-link`]: {
        display: 'flex',
        alignItems: 'center',
        gap: paddingXS,
        padding: `${paddingXS} ${paddingSM}`,
        userSelect: 'none',
        cursor: 'pointer',
        position: 'relative',
        textDecoration: 'none',
        color: 'inherit',
      },

      [`${componentCls}-header-icon, ${componentCls}-item-icon`]: {
        color: colorTextSecondary,
      },

      [`${componentCls}-header:not(${componentCls}-header-disabled):focus-visible ${componentCls}-header-content ${componentCls}-header-icon, ${componentCls}-header:not(${componentCls}-header-disabled) ${componentCls}-header-content:hover ${componentCls}-header-icon,
       ${componentCls}-item-focused ${componentCls}-item-content ${componentCls}-item-icon, ${componentCls}-item:not(${componentCls}-item-disabled) ${componentCls}-item-content:hover ${componentCls}-item-icon`]:
        {
          color: colorText,
        },

      // 子菜单展开 / 折叠图标
      [`${componentCls}-submenu-icon`]: {
        width: '14px',
        height: '14px',
        color: colorTextSecondary,
      },

      [`${componentCls}-submenu-icon:dir(rtl)`]: {
        transform: 'rotate(180deg)',
      },

      [`${componentCls}-header:not(${componentCls}-header-disabled):focus-visible ${componentCls}-header-content ${componentCls}-submenu-icon, ${componentCls}-header:not(${componentCls}-header-disabled) ${componentCls}-header-content:hover ${componentCls}-submenu-icon,
       ${componentCls}-item-focused ${componentCls}-item-content ${componentCls}-submenu-icon, ${componentCls}-item:not(${componentCls}-item-disabled) ${componentCls}-item-content:hover ${componentCls}-submenu-icon`]:
        {
          color: colorText,
        },

      // 内容容器（折叠时 grid 行高为 0）
      [`${componentCls}-content-container`]: {
        display: 'grid',
        gridTemplateRows: '1fr',
      },

      [`${componentCls}-content-wrapper`]: {
        minHeight: 0,
      },

      [`${componentCls}-content`]: {
        padding: 0,
      },

      // 根列表
      [`${componentCls}-root-list`]: {
        margin: 0,
        padding: 0,
        outline: '0 none',
        listStyle: 'none',
      },

      // 子菜单列表
      [`${componentCls}-submenu`]: {
        margin: 0,
        padding: `0 0 0 ${paddingLG}`,
        outline: 0,
        listStyle: 'none',

        '&:dir(rtl)': {
          padding: `0 ${paddingLG} 0 0`,
        },
      },

      // 子菜单项
      [`${componentCls}-item`]: {
        outline: '0 none',

        '&-disabled': {
          opacity: 0.6,
          pointerEvents: 'none',
        },
      },

      [`${componentCls}-item-content`]: {
        borderRadius: borderRadiusSM,
        color: colorText,
        outlineColor: 'transparent',
        transition: `background ${motionDurationMid}, color ${motionDurationMid}, outline-color ${motionDurationMid}, box-shadow ${motionDurationMid}`,
      },

      [`${componentCls}-item-focused > ${componentCls}-item-content, ${componentCls}-item:not(${componentCls}-item-disabled) > ${componentCls}-item-content:hover`]:
        {
          color: colorText,
          background: colorBgLayout,
        },

      [`${componentCls}-item-link`]: {
        display: 'flex',
        alignItems: 'center',
        gap: paddingXS,
        padding: `${paddingXS} ${paddingSM}`,
        userSelect: 'none',
        cursor: 'pointer',
        textDecoration: 'none',
        color: 'inherit',
        position: 'relative',
        overflow: 'hidden',
      },

      [`${componentCls}-item-label`]: {
        lineHeight: 1,
      },

      [`${componentCls}-separator`]: {
        borderTop: `1px solid ${colorBorder}`,
      },
    },
  } as CSSObject;
};

// 折叠过渡动画
const genCollapsibleTransitionStyle: GenerateStyle<PanelMenuToken, CSSObject> = (
  token,
): CSSObject => {
  const { componentCls, motionDurationMid } = token;

  return {
    [`${componentCls}-content-container`]: {
      transition: `grid-template-rows ${motionDurationMid}, opacity ${motionDurationMid}`,
      overflow: 'hidden',
    },

    // vue Transition name="xy-collapsible"
    '.xy-collapsible-enter-active, .xy-collapsible-leave-active': {
      transition: `opacity ${motionDurationMid}, transform ${motionDurationMid}`,
    },

    '.xy-collapsible-enter-from, .xy-collapsible-leave-to': {
      opacity: 0,
      transform: 'translateY(-4px)',
    },
  } as CSSObject;
};

export default genComponentStyleHook('PanelMenu', token => {
  const panelMenuToken = mergeToken<PanelMenuToken>(token, {
    panelMenuHeaderPadding: `${token.paddingXS} ${token.paddingSM}`,
    panelMenuItemPadding: `${token.paddingXS} ${token.paddingSM}`,
  });

  return [genSharedPanelMenuStyle(panelMenuToken), genCollapsibleTransitionStyle(panelMenuToken)];
});
