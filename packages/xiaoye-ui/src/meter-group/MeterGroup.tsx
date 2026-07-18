/// <reference types="vue/jsx" />
import { computed, defineComponent, getCurrentInstance, provide } from 'vue';
import { initDefaultProps } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import type { CustomSlotsType } from '../_util/type';
import useStyle from './style';
import { meterGroupProps } from './meterGroupTypes';
import type { MeterItem } from './meterGroupTypes';
import MeterGroupLabel from './MeterGroupLabel';

export default defineComponent({
  name: 'XYMeterGroup',
  inheritAttrs: false,
  __XY_METER_GROUP: true,
  props: initDefaultProps(meterGroupProps(), {
    min: 0,
    max: 100,
    orientation: 'horizontal',
    labelPosition: 'end',
    labelOrientation: 'horizontal',
  }),
  slots: Object as CustomSlotsType<{
    label?: (scope: { value: MeterItem[]; totalPercent: number; percentages: number[] }) => any;
    meter?: (scope: {
      value: MeterItem;
      index: number;
      class: string;
      orientation: string;
      size: string;
      totalPercent: number;
    }) => any;
    start?: (scope: { value: MeterItem[]; totalPercent: number; percentages: number[] }) => any;
    end?: (scope: { value: MeterItem[]; totalPercent: number; percentages: number[] }) => any;
    icon?: (scope: { value: MeterItem; class: string }) => any;
  }>,
  setup(props, { slots, attrs }) {
    const { prefixCls } = useConfigInject('meter-group', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const instance = getCurrentInstance()!;

    // 计算单值百分比（限制在 0~100）
    const percent = (meter = 0) => {
      const range = props.max - props.min;
      if (!range) return 0;
      const percentOfItem = ((meter - props.min) / range) * 100;
      return Math.max(0, Math.min(100, percentOfItem));
    };

    const roundedPercent = (meter = 0) => Math.round(percent(meter));

    const percentValue = (meter: number) => `${roundedPercent(meter)}%`;

    // 提供给 MeterGroupLabel 的上下文
    const meterGroupCtx = {
      get $el() {
        return instance.proxy?.$el;
      },
      get $attrs() {
        return instance.attrs;
      },
      percentValue,
    };

    provide('$xyMeterGroup', meterGroupCtx);
    provide('$parentInstance', meterGroupCtx);

    const rootClasses = computed(() => {
      return [hashId.value, prefixCls.value, `${prefixCls.value}-${props.orientation}`];
    });

    const meterClass = computed(() => `${prefixCls.value}-meter`);

    const meterCalculatedStyles = (val: MeterItem) => {
      return {
        backgroundColor: val.color,
        width: props.orientation === 'horizontal' ? `${percent(val.value)}%` : undefined,
        height: props.orientation === 'vertical' ? `${percent(val.value)}%` : undefined,
      };
    };

    const values = computed<MeterItem[]>(() => props.values || []);

    const totalPercent = computed(() =>
      roundedPercent(values.value.reduce((total, val) => total + val.value, 0)),
    );

    const percentages = computed(() => {
      let sum = 0;
      const sumsArray: number[] = [];
      values.value.forEach(item => {
        sum += item.value;
        sumsArray.push(sum);
      });
      return sumsArray;
    });

    const renderLabel = () => {
      if (slots.label) {
        return slots.label({
          value: values.value,
          totalPercent: totalPercent.value,
          percentages: percentages.value,
        });
      }
      return (
        <MeterGroupLabel
          value={values.value}
          labelPosition={props.labelPosition}
          labelOrientation={props.labelOrientation}
          prefixCls={prefixCls.value}
        />
      );
    };

    return () => {
      const { class: cls, ...restAttrs } = attrs;
      return wrapSSR(
        <div
          {...restAttrs}
          class={[rootClasses.value, cls]}
          role="meter"
          aria-valuemin={props.min}
          aria-valuemax={props.max}
          aria-valuenow={totalPercent.value}
        >
          {props.labelPosition === 'start' && renderLabel()}
          {slots.start?.({
            value: values.value,
            totalPercent: totalPercent.value,
            percentages: percentages.value,
          })}
          <div class={`${prefixCls.value}-meters`}>
            {values.value.map((val, index) =>
              slots.meter ? (
                slots.meter({
                  value: val,
                  index,
                  class: meterClass.value,
                  orientation: props.orientation,
                  size: percentValue(val.value),
                  totalPercent: totalPercent.value,
                })
              ) : roundedPercent(val.value) ? (
                <span class={meterClass.value} style={meterCalculatedStyles(val)} />
              ) : null,
            )}
          </div>
          {slots.end?.({
            value: values.value,
            totalPercent: totalPercent.value,
            percentages: percentages.value,
          })}
          {props.labelPosition === 'end' && renderLabel()}
        </div>,
      );
    };
  },
});
