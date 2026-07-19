/**
 * 1:1 复刻 ui-4 的 editor-suggestion-menu theme，映射到 mention 菜单类名。
 *
 * 与 suggestion-menu 共用同一套 CSS 结构，仅 slot 前缀不同，并增加 avatar 相关 slots。
 */
export default {
  slots: {
    root: 'xy-rich-text-editor-mention-menu',
    content: 'xy-rich-text-editor-mention-menu-content',
    viewport: 'xy-rich-text-editor-mention-menu-viewport',
    group: 'xy-rich-text-editor-mention-menu-group',
    label: 'xy-rich-text-editor-mention-menu-label',
    separator: 'xy-rich-text-editor-mention-menu-separator',
    item: 'xy-rich-text-editor-mention-menu-item',
    itemLeading: 'xy-rich-text-editor-mention-menu-item-leading',
    itemLeadingIcon: 'xy-rich-text-editor-mention-menu-item-leading-icon',
    itemLeadingAvatar: 'xy-rich-text-editor-mention-menu-item-leading-avatar',
    itemLeadingAvatarSize: '',
    itemWrapper: 'xy-rich-text-editor-mention-menu-item-wrapper',
    itemLabel: 'xy-rich-text-editor-mention-menu-item-label',
    itemDescription: 'xy-rich-text-editor-mention-menu-item-description',
    itemLabelExternalIcon: 'xy-rich-text-editor-mention-menu-item-label-external-icon',
  },
  variants: {
    size: {
      xs: {
        label: 'xy-rich-text-editor-mention-menu-label--xs',
        item: 'xy-rich-text-editor-mention-menu-item--xs',
        itemLeadingIcon: 'xy-rich-text-editor-mention-menu-item-leading-icon--xs',
      },
      sm: {
        label: 'xy-rich-text-editor-mention-menu-label--sm',
        item: 'xy-rich-text-editor-mention-menu-item--sm',
        itemLeadingIcon: 'xy-rich-text-editor-mention-menu-item-leading-icon--sm',
      },
      md: {
        label: 'xy-rich-text-editor-mention-menu-label--md',
        item: 'xy-rich-text-editor-mention-menu-item--md',
        itemLeadingIcon: 'xy-rich-text-editor-mention-menu-item-leading-icon--md',
      },
      lg: {
        label: 'xy-rich-text-editor-mention-menu-label--lg',
        item: 'xy-rich-text-editor-mention-menu-item--lg',
        itemLeadingIcon: 'xy-rich-text-editor-mention-menu-item-leading-icon--lg',
      },
      xl: {
        label: 'xy-rich-text-editor-mention-menu-label--xl',
        item: 'xy-rich-text-editor-mention-menu-item--xl',
        itemLeadingIcon: 'xy-rich-text-editor-mention-menu-item-leading-icon--xl',
      },
    },
    active: {
      true: {
        item: 'xy-rich-text-editor-mention-menu-item--active',
        itemLeadingIcon: 'xy-rich-text-editor-mention-menu-item-leading-icon--active',
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
