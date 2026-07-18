/// <reference types="vue/jsx" />
import { computed, defineComponent, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { initDefaultProps } from '../_util/props-util';
import classNames from '../_util/classNames';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { CheckOutlined, CloseOutlined, EditOutlined } from '@xiaoye-ui/icons';
import Input from '../input';
import TextArea from '../input/TextArea';
import type { CustomSlotsType } from '../_util/type';
import { inlineEditProps } from './inlineEditTypes';
import useStyle from './style';

// SSR 安全判断
const isClient = typeof window !== 'undefined' && !!window.document;

export default defineComponent({
  name: 'XYInlineEdit',
  inheritAttrs: false,
  __XY_INLINE_EDIT: true,
  props: initDefaultProps(inlineEditProps(), {
    type: 'text',
    disabled: false,
    editable: false,
    autoSave: false,
  }),
  emits: ['update:modelValue', 'update:editable', 'change', 'save', 'cancel', 'edit'],
  slots: Object as CustomSlotsType<{
    default?: (scope: { value: any; editable: boolean }) => any;
    edit?: (scope: { value: any; save: () => void; cancel: () => void }) => any;
  }>,
  setup(props, { slots, attrs, emit, expose }) {
    const { prefixCls, direction } = useConfigInject('inline-edit', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    // 内部编辑态
    const d_editable = ref(props.editable);
    // 临时编辑值：进入编辑模式时从 modelValue 拷贝，保存/取消时同步或丢弃
    const d_value = ref(props.modelValue);
    const rootRef = ref<HTMLElement | null>(null);
    const inputRef = ref<any>(null);

    // 外部 editable 变化时同步内部状态
    watch(
      () => props.editable,
      val => {
        if (val && !d_editable.value) {
          enterEdit();
        } else if (!val && d_editable.value) {
          // 外部主动关闭：按取消处理，还原临时值
          d_value.value = props.modelValue;
          d_editable.value = false;
        }
      },
    );

    // 外部 modelValue 变化时同步临时值（非编辑态或 autoSave 持续同步场景）
    watch(
      () => props.modelValue,
      val => {
        d_value.value = val;
      },
    );

    function isEmpty(val: any) {
      return val === null || val === undefined || val === '';
    }

    // 数字类型归一化：空串保留，否则转 Number
    function normalizeValue(val: any) {
      if (props.type === 'number') {
        if (val === '' || val === null || val === undefined) return val;
        const num = Number(val);
        return Number.isNaN(num) ? val : num;
      }
      return val;
    }

    // 进入编辑模式
    function enterEdit(event?: Event) {
      if (props.disabled || d_editable.value) return;
      d_value.value = props.modelValue;
      d_editable.value = true;
      emit('update:editable', true);
      emit('edit', event);
      if (isClient) {
        nextTick(() => {
          inputRef.value?.focus?.();
        });
      }
    }

    // 保存
    function save(_event?: Event) {
      if (!d_editable.value) return;
      const oldValue = props.modelValue;
      const newValue = normalizeValue(d_value.value);
      const changed = newValue !== oldValue;
      d_editable.value = false;
      emit('update:editable', false);
      if (changed) {
        emit('update:modelValue', newValue);
        emit('change', newValue);
      }
      emit('save', newValue);
      // 临时值与最新值保持一致
      d_value.value = newValue;
    }

    // 取消
    function cancel(_event?: Event) {
      if (!d_editable.value) return;
      d_value.value = props.modelValue;
      d_editable.value = false;
      emit('update:editable', false);
      emit('cancel', props.modelValue);
    }

    // 输入值变化
    function handleChange(val: any) {
      d_value.value = val;
      // autoSave：每次输入变化即触发保存，但保留编辑态
      if (props.autoSave) {
        const newValue = normalizeValue(val);
        emit('update:modelValue', newValue);
        emit('change', newValue);
        emit('save', newValue);
      }
    }

    // Enter 保存：textarea 时由 Ctrl/Shift/Cmd + Enter 触发
    function handlePressEnter(event?: Event) {
      if (props.type === 'textarea') {
        const ke = event as KeyboardEvent;
        if (ke?.ctrlKey || ke?.metaKey || ke?.shiftKey) {
          ke.preventDefault();
          save(event);
        }
        return;
      }
      save(event);
    }

    // 外部点击保存
    function handleDocumentMouseDown(event: MouseEvent) {
      if (!d_editable.value) return;
      const target = event.target as Node | null;
      if (rootRef.value && target && !rootRef.value.contains(target)) {
        save(event);
      }
    }

    // Esc 取消
    function handleDocumentKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && d_editable.value) {
        event.preventDefault();
        cancel(event);
      }
    }

    onMounted(() => {
      if (!isClient) return;
      document.addEventListener('mousedown', handleDocumentMouseDown);
      document.addEventListener('keydown', handleDocumentKeyDown);
    });

    onBeforeUnmount(() => {
      if (!isClient) return;
      document.removeEventListener('mousedown', handleDocumentMouseDown);
      document.removeEventListener('keydown', handleDocumentKeyDown);
    });

    expose({ save, cancel, edit: enterEdit });

    const rootClasses = computed(() =>
      classNames(prefixCls.value, hashId.value, attrs.class as string, {
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        [`${prefixCls.value}-disabled`]: props.disabled,
      }),
    );

    const displayClasses = computed(() =>
      classNames(`${prefixCls.value}-display`, {
        [`${prefixCls.value}-display-disabled`]: props.disabled,
        [`${prefixCls.value}-display-empty`]: isEmpty(props.modelValue),
      }),
    );

    const displayText = computed(() => {
      const val = props.modelValue;
      if (isEmpty(val)) {
        return props.placeholder || '';
      }
      return String(val);
    });

    const renderEditor = () => {
      const { type, placeholder, disabled } = props;
      const sharedProps = {
        ref: inputRef,
        value: d_value.value,
        placeholder,
        disabled,
        class: `${prefixCls.value}-editor`,
        'onUpdate:value': handleChange,
        onPressEnter: handlePressEnter,
      };
      if (type === 'textarea') {
        return <TextArea {...sharedProps} autoSize />;
      }
      return <Input {...sharedProps} type={type === 'number' ? 'number' : 'text'} />;
    };

    return () =>
      wrapSSR(
        <div
          ref={rootRef}
          class={rootClasses.value}
          {...attrs}
          aria-live="polite"
          aria-atomic="true"
        >
          {!d_editable.value ? (
            <div
              class={displayClasses.value}
              tabindex={props.disabled ? -1 : 0}
              role="button"
              aria-disabled={props.disabled}
              onClick={enterEdit}
              onKeydown={(e: KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  enterEdit(e);
                }
              }}
            >
              {slots.default ? (
                slots.default({ value: props.modelValue, editable: false })
              ) : (
                <span class={`${prefixCls.value}-display-text`}>{displayText.value}</span>
              )}
              {!props.disabled ? (
                <span class={`${prefixCls.value}-display-icon`} aria-hidden="true">
                  <EditOutlined />
                </span>
              ) : null}
            </div>
          ) : (
            <div class={`${prefixCls.value}-content`}>
              <div class={`${prefixCls.value}-content-inner`}>
                {slots.edit ? slots.edit({ value: d_value.value, save, cancel }) : renderEditor()}
              </div>
              {!slots.edit ? (
                <div class={`${prefixCls.value}-actions`}>
                  <button
                    type="button"
                    class={classNames(`${prefixCls.value}-btn`, `${prefixCls.value}-btn-save`)}
                    aria-label="保存"
                    onClick={save}
                  >
                    <CheckOutlined />
                  </button>
                  <button
                    type="button"
                    class={classNames(`${prefixCls.value}-btn`, `${prefixCls.value}-btn-cancel`)}
                    aria-label="取消"
                    onClick={cancel}
                  >
                    <CloseOutlined />
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>,
      );
  },
});
