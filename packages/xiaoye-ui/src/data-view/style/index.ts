import type { CSSObject } from '../../_util/cssinjs';
import { genComponentStyleHook } from '../../theme/internal';

export interface ComponentToken {}

export default genComponentStyleHook('DataView', token => {
  const {
    componentCls,
    colorBorder,
    borderRadius,
    colorBgContainer,
    colorText,
    paddingSM,
    paddingMD,
    colorBgLayout,
    colorTextSecondary,
  } = token;

  return {
    [componentCls]: {
      border: `1px solid ${colorBorder}`,
      borderRadius: `${borderRadius}px`,
      background: colorBgContainer,
      color: colorText,
      padding: 0,
      overflow: 'hidden',

      '&-header': {
        background: colorBgLayout,
        color: colorText,
        borderBottom: `1px solid ${colorBorder}`,
        padding: `${paddingSM}px ${paddingMD}px`,
      },

      '&-content': {
        background: colorBgContainer,
        color: colorText,
        padding: 0,
      },

      '&-empty-message': {
        padding: `${paddingMD}px`,
        color: colorTextSecondary,
        textAlign: 'center',
      },

      '&-footer': {
        background: colorBgLayout,
        color: colorText,
        borderTop: `1px solid ${colorBorder}`,
        padding: `${paddingSM}px ${paddingMD}px`,
      },

      '&-pagination': {
        borderColor: colorBorder,
        borderStyle: 'solid',

        '&-top': {
          borderWidth: '0 0 1px 0',
        },

        '&-bottom': {
          borderWidth: '1px 0 0 0',
        },
      },
    },
  } as CSSObject;
});
