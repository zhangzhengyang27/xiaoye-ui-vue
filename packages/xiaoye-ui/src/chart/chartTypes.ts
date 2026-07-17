import type { ExtractPropTypes, PropType, CanvasHTMLAttributes } from 'vue';
import { anyType } from '../_util/type';

/**
 * Chart 类型（如 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polarArea' | 'bubble' | 'scatter'）
 * 实际由 chart.js 定义，这里保持宽松以避免与 chart.js 类型耦合
 */
export type ChartType = string;

/** Chart 数据结构，与 chart.js 的ChartData 对应 */
export type ChartData = object;

/** Chart 配置项，与 chart.js 的ChartOptions 对应 */
export type ChartOptions = object;

/** Chart 插件数组 */
export type ChartPlugins = any[];

export const chartProps = () => ({
  prefixCls: String,
  type: anyType<ChartType>(),
  data: anyType<ChartData>(),
  options: anyType<ChartOptions>(),
  plugins: anyType<ChartPlugins>(),
  width: { type: Number, default: 300 },
  height: { type: Number, default: 150 },
  canvasProps: { type: Object as PropType<CanvasHTMLAttributes>, default: null },
});

export type ChartProps = Partial<ExtractPropTypes<ReturnType<typeof chartProps>>>;

/** select 事件载荷 */
export interface ChartSelectEvent {
  originalEvent: Event;
  element: any;
  dataset: any;
}

export default chartProps;
