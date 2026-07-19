import type { CSSObject } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { resetComponent } from '../../style';

export interface ComponentToken {}

interface ChipsToken extends FullToken<'Chips'> {
  chipsInputMinHeight: number;
  chipsItemGap: number;
  chipsItemPaddingInline: number;
  chipsItemPaddingBlock: number;
  chipsInputMinWidth: number;
}

const genBaseStyle: GenerateStyle<ChipsToken, CSSObject> = token => {
  const {
    componentCls,
    colorBgContainer,
    colorBorder,
    colorText,
    colorPrimaryHover,
    colorPrimary,
    controlOutline,
    colorBgLayout,
    colorTextSecondary,
    borderRadius,
    borderRadiusSM,
    paddingXS,
    fontSize,
    lineHeight,
    motionDurationMid,
  } = token;

  return {
    [componentCls]: {
      ...resetComponent(token),
      display: 'inline-flex',
      width: '100%',

      [`${componentCls}-input`]: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        width: '100%',
        minHeight: token.chipsInputMinHeight,
        margin: 0,
        padding: `${token.chipsItemGap}px ${paddingXS}px`,
        gap: `${token.chipsItemGap}px`,
        listStyleType: 'none',
        color: colorText,
        background: colorBgContainer,
        border: `1px solid ${colorBorder}`,
        borderRadius,
        cursor: 'text',
        transition: `border-color ${motionDurationMid}, background-color ${motionDurationMid}, box-shadow ${motionDurationMid}`,
      },

      [`&:not(${componentCls}-disabled):hover ${componentCls}-input`]: {
        borderColor: colorPrimaryHover,
      },

      [`&-focused ${componentCls}-input, ${componentCls}-input:focus-within`]: {
        borderColor: colorPrimary,
        boxShadow: `0 0 0 2px ${controlOutline}`,
        outline: 'none',
      },

      [`&-disabled ${componentCls}-input`]: {
        background: colorBgLayout,
        cursor: 'not-allowed',
        opacity: 0.6,
      },

      [`${componentCls}-item`]: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${token.chipsItemGap}px`,
        padding: `${token.chipsItemPaddingBlock}px ${token.chipsItemPaddingInline}px`,
        background: colorBgLayout,
        borderRadius: borderRadiusSM,
        transition: `background ${motionDurationMid}`,

        '&-focused': {
          background: token.colorBorderSecondary,
        },

        [`&:hover:not(&-focused):not(${componentCls}-disabled &)`]: {
          background: colorBorder,
        },
      },

      [`${componentCls}-item-label`]: {
        lineHeight: 1,
      },

      [`${componentCls}-item-remove`]: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        margin: 0,
        border: 'none',
        background: 'transparent',
        color: colorTextSecondary,
        cursor: 'pointer',
        transition: `color ${motionDurationMid}`,
        fontSize: `${fontSize}px`,

        '&:hover': {
          color: colorText,
        },

        '&:disabled': {
          cursor: 'not-allowed',
          opacity: 0.6,
        },
      },

      [`${componentCls}-input-item`]: {
        flex: '1 1 auto',
        display: 'inline-flex',
        alignItems: 'center',
        minWidth: token.chipsInputMinWidth,
      },

      [`${componentCls}-input-field`]: {
        width: '100%',
        border: '0 none',
        outline: '0 none',
        background: 'transparent',
        margin: 0,
        padding: 0,
        boxShadow: 'none',
        borderRadius: 0,
        fontFamily: 'inherit',
        fontSize,
        lineHeight,
        color: 'inherit',

        '&::placeholder': {
          color: colorTextSecondary,
        },

        '&:disabled': {
          cursor: 'not-allowed',
        },
      },

      [`&-rtl`]: {
        direction: 'rtl',
      },
    },
  };
};

export default genComponentStyleHook('Chips', token => {
  const chipsToken = mergeToken<ChipsToken>(token, {
    chipsInputMinHeight: token.controlHeight,
    chipsItemGap: token.paddingXXS,
    chipsItemPaddingInline: token.paddingXS,
    chipsItemPaddingBlock: 2,
    chipsInputMinWidth: 60,
  });

  return [genBaseStyle(chipsToken)];
});
