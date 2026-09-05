/// <reference types="vue/jsx" />
import type { PropType, ExtractPropTypes } from 'vue';
import { defineComponent, inject, h, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useEditorMenu } from './composables/useEditorMenu';
import { createHandlers } from './utils/editor';
import { tv } from './utils/tv';
import theme from './theme/editor-suggestion-menu';
import type { Editor } from '@tiptap/vue-3';
import type { EditorCustomHandlers, FloatingUIOptions, EditorItem } from './types/editor';
import type { SuggestionOptions } from '@tiptap/suggestion';
import { initDefaultProps } from '../_util/props-util';
import { anyType, arrayType, stringType } from '../_util/type';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';
import { sanitizeSvgString } from '../_util/sanitizeSvg';

// 渲染 leading icon：支持字符串（SVG）、VNode、组件定义
function renderLeadingIcon(icon: any) {
  if (icon == null) return null;
  // 字符串按 SVG 净化后再插入，避免外部数据注入可执行 HTML
  if (typeof icon === 'string') return h('span', { innerHTML: sanitizeSvgString(icon) });
  if (icon.__v_isVnode) return icon;
  if (typeof icon === 'object' || typeof icon === 'function') {
    return h(icon as any);
  }
  return icon;
}

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
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  options?: FloatingUIOptions;
  suggestion?: Omit<
    Partial<SuggestionOptions>,
    'pluginKey' | 'editor' | 'char' | 'items' | 'command' | 'render'
  >;
  appendTo?: HTMLElement | (() => HTMLElement);
}

export default defineComponent({
  name: 'XYRichTextEditorSuggestionMenu',
  inheritAttrs: false,
  __XY_RICH_TEXT_EDITOR_SUGGESTION_MENU: true,
  props: initDefaultProps(richTextEditorSuggestionMenuProps(), {}),
  setup(props) {
    // 使用 RichTextEditor 统一的 prefixCls，确保 SuggestionMenu 共享同一 hashId
    const { prefixCls: _prefixCls } = useConfigInject('rich-text-editor', props);
    const [, hashId] = useStyle(_prefixCls);

    const handlers = inject(
      'editorHandlers',
      computed(() => createHandlers()),
    );

    // 1:1 复刻 ui-4：通过 tv() 组合 theme 与变体
    const ui = computed(() =>
      tv({
        extend: theme,
      })({
        size: props.size,
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
        renderItem: (item: any, styles) => {
          if (item.type === 'label') {
            return [h('span', {}, item.label)];
          }

          return [
            item.icon
              ? h('span', { class: styles.value.itemLeadingIcon() }, [renderLeadingIcon(item.icon)])
              : null,
            h('span', { class: styles.value.itemWrapper() }, [
              h('span', { class: styles.value.itemLabel() }, item.label),
              item.description
                ? h('span', { class: styles.value.itemDescription() }, item.description)
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
