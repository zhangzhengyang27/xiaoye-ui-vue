import { computed, defineComponent, ref, watch } from 'vue';
import { equals, isNotEmpty, resolveFieldData } from '@xiaoye-ui/utils/object';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { initDefaultProps } from '../_util/props-util';
import type { CustomSlotsType } from '../_util/type';
import useStyle from './style';
import { toggleButtonProps } from './interface';
import type { ToggleButtonOption } from './interface';

export default defineComponent({
  name: 'XYToggleButton',
  inheritAttrs: false,
  props: initDefaultProps(toggleButtonProps(), { multiple: false }),
  slots: Object as CustomSlotsType<{
    default: any;
    icon: { value: any };
    option: { option: ToggleButtonOption; index: number; selected: boolean };
  }>,
  setup(props, { slots, attrs, emit }) {
    const { prefixCls, size, direction } = useConfigInject('toggle-button', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const isControlled = computed(() => props.value !== undefined);
    const internalValue = ref<any>(props.defaultValue);

    watch(
      () => props.value,
      val => {
        if (isControlled.value && val !== undefined) {
          internalValue.value = val;
        }
      },
      { immediate: true },
    );

    const mergedSize = computed(() => props.size || size.value || 'middle');

    const normalizedOptions = computed<ToggleButtonOption[]>(() => {
      if (!props.options) return [];
      return props.options.map(option => {
        if (typeof option === 'string' || typeof option === 'number') {
          return { label: String(option), value: option };
        }
        const label = props.optionLabel
          ? resolveFieldData(option, props.optionLabel)
          : option.label;
        const value = props.optionValue
          ? resolveFieldData(option, props.optionValue)
          : option.value;
        const disabled = props.optionDisabled
          ? resolveFieldData(option, props.optionDisabled)
          : option.disabled;
        return { label: label ?? String(value), value, disabled };
      });
    });

    const hasOptions = computed(() => normalizedOptions.value.length > 0);

    const isSelected = (option: ToggleButtonOption) => {
      if (props.multiple && Array.isArray(internalValue.value)) {
        return internalValue.value.some((v: any) => equals(v, option.value));
      }
      return equals(internalValue.value, option.value);
    };

    const updateValue = (value: any) => {
      if (!isControlled.value) {
        internalValue.value = value;
      }
      emit('update:value', value);
      emit('change', value);
    };

    const handleOptionClick = (option: ToggleButtonOption) => {
      if (props.disabled || option.disabled) return;

      if (props.multiple) {
        const current = Array.isArray(internalValue.value) ? internalValue.value : [];
        const selected = isSelected(option);
        const next = selected
          ? current.filter((v: any) => !equals(v, option.value))
          : [...current, option.value];
        updateValue(next);
      } else {
        updateValue(isSelected(option) ? undefined : option.value);
      }
    };

    const handleToggleClick = () => {
      if (props.disabled) return;
      updateValue(!internalValue.value);
    };

    const rootClasses = computed(() => [
      prefixCls.value,
      hashId.value,
      attrs.class,
      `${prefixCls.value}-${mergedSize.value}`,
      {
        [`${prefixCls.value}-checked`]: internalValue.value === true,
        [`${prefixCls.value}-disabled`]: props.disabled,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
      },
    ]);

    const groupClasses = computed(() => [
      `${prefixCls.value}-group`,
      hashId.value,
      attrs.class,
      {
        [`${prefixCls.value}-group-rtl`]: direction.value === 'rtl',
      },
    ]);

    const getOptionClasses = (option: ToggleButtonOption) => [
      prefixCls.value,
      `${prefixCls.value}-${mergedSize.value}`,
      {
        [`${prefixCls.value}-checked`]: isSelected(option),
        [`${prefixCls.value}-disabled`]: props.disabled || option.disabled,
      },
    ];

    const getLabel = computed(() => {
      if (slots.default) return null;
      return isNotEmpty(internalValue.value) && internalValue.value ? 'On' : 'Off';
    });

    return () => {
      if (hasOptions.value) {
        return wrapSSR(
          <div {...attrs} class={groupClasses.value} style={attrs.style} role="group">
            {normalizedOptions.value.map((option, index) => (
              <button
                key={String(option.value)}
                type="button"
                class={getOptionClasses(option)}
                disabled={props.disabled || option.disabled}
                aria-pressed={isSelected(option)}
                onClick={() => handleOptionClick(option)}
              >
                {slots.option ? (
                  slots.option({ option, index, selected: isSelected(option) })
                ) : (
                  <span class={`${prefixCls.value}-label`}>{option.label}</span>
                )}
              </button>
            ))}
          </div>,
        );
      }

      return wrapSSR(
        <button
          {...attrs}
          type="button"
          class={rootClasses.value}
          style={attrs.style}
          disabled={props.disabled}
          aria-pressed={internalValue.value === true}
          onClick={handleToggleClick}
        >
          <span class={`${prefixCls.value}-content`}>
            {slots.default?.() || (
              <>
                {slots.icon ? slots.icon({ value: internalValue.value }) : null}
                <span class={`${prefixCls.value}-label`}>{getLabel.value}</span>
              </>
            )}
          </span>
        </button>,
      );
    };
  },
});
