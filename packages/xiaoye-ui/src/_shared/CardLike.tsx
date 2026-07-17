/// <reference types="vue/jsx" />
import { computed, defineComponent } from 'vue';
import type { ExtractPropTypes, PropType } from 'vue';
import { initDefaultProps } from '../_util/props-util';
import type { CustomSlotsType } from '../_util/type';

export const cardLikeProps = () => ({
  component: { type: String as PropType<'card' | 'panel'>, default: 'card' },
  title: { type: String, default: undefined },
  extra: { type: String, default: undefined },
  bordered: { type: Boolean, default: true },
  loading: { type: Boolean, default: false },
  hoverable: { type: Boolean, default: false },
  collapsed: { type: Boolean, default: false },
  hashId: { type: String, default: undefined },
  class: { type: null as any, default: undefined },
  style: { type: null as any, default: undefined },
});

export type CardLikeProps = Partial<ExtractPropTypes<ReturnType<typeof cardLikeProps>>>;

export default defineComponent({
  name: 'XYCardLike',
  inheritAttrs: false,
  __XY_CARD_LIKE: true,
  props: initDefaultProps(cardLikeProps(), {}),
  slots: Object as CustomSlotsType<{
    default?: any;
    title?: any;
    header?: any;
    'header-actions'?: any;
    extra?: any;
    cover?: any;
    footer?: any;
    actions?: any;
  }>,
  setup(props, { slots }) {
    const prefix = computed(() => `xy-${props.component}`);

    const showTitle = computed(() => props.title || slots.title);
    const showHeader = computed(
      () =>
        slots.header || showTitle.value || slots['header-actions'] || props.extra || slots.extra,
    );

    const componentClasses = computed(() => {
      const p = prefix.value;

      return [
        p,
        props.hashId,
        {
          [`${p}-bordered`]: props.bordered,
          [`${p}-loading`]: props.loading,
          [`${p}-hoverable`]: props.hoverable,
          [`${p}-collapsed`]: props.collapsed,
          [props.class as string]: props.class,
        },
      ];
    });

    return () => (
      <div class={componentClasses.value} style={props.style}>
        {showHeader.value && (
          <div class={`${prefix.value}-header`}>
            {slots.header ? (
              slots.header()
            ) : (
              <div class={`${prefix.value}-head-wrapper`}>
                {showTitle.value && (
                  <div class={`${prefix.value}-head-title`}>
                    {slots.title ? slots.title() : props.title}
                  </div>
                )}
                {slots['header-actions'] && (
                  <div class={`${prefix.value}-head-actions`}>{slots['header-actions']()}</div>
                )}
                {(props.extra || slots.extra) && (
                  <div class={`${prefix.value}-extra`}>
                    {slots.extra ? slots.extra() : props.extra}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {slots.cover && <div class={`${prefix.value}-cover`}>{slots.cover()}</div>}
        <div
          style={{ display: props.collapsed ? 'none' : undefined }}
          class={`${prefix.value}-body`}
          role="region"
        >
          {props.loading ? (
            <div class={`${prefix.value}-loading`}>
              {[1, 2, 3].map(i => (
                <div key={i} class={`${prefix.value}-loading-block`} />
              ))}
            </div>
          ) : (
            slots.default?.()
          )}
        </div>
        {slots.footer && !props.collapsed && (
          <div class={`${prefix.value}-footer`}>{slots.footer()}</div>
        )}
        {slots.actions && !props.collapsed && (
          <ul class={`${prefix.value}-actions`}>{slots.actions()}</ul>
        )}
      </div>
    );
  },
});
