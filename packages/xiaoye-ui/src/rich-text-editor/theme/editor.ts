/**
 * 1:1 复刻 ui-4 的 editor theme。
 *
 * ui-4 返回 Tailwind v4 工具类；XiaoyeUI 没有 Tailwind，因此 slots 直接映射到
 * style/index.ts 中已注册的 CSS 类名，保持 ui-4 的 slot/variant 结构不变。
 */
export default {
  slots: {
    root: 'xy-rich-text-editor',
    content: 'xy-rich-text-editor-content',
    base: 'xy-rich-text-editor-base',
  },
  variants: {
    placeholderMode: {
      firstLine: {
        base: 'xy-rich-text-editor-base--firstLine',
      },
      everyLine: {
        base: 'xy-rich-text-editor-base--everyLine',
      },
    },
  },
  defaultVariants: {
    placeholderMode: 'everyLine',
  },
};
