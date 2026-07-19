/// <reference types="vue/jsx" />
import type { PropType, ExtractPropTypes } from 'vue';
import { defineComponent, ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import type { Editor } from '@tiptap/vue-3';
import { initDefaultProps } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';

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
    // 使用 RichTextEditor 统一的 prefixCls，确保 link-popover 共享同一 hashId
    const { prefixCls: _prefixCls } = useConfigInject('rich-text-editor', props);
    const [, hashId] = useStyle(_prefixCls);

    const visible = ref(false);
    const url = ref('');
    const containerRef = ref<HTMLElement | null>(null);
    const inputRef = ref<HTMLInputElement | null>(null);
    const positionStyle = ref({ top: '0px', left: '0px' });

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

        if (!isClient) return;
        // 基于当前选区/光标定位 popover，避免出现在编辑器左上角
        const selection = window.getSelection();
        let rect: DOMRect | undefined;
        if (selection && selection.rangeCount > 0) {
          rect = selection.getRangeAt(0).getBoundingClientRect();
        }
        if (
          (!rect || (rect.width === 0 && rect.height === 0)) &&
          props.editor?.view?.dom &&
          typeof props.editor.view.dom.getBoundingClientRect === 'function'
        ) {
          rect = props.editor.view.dom.getBoundingClientRect();
        }
        if (rect) {
          positionStyle.value = {
            top: `${rect.bottom + 8}px`,
            left: `${rect.left}px`,
          };
        }
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

    // 修复 bug：autoOpen 在挂载时立即打开会导致页面加载即显示弹窗。
    // 改为仅在 onMounted 后检查一次，并监听后续变化；移除 immediate 避免
    // setup 阶段就触发 open。
    watch(
      () => props.autoOpen,
      val => {
        if (val) open();
      },
    );

    // 修复 bug：SSR 守卫，避免在非客户端环境访问 document
    onMounted(() => {
      if (!isClient) return;
      document.addEventListener('keydown', handleKeydown);
      if (props.autoOpen) {
        nextTick(() => open());
      }
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
          class={['xy-rich-text-editor-link-popover', hashId.value]}
          style={positionStyle.value}
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
