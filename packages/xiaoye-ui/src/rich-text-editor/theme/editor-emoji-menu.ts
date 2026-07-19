/**
 * 1:1 复刻 ui-4 的 editor-suggestion-menu theme，映射到 emoji 菜单类名。
 *
 * 与 suggestion-menu 共用同一套 CSS 结构，仅 slot 前缀不同。
 */
export default {
  slots: {
    root: 'xy-rich-text-editor-emoji-menu',
    content: 'xy-rich-text-editor-emoji-menu-content',
    viewport: 'xy-rich-text-editor-emoji-menu-viewport',
    group: 'xy-rich-text-editor-emoji-menu-group',
    label: 'xy-rich-text-editor-emoji-menu-label',
    separator: 'xy-rich-text-editor-emoji-menu-separator',
    item: 'xy-rich-text-editor-emoji-menu-item',
    itemLeading: 'xy-rich-text-editor-emoji-menu-item-leading',
    itemLeadingIcon: 'xy-rich-text-editor-emoji-menu-item-leading-icon',
    itemWrapper: 'xy-rich-text-editor-emoji-menu-item-wrapper',
    itemLabel: 'xy-rich-text-editor-emoji-menu-item-label',
  },
  variants: {
    size: {
      xs: {
        label: 'xy-rich-text-editor-emoji-menu-label--xs',
        item: 'xy-rich-text-editor-emoji-menu-item--xs',
        itemLeadingIcon: 'xy-rich-text-editor-emoji-menu-item-leading-icon--xs',
      },
      sm: {
        label: 'xy-rich-text-editor-emoji-menu-label--sm',
        item: 'xy-rich-text-editor-emoji-menu-item--sm',
        itemLeadingIcon: 'xy-rich-text-editor-emoji-menu-item-leading-icon--sm',
      },
      md: {
        label: 'xy-rich-text-editor-emoji-menu-label--md',
        item: 'xy-rich-text-editor-emoji-menu-item--md',
        itemLeadingIcon: 'xy-rich-text-editor-emoji-menu-item-leading-icon--md',
      },
      lg: {
        label: 'xy-rich-text-editor-emoji-menu-label--lg',
        item: 'xy-rich-text-editor-emoji-menu-item--lg',
        itemLeadingIcon: 'xy-rich-text-editor-emoji-menu-item-leading-icon--lg',
      },
      xl: {
        label: 'xy-rich-text-editor-emoji-menu-label--xl',
        item: 'xy-rich-text-editor-emoji-menu-item--xl',
        itemLeadingIcon: 'xy-rich-text-editor-emoji-menu-item-leading-icon--xl',
      },
    },
    active: {
      true: {
        item: 'xy-rich-text-editor-emoji-menu-item--active',
        itemLeadingIcon: 'xy-rich-text-editor-emoji-menu-item-leading-icon--active',
      },
      false: {
        item: '',
        itemLeadingIcon: '',
      },
    },
    layout: {
      list: {
        group: '',
      },
      grid: {
        group: 'xy-rich-text-editor-emoji-menu-group--grid',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    active: false,
    layout: 'grid',
  },
};
