/**
 * 1:1 复刻 ui-4 的 editor-suggestion-menu theme。
 *
 * ui-4 返回 Tailwind v4 工具类；XiaoyeUI 没有 Tailwind，因此 slots 直接映射到
 * style/index.ts 中已注册的 CSS 类名，保持 ui-4 的 slot/variant 结构不变。
 */
export default {
  slots: {
    content: 'xy-rich-text-editor-suggestion-menu-content',
    viewport: 'xy-rich-text-editor-suggestion-menu-viewport',
    group: 'xy-rich-text-editor-suggestion-menu-group',
    label: 'xy-rich-text-editor-suggestion-menu-label',
    separator: 'xy-rich-text-editor-suggestion-menu-separator',
    item: 'xy-rich-text-editor-suggestion-menu-item',
    itemLeading: 'xy-rich-text-editor-suggestion-menu-item-leading',
    itemLeadingIcon: 'xy-rich-text-editor-suggestion-menu-item-leading-icon',
    itemLeadingAvatar: 'xy-rich-text-editor-suggestion-menu-item-leading-avatar',
    itemLeadingAvatarSize: '',
    itemWrapper: 'xy-rich-text-editor-suggestion-menu-item-wrapper',
    itemLabel: 'xy-rich-text-editor-suggestion-menu-item-label',
    itemDescription: 'xy-rich-text-editor-suggestion-menu-item-description',
    itemLabelExternalIcon: 'xy-rich-text-editor-suggestion-menu-item-label-external-icon',
  },
  variants: {
    size: {
      xs: {
        label: 'xy-rich-text-editor-suggestion-menu-label--xs',
        item: 'xy-rich-text-editor-suggestion-menu-item--xs',
        itemLeadingIcon: 'xy-rich-text-editor-suggestion-menu-item-leading-icon--xs',
      },
      sm: {
        label: 'xy-rich-text-editor-suggestion-menu-label--sm',
        item: 'xy-rich-text-editor-suggestion-menu-item--sm',
        itemLeadingIcon: 'xy-rich-text-editor-suggestion-menu-item-leading-icon--sm',
      },
      md: {
        label: 'xy-rich-text-editor-suggestion-menu-label--md',
        item: 'xy-rich-text-editor-suggestion-menu-item--md',
        itemLeadingIcon: 'xy-rich-text-editor-suggestion-menu-item-leading-icon--md',
      },
      lg: {
        label: 'xy-rich-text-editor-suggestion-menu-label--lg',
        item: 'xy-rich-text-editor-suggestion-menu-item--lg',
        itemLeadingIcon: 'xy-rich-text-editor-suggestion-menu-item-leading-icon--lg',
      },
      xl: {
        label: 'xy-rich-text-editor-suggestion-menu-label--xl',
        item: 'xy-rich-text-editor-suggestion-menu-item--xl',
        itemLeadingIcon: 'xy-rich-text-editor-suggestion-menu-item-leading-icon--xl',
      },
    },
    active: {
      true: {
        item: 'xy-rich-text-editor-suggestion-menu-item--active',
        itemLeadingIcon: 'xy-rich-text-editor-suggestion-menu-item-leading-icon--active',
      },
      false: {
        item: '',
        itemLeadingIcon: '',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    active: false,
  },
};
