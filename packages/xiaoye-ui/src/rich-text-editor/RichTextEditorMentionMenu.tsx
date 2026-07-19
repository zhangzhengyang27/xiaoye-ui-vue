/// <reference types="vue/jsx" />
import type { PropType, ExtractPropTypes } from 'vue';
import {
  defineComponent,
  h,
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick,
  watch,
} from 'vue';
import type { Editor } from '@tiptap/vue-3';
import Avatar from '../avatar';
import { useEditorMenu } from './composables/useEditorMenu';
import { tv } from './utils/tv';
import theme from './theme/editor-mention-menu';
import { initDefaultProps } from '../_util/props-util';
import { anyType, arrayType, booleanType, stringType } from '../_util/type';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';

if (typeof window !== 'undefined') {
  (window as any).__rteMentionMenuLoaded = true;
}

// 渲染 leading icon：支持字符串、VNode、组件定义
function renderLeadingIcon(icon: any) {
  if (icon == null) return null;
  // 字符串：作为文本渲染
  if (typeof icon === 'string') return icon;
  // VNode：直接返回
  if (icon.__v_isVnode) return icon;
  // 组件定义（对象/函数）：用 h() 渲染
  if (typeof icon === 'object' || typeof icon === 'function') {
    return h(icon as any);
  }
  return icon;
}

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
  size: stringType<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md'),
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

export default defineComponent({
  name: 'XYRichTextEditorMentionMenu',
  inheritAttrs: false,
  __XY_RICH_TEXT_EDITOR_MENTION_MENU: true,
  props: initDefaultProps(richTextEditorMentionMenuProps(), {}),
  emits: ['update:searchTerm'],
  setup(props, { emit }) {
    // 使用 RichTextEditor 统一的 prefixCls，确保 MentionMenu 共享同一 hashId
    const { prefixCls: _prefixCls } = useConfigInject('rich-text-editor', props);
    const [, hashId] = useStyle(_prefixCls);

    // 1:1 复刻 ui-4：通过 tv() 组合 theme 与变体
    const ui = computed(() =>
      tv({
        extend: theme,
      })({
        size: props.size,
      }),
    );

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
        items: computed(() => props.items),
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
        ui,
        hashId: hashId.value,
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
        renderItem: (item, styles) => [
          item.avatar
            ? h(Avatar, {
                ...item.avatar,
                image: item.avatar.image ?? item.avatar.src,
                // 尊重 item.avatar.size/shape，默认 small/circle
                size: (item.avatar.size ?? 'small') as any,
                shape: (item.avatar.shape ?? 'circle') as any,
                class: styles.value.itemLeadingAvatar(),
              })
            : item.icon
              ? h('span', { class: styles.value.itemLeadingIcon() }, [renderLeadingIcon(item.icon)])
              : null,
          h('span', { class: styles.value.itemWrapper() }, [
            h('span', { class: styles.value.itemLabel() }, item.label),
            item.description
              ? h('span', { class: styles.value.itemDescription() }, item.description)
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
