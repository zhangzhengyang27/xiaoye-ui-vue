import type { App, Plugin } from 'vue';
import { computed, defineComponent, ref, watch } from 'vue';
import classNames from '../_util/classNames';
import { initDefaultProps } from '../_util/props-util';
import { registerComponent } from '../_util/registerComponent';
import type { CustomSlotsType } from '../_util/type';
import { CloseOutlined } from '@xiaoye-ui/icons';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { chipsProps } from './interface';
import useStyle from './style';

const Chips = defineComponent({
  name: 'XYChips',
  inheritAttrs: false,
  props: initDefaultProps(chipsProps(), {
    disabled: false,
    allowDuplicate: true,
    addOnBlur: false,
  }),
  emits: ['update:value', 'add', 'remove', 'focus', 'blur'],
  slots: Object as CustomSlotsType<{
    default: any;
    chip: { value: string; index: number; removeCallback: (event: Event) => void };
    removeIcon: any;
  }>,
  setup(props, { slots, emit, expose }) {
    const { prefixCls, direction, disabled: configDisabled } = useConfigInject('chips', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const inputRef = ref<HTMLInputElement | null>(null);
    const containerRef = ref<HTMLElement | null>(null);

    const inputValue = ref('');
    const focused = ref(false);
    const focusedIndex = ref<number | null>(null);

    const mergedDisabled = computed(() => props.disabled ?? configDisabled.value);

    const rootClassName = computed(() =>
      classNames(hashId.value, prefixCls.value, {
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        [`${prefixCls.value}-disabled`]: mergedDisabled.value,
        [`${prefixCls.value}-focused`]: focused.value,
        [`${prefixCls.value}-filled`]: (props.value && props.value.length) || !!inputValue.value,
      }),
    );

    const inputClassName = computed(() =>
      classNames(`${prefixCls.value}-input`, {
        [`${prefixCls.value}-input-focused`]: focused.value,
      }),
    );

    const maxedOut = computed(
      () => props.max !== undefined && props.value && props.max === props.value.length,
    );

    const focusedOptionId = computed(() =>
      focusedIndex.value !== null ? `${prefixCls.value}_item_${focusedIndex.value}` : null,
    );

    const updateModel = (event: Event, value: string[], preventDefault?: boolean) => {
      emit('update:value', value);
      emit('add', {
        originalEvent: event,
        value,
      });

      if (inputRef.value) {
        inputRef.value.value = '';
      }
      inputValue.value = '';

      if (maxedOut.value) {
        focused.value = false;
      }

      if (preventDefault) {
        event.preventDefault();
      }
    };

    const addItem = (event: Event, item: string, preventDefault?: boolean) => {
      if (item && item.trim().length) {
        const trimmedItem = item.trim();
        const value = props.value ? [...props.value] : [];

        if (props.allowDuplicate || value.indexOf(trimmedItem) === -1) {
          value.push(trimmedItem);
          updateModel(event, value, preventDefault);
        }
      }
    };

    const removeItem = (event: Event, index: number) => {
      if (mergedDisabled.value) {
        return;
      }

      const values = [...props.value];
      const [removedItem] = values.splice(index, 1);

      focusedIndex.value = null;
      inputRef.value?.focus();
      emit('update:value', values);
      emit('remove', {
        originalEvent: event,
        value: removedItem,
      });
    };

    const onWrapperClick = () => {
      inputRef.value?.focus();
    };

    const onInput = (event: Event) => {
      const target = event.target as HTMLInputElement | null;
      if (!target) return;
      inputValue.value = target.value;
      focusedIndex.value = null;
    };

    const onFocus = (event: FocusEvent) => {
      focused.value = true;
      focusedIndex.value = null;
      emit('focus', event);
    };

    const onBlur = (event: FocusEvent) => {
      focused.value = false;
      focusedIndex.value = null;

      if (props.addOnBlur) {
        const target = event.target as HTMLInputElement | null;
        if (target) addItem(event, target.value, false);
      }

      emit('blur', event);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLInputElement | null;
      if (!target) return;

      const inputVal = target.value;

      switch (event.code) {
        case 'Backspace':
          if (inputVal.length === 0 && props.value && props.value.length > 0) {
            if (focusedIndex.value !== null) {
              removeItem(event, focusedIndex.value);
            } else {
              removeItem(event, props.value.length - 1);
            }
          }
          break;

        case 'Enter':
        case 'NumpadEnter':
          if (inputVal && inputVal.trim().length && !maxedOut.value) {
            addItem(event, inputVal, true);
          }
          break;

        case 'ArrowLeft':
          if (inputVal.length === 0 && props.value && props.value.length > 0) {
            containerRef.value?.focus();
          }
          break;

        default:
          if (props.separator) {
            const separatorRegex =
              typeof props.separator === 'string'
                ? new RegExp(`\\${props.separator}`)
                : props.separator;
            if (separatorRegex.test(event.key)) {
              addItem(event, inputVal, true);
            }
          }
          break;
      }
    };

    const onPaste = (event: ClipboardEvent) => {
      if (props.separator) {
        const pastedData =
          event.clipboardData?.getData('Text') ||
          (window as any).clipboardData?.getData('Text') ||
          '';

        if (pastedData) {
          const separatorRegex =
            typeof props.separator === 'string'
              ? new RegExp(`\\${props.separator}`)
              : props.separator;
          let value = props.value || [];
          let pastedValues = pastedData.split(separatorRegex);

          pastedValues = pastedValues.filter(
            val => props.allowDuplicate || value.indexOf(val) === -1,
          );
          value = [...value, ...pastedValues];
          updateModel(event, value, true);
        }
      }
    };

    const onContainerFocus = () => {
      focused.value = true;
    };

    const onContainerBlur = () => {
      focusedIndex.value = null;
      focused.value = false;
    };

    const onContainerKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowLeft':
          onArrowLeftKeyOn(event);
          break;
        case 'ArrowRight':
          onArrowRightKeyOn(event);
          break;
        case 'Backspace':
          onBackspaceKeyOn(event);
          break;
        default:
          break;
      }
    };

    const onArrowLeftKeyOn = (_event: KeyboardEvent) => {
      if (inputValue.value.length === 0 && props.value && props.value.length > 0) {
        focusedIndex.value =
          focusedIndex.value === null ? props.value.length - 1 : focusedIndex.value - 1;
        if (focusedIndex.value < 0) focusedIndex.value = 0;
      }
    };

    const onArrowRightKeyOn = (_event: KeyboardEvent) => {
      if (inputValue.value.length === 0 && props.value && props.value.length > 0) {
        if (focusedIndex.value === props.value.length - 1) {
          focusedIndex.value = null;
          inputRef.value?.focus();
        } else {
          focusedIndex.value = (focusedIndex.value ?? -1) + 1;
        }
      }
    };

    const onBackspaceKeyOn = (event: KeyboardEvent) => {
      if (focusedIndex.value !== null) {
        removeItem(event, focusedIndex.value);
      }
    };

    watch(focused, value => {
      if (!value) {
        focusedIndex.value = null;
      }
    });

    expose({
      addItem,
      removeItem,
      input: inputRef,
      inputValue,
    });

    return () => {
      const chipList = props.value || [];

      return wrapSSR(
        <div class={rootClassName.value}>
          <ul
            ref={containerRef}
            class={inputClassName.value}
            tabindex="-1"
            role="listbox"
            aria-orientation="horizontal"
            aria-activedescendant={focused.value ? focusedOptionId.value : undefined}
            onClick={onWrapperClick}
            onFocus={onContainerFocus}
            onBlur={onContainerBlur}
            onKeydown={onContainerKeyDown}
          >
            {chipList.map((val, i) => (
              <li
                key={`${i}_${val}`}
                id={`${prefixCls.value}_item_${i}`}
                role="option"
                class={classNames(`${prefixCls.value}-item`, {
                  [`${prefixCls.value}-item-focused`]: focusedIndex.value === i,
                })}
                aria-label={val}
                aria-selected="true"
                aria-setsize={chipList.length}
                aria-posinset={i + 1}
                data-focused={focusedIndex.value === i}
              >
                {slots.chip ? (
                  slots.chip({
                    value: val,
                    index: i,
                    removeCallback: (event: Event) => removeItem(event, i),
                  })
                ) : (
                  <>
                    <span class={`${prefixCls.value}-item-label`}>{val}</span>
                    <button
                      type="button"
                      class={`${prefixCls.value}-item-remove`}
                      disabled={mergedDisabled.value}
                      onClick={(e: Event) => {
                        e.stopPropagation();
                        removeItem(e, i);
                      }}
                    >
                      {slots.removeIcon ? slots.removeIcon() : <CloseOutlined />}
                    </button>
                  </>
                )}
              </li>
            ))}
            <li class={`${prefixCls.value}-input-item`} role="option">
              <input
                ref={inputRef}
                type="text"
                class={`${prefixCls.value}-input-field`}
                disabled={mergedDisabled.value || maxedOut.value}
                placeholder={props.placeholder}
                value={inputValue.value}
                onFocus={onFocus}
                onBlur={onBlur}
                onInput={onInput}
                onKeydown={onKeyDown}
                onPaste={onPaste}
              />
            </li>
          </ul>
        </div>,
      );
    };
  },
});

(Chips as any).install = (app: App) => {
  registerComponent(app, Chips);
  return app;
};

export default Chips as typeof Chips & Plugin;
