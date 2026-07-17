/// <reference types="vue/jsx" />
import type { PropType, ExtractPropTypes } from 'vue';
import {
  defineComponent,
  inject,
  h,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick,
  toRef,
} from 'vue';
import { useEditorMenu } from './composables/useEditorMenu';
import { createHandlers } from './utils/editor';
import type { Editor } from '@tiptap/vue-3';
import type { EditorCustomHandlers, FloatingUIOptions, EditorItem } from './types/editor';
import type { SuggestionOptions } from '@tiptap/suggestion';
import { initDefaultProps } from '../_util/props-util';
import { anyType, arrayType, stringType } from '../_util/type';

export type EditorSuggestionMenuLabelItem = {
  type: 'label';
  label: string;
  class?: any;
  [key: string]: any;
};

export type EditorSuggestionMenuSeparatorItem = {
  type: 'separator';
  class?: any;
  [key: string]: any;
};

export type EditorSuggestionMenuActionItem<H extends EditorCustomHandlers = EditorCustomHandlers> =
  {
    type?: never;
    label: string;
    description?: string;
    icon?: string;
    disabled?: boolean;
    class?: any;
  } & EditorItem<H>;

export type EditorSuggestionMenuItem<H extends EditorCustomHandlers = EditorCustomHandlers> =
  | EditorSuggestionMenuLabelItem
  | EditorSuggestionMenuSeparatorItem
  | EditorSuggestionMenuActionItem<H>;

export const richTextEditorSuggestionMenuProps = () => ({
  prefixCls: String,
  editor: { type: Object as PropType<Editor>, required: true },
  items: anyType<any[] | any[][]>(),
  char: stringType('/'),
  pluginKey: stringType('suggestionMenu'),
  filterFields: arrayType<string[]>(['label']),
  limit: { type: Number, default: 42 },
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

export type RichTextEditorSuggestionMenuProps = Partial<
  ExtractPropTypes<ReturnType<typeof richTextEditorSuggestionMenuProps>>
>;

export interface EditorSuggestionMenuProps {
  editor: Editor;
  items?: any[] | any[][];
  char?: string;
  pluginKey?: string;
  filterFields?: string[];
  limit?: number;
  options?: FloatingUIOptions;
  suggestion?: Omit<
    Partial<SuggestionOptions>,
    'pluginKey' | 'editor' | 'char' | 'items' | 'command' | 'render'
  >;
  appendTo?: HTMLElement | (() => HTMLElement);
}

const MENU_CLASSES = {
  root: 'xy-rich-text-editor-suggestion-menu',
  content: 'xy-rich-text-editor-suggestion-menu-content',
  viewport: 'xy-rich-text-editor-suggestion-menu-viewport',
  group: 'xy-rich-text-editor-suggestion-menu-group',
  label: 'xy-rich-text-editor-suggestion-menu-label',
  separator: 'xy-rich-text-editor-suggestion-menu-separator',
  item: 'xy-rich-text-editor-suggestion-menu-item',
  itemActive: 'xy-rich-text-editor-suggestion-menu-item-active',
  itemLeading: 'xy-rich-text-editor-suggestion-menu-item-leading',
  itemLeadingIcon: 'xy-rich-text-editor-suggestion-menu-item-icon',
  itemWrapper: 'xy-rich-text-editor-suggestion-menu-item-wrapper',
  itemLabel: 'xy-rich-text-editor-suggestion-menu-item-label',
  itemDescription: 'xy-rich-text-editor-suggestion-menu-item-description',
};

export default defineComponent({
  name: 'XYRichTextEditorSuggestionMenu',
  inheritAttrs: false,
  __XY_RICH_TEXT_EDITOR_SUGGESTION_MENU: true,
  props: initDefaultProps(richTextEditorSuggestionMenuProps(), {}),
  setup(props) {
    // 改进：原实现用 `{ value: createHandlers() } as any` 作为 inject 默认值，
    // 类型不一致。这里改用 computed，与 RichTextEditorToolbar 的 inject 方式一致。
    const handlers = inject(
      'editorHandlers',
      computed(() => createHandlers()),
    );

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
        onSelect: (editor, range, item: any) => {
          if (item.type === 'label' || item.type === 'separator') return;

          editor.chain().focus().deleteRange(range).run();

          const handler = handlers?.value?.[item.kind];
          if (handler) {
            const result = handler.execute(editor, item);
            if (result && typeof result.run === 'function') {
              result.run();
            }
          }
        },
        renderItem: (item: any, classes) => {
          if (item.type === 'label') {
            return [h('span', {}, item.label)];
          }

          return [
            item.icon ? h('span', { class: classes.itemLeadingIcon }, item.icon) : null,
            h('span', { class: classes.itemWrapper }, [
              h('span', { class: classes.itemLabel }, item.label),
              item.description
                ? h('span', { class: classes.itemDescription }, item.description)
                : null,
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
