import type { ExtractPropTypes, PropType } from 'vue';
import PropTypes from '../_util/vue-types';
import { booleanType } from '../_util/type';

/**
 * 阻塞目标容器：'body' / CSS 选择器 / HTMLElement / 不传（使用组件根元素）
 */
export type BlockUIContainerType = 'body' | (string & {}) | HTMLElement;

export const blockUIProps = () => ({
  prefixCls: String,
  /** 是否阻塞 */
  blocked: booleanType(false),
  /** 是否阻塞整个文档（等同于 container 为 'body'） */
  fullScreen: booleanType(false),
  /**
   * 阻塞目标容器
   * - 默认使用组件根元素
   * - 传 'body' 时挂到 document.body
   * - 传 CSS 选择器或 HTMLElement 时挂到对应节点
   */
  container: {
    type: [String, Object] as PropType<BlockUIContainerType>,
    default: undefined,
  },
  /** 是否自动管理 z-index */
  autoZIndex: booleanType(true),
  /** z-index 基准值 */
  baseZIndex: { type: Number, default: 0 },
  /** 显式指定 z-index（设置后 autoZIndex 失效） */
  zIndex: { type: Number, default: undefined },
  /** 遮罩自定义类名 */
  maskClassName: { type: String, default: undefined },
  /** 遮罩自定义内联样式 */
  maskStyle: { type: Object as PropType<Record<string, any>>, default: undefined },
  /** 遮罩背景色（覆盖默认遮罩色） */
  maskColor: { type: String, default: undefined },
  /** 遮罩下方加载文案（与 #tip 插槽二选一） */
  tip: PropTypes.any,
});

export type BlockUIProps = Partial<ExtractPropTypes<ReturnType<typeof blockUIProps>>>;

export default blockUIProps;
