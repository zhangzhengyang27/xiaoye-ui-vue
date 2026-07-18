import { computed, defineComponent, inject, type PropType } from 'vue';
import type { CustomSlotsType } from '../_util/type';
import type {
  MeterGroupLabelOrientation,
  MeterGroupLabelPosition,
  MeterItem,
} from './meterGroupTypes';

export interface MeterGroupLabelProps {
  value?: MeterItem[];
  labelPosition?: MeterGroupLabelPosition;
  labelOrientation?: MeterGroupLabelOrientation;
}

export default defineComponent({
  name: 'XYMeterGroupLabel',
  inheritAttrs: false,
  props: {
    value: { type: Array as PropType<MeterItem[]>, default: () => [] },
    labelPosition: {
      type: String as PropType<MeterGroupLabelPosition>,
      default: 'end',
    },
    labelOrientation: {
      type: String as PropType<MeterGroupLabelOrientation>,
      default: 'horizontal',
    },
    prefixCls: { type: String, default: 'xy-meter-group' },
  },
  slots: Object as CustomSlotsType<{
    icon?: (scope: { value: MeterItem; class: string }) => any;
  }>,
  setup(props, { slots }) {
    // 从父级 MeterGroup 注入 percentValue 计算函数
    const meterGroupCtx = inject<any>('$xyMeterGroup', null);

    const labelListClasses = computed(() => {
      const pre = props.prefixCls;
      return [`${pre}-label-list`, `${pre}-label-list-${props.labelOrientation}`];
    });

    const labelIconClass = computed(() => `${props.prefixCls}-label-icon`);
    const labelMarkerClass = computed(() => `${props.prefixCls}-label-marker`);

    return () => (
      <ol class={labelListClasses.value}>
        {(props.value || []).map((val, index) => (
          <li key={`${index}_label`} class={`${props.prefixCls}-label`}>
            {slots.icon ? (
              slots.icon({ value: val, class: labelIconClass.value })
            ) : val.icon ? (
              <i class={[val.icon, labelIconClass.value]} style={{ color: val.color }} />
            ) : (
              <span class={labelMarkerClass.value} style={{ backgroundColor: val.color }} />
            )}
            <span class={`${props.prefixCls}-label-text`}>
              {val.label}
              {meterGroupCtx?.percentValue ? ` (${meterGroupCtx.percentValue(val.value)})` : ''}
            </span>
          </li>
        ))}
      </ol>
    );
  },
});
