import type { CSSObject } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { resetComponent } from '../../style';

export interface ComponentToken {
  // 拖拽手柄尺寸
  itemHandleSize: number;
  // 列表项内边距
  itemPaddingVertical: number;
  itemPaddingHorizontal: number;
  // 列表项间距
  itemGap: number;
}

interface SortableListToken extends FullToken<'SortableList'> {
  itemHandleSize: number;
  itemPaddingVertical: number;
  itemPaddingHorizontal: number;
  itemGap: number;
}

// 基础样式
const genBaseStyle: GenerateStyle<SortableListToken, CSSObject> = token => {
  const {
    componentCls,
    colorBgContainer,
    colorBorder,
    colorText,
    colorTextDisabled,
    colorTextDescription,
    borderRadiusLG,
    borderRadiusSM,
    fontSize,
    motionDurationMid,
    itemHandleSize,
    itemPaddingVertical,
    itemPaddingHorizontal,
    itemGap,
    colorPrimary,
    controlItemBgHover,
    controlItemBgActive,
  } = token;

  return {
    [componentCls]: {
      ...resetComponent(token),
      display: 'block',

      [`${componentCls}-container`]: {
        display: 'flex',
        gap: itemGap,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        padding: itemPaddingVertical,
      },

      // 垂直方向（默认）
      [`${componentCls}-y ${componentCls}-container`]: {
        flexDirection: 'column',
      },

      // 水平方向
      [`${componentCls}-x ${componentCls}-container`]: {
        flexDirection: 'row',
        overflowX: 'auto',
      },

      // 禁用整体拖拽
      [`&${componentCls}-disabled`]: {
        [`${componentCls}-item`]: {
          cursor: 'default',
        },
        [`${componentCls}-item-handle`]: {
          cursor: 'not-allowed',
          opacity: 0.5,
        },
      },

      // 列表项
      [`${componentCls}-item`]: {
        display: 'flex',
        alignItems: 'center',
        padding: `${itemPaddingVertical}px ${itemPaddingHorizontal}px`,
        background: colorBgContainer,
        border: `1px solid ${colorBorder}`,
        borderRadius: borderRadiusSM,
        color: colorText,
        fontSize,
        cursor: 'grab',
        userSelect: 'none',
        transition: `background ${motionDurationMid}, border-color ${motionDurationMid}, box-shadow ${motionDurationMid}, opacity ${motionDurationMid}`,
        flex: '1 0 auto',

        '&:hover': {
          background: controlItemBgHover,
          borderColor: colorPrimary,
        },

        '&:active': {
          cursor: 'grabbing',
        },

        // 无 handle 模式下，列表项自身可键盘聚焦，需要 focus ring
        '&:focus-visible': {
          outline: 'none',
          boxShadow: `0 0 0 2px ${colorPrimary}66`,
          borderColor: colorPrimary,
        },

        // 拖拽中（正在拖拽的源项）
        [`${componentCls}-item-dragging`]: {
          opacity: 0.5,
          cursor: 'grabbing',
          boxShadow: `0 4px 12px rgba(0, 0, 0, 0.15)`,
        },

        // 拖拽源
        [`&${componentCls}-item-drag-source`]: {
          opacity: 0.4,
        },

        // 放置目标
        [`&${componentCls}-item-drop-target`]: {
          background: controlItemBgActive,
          borderColor: colorPrimary,
          boxShadow: `0 0 0 2px ${colorPrimary}33`,
        },

        // 键盘拾起状态：视觉降低透明度，配合 aria-grabbed="true"
        [`&${componentCls}-item-keyboard-grabbed`]: {
          opacity: 0.5,
          boxShadow: `0 0 0 2px ${colorPrimary}66`,
          borderColor: colorPrimary,
        },

        // 禁用项
        [`&${componentCls}-item-disabled`]: {
          cursor: 'not-allowed',
          color: colorTextDisabled,
          background: 'transparent',

          '&:hover': {
            background: 'transparent',
            borderColor: colorBorder,
          },
        },

        // 拖拽手柄
        [`${componentCls}-item-handle`]: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: itemHandleSize,
          height: itemHandleSize,
          marginInlineEnd: itemPaddingHorizontal,
          color: colorTextDescription,
          cursor: 'grab',
          flexShrink: 0,
          // 允许键盘聚焦，并显示清晰的 focus ring
          outline: 'none',
          borderRadius: borderRadiusSM,

          '&:hover': {
            color: colorPrimary,
          },

          '&:active': {
            cursor: 'grabbing',
          },

          // 键盘聚焦时的 focus ring
          '&:focus-visible': {
            boxShadow: `0 0 0 2px ${colorPrimary}66`,
            color: colorPrimary,
          },

          // svg 跟随当前颜色
          '& .xyicon': {
            display: 'inline-flex',
            lineHeight: 0,
          },
        },

        // 内容区
        [`${componentCls}-item-content`]: {
          flex: '1 1 auto',
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
      },

      // 使用拖拽手柄时，列表项本身的 cursor 改为 default
      [`&${componentCls}-with-handle ${componentCls}-item`]: {
        cursor: 'default',

        '&:active': {
          cursor: 'default',
        },
      },

      // 空状态
      [`${componentCls}-empty`]: {
        padding: `${itemPaddingVertical * 2}px ${itemPaddingHorizontal}px`,
        color: colorTextDisabled,
        fontSize,
        textAlign: 'center',
      },

      // 水平布局下的特殊处理
      [`${componentCls}-x ${componentCls}-item`]: {
        flex: '0 0 auto',
        minWidth: 120,
      },

      // 视觉隐藏的 aria-live 区域：屏幕阅读器可读，但视觉不可见
      [`${componentCls}-sr-only`]: {
        position: 'absolute',
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      },
    },
  };
};

// RTL 支持
const genRtlStyle: GenerateStyle<SortableListToken, CSSObject> = token => {
  const { componentCls } = token;
  return {
    [`${componentCls}-rtl`]: {
      [`${componentCls}-item`]: {
        [`${componentCls}-item-handle`]: {
          marginInlineEnd: 0,
          marginInlineStart: token.itemPaddingHorizontal,
        },
      },
    },
  };
};

export default genComponentStyleHook(
  'SortableList',
  token => {
    const sortableListToken = mergeToken<SortableListToken>(token, {
      itemHandleSize: 16,
      itemPaddingVertical: token.paddingContentVerticalSM,
      itemPaddingHorizontal: token.paddingSM,
      itemGap: token.paddingXS,
    });

    return [genBaseStyle(sortableListToken), genRtlStyle(sortableListToken)];
  },
  {
    itemHandleSize: 16,
    itemPaddingVertical: 8,
    itemPaddingHorizontal: 12,
    itemGap: 4,
  } as ComponentToken,
);
