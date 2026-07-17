/// <reference types="vue/jsx" />
import type { PropType, ExtractPropTypes } from 'vue';
import { defineComponent, h, onMounted, onBeforeUnmount, nextTick, toRef } from 'vue';
import { useEditorMenu } from './composables/useEditorMenu';
import type { Editor } from '@tiptap/vue-3';
import type { FloatingUIOptions } from './types/editor';
import type { SuggestionOptions } from '@tiptap/suggestion';
import { initDefaultProps } from '../_util/props-util';
import { anyType, arrayType, stringType } from '../_util/type';

export interface EmojiMenuItem {
  name: string;
  emoji?: string;
  shortcodes: string[];
  tags: string[];
  group?: string;
  [key: string]: any;
}

export const richTextEditorEmojiMenuProps = () => ({
  prefixCls: String,
  editor: { type: Object as PropType<Editor>, required: true },
  items: anyType<EmojiMenuItem[] | EmojiMenuItem[][]>(),
  char: stringType(':'),
  pluginKey: stringType('emojiMenu'),
  filterFields: arrayType<string[]>(['name', 'shortcodes', 'tags']),
  limit: { type: Number, default: undefined },
  options: { type: Object as PropType<FloatingUIOptions>, default: undefined },
  suggestion: {
    type: Object as PropType<
      Omit<
        Partial<SuggestionOptions>,
        'pluginKey' | 'editor' | 'char' | 'items' | 'command' | 'render'
      >
    >,
    default: undefined,
  },
  appendTo: {
    type: [Object, Function] as PropType<HTMLElement | (() => HTMLElement)>,
    default: undefined,
  },
});

export type RichTextEditorEmojiMenuProps = Partial<
  ExtractPropTypes<ReturnType<typeof richTextEditorEmojiMenuProps>>
>;

const MENU_CLASSES = {
  root: 'xy-rich-text-editor-emoji-menu',
  content: 'xy-rich-text-editor-emoji-menu-content',
  viewport: 'xy-rich-text-editor-emoji-menu-viewport',
  group: 'xy-rich-text-editor-emoji-menu-group',
  label: 'xy-rich-text-editor-emoji-menu-label',
  separator: 'xy-rich-text-editor-emoji-menu-separator',
  item: 'xy-rich-text-editor-emoji-menu-item',
  itemActive: 'xy-rich-text-editor-emoji-menu-item-active',
  itemLeading: 'xy-rich-text-editor-emoji-menu-item-leading',
  itemLeadingIcon: 'xy-rich-text-editor-emoji-menu-item-icon',
  itemWrapper: 'xy-rich-text-editor-emoji-menu-item-wrapper',
  itemLabel: 'xy-rich-text-editor-emoji-menu-item-label',
};

export default defineComponent({
  name: 'XYRichTextEditorEmojiMenu',
  inheritAttrs: false,
  __XY_RICH_TEXT_EDITOR_EMOJI_MENU: true,
  props: initDefaultProps(richTextEditorEmojiMenuProps(), {}),
  setup(props) {
    let menu: ReturnType<typeof useEditorMenu> | null = null;

    onMounted(async () => {
      await nextTick();

      if (!props.editor || props.editor.isDestroyed) return;

      menu = useEditorMenu({
        editor: props.editor,
        char: props.char,
        pluginKey: props.pluginKey,
        items: toRef(() => props.items),
        filterFields: props.filterFields,
        limit: props.limit,
        options: props.options,
        suggestion: props.suggestion,
        appendTo: props.appendTo,
        classes: MENU_CLASSES,
        onSelect: (editor, range, item) => {
          if (!item.emoji) return;

          editor.chain().focus().deleteRange(range).insertContent(item.emoji).run();
        },
        renderItem: (item, classes) => {
          const content = item.emoji || item.shortcodes[0] || item.name;
          return [
            h('span', { class: classes.itemLeadingIcon }, content),
            h('span', { class: classes.itemWrapper }, [
              h('span', { class: classes.itemLabel }, item.name),
            ]),
          ];
        },
      });

      props.editor.registerPlugin(menu.plugin);
    });

    onBeforeUnmount(() => {
      if (menu) {
        menu.destroy();
        menu = null;
      }

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
