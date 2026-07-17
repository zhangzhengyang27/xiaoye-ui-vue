/// <reference types="vue/jsx" />
import { computed, defineComponent, ref, watch } from 'vue';
import CardLike from '../_shared/CardLike';
import panelProps from './panelTypes';
import { initDefaultProps } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import type { CustomSlotsType } from '../_util/type';
import useStyle from './style';

export default defineComponent({
  name: 'XYPanel',
  inheritAttrs: false,
  __XY_PANEL: true,
  props: initDefaultProps(panelProps(), {}),
  slots: Object as CustomSlotsType<{
    default?: any;
    title?: any;
    header?: any;
    icons?: any;
    footer?: any;
  }>,
  emits: ['update:collapsed', 'toggle'],
  setup(props, { slots, emit }) {
    const { prefixCls } = useConfigInject('panel', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const internalCollapsed = ref(props.collapsed ?? false);

    watch(
      () => props.collapsed,
      value => {
        if (value !== undefined) {
          internalCollapsed.value = value;
        }
      },
    );

    const collapsedState = computed({
      get: () => internalCollapsed.value,
      set: value => {
        internalCollapsed.value = value;
      },
    });

    const toggle = (event: Event) => {
      const next = !collapsedState.value;

      if (props.collapsed === undefined) {
        collapsedState.value = next;
      }

      emit('update:collapsed', next);
      emit('toggle', { originalEvent: event, value: next });
    };

    return () =>
      wrapSSR(
        <CardLike
          component="panel"
          title={props.title}
          bordered={props.bordered}
          loading={props.loading}
          hoverable={props.hoverable}
          collapsed={collapsedState.value}
          hashId={hashId.value}
          class={props.class}
          style={props.style}
        >
          {{
            title: () =>
              slots.header || slots.title || props.title ? (
                slots.header ? (
                  slots.header()
                ) : (
                  <>{slots.title ? slots.title() : props.title}</>
                )
              ) : undefined,
            'header-actions': () =>
              slots.icons || props.toggleable ? (
                <>
                  {slots.icons?.()}
                  {props.toggleable && (
                    <button
                      type="button"
                      class={`${prefixCls.value}-toggle-button`}
                      aria-expanded={!collapsedState.value}
                      onClick={toggle}
                    >
                      <svg
                        class={[
                          `${prefixCls.value}-toggle-icon`,
                          { [`${prefixCls.value}-toggle-icon-collapsed`]: collapsedState.value },
                        ]}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                  )}
                </>
              ) : undefined,
            footer: slots.footer ? () => slots.footer?.() : undefined,
            default: slots.default,
          }}
        </CardLike>,
      );
  },
});
