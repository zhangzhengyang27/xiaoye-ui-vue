import type { CSSObject } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';

// 组件 Token
export interface ComponentToken {
  /** 展示区 hover 背景色 */
  inlineEditDisplayHoverBg?: string;
  /** 展示区内边距（数值，单位 px） */
  inlineEditDisplayPadding?: number;
  /** 操作按钮尺寸 */
  inlineEditBtnSize?: number;
  /** 编辑区背景色 */
  inlineEditContentBg?: string;
}

interface InlineEditToken extends FullToken<'InlineEdit'> {
  inlineEditDisplayHoverBg: string;
  inlineEditDisplayPadding: number;
  inlineEditBtnSize: number;
  inlineEditContentBg: string;
}

const genInlineEditStyle: GenerateStyle<InlineEditToken, CSSObject> = (
  token: InlineEditToken,
): CSSObject => {
  const {
    componentCls,
    colorBgLayout,
    colorText,
    colorTextDisabled,
    colorPrimary,
    colorError,
    colorBorder,
    borderRadius,
    paddingXS,
    marginXS,
    motionDurationMid,
    fontSizeIcon,
    lineWidth,
    lineType,
    inlineEditDisplayHoverBg,
    inlineEditDisplayPadding,
    inlineEditBtnSize,
    inlineEditContentBg,
  } = token;

  return {
    [componentCls]: {
      display: 'inline-block',
      maxWidth: '100%',

      [`&-rtl`]: {
        direction: 'rtl',
      },

      // 展示区
      [`${componentCls}-display`]: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: marginXS,
        padding: inlineEditDisplayPadding,
        color: 'inherit',
        cursor: 'pointer',
        background: 'transparent',
        border: `${lineWidth}px ${lineType} transparent`,
        borderRadius,
        transition: `background ${motionDurationMid}, color ${motionDurationMid}, box-shadow ${motionDurationMid}, border-color ${motionDurationMid}`,
        outlineColor: 'transparent',
        userSelect: 'none',
        maxWidth: '100%',

        '&:not(&-disabled):hover': {
          color: colorText,
          background: inlineEditDisplayHoverBg,
          borderColor: colorBorder,

          [`${componentCls}-display-icon`]: {
            opacity: 1,
          },
        },

        '&:focus-visible': {
          boxShadow: 'none',
          outline: `${lineWidth * 2}px solid ${colorPrimary}`,
          outlineOffset: '2px',
        },

        '&-disabled': {
          cursor: 'not-allowed',
          color: colorTextDisabled,
          opacity: 0.6,
        },

        '&-empty': {
          color: colorTextDisabled,
        },
      },

      [`${componentCls}-display-text`]: {
        display: 'inline-block',
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        verticalAlign: 'middle',
      },

      // 编辑图标：默认半透明，hover 时显现
      [`${componentCls}-display-icon`]: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: colorTextDisabled,
        opacity: 0.6,
        transition: `opacity ${motionDurationMid}`,
        fontSize: fontSizeIcon,
        lineHeight: 1,
        flex: 'none',
      },

      // 编辑区
      [`${componentCls}-content`]: {
        display: 'inline-flex',
        alignItems: 'flex-start',
        gap: marginXS,
        padding: inlineEditDisplayPadding,
        background: inlineEditContentBg,
        border: `${lineWidth}px ${lineType} ${colorBorder}`,
        borderRadius,
        maxWidth: '100%',

        [`&-inner`]: {
          flex: 'auto',
          minWidth: 0,
        },
      },

      // 编辑器宽度自适应
      [`${componentCls}-editor`]: {
        width: '12em',
        maxWidth: '100%',
      },

      // 操作按钮组
      [`${componentCls}-actions`]: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: paddingXS,
        flex: 'none',
      },

      [`${componentCls}-btn`]: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: inlineEditBtnSize,
        height: inlineEditBtnSize,
        padding: 0,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        borderRadius,
        transition: `color ${motionDurationMid}, background ${motionDurationMid}`,
        color: colorTextDisabled,

        '&:hover': {
          color: colorText,
          background: colorBgLayout,
        },

        '&:focus-visible': {
          outline: `${lineWidth * 2}px solid ${colorPrimary}`,
          outlineOffset: '2px',
        },

        [`${token.iconCls}`]: {
          fontSize: fontSizeIcon,
          lineHeight: 1,
        },
      },

      [`${componentCls}-btn-save`]: {
        color: colorPrimary,

        '&:hover': {
          color: colorPrimary,
          background: colorBgLayout,
        },
      },

      [`${componentCls}-btn-cancel`]: {
        '&:hover': {
          color: colorError,
          background: colorBgLayout,
        },
      },

      // 禁用状态
      [`&-disabled`]: {
        [`${componentCls}-display`]: {
          cursor: 'not-allowed',
        },
      },
    },
  } as CSSObject;
};

// ============================== Export ==============================
export default genComponentStyleHook(
  'InlineEdit',
  token => {
    const inlineEditToken = mergeToken<InlineEditToken>(token, {
      inlineEditDisplayHoverBg: token.colorBgLayout,
      inlineEditDisplayPadding: token.paddingXS,
      inlineEditBtnSize: token.controlHeightSM,
      inlineEditContentBg: token.colorBgContainer,
    });
    return [genInlineEditStyle(inlineEditToken)];
  },
  {
    inlineEditDisplayHoverBg: 'transparent',
    inlineEditDisplayPadding: 8,
    inlineEditBtnSize: 24,
    inlineEditContentBg: '#ffffff',
  },
);
