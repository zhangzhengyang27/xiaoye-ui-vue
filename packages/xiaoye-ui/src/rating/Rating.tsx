import { computed, defineComponent, ref, watch } from 'vue';
import { StarFilled } from '@xiaoye-ui/icons';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { initDefaultProps } from '../_util/props-util';
import type { CustomSlotsType, VueNode } from '../_util/type';
import useStyle from './style';
import { ratingProps } from './interface';

export default defineComponent({
  name: 'XYRating',
  inheritAttrs: false,
  props: initDefaultProps(ratingProps(), {
    defaultValue: 0,
    count: 5,
    allowClear: true,
  }),
  slots: Object as CustomSlotsType<{
    character: { index: number; value: number };
    default: any;
  }>,
  setup(props, { slots, attrs, emit }) {
    const { prefixCls, direction } = useConfigInject('rating', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const isControlled = computed(() => props.value !== undefined);
    const internalValue = ref<number>(props.defaultValue ?? 0);
    const focusedIndex = ref(-1);
    const name = computed(() => `xy-rating-${Math.random().toString(36).slice(2, 9)}`);

    watch(
      () => props.value,
      val => {
        if (isControlled.value && val !== undefined) {
          internalValue.value = val;
        }
      },
      { immediate: true },
    );

    const starList = computed(() => Array.from({ length: props.count }, (_, i) => i + 1));

    const classes = computed(() => [
      prefixCls.value,
      hashId.value,
      attrs.class,
      {
        [`${prefixCls.value}-disabled`]: props.disabled,
        [`${prefixCls.value}-readonly`]: props.readonly,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
      },
    ]);

    const handleChange = (index: number) => {
      if (props.disabled || props.readonly) return;

      let nextValue = index;
      if (props.allowClear && internalValue.value === index) {
        nextValue = 0;
      }

      if (!isControlled.value) {
        internalValue.value = nextValue;
      }

      emit('update:value', nextValue);
      emit('change', nextValue);
    };

    const handleFocus = (e: FocusEvent, index: number) => {
      focusedIndex.value = index;
      emit('focus', e);
    };

    const handleBlur = (e: FocusEvent) => {
      focusedIndex.value = -1;
      emit('blur', e);
    };

    const renderCharacter = (index: number): VueNode => {
      if (slots.character) {
        return slots.character({ index, value: internalValue.value });
      }
      if (props.character) {
        return props.character({ index, value: internalValue.value });
      }
      return <StarFilled />;
    };

    return () =>
      wrapSSR(
        <div
          {...attrs}
          class={classes.value}
          style={attrs.style}
          role="radiogroup"
          aria-label="Rating"
        >
          {starList.value.map(index => {
            const isActive = index <= internalValue.value;
            const isFocused = index === focusedIndex.value;

            return (
              <label
                key={index}
                class={{
                  [`${prefixCls.value}-star`]: true,
                  [`${prefixCls.value}-star-active`]: isActive,
                  [`${prefixCls.value}-star-focused`]: isFocused,
                }}
              >
                <input
                  type="radio"
                  name={name.value}
                  value={index}
                  checked={internalValue.value === index}
                  disabled={props.disabled}
                  class={`${prefixCls.value}-input`}
                  onChange={() => handleChange(index)}
                  onFocus={e => handleFocus(e, index)}
                  onBlur={handleBlur}
                  aria-label={`${index} star${index === 1 ? '' : 's'}`}
                />
                <span class={`${prefixCls.value}-character`}>{renderCharacter(index)}</span>
              </label>
            );
          })}
        </div>,
      );
  },
});
