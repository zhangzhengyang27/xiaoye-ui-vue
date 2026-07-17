import type { CSSObject } from '../../_util/cssinjs';
import { genComponentStyleHook } from '../../theme/internal';

export interface ComponentToken {}

// SplitterPanel 样式（SplitterPanel.tsx 使用）
// 修复源项目 bug：去掉第三参数 'xy-splitter-panel'，让 genComponentStyleHook('SplitterPanel') 自动推导
export const useSplitterPanelStyle = genComponentStyleHook('SplitterPanel', token => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      flexGrow: 1,
      overflow: 'hidden',

      [`&${componentCls}-nested`]: {
        display: 'flex',
      },

      // 嵌套 Splitter 时重置样式（硬编码 .xy-splitter 与 Splitter 的 prefixCls 一致）
      '.xy-splitter': {
        flexGrow: 1,
        minWidth: 0,
        minHeight: 0,
        border: '0 none',
      },
    },
  } as CSSObject;
});

// Splitter 样式（Splitter.tsx 使用，默认导出）
// 修复源项目 bug：BEM 风格（--xxx / __xxx）→ 短横线（-xxx），与组件代码一致
export default genComponentStyleHook('Splitter', token => {
  const {
    componentCls,
    colorBgContainer,
    colorBorder,
    colorText,
    borderRadiusLG,
    colorBorderSecondary,
    borderRadiusSM,
    colorPrimary,
    motionDurationMid,
  } = token;

  return {
    [componentCls]: {
      display: 'flex',
      flexWrap: 'nowrap',
      border: `1px solid ${colorBorder}`,
      background: colorBgContainer,
      borderRadius: borderRadiusLG,
      color: colorText,

      [`${componentCls}-vertical`]: {
        flexDirection: 'column',
      },

      [`${componentCls}-resizing`]: {
        userSelect: 'none',
      },

      [`${componentCls}-horizontal${componentCls}-resizing`]: {
        cursor: 'col-resize',
      },

      [`${componentCls}-vertical${componentCls}-resizing`]: {
        cursor: 'row-resize',
      },

      [`${componentCls}-panel`]: {
        flexGrow: 1,
        overflow: 'hidden',

        [`&-nested`]: {
          display: 'flex',
        },

        [`${componentCls}`]: {
          flexGrow: 1,
          minWidth: 0,
          minHeight: 0,
          border: '0 none',
        },
      },

      [`${componentCls}-gutter`]: {
        flexGrow: 0,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        background: colorBorder,
      },

      [`${componentCls}-horizontal > ${componentCls}-gutter`]: {
        cursor: 'col-resize',
      },

      [`${componentCls}-vertical > ${componentCls}-gutter`]: {
        cursor: 'row-resize',
      },

      [`${componentCls}-gutter-handle`]: {
        borderRadius: borderRadiusSM,
        background: colorBorderSecondary,
        transition: `outline-color ${motionDurationMid}, box-shadow ${motionDurationMid}`,
        outlineColor: 'transparent',

        '&:focus-visible': {
          boxShadow: `0 0 0 0.2rem ${colorPrimary}33`,
          outline: '0 none transparent',
          outlineOffset: 0,
        },
      },

      [`${componentCls}-horizontal > ${componentCls}-gutter > ${componentCls}-gutter-handle`]: {
        height: '24px',
        width: '100%',
      },

      [`${componentCls}-vertical > ${componentCls}-gutter > ${componentCls}-gutter-handle`]: {
        width: '24px',
        height: '100%',
      },
    },
  } as CSSObject;
});
