import { computed, defineComponent, ref, watch } from 'vue';
import type { CSSProperties } from 'vue';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';
import { imageCompareProps } from './interface';
import { initDefaultProps } from '../_util/props-util';
import type { CustomSlotsType } from '../_util/type';

export default defineComponent({
  name: 'XYImageCompare',
  inheritAttrs: false,
  props: initDefaultProps(imageCompareProps(), { defaultValue: 50 }),
  slots: Object as CustomSlotsType<{
    left: any;
    right: any;
  }>,
  setup(props, { slots, attrs, emit }) {
    const { prefixCls, direction } = useConfigInject('image-compare', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const isControlled = computed(() => props.value !== undefined);
    const internalValue = ref<number>(props.defaultValue);

    watch(
      () => props.value,
      val => {
        if (isControlled.value && val !== undefined) {
          internalValue.value = val;
        }
      },
      { immediate: true },
    );

    const handleInput = (e: Event) => {
      if (props.disabled) return;

      const target = e.target as HTMLInputElement;
      const value = Number(target.value);

      if (!isControlled.value) {
        internalValue.value = value;
      }

      emit('update:value', value);
      emit('change', value);
    };

    const classes = computed(() => [
      prefixCls.value,
      hashId.value,
      attrs.class,
      {
        [`${prefixCls.value}-disabled`]: props.disabled,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
      },
    ]);

    const mergedStyle = computed<CSSProperties>(() => ({
      ...(attrs.style as CSSProperties),
      '--xy-image-compare-scope-x': `${internalValue.value}%`,
    }));

    return () =>
      wrapSSR(
        <div {...attrs} class={classes.value} style={mergedStyle.value}>
          <div class={`${prefixCls.value}-layer ${prefixCls.value}-layer-left`}>
            {slots.left?.()}
          </div>
          <div class={`${prefixCls.value}-layer ${prefixCls.value}-layer-right`}>
            {slots.right?.()}
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={internalValue.value}
            disabled={props.disabled}
            class={`${prefixCls.value}-slider`}
            onInput={handleInput}
            onChange={handleInput}
          />
        </div>,
      );
  },
});
