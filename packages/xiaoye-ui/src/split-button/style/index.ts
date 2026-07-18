import type { CSSInterpolation, CSSObject } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';

// 组件专属 Token
export interface ComponentToken {
  // 主按钮与下拉按钮之间的分隔线宽度
  splitBorderWidth?: number;
}

export interface SplitButtonToken extends FullToken<'SplitButton'> {
  // 按钮组容器类名（带点前缀），由 rootCls 派生
  btnCls: string;
}

// 生成基础样式：基于 Button.Group，调整两个按钮的圆角与边框衔接
const genBaseStyle: GenerateStyle<SplitButtonToken, CSSObject> = token => {
  const {
    componentCls,
    rootCls,
    btnCls,
    paddingXS,
    opacityLoading,
    fontSizeIcon,
    motionDurationMid,
  } = token;

  return {
    [componentCls]: {
      whiteSpace: 'nowrap',

      // 按钮组内按钮的衔接处理
      [`&${rootCls}-btn-group > ${btnCls}`]: {
        // 加载状态：禁止交互并降低透明度
        [`&-loading, &-loading + ${btnCls}`]: {
          cursor: 'default',
          pointerEvents: 'none',
          opacity: opacityLoading,
        },

        // 下拉触发按钮（右侧最后一个）：紧凑内边距，清除左侧圆角
        [`&:last-child:not(:first-child):not(${btnCls}-icon-only)`]: {
          paddingInline: paddingXS,
          borderStartStartRadius: 0,
          borderEndStartRadius: 0,
        },

        // 主按钮（左侧第一个）：清除右侧圆角
        [`&:first-child:not(:last-child)`]: {
          borderStartEndRadius: 0,
          borderEndEndRadius: 0,
        },

        // 聚焦时提升层级，避免被相邻按钮遮挡
        '&:focus-visible': {
          position: 'relative',
          zIndex: 1,
        },
      },

      // 下拉箭头图标
      [`${token.iconCls}-down`]: {
        fontSize: fontSizeIcon,
        transition: `transform ${motionDurationMid}`,
      },
    },

    // 菜单展开时箭头旋转 180°
    [`${componentCls}-open ${token.iconCls}-down::before`]: {
      transform: 'rotate(180deg)',
    },
  } as CSSObject;
};

// ============================== Export ==============================
export default genComponentStyleHook(
  'SplitButton',
  (token, { rootPrefixCls }) => {
    const splitButtonToken = mergeToken<SplitButtonToken>(token, {
      btnCls: `.${rootPrefixCls}-btn`,
    });

    return [genBaseStyle(splitButtonToken)] as CSSInterpolation;
  },
  (token: any) => ({
    splitBorderWidth: token.lineWidth,
  }),
);
