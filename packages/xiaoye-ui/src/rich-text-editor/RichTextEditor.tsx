/// <reference types="vue/jsx" />
import type { VNode, ExtractPropTypes, PropType } from 'vue';
import { computed, provide, watch, defineComponent, onBeforeUnmount, ref } from 'vue';
import {
  useEditor,
  EditorContent,
  type EditorOptions,
  type Content,
  type Editor,
} from '@tiptap/vue-3';
import { mergeAttributes } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import type { StarterKitOptions } from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import type { PlaceholderOptions } from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import type { ImageOptions } from '@tiptap/extension-image';
import Mention from '@tiptap/extension-mention';
import type { MentionOptions } from '@tiptap/extension-mention';
import Code from '@tiptap/extension-code';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import { Markdown } from '@tiptap/markdown';
import type { MarkdownExtensionOptions } from '@tiptap/markdown';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import { Table } from '@tiptap/extension-table';
import type { TableOptions } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { defu } from 'defu';
import CodeBlockShiki from 'tiptap-extension-code-block-shiki';
import type { CodeBlockShikiOptions } from 'tiptap-extension-code-block-shiki';
import { initDefaultProps } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useComponentProps from '../_util/hooks/useComponentProps';
import useStyle from './style';
import type { EditorHandlers, EditorCustomHandlers } from './types/editor';
import { createHandlers } from './utils/editor';
import { tv } from './utils/tv';
import theme from './theme/editor';
import Primitive from './Primitive';
import EditorLinkPopover from './EditorLinkPopover';

// SSR 安全：仅浏览器端可访问 document/window
const isClient = typeof window !== 'undefined' && !!window.document;

export type RichTextEditorContentType = 'json' | 'html' | 'markdown';

export const richTextEditorProps = () => ({
  prefixCls: String,
  modelValue: { type: [String, Object, Array] as PropType<any>, default: undefined },
  as: { type: [String, Object] as PropType<string | object>, default: 'div' },
  contentType: { type: String as PropType<RichTextEditorContentType>, default: undefined },
  placeholder: {
    type: [String, Object] as PropType<
      string | Partial<PlaceholderOptions & { mode?: 'firstLine' | 'everyLine' }>
    >,
    default: undefined,
  },
  starterKit: {
    type: [Boolean, Object] as PropType<boolean | Partial<StarterKitOptions>>,
    default: true,
  },
  image: { type: [Boolean, Object] as PropType<boolean | Partial<ImageOptions>>, default: true },
  mention: {
    type: [Boolean, Object] as PropType<
      boolean | Partial<Omit<MentionOptions, 'suggestion' | 'suggestions'>>
    >,
    default: true,
  },
  table: { type: [Boolean, Object] as PropType<boolean | Partial<TableOptions>>, default: true },
  markdown: { type: Object as PropType<Partial<MarkdownExtensionOptions>>, default: undefined },
  codeBlockShiki: {
    type: [Boolean, Object] as PropType<boolean | Partial<CodeBlockShikiOptions> | false>,
    default: true,
  },
  disabled: { type: Boolean, default: false },
  extensions: { type: Array as PropType<EditorOptions['extensions']>, default: undefined },
  editorProps: { type: Object as PropType<EditorOptions['editorProps']>, default: undefined },
  handlers: { type: Object as PropType<EditorCustomHandlers>, default: undefined },
  classNames: {
    type: Object as PropType<{
      root?: string;
      content?: string;
      linkPopover?: string;
    }>,
    default: undefined,
  },
  ui: {
    type: Object as PropType<{
      root?: string;
      content?: string;
      base?: string;
    }>,
    default: undefined,
  },
});

export type RichTextEditorProps = Partial<ExtractPropTypes<ReturnType<typeof richTextEditorProps>>>;

export interface RichTextEditorSlots {
  default?(props: { editor: Editor | undefined; handlers: EditorHandlers }): VNode[];
}

