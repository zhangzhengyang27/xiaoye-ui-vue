import type { CSSObject } from '../../_util/cssinjs';
import { genComponentStyleHook } from '../../theme/internal';

export interface ComponentToken {}

export default genComponentStyleHook('Editor', token => {
  const {
    componentCls,
    colorBgLayout,
    colorBorder,
    borderRadius,
    borderRadiusSM,
    colorTextSecondary,
    colorPrimary,
    colorBgContainer,
    colorText,
    boxShadow,
  } = token;
  // 部分 token 在当前类型中可能缺失，使用 as any 安全访问
  const anyToken = token as any;
  const placeholderColor = anyToken.colorTextQuaternary || 'rgba(0,0,0,0.25)';
  const hoverColor = anyToken.colorPrimaryHover || colorPrimary;
  const errorColor = anyToken.colorError || '#ff4d4f';

  return {
    [componentCls]: {
      display: 'block',
      '&-invalid': {
        [`${componentCls}-toolbar.ql-snow`]: { borderColor: errorColor },
        [`${componentCls}-content.ql-snow`]: { borderColor: errorColor },
      },
      '&-toolbar': {
        background: colorBgLayout,
        borderStartStartRadius: `${borderRadius}px`,
        borderStartEndRadius: `${borderRadius}px`,
      },
      [`${componentCls}-toolbar.ql-snow`]: {
        border: `1px solid ${colorBorder}`,
        '.ql-stroke': { stroke: colorTextSecondary },
        '.ql-fill': { fill: colorTextSecondary },
        '.ql-picker .ql-picker-label': {
          border: '0 none',
          color: colorTextSecondary,
          '&:hover': {
            color: hoverColor,
            '.ql-stroke': { stroke: hoverColor },
            '.ql-fill': { fill: hoverColor },
          },
        },
        '.ql-picker.ql-expanded .ql-picker-label': {
          color: colorPrimary,
          '.ql-stroke': { stroke: colorPrimary },
          '.ql-fill': { fill: colorPrimary },
        },
        '.ql-picker.ql-expanded .ql-picker-options': {
          background: colorBgContainer,
          border: `1px solid ${colorBorder}`,
          boxShadow,
          borderRadius: `${borderRadius}px`,
          padding: '4px 8px',
          '.ql-picker-item': {
            color: colorText,
            borderRadius: `${borderRadiusSM}px`,
            '&:hover': { background: colorBgLayout, color: colorText },
          },
        },
        '.ql-picker.ql-expanded:not(.ql-color-picker, .ql-icon-picker) .ql-picker-item': {
          padding: '5px 8px',
        },
      },
      '&-content': {
        borderEndStartRadius: `${borderRadius}px`,
        borderEndEndRadius: `${borderRadius}px`,
      },
      [`${componentCls}-content.ql-snow`]: {
        border: `1px solid ${colorBorder}`,
        '.ql-editor': {
          background: colorBgContainer,
          color: colorText,
          borderEndStartRadius: `${borderRadius}px`,
          borderEndEndRadius: `${borderRadius}px`,
        },
      },
      '.ql-snow.ql-toolbar button:hover, .ql-snow.ql-toolbar button:focus': {
        color: hoverColor,
        '.ql-stroke': { stroke: hoverColor },
        '.ql-fill': { fill: hoverColor },
      },
      [`.ql-snow.ql-toolbar button.ql-active, .ql-snow.ql-toolbar .ql-picker-label.ql-active, .ql-snow.ql-toolbar .ql-picker-item.ql-selected`]:
        {
          color: colorPrimary,
          '.ql-stroke': { stroke: colorPrimary },
          '.ql-fill': { fill: colorPrimary },
          '.ql-picker-label': { color: colorPrimary },
        },
      '.ql-editor.ql-blank::before': { color: placeholderColor },
    },
  } as CSSObject;
});
