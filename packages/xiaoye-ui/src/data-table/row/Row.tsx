/// <reference types="vue/jsx" />
import {
  computed,
  defineComponent,
  getCurrentInstance,
  inject,
  onMounted,
  onUnmounted,
  provide,
} from 'vue';
import type { PropType } from 'vue';
import useConfigInject from 'xiaoye-ui/config-provider/hooks/useConfigInject';
import useStyle from './style';

export const xyRowKey = 'xyRow';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'XYRow',
  inheritAttrs: false,
  props: {
    prefixCls: { type: String, default: undefined },
    align: {
      type: String as PropType<'top' | 'middle' | 'bottom' | 'stretch' | string>,
      default: undefined,
    },
    gutter: { type: [Number, Array] as PropType<number | [number, number]>, default: undefined },
    justify: {
      type: String as PropType<
        'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly' | string
      >,
      default: undefined,
    },
    wrap: { type: Boolean, default: true },
    class: { type: null as any as PropType<any>, default: undefined },
    style: { type: null as any as PropType<any>, default: undefined },
  },
  setup(props, { slots, attrs }) {
    const { prefixCls } = useConfigInject('row', props);
    const [, hashId] = useStyle(prefixCls);

    const instance = getCurrentInstance();
    const dataTableRows = inject<Set<any>>('$rows', undefined);

    onMounted(() => {
      dataTableRows?.add(instance);
    });

    onUnmounted(() => {
      dataTableRows?.delete(instance);
    });

    const gutter = computed(() => {
      const { gutter } = props;
      if (Array.isArray(gutter)) {
        return { horizontal: gutter[0], vertical: gutter[1] };
      }
      return { horizontal: gutter || 0, vertical: 0 };
    });

    provide(xyRowKey, gutter);

    const classes = computed(() => {
      const { align, justify, wrap } = props;
      return [
        prefixCls.value,
        hashId.value,
        {
          [`${prefixCls.value}-align-${align}`]: align,
          [`${prefixCls.value}-justify-${justify}`]: justify,
          [`${prefixCls.value}-nowrap`]: wrap === false,
        },
        props.class,
      ];
    });

    const styles = computed(() => {
      const { horizontal, vertical } = gutter.value;
      const margin = `-${horizontal / 2}px`;
      return {
        marginLeft: margin,
        marginRight: margin,
        rowGap: vertical ? `${vertical}px` : undefined,
        ...(props.style || {}),
      };
    });

    return () => {
      // DataTable 行内模式：直接透传插槽
      if (dataTableRows) {
        return slots.default?.();
      }
      return (
        <div class={classes.value} style={styles.value} {...attrs}>
          {slots.default?.()}
        </div>
      );
    };
  },
});
