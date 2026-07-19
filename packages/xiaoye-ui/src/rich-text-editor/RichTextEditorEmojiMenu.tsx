/// <reference types="vue/jsx" />
import type { PropType, ExtractPropTypes } from 'vue';
import { defineComponent, h, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useEditorMenu } from './composables/useEditorMenu';
import { tv } from './utils/tv';
import theme from './theme/editor-emoji-menu';
import type { Editor } from '@tiptap/vue-3';
import type { FloatingUIOptions } from './types/editor';
import type { SuggestionOptions } from '@tiptap/suggestion';
import { initDefaultProps } from '../_util/props-util';
import { anyType, arrayType, stringType } from '../_util/type';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';

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
  size: stringType<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md'),
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
  // 布局模式：list / grid（默认 grid，emoji 多时更紧凑）
  layout: { type: String as PropType<'list' | 'grid'>, default: 'grid' },
});

export type RichTextEditorEmojiMenuProps = Partial<
  ExtractPropTypes<ReturnType<typeof richTextEditorEmojiMenuProps>>
>;

export default defineComponent({
  name: 'XYRichTextEditorEmojiMenu',
  inheritAttrs: false,
  __XY_RICH_TEXT_EDITOR_EMOJI_MENU: true,
  props: initDefaultProps(richTextEditorEmojiMenuProps(), {}),
  setup(props) {
    // 使用 RichTextEditor 统一的 prefixCls，确保 EmojiMenu 共享同一 hashId
    const { prefixCls: _prefixCls } = useConfigInject('rich-text-editor', props);
    const [, hashId] = useStyle(_prefixCls);

    // 1:1 复刻 ui-4：通过 tv() 组合 theme 与变体
    const ui = computed(() =>
      tv({
        extend: theme,
      })({
        size: props.size,
        layout: props.layout,
      }),
    );

    let menu: ReturnType<typeof useEditorMenu> | null = null;

    onMounted(async () => {
      await nextTick();

      if (!props.editor || props.editor.isDestroyed) return;

      menu = useEditorMenu({
        editor: props.editor,
        char: props.char,
        pluginKey: props.pluginKey,
        items: computed(() => props.items),
        filterFields: props.filterFields,
        limit: props.limit,
        options: props.options,
        suggestion: props.suggestion,
        appendTo: props.appendTo,
        ui,
        hashId: hashId.value,
        onSelect: (editor, range, item) => {
          if (!item.emoji) return;

          editor.chain().focus().deleteRange(range).insertContent(item.emoji).run();
        },
        renderItem: (item, styles) => {
          const content = item.emoji || item.shortcodes[0] || item.name;
          return [
            h('span', { class: styles.value.itemLeadingIcon() }, content),
            h('span', { class: styles.value.itemWrapper() }, [
              h('span', { class: styles.value.itemLabel() }, item.name),
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