export default defineComponent({
  name: 'XYRichTextEditor',
  inheritAttrs: false,
  __XY_RICH_TEXT_EDITOR: true,
  props: initDefaultProps(richTextEditorProps(), {}),
  emits: ['update:modelValue'],
  setup(props, { attrs, slots, emit, expose }) {
    const { prefixCls } = useConfigInject('rich-text-editor', props);
    const [, hashId] = useStyle(prefixCls);

    // 通过 ConfigProvider 注入的组件级 props 默认值
    const mergedProps = useComponentProps('RichTextEditor', props);

    const contentType = computed(
      () =>
        mergedProps.value.contentType || (typeof props.modelValue === 'string' ? 'html' : 'json'),
    );

    const starterKit = computed(() => {
      const userOptions: Partial<StarterKitOptions> =
        typeof props.starterKit === 'boolean' ? {} : (props.starterKit ?? {});

      const plainText: Partial<StarterKitOptions> =
        props.starterKit === false
          ? {
              blockquote: false,
              bold: false,
              bulletList: false,
              code: false,
              codeBlock: false,
              dropcursor: false,
              gapcursor: false,
              heading: false,
              horizontalRule: false,
              italic: false,
              listItem: false,
              listKeymap: false,
              link: false,
              orderedList: false,
              strike: false,
              underline: false,
              trailingNode: false,
            }
          : {};

      return defu(userOptions, plainText, {
        code: false,
        codeBlock: false,
        horizontalRule: false,
        underline: false,
        taskList: {
          nested: true,
        },
        dropcursor: {
          color: 'var(--xy-color-primary)',
          width: 2,
        },
        link: {
          openOnClick: false,
        },
      } as Partial<StarterKitOptions>);
    });

    const isPlainText = computed(() => props.starterKit === false);

    const placeholder = computed(() => {
      const options =
        typeof props.placeholder === 'string'
          ? { placeholder: props.placeholder }
          : props.placeholder;
      const { mode, ...rest } = (options || {}) as any;
      return defu(rest, {
        showOnlyWhenEditable: false,
        showOnlyCurrent: true,
      } as Partial<PlaceholderOptions>);
    });

    const placeholderMode = computed(
      () =>
        (typeof props.placeholder === 'object' ? props.placeholder?.mode : undefined) ||
        'everyLine',
    );

    const markdown = computed(() =>
      defu(props.markdown, {
        markedOptions: { gfm: true },
      } as Partial<MarkdownExtensionOptions>),
    );

    const image = computed(() => (typeof props.image === 'boolean' ? {} : props.image));

    const mention = computed(() =>
      defu(typeof props.mention === 'boolean' ? {} : props.mention, {
        HTMLAttributes: {
          class: 'mention',
        },
        renderText({ node }: { node: any }) {
          return `${node.attrs.mentionSuggestionChar ?? '@'}${node.attrs.label ?? node.attrs.id}`;
        },
        renderHTML({ options, node }: { options: any; node: any }) {
          return [
            'span',
            mergeAttributes({ 'data-type': 'mention' }, options.HTMLAttributes),
            `${node.attrs.mentionSuggestionChar ?? '@'}${node.attrs.label ?? node.attrs.id}`,
          ];
        },
      } as Partial<MentionOptions>),
    );

    const table = computed(() => (typeof props.table === 'boolean' ? {} : props.table || {}));

    const codeBlockShikiOptions = computed(() => {
      if (props.codeBlockShiki === false) return null;
      const options = typeof props.codeBlockShiki === 'object' ? props.codeBlockShiki : {};
      return defu(options, {
        defaultTheme: 'material-theme',
        themes: {
          light: 'material-theme-lighter',
          dark: 'material-theme-palenight',
        },
      } as Partial<CodeBlockShikiOptions>);
    });

    const extensions = computed(() =>
      [
        contentType.value === 'markdown' && Markdown.configure(markdown.value),
        StarterKit.configure(starterKit.value),
        !isPlainText.value &&
          TextAlign.configure({
            types: ['heading', 'paragraph'],
          }),
        !isPlainText.value && TextStyle,
        !isPlainText.value &&
          Highlight.configure({
            multicolor: true,
          }),
        !isPlainText.value && Underline,
        !isPlainText.value &&
          Code.extend({
            excludes: 'code',
          }),
        !isPlainText.value &&
          HorizontalRule.extend({
            renderHTML() {
              return [
                'div',
                mergeAttributes(this.options.HTMLAttributes, { 'data-type': this.name }),
                ['hr'],
              ];
            },
          }),
        !isPlainText.value && props.image !== false && Image.configure(image.value),
        !isPlainText.value && props.mention !== false && Mention.configure(mention.value),
        !isPlainText.value &&
          props.table !== false &&
          Table.configure({
            resizable: true,
            HTMLAttributes: {
              class: 'table',
            },
            ...table.value,
          }),
        !isPlainText.value && props.table !== false && TableRow,
        !isPlainText.value && props.table !== false && TableCell,
        !isPlainText.value && props.table !== false && TableHeader,
        !isPlainText.value &&
          props.codeBlockShiki !== false &&
          codeBlockShikiOptions.value &&
          CodeBlockShiki.configure(codeBlockShikiOptions.value),
        props.placeholder && Placeholder.configure(placeholder.value),
        ...(props.extensions || []),
      ].filter(extension => !!extension),
    );

    // 1:1 复刻 ui-4：通过 tv() 组合 theme 与变体
    const ui = computed(() =>
      tv({
        extend: theme,
      })({
        placeholderMode: placeholderMode.value,
      }),
    );

    const editorProps = computed(() => {
      // 排除 data-slot，避免透传到 ProseMirror DOM 干扰样式系统
      const { dataSlot, class: _, ...restAttrs } = attrs as Record<string, any>;
      return defu(props.editorProps, {
        attributes: {
          autocomplete: 'off',
          autocorrect: 'off',
          autocapitalize: 'off',
          ...restAttrs,
          class: ui.value.base({ class: [props.classNames?.content, props.ui?.base] }),
        },
      } as EditorOptions['editorProps']);
    });

    const editor = useEditor({
      content: props.modelValue as Content,
      contentType: contentType.value,
      extensions: extensions.value,
      editorProps: editorProps.value,
      onCreate: ({ editor }) => {
        if (props.placeholder) {
          editor.view.dispatch(editor.state.tr);
        }
      },
      onUpdate: ({ editor }) => {
        let value;
        try {
          if (contentType.value === 'html') {
            value = editor.getHTML();
          } else if (contentType.value === 'json') {
            value = editor.getJSON();
          } else if (contentType.value === 'markdown') {
            value = editor.getMarkdown();
          }
        } catch {
          value = editor.getText();
        }
        emit('update:modelValue', value);
      },
    });

    onBeforeUnmount(() => {
      if (isClient && editor.value && !editor.value.isDestroyed) {
        editor.value.destroy();
      }
    });

    watch(
      () => props.modelValue,
      newVal => {
        if (!editor.value || newVal == null) return;

        const currentContent =
          contentType.value === 'html'
            ? editor.value.getHTML()
            : contentType.value === 'json'
              ? JSON.stringify(editor.value.getJSON())
              : contentType.value === 'markdown'
                ? editor.value.getMarkdown()
                : editor.value.getText();

        const newContent =
          contentType.value === 'json' && typeof newVal === 'object'
            ? JSON.stringify(newVal)
            : String(newVal);

        if (currentContent !== newContent) {
          const currentSelection = editor.value.state.selection;
          const currentPos = currentSelection.from;

          editor.value.commands.setContent(newVal, {
            contentType: contentType.value,
          } as any);

          const newDoc = editor.value.state.doc;
          if (currentPos <= newDoc.content.size) {
            editor.value.commands.setTextSelection(currentPos);
          }
        }
      },
    );

    watch(
      () => props.disabled,
      val => {
        if (editor.value) {
          editor.value.setEditable(!val);
        }
      },
      { immediate: true },
    );

    const linkPopoverRef = ref<{ open: () => void; close: () => void } | null>(null);

    const handlers = computed(() => {
      const base = createHandlers();
      const customHandlers = props.handlers || {};

      if (!customHandlers.link) {
        base.link = {
          ...base.link,
          execute: (editor: Editor, cmd: any) => {
            if (linkPopoverRef.value?.open) {
              linkPopoverRef.value.open();
              return editor.chain();
            }
            return createHandlers().link.execute(editor, cmd);
          },
        };
      }

      return { ...base, ...customHandlers } as EditorHandlers<any>;
    });

    provide('editorHandlers', handlers);

    expose({ editor });

    return () => {
      return (
        <Primitive
          as={props.as}
          class={ui.value.root({
            class: [hashId.value, props.classNames?.root, props.ui?.root, attrs.class as any],
          })}
          data-slot="root"
        >
          {editor.value && (
            <>
              {slots.default?.({ editor: editor.value, handlers: handlers.value })}
              <EditorContent
                editor={editor.value}
                data-slot="content"
                class={ui.value.content({ class: props.ui?.content })}
              />
              <EditorLinkPopover
                ref={linkPopoverRef as any}
                editor={editor.value}
                class={props.classNames?.linkPopover}
                {...({ 'data-slot': 'link-popover' } as any)}
              />
            </>
          )}
        </Primitive>
      );
    };
  },
});
