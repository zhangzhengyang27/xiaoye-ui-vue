/// <reference types="vue/jsx" />
import type { PropType, ExtractPropTypes } from 'vue';
import { defineComponent, h, ref, onMounted, onBeforeUnmount, nextTick, toRef, watch } from 'vue';
import type { Editor } from '@tiptap/vue-3';
import Avatar from '../avatar';
import { useEditorMenu } from './composables/useEditorMenu';
import { initDefaultProps } from '../_util/props-util';
import { anyType, arrayType, booleanType, stringType } from '../_util/type';

export interface EditorMentionMenuItem {
  label: string;
  description?: string;
  icon?: string;
  avatar?: {
    src?: string;
    image?: string;
    label?: string;
    icon?: string;
    shape?: string;
    size?: string;
    loading?: string;
  };
  disabled?: boolean;
  class?: any;
  [key: string]: any;
}

export const richTextEditorMentionMenuProps = () => ({
  prefixCls: String,
  editor: { type: Object as PropType<Editor>, required: true },
  items: anyType<EditorMentionMenuItem[] | EditorMentionMenuItem[][]>(),
  char: stringType('@'),
  pluginKey: stringType('mentionMenu'),
  filterFields: arrayType<string[]>(),
  ignoreFilter: booleanType(undefined),
  limit: { type: Number, default: undefined },
  options: { type: Object, default: undefined },
  suggestion: { type: Object, default: undefined },
  appendTo: {
    type: [Object, Function] as PropType<HTMLElement | (() => HTMLElement)>,
    default: undefined,
  },
  searchTerm: { type: String, default: '' },
});

export type RichTextEditorMentionMenuProps = Partial<
  ExtractPropTypes<ReturnType<typeof richTextEditorMentionMenuProps>>
>;

export interface EditorMentionMenuEmits {
  'update:searchTerm': [value: string];
}

const MENU_CLASSES = {
  root: 'xy-rich-text-editor-mention-menu',
  content: 'xy-rich-text-editor-mention-menu-content',
  viewport: 'xy-rich-text-editor-mention-menu-viewport',
  group: 'xy-rich-text-editor-mention-menu-group',
  label: 'xy-rich-text-editor-mention-menu-label',
  separator: 'xy-rich-text-editor-mention-menu-separator',
  item: 'xy-rich-text-editor-mention-menu-item',
  itemActive: 'xy-rich-text-editor-mention-menu-item-active',
  itemLeading: 'xy-rich-text-editor-mention-menu-item-leading',
  itemLeadingAvatar: 'xy-rich-text-editor-mention-menu-item-leading-avatar',
  itemLeadingIcon: 'xy-rich-text-editor-mention-menu-item-leading-icon',
  itemWrapper: 'xy-rich-text-editor-mention-menu-item-wrapper',
  itemLabel: 'xy-rich-text-editor-mention-menu-item-label',
  itemDescription: 'xy-rich-text-editor-mention-menu-item-description',
};

export default defineComponent({
  name: 'XYRichTextEditorMentionMenu',
  inheritAttrs: false,
  __XY_RICH_TEXT_EDITOR_MENTION_MENU: true,
  props: initDefaultProps(richTextEditorMentionMenuProps(), {}),
  emits: ['update:searchTerm'],
  setup(props, { emit }) {
    // 维护内部 searchTerm ref，通过 watch 同步给父组件
    // 修复 bug：原实现用 `{ value: props.searchTerm, onChange: ... } as any` 传入 useEditorMenu，
    // 但 useEditorMenu 期望 Ref<string>，onChange 永远不会被调用，导致 searchTerm 无法同步。
    const internalSearchTerm = ref(props.searchTerm);

    // 同步父组件传入的 searchTerm 到内部
    watch(
      () => props.searchTerm,
      val => {
        internalSearchTerm.value = val;
      },
    );

    let menu: ReturnType<typeof useEditorMenu> | null = null;

    onMounted(async () => {
      await nextTick();

      if (!props.editor || props.editor.isDestroyed) {
        return;
      }

      menu = useEditorMenu({
        editor: props.editor,
        char: props.char,
        pluginKey: props.pluginKey,
        items: toRef(() => props.items),
        filterFields: props.filterFields,
        ignoreFilter: props.ignoreFilter,
        limit: props.limit,
        options: props.options,
        suggestion: props.suggestion,
        appendTo: props.appendTo,
        searchTerm: internalSearchTerm,
        onSearchTermChange: (val: string) => {
          emit('update:searchTerm', val);
        },
        classes: MENU_CLASSES,
        onSelect: (editor, range, item) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContent({
              type: 'mention',
              attrs: {
                ...item,
                mentionSuggestionChar: props.char,
              },
            })
            .run();
        },
        renderItem: (item, classes) => [
          item.avatar
            ? h(Avatar, {
                ...item.avatar,
                image: item.avatar.image ?? item.avatar.src,
                size: 'small',
                shape: 'circle',
                class: classes.itemLeadingAvatar,
              })
            : item.icon
              ? h('span', { class: classes.itemLeadingIcon }, [item.icon])
              : null,
          h('span', { class: classes.itemWrapper }, [
            h('span', { class: classes.itemLabel }, item.label),
            item.description
              ? h('span', { class: classes.itemDescription }, item.description)
              : null,
          ]),
        ],
      });

      props.editor.registerPlugin(menu.plugin);
    });

    onBeforeUnmount(() => {
      if (menu) {
        menu.destroy();
        menu = null;
      }

      // 修复 bug：原实现没有 try/catch，与 SuggestionMenu/EmojiMenu 不一致，
      // 当 editor 已销毁或 pluginKey 不存在时会抛错。
      if (props.editor && !props.editor.isDestroyed) {
        try {
          props.editor.unregisterPlugin(props.pluginKey);
        } catch {
          // editor 已销毁或 plugin 不存在，忽略
        }
      }
    });

    return () => h('div');
  },
});
