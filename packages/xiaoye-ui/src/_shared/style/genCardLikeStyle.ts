import type { CSSObject } from '../../_util/cssinjs';

/**
 * 共享卡片样式（card / panel 复用）。
 * 原 _shared/style/card-like.less 的 .card-like() 混合，迁移为纯 CSS-in-JS 函数。
 * 旧 less 通过 @card-like-* 变量（最终指向 antd seed/map token）驱动，此处直接用 token。
 * 暗色模式交由 ConfigProvider darkAlgorithm 改 token 值，无需 [data-theme='dark'] 覆盖。
 *
 * 修复源项目 bug：返回的 key 必须带点（'.xy-panel'），与 componentCls（带点）保持一致，
 * 否则调用方 `cardLike[componentCls]` 取不到值。
 */
export default function genCardLikeStyle(prefixCls: string, token: any): CSSObject {
  const {
    colorBgContainer,
    colorBorder,
    borderRadiusLG,
    boxShadowTertiary,
    boxShadow,
    paddingMD,
    paddingLG,
    paddingSM,
    paddingXS,
    fontSizeLG,
    fontSize,
    colorText,
    colorTextSecondary,
    colorBgLayout,
    borderRadiusSM,
  } = token;

  return {
    [`.${prefixCls}`]: {
      position: 'relative',
      background: colorBgContainer,
      borderRadius: borderRadiusLG,
      boxShadow: boxShadowTertiary,
      transition: 'box-shadow 0.3s',

      '&-bordered': {
        border: `1px solid ${colorBorder}`,
      },

      '&-hoverable': {
        cursor: 'pointer',

        '&:hover': {
          boxShadow,
        },
      },

      '&-loading': {
        overflow: 'hidden',
      },

      [`.${prefixCls}-header`]: {
        padding: `${paddingMD}px ${paddingLG}px`,
        borderBottom: `1px solid ${colorBorder}`,
        borderRadius: `${borderRadiusLG}px ${borderRadiusLG}px 0 0`,
      },

      [`.${prefixCls}-head-wrapper`]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: `${paddingSM}px`,
      },

      [`.${prefixCls}-head-title`]: {
        flex: 1,
        overflow: 'hidden',
        color: colorText,
        fontSize: fontSizeLG,
        fontWeight: 500,
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      },

      [`.${prefixCls}-head-actions`]: {
        display: 'flex',
        alignItems: 'center',
        gap: `${paddingXS}px`,
      },

      [`.${prefixCls}-extra`]: {
        flexShrink: 0,
        color: colorTextSecondary,
        fontSize,
      },

      [`.${prefixCls}-cover`]: {
        display: 'block',
        margin: '-1px -1px 0',
        overflow: 'hidden',
        borderRadius: `${borderRadiusLG}px ${borderRadiusLG}px 0 0`,

        '> *': {
          display: 'block',
          width: '100%',
        },
      },

      [`.${prefixCls}-body`]: {
        padding: `${paddingLG}px`,
      },

      [`.${prefixCls}-footer`]: {
        padding: `${paddingMD}px ${paddingLG}px`,
        borderTop: `1px solid ${colorBorder}`,
        borderRadius: `0 0 ${borderRadiusLG}px ${borderRadiusLG}px`,
      },

      [`.${prefixCls}-actions`]: {
        display: 'flex',
        alignItems: 'center',
        margin: 0,
        padding: 0,
        listStyle: 'none',
        borderTop: `1px solid ${colorBorder}`,

        '> li': {
          flex: 1,
          padding: `${paddingSM}px 0`,
          textAlign: 'center',

          '&:not(:last-child)': {
            borderRight: `1px solid ${colorBorder}`,
          },
        },
      },

      [`.${prefixCls}-loading`]: {
        display: 'flex',
        flexDirection: 'column',
        gap: `${paddingSM}px`,
      },

      [`.${prefixCls}-loading-block`]: {
        height: `${fontSize}px`,
        background: colorBgLayout,
        borderRadius: borderRadiusSM,

        '&:nth-child(2)': {
          width: '80%',
        },

        '&:nth-child(3)': {
          width: '60%',
        },
      },
    },
  } as CSSObject;
}
