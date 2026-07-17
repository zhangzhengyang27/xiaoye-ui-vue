import type { ExtractPropTypes, PropType } from 'vue';

/**
 * Portal appendTo 接受：
 * - 'body' / 'self' 字符串字面量
 * - 任意 CSS 选择器字符串
 * - HTMLElement 实例
 */
export type PortalAppendToType = 'body' | 'self' | (string & {}) | HTMLElement;

export const portalProps = () => ({
  prefixCls: String,
  appendTo: {
    type: [String, Object] as PropType<PortalAppendToType>,
    default: 'body' as const,
  },
  disabled: { type: Boolean, default: false },
  position: { type: String, default: undefined },
  group: { type: String, default: undefined },
});

export type PortalProps = Partial<ExtractPropTypes<ReturnType<typeof portalProps>>>;

export default portalProps;
