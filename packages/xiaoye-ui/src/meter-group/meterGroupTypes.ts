import type { ExtractPropTypes } from 'vue';
import { arrayType, someType, stringType } from '../_util/type';

/** 指标项方向 */
export type MeterGroupOrientation = 'horizontal' | 'vertical';
/** 标签位置 */
export type MeterGroupLabelPosition = 'start' | 'end';
/** 标签方向 */
export type MeterGroupLabelOrientation = 'horizontal' | 'vertical';

/**
 * 单个指标项
 */
export interface MeterItem {
  /** 指标标签文本 */
  label?: string;
  /** 指标当前值 */
  value: number;
  /** 指标颜色 */
  color?: string;
  /** 指标图标（CSS class，例如图标字体类名） */
  icon?: string;
  /** 透传扩展字段 */
  [key: string]: any;
}

export const meterGroupProps = () => ({
  prefixCls: String,
  /** 指标数组，每项含 { label, value, color, icon } */
  values: arrayType<MeterItem[]>(),
  /** 最小边界值 */
  min: someType<number>([Number]),
  /** 最大边界值 */
  max: someType<number>([Number]),
  /** 进度条方向 */
  orientation: stringType<MeterGroupOrientation>('horizontal'),
  /** 标签位置 */
  labelPosition: stringType<MeterGroupLabelPosition>('end'),
  /** 标签排列方向 */
  labelOrientation: stringType<MeterGroupLabelOrientation>('horizontal'),
});

export type MeterGroupProps = Partial<ExtractPropTypes<ReturnType<typeof meterGroupProps>>>;
