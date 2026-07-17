/// <reference types="vue/jsx" />
import { computed, defineComponent, ref, watch, Transition } from 'vue';
import { MinusIcon, PlusIcon } from '@xiaoye-ui/icons';
import fieldsetProps from './fieldsetTypes';
import { initDefaultProps } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import type { CustomSlotsType } from '../_util/type';
import useStyle from './style';

// 模块级 id 计数器，保证同一页面内多个 Fieldset 的 aria 控制关系唯一
let fieldsetIdCounter = 0;

export default defineComponent({
  name: 'XYFieldset',
  inheritAttrs: false,
  __XY_FIELDSET: true,
  props: initDefaultProps(fieldsetProps(), {}),
  slots: Object as CustomSlotsType<{
    default?: any;
    legend?: any;
    toggleicon?: any;
    togglericon?: any;
  }>,
  emits: ['update:collapsed', 'toggle'],
  setup(props, { slots, emit, expose }) {
    const { prefixCls } = useConfigInject('fieldset', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const id = ref(`${prefixCls.value}-${++fieldsetIdCounter}`);
    const d_collapsed = ref(props.collapsed);

    watch(
      () => props.collapsed,
      newValue => {
        d_collapsed.value = newValue;
      },
    );

    function toggle(event: Event) {
      d_collapsed.value = !d_collapsed.value;
      emit('update:collapsed', d_collapsed.value);
      emit('toggle', {
        originalEvent: event,
        value: d_collapsed.value,
      });
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.code === 'Enter' || event.code === 'NumpadEnter' || event.code === 'Space') {
        toggle(event as unknown as Event);
        event.preventDefault();
      }
    }

    const buttonAriaLabel = computed(() =>
      props.toggleButtonProps && (props.toggleButtonProps as any).ariaLabel
        ? (props.toggleButtonProps as any).ariaLabel
        : props.legend,
    );

    const rootClasses = computed(() => [
      prefixCls.value,
      hashId.value,
      {
        [`${prefixCls.value}-toggleable`]: props.toggleable,
      },
    ]);

    const toggleIconClass = `${prefixCls.value}-toggle-icon`;

    expose({ toggle, onKeyDown });

    return () =>
      wrapSSR(
        <fieldset class={rootClasses.value}>
          <legend class={`${prefixCls.value}-legend`}>
            {slots.legend ? (
              slots.legend({ toggleCallback: toggle })
            ) : !props.toggleable ? (
              <span id={`${id.value}-header`} class={`${prefixCls.value}-legend-label`}>
                {props.legend}
              </span>
            ) : (
              <button
                id={`${id.value}-header`}
                type="button"
                aria-controls={`${id.value}-content`}
                aria-expanded={!d_collapsed.value}
                aria-label={buttonAriaLabel.value}
                class={`${prefixCls.value}-toggle-button`}
                onClick={toggle}
                onKeydown={onKeyDown}
                {...props.toggleButtonProps}
              >
                {slots.toggleicon ? (
                  slots.toggleicon({ collapsed: d_collapsed.value, class: toggleIconClass })
                ) : slots.togglericon ? (
                  slots.togglericon({ collapsed: d_collapsed.value, class: toggleIconClass })
                ) : d_collapsed.value ? (
                  <PlusIcon class={toggleIconClass} />
                ) : (
                  <MinusIcon class={toggleIconClass} />
                )}
                <span class={`${prefixCls.value}-legend-label`}>{props.legend}</span>
              </button>
            )}
          </legend>
          <Transition name="xy-collapsible">
            <div
              v-show={!d_collapsed.value}
              id={`${id.value}-content`}
              class={`${prefixCls.value}-content-container`}
              role="region"
              aria-labelledby={`${id.value}-header`}
            >
              <div class={`${prefixCls.value}-content-wrapper`}>
                <div class={`${prefixCls.value}-content`}>{slots.default?.()}</div>
              </div>
            </div>
          </Transition>
        </fieldset>,
      );
  },
});
