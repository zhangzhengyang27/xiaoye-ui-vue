import type { CSSObject } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';

export interface ComponentToken {}

export interface ToggleButtonToken extends FullToken<'ToggleButton'> {}

const genToggleButtonStyle: GenerateStyle<ToggleButtonToken> = token => {
  const {
    componentCls,
    colorText,
    colorBgContainer,
    colorBorder,
    colorPrimary,
    colorTextLightSolid,
    colorBgLayout,
    colorTextDisabled,
    controlOutline,
    paddingXXS,
    paddingXS,
    paddingSM,
    paddingMD,
    borderRadius,
    borderRadiusSM,
    fontSize,
    fontSizeSM,
    fontSizeLG,
    motionDurationFast,
  } = token;

  return {
    [componentCls]: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      userSelect: 'none',
      overflow: 'hidden',
      position: 'relative',
      color: colorText,
      background: colorBgContainer,
      border: `1px solid ${colorBorder}`,
      padding: `${paddingXXS}px ${paddingSM}px`,
      fontSize,
      fontWeight: 500,
      lineHeight: 1,
      borderRadius,
      outlineColor: 'transparent',
      transition: `background ${motionDurationFast}, color ${motionDurationFast}, border-color ${motionDurationFast}, box-shadow ${motionDurationFast}`,

      '&:hover:not(:disabled):not(&-checked)': {
        background: colorBgLayout,
      },

      '&:focus-visible': {
        outline: 'none',
        boxShadow: `0 0 0 2px ${controlOutline}`,
      },

      '&-checked': {
        background: colorPrimary,
        borderColor: colorPrimary,
        color: colorTextLightSolid,
      },

      '&:disabled': {
        cursor: 'not-allowed',
        opacity: 0.6,
        background: colorBgLayout,
        borderColor: colorBorder,
        color: colorTextDisabled,
      },

      '&-small': {
        padding: `2px ${paddingSM}px`,
        fontSize: fontSizeSM,
      },

      '&-large': {
        padding: `${paddingXS}px ${paddingMD}px`,
        fontSize: fontSizeLG,
      },

      [`${componentCls}-content`]: {
        display: 'inline-flex',
        flex: '1 1 auto',
        alignItems: 'center',
        justifyContent: 'center',
        gap: paddingXS,
        padding: `2px ${paddingXS}px`,
        background: 'transparent',
        borderRadius: borderRadiusSM,
        transition: `background ${motionDurationFast}, color ${motionDurationFast}`,
      },

      [`${componentCls}-icon, ${componentCls}-label`]: {
        position: 'relative',
        lineHeight: 1,
      },

      [`${componentCls}-icon`]: {
        display: 'inline-flex',
        alignItems: 'center',
        color: 'inherit',
      },
    },

    [`${componentCls}-group`]: {
      display: 'inline-flex',
      userSelect: 'none',
      verticalAlign: 'bottom',
      outlineColor: 'transparent',
      borderRadius,

      [`${componentCls}`]: {
        borderRadius: 0,
        borderWidth: '1px 1px 1px 0',

        '&:focus-visible': {
          position: 'relative',
          zIndex: 1,
        },

        '&:first-child': {
          borderInlineStartWidth: '1px',
          borderStartStartRadius: borderRadius,
          borderEndStartRadius: borderRadius,
        },

        '&:last-child': {
          borderStartEndRadius: borderRadius,
          borderEndEndRadius: borderRadius,
        },
      },
    },
  } as CSSObject;
};

export default genComponentStyleHook('ToggleButton', token => {
  const toggleButtonToken = mergeToken<ToggleButtonToken>(token, {});
  return [genToggleButtonStyle(toggleButtonToken)];
});
