import type { CSSObject } from '../../_util/cssinjs';
import { genComponentStyleHook } from '../../theme/internal';

export interface ComponentToken {
  /** 编辑器边框圆角 */
  borderRadius?: number;
  /** 编辑器边框颜色 */
  borderColor?: string;
  /** 编辑器背景色 */
  bgColor?: string;
}

export default genComponentStyleHook('MarkdownEditor', token => {
  const { componentCls, borderRadius, colorBorder, colorBgContainer, boxShadow } = token;

  return {
    [componentCls]: {
      display: 'block',
      // Vditor 容器圆角与边框处理，与项目其他组件视觉对齐
      '.vditor': {
        borderRadius: `${borderRadius}px`,
        borderColor: colorBorder,
        backgroundColor: colorBgContainer,
        boxShadow,
      },
      // 隐藏 Vditor 内置的边框重叠
      '.vditor-toolbar': {
        borderEndStartRadius: 0,
        borderEndEndRadius: 0,
      },
    },
  } as CSSObject;
});
