import type { CSSObject } from '../../_util/cssinjs';
import { genComponentStyleHook } from '../../theme/internal';

export interface ComponentToken {}

export default genComponentStyleHook('Toolbar', token => {
  const {
    componentCls,
    colorBgContainer,
    colorBorder,
    colorText,
    borderRadiusLG,
    paddingMD,
    paddingLG,
    paddingSM,
  } = token;

  return {
    [componentCls]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      padding: `${paddingMD}px ${paddingLG}px`,
      background: colorBgContainer,
      border: `1px solid ${colorBorder}`,
      color: colorText,
      borderRadius: borderRadiusLG,
      gap: `${paddingMD}px`,

      [`${componentCls}-group`]: {
        display: 'flex',
        alignItems: 'center',
        gap: `${paddingSM}px`,
      },

      [`${componentCls}-group-start`]: {
        justifyContent: 'flex-start',
      },

      [`${componentCls}-group-center`]: {
        justifyContent: 'center',
        flex: 1,
      },

      [`${componentCls}-group-end`]: {
        justifyContent: 'flex-end',
      },
    },
  } as CSSObject;
});
