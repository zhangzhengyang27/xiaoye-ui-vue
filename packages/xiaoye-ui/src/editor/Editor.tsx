/// <reference types="vue/jsx" />
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, watch, useSlots } from 'vue';
import { initDefaultProps } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';
import editorProps from './editorTypes';

// SSR 安全：仅浏览器端可访问 document/window
const isClient = typeof window !== 'undefined' && !!window.document;

export default defineComponent({
  name: 'XYEditor',
  inheritAttrs: false,
  __XY_EDITOR: true,
  props: initDefaultProps(editorProps(), {}),
  emits: ['update:modelValue', 'value-change', 'text-change', 'selection-change', 'load'],
  setup(props, { emit, expose }) {
    const { prefixCls } = useConfigInject('editor', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const slots = useSlots();

    const { editorStyle } = props;

    const toolbarElement = ref<HTMLElement | null>(null);
    const editorElement = ref<HTMLElement | null>(null);

    const d_value = ref(props.defaultValue !== undefined ? props.defaultValue : props.modelValue);

    const rootClasses = computed(() => {
      return [
        'xy-editor',
        hashId.value,
        {
          'xy-editor-invalid': props.invalid,
        },
      ];
    });

    let quill: any = null;

    watch(
      () => props.modelValue,
      (newValue, oldValue) => {
        if (newValue !== oldValue && quill && !quill.hasFocus()) {
          renderValue(newValue);
        }
      },
    );

    watch(
      () => props.defaultValue,
      newValue => {
        d_value.value = newValue;
      },
    );

    watch(
      () => props.readonly,
      () => {
        handleReadOnlyChange();
      },
    );

    function renderValue(value: string) {
      if (quill) {
        if (value) {
          const delta = quill.clipboard.convert({ html: value });
          quill.setContents(delta);
        } else {
          quill.setText('');
        }
      }
    }

    function writeValue(value: string, _event?: Event) {
      d_value.value = value;
      emit('update:modelValue', value);
      emit('value-change', value);
    }

    function initQuill() {
      renderValue(d_value.value);

      quill.on('text-change', (delta: any, _oldContents: any, source: any) => {
        if (source === 'user') {
          let html = quill.getSemanticHTML();
          const text = quill.getText().trim();

          if (html === '<p><br></p>') {
            html = '';
          }

          writeValue(html);
          emit('text-change', {
            htmlValue: html,
            textValue: text,
            delta,
            source,
            instance: quill,
          });
        }
      });

      quill.on('selection-change', (range: any, oldRange: any, source: any) => {
        const html = quill.getSemanticHTML();
        const text = quill.getText().trim();

        emit('selection-change', {
          htmlValue: html,
          textValue: text,
          range,
          oldRange,
          source,
          instance: quill,
        });
      });
    }

    function handleLoad() {
      if (quill && quill.getModule('toolbar')) {
        emit('load', { instance: quill });
      }
    }

    function handleReadOnlyChange() {
      if (quill) quill.enable(!props.readonly);
    }

    // 客户端初始化 Quill
    onMounted(() => {
      if (!isClient) return;

      const configuration = {
        modules: {
          toolbar: toolbarElement.value,
          ...props.modules,
        },
        readOnly: props.readonly,
        theme: 'snow',
        formats: props.formats,
        placeholder: props.placeholder,
      };

      const QuillJS = (function () {
        try {
          return (window as any).Quill;
        } catch {
          return null;
        }
      })();

      if (QuillJS) {
        quill = new QuillJS(editorElement.value, configuration);
        initQuill();
        handleLoad();
      } else {
        // 动态加载 quill 主题 CSS（SSR 安全，失败时忽略）
        // @ts-ignore - quill CSS 模块无类型声明
        import('quill/dist/quill.snow.css').catch(() => {});

        // 动态加载 quill 模块并初始化
        import('quill').then(quillModule => {
          if (editorElement.value) {
            if ((quillModule as any).default) {
              quill = new (quillModule as any).default(editorElement.value, configuration);
            } else {
              quill = new (quillModule as any)(editorElement.value, configuration);
            }

            initQuill();
            handleLoad();
          }
        });
      }
    });

    onBeforeUnmount(() => {
      if (quill) {
        if (typeof quill.disable === 'function') {
          quill.disable();
        }
        if (typeof quill.destroy === 'function') {
          quill.destroy();
        }
        quill = null;
      }
    });

    expose({
      quill,
      d_value,
      renderValue,
      writeValue,
      initQuill,
      handleLoad,
      handleReadOnlyChange,
    });

    return () => {
      const toolbarSlot = slots.toolbar?.();

      return wrapSSR(
        <div class={rootClasses.value}>
          <div ref={toolbarElement} class="xy-editor-toolbar">
            {toolbarSlot ?? (
              <>
                <span class="ql-formats">
                  <select class="ql-header">
                    <option value="1">标题</option>
                    <option value="2">子标题</option>
                    <option value="0" selected>
                      正文
                    </option>
                  </select>
                  <select class="ql-font">
                    <option></option>
                    <option value="serif"></option>
                    <option value="monospace"></option>
                  </select>
                </span>
                <span class="ql-formats">
                  <button class="ql-bold" type="button"></button>
                  <button class="ql-italic" type="button"></button>
                  <button class="ql-underline" type="button"></button>
                </span>
                <span class="ql-formats">
                  <select class="ql-color"></select>
                  <select class="ql-background"></select>
                </span>
                <span class="ql-formats">
                  <button class="ql-list" value="ordered" type="button"></button>
                  <button class="ql-list" value="bullet" type="button"></button>
                  <select class="ql-align">
                    <option selected></option>
                    <option value="center"></option>
                    <option value="right"></option>
                    <option value="justify"></option>
                  </select>
                </span>
                <span class="ql-formats">
                  <button class="ql-link" type="button"></button>
                  <button class="ql-image" type="button"></button>
                  <button class="ql-code-block" type="button"></button>
                </span>
                <span class="ql-formats">
                  <button class="ql-clean" type="button"></button>
                </span>
              </>
            )}
          </div>
          <div ref={editorElement} class="xy-editor-content" style={editorStyle}></div>
        </div>,
      );
    };
  },
});
