import type { CSSObject } from '../../_util/cssinjs';
import { genComponentStyleHook } from '../../theme/internal';

export interface ComponentToken {}

// 修复源项目 bug：
// 1) 去掉第三参数 'xy-fieldset'，让 genComponentStyleHook('Fieldset') 自动推导 componentCls = 'xy-fieldset'
// 2) BEM 风格（__xxx / --xxx）→ 短横线（-xxx），与组件代码一致
// 3) 补充全局过渡类 xy-collapsible 的 enter/leave 动画（源项目使用但未定义）
export default genComponentStyleHook('Fieldset', token => {
  const {
    componentCls,
    colorBgContainer,
    colorBorder,
    borderRadiusLG,
    colorText,
    paddingMD,
    paddingLG,
    paddingSM,
    colorBgLayout,
    paddingXS,
    colorPrimary,
    colorTextSecondary,
    motionDurationSlow,
  } = token;

  return {
    [componentCls]: {
      margin: 0,
      padding: `${paddingMD}px ${paddingLG}px`,
      color: colorText,
      background: colorBgContainer,
      border: `1px solid ${colorBorder}`,
      borderRadius: borderRadiusLG,

      '&-legend': {
        display: 'block',
        width: '100%',
        padding: `${paddingSM}px ${paddingMD}px`,
        color: colorText,
        fontWeight: 500,
        background: 'transparent',
        border: 0,
        borderRadius: 'var(--xy-border-radius)',
        transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
      },

      '&-toggleable > &-legend': {
        padding: 0,
        background: 'transparent',
        borderColor: 'transparent',
      },

      '&-toggle-button': {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: paddingXS,
        width: '100%',
        padding: `${paddingSM}px ${paddingMD}px`,
        color: 'inherit',
        font: 'inherit',
        textAlign: 'start',
        textDecoration: 'none',
        background: 'transparent',
        border: 0,
        borderRadius: 'var(--xy-border-radius)',
        cursor: 'pointer',
        outlineColor: 'transparent',
        transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',

        '&:focus-visible': {
          boxShadow: 'none',
          outline: `2px solid ${colorPrimary}`,
          outlineOffset: 2,
        },
      },

      '&-toggle-icon': {
        flexShrink: 0,
        color: colorTextSecondary,
        transition: 'color 0.2s',
      },

      '&-toggleable > &-legend:hover': {
        color: colorText,
        background: colorBgLayout,

        [`${componentCls}-toggle-icon`]: {
          color: colorText,
        },
      },

      '&-content-container': {
        display: 'grid',
        gridTemplateRows: '1fr',
        transition: 'grid-template-rows 0.2s ease-out',
      },

      '&-content-wrapper': {
        minHeight: 0,
        overflow: 'hidden',
      },

      '&-content': {
        padding: `${paddingMD}px 0 0`,
      },
    },

    // 全局过渡类：被 Fieldset、PanelMenu、PanelMenuSub 等使用
    // Transition name="xy-collapsible" 会应用这些类
    '.xy-collapsible-enter-active': {
      transition: `opacity ${motionDurationSlow}, max-height ${motionDurationSlow}`,
      overflow: 'hidden',
    },
    '.xy-collapsible-leave-active': {
      transition: `opacity ${motionDurationSlow}, max-height ${motionDurationSlow}`,
      overflow: 'hidden',
    },
    '.xy-collapsible-enter-from': {
      opacity: 0,
      maxHeight: 0,
    },
    '.xy-collapsible-leave-to': {
      opacity: 0,
      maxHeight: 0,
    },
  } as CSSObject;
});
