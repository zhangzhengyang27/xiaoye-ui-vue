import type { CSSObject } from '../../_util/cssinjs';
import { genComponentStyleHook } from '../../theme/internal';

export interface ComponentToken {}

export default genComponentStyleHook('ContextMenu', token => {
  const {
    componentCls,
    colorBgContainer,
    colorText,
    borderRadius,
    boxShadow,
    borderRadiusSM,
    colorBgLayout,
    colorTextSecondary,
    paddingXS,
    paddingSM,
    paddingLG,
    motionDurationMid,
  } = token;

  return {
    [componentCls]: {
      background: colorBgContainer,
      color: colorText,
      border: '0 none',
      borderRadius,
      boxShadow,
      minWidth: '12.5rem',

      [`${componentCls}-list, ${componentCls}-submenu`]: {
        margin: 0,
        padding: `${paddingXS} 0`,
        listStyle: 'none',
        outline: '0 none',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,

        li: {
          margin: 0,
          padding: 0,
        },
      },

      [`${componentCls}-submenu`]: {
        position: 'absolute',
        minWidth: '100%',
        zIndex: 1,
        background: colorBgContainer,
        color: colorText,
        border: '0 none',
        borderRadius,
        boxShadow,
      },

      [`${componentCls}-item`]: {
        position: 'relative',
        margin: 0,
        padding: 0,
        border: '0 none',
      },

      [`${componentCls}-item-content`]: {
        transition: `background ${motionDurationMid}, color ${motionDurationMid}`,
        borderRadius: borderRadiusSM,
        color: colorText,
      },

      [`${componentCls}-item-link`]: {
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        overflow: 'hidden',
        position: 'relative',
        color: 'inherit',
        padding: `${paddingXS} ${paddingSM}`,
        gap: paddingXS,
        userSelect: 'none',
      },

      [`${componentCls}-item-label`]: {
        lineHeight: 'inherit',
      },

      [`${componentCls}-item-icon`]: {
        color: colorTextSecondary,
      },

      [`${componentCls}-submenu-icon`]: {
        color: colorTextSecondary,
        marginLeft: 'auto',
        fontSize: '14px',
        width: '14px',
        height: '14px',
      },

      [`${componentCls}-submenu-icon:dir(rtl)`]: {
        marginLeft: 0,
        marginRight: 'auto',
      },

      [`${componentCls}-item-focused > ${componentCls}-item-content, ${componentCls}-item:not(${componentCls}-item-disabled) > ${componentCls}-item-content:hover`]:
        {
          color: colorText,
          background: colorBgLayout,
        },

      [`${componentCls}-item-focused > ${componentCls}-item-content ${componentCls}-item-icon, ${componentCls}-item:not(${componentCls}-item-disabled) > ${componentCls}-item-content:hover ${componentCls}-item-icon`]:
        {
          color: colorText,
        },

      [`${componentCls}-item-focused > ${componentCls}-item-content ${componentCls}-submenu-icon, ${componentCls}-item:not(${componentCls}-item-disabled) > ${componentCls}-item-content:hover ${componentCls}-submenu-icon`]:
        {
          color: colorText,
        },

      [`${componentCls}-item-active > ${componentCls}-item-content`]: {
        color: colorText,
        background: colorBgLayout,
      },

      [`${componentCls}-item-active > ${componentCls}-item-content ${componentCls}-item-icon`]: {
        color: colorText,
      },

      [`${componentCls}-item-active > ${componentCls}-item-content ${componentCls}-submenu-icon`]: {
        color: colorText,
      },

      [`${componentCls}-separator`]: {
        display: 'none',
      },

      [`&-mobile ${componentCls}-submenu`]: {
        position: 'static',
        boxShadow: 'none',
        border: '0 none',
        paddingInlineStart: paddingLG,
        paddingInlineEnd: 0,
      },

      [`&-mobile ${componentCls}-submenu-icon`]: {
        transition: `transform ${motionDurationMid}`,
        transform: 'rotate(90deg)',
      },

      [`&-mobile ${componentCls}-item-active > ${componentCls}-item-content ${componentCls}-submenu-icon`]:
        {
          transform: 'rotate(-90deg)',
        },
    },
  } as CSSObject;
});
