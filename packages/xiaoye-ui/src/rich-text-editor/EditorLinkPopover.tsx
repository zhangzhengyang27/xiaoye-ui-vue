/// <reference types="vue/jsx" />
import type { PropType, ExtractPropTypes } from 'vue';
import { defineComponent, ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import type { Editor } from '@tiptap/vue-3';
import { initDefaultProps } from '../_util/props-util';

// SSR 安全：仅浏览器端可访问 document/window
const isClient = typeof window !== 'undefined' && !!window.document;

export const editorLinkPopoverProps = () => ({
  prefixCls: String,
  // editor 改为非 required：避免在 editor 还未就绪（useEditor 异步创建）或独立使用时
  // 触发 Vue 的 "Expected Object, got Undefined" prop 警告（BUG-01）
  editor: { type: Object as PropType<Editor>, default: undefined },
  autoOpen: { type: Boolean, default: false },
});

export type EditorLinkPopoverProps = Partial<
  ExtractPropTypes<ReturnType<typeof editorLinkPopoverProps>>
>;

export default defineComponent({
  name: 'XYEditorLinkPopover',
  inheritAttrs: false,
  __XY_EDITOR_LINK_POPOVER: true,
  props: initDefaultProps(editorLinkPopoverProps(), {}),
  emits: ['open', 'close'],
  setup(props, { emit, expose }) {
    const visible = ref(false);
    const url = ref('');
    const containerRef = ref<HTMLElement | null>(null);
    const inputRef = ref<HTMLInputElement | null>(null);

    let outsideClickListener: ((event: MouseEvent) => void) | null = null;

    function checkSelection() {
      if (!props.editor) {
        url.value = '';
        return;
      }

      const attrs = props.editor.getAttributes('link');
      url.value = attrs?.href || '';
    }

    function open() {
      checkSelection();
      visible.value = true;
      emit('open');
      nextTick(() => {
        inputRef.value?.focus();
        inputRef.value?.select();
      });
      bindOutsideClickListener();
    }

    function close() {
      visible.value = false;
      url.value = '';
      emit('close');
      unbindOutsideClickListener();
    }

    function apply() {
      if (!props.editor) return;

      if (url.value.trim()) {
        props.editor.chain().focus().setLink({ href: url.value.trim() }).run();
      } else {
        props.editor.chain().focus().unsetLink().run();
      }
      close();
    }

    function handleKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        apply();
      }
    }

    function bindOutsideClickListener() {
      if (outsideClickListener || !containerRef.value) return;

      outsideClickListener = (event: MouseEvent) => {
        if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
          close();
        }
      };

      document.addEventListener('mousedown', outsideClickListener);
    }

    function unbindOutsideClickListener() {
      if (outsideClickListener) {
        document.removeEventListener('mousedown', outsideClickListener);
        outsideClickListener = null;
      }
    }

    watch(
      () => props.autoOpen,
      val => {
        if (val) open();
      },
      { immediate: true },
    );

    // 修复 bug：SSR 守卫，避免在非客户端环境访问 document
    onMounted(() => {
      if (!isClient) return;
      document.addEventListener('keydown', handleKeydown);
    });

    onBeforeUnmount(() => {
      if (isClient) {
        document.removeEventListener('keydown', handleKeydown);
      }
      unbindOutsideClickListener();
    });

    expose({ open, close });

    return () => {
      if (!visible.value) return null;

      return (
        <div
          ref={containerRef}
          class="xy-rich-text-editor-link-popover"
          role="dialog"
          aria-modal={false}
          onMousedown={(e: MouseEvent) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div class="xy-rich-text-editor-link-popover-header">
            <span class="xy-rich-text-editor-link-popover-header-icon" aria-hidden="true">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </span>
            <span class="xy-rich-text-editor-link-popover-header-label">链接</span>
          </div>

          <div class="xy-rich-text-editor-link-popover-input-wrapper">
            <input
              ref={inputRef}
              value={url.value}
              type="url"
              placeholder="https://example.com"
              class="xy-rich-text-editor-link-popover-input"
              autofocus
              onKeydown={handleKeydown}
              onInput={(e: Event) => {
                url.value = (e.target as HTMLInputElement).value;
              }}
            />
          </div>

          <div class="xy-rich-text-editor-link-popover-button-group">
            <button
              type="button"
              class="xy-rich-text-editor-link-popover-button xy-rich-text-editor-link-popover-button-cancel"
              onClick={close}
            >
              取消
            </button>
            <button
              type="button"
              class="xy-rich-text-editor-link-popover-button xy-rich-text-editor-link-popover-button-apply"
              onClick={apply}
            >
              应用
            </button>
          </div>
        </div>
      );
    };
  },
});
