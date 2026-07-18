import type { ExtractPropTypes } from 'vue';
import type { MouseEventHandler } from '../_util/EventInterface';
import { eventType, functionType } from '../_util/type';

export const backTopProps = () => ({
  prefixCls: String,
  // 滚动高度达到此参数值才出现 BackTop
  visibilityHeight: { type: Number, default: 400 },
  // 设置需要监听其滚动事件的元素，默认为 window
  target: functionType<() => HTMLElement | Window | Document>(),
  // 回到顶部所需时间（毫秒）
  duration: { type: Number, default: 450 },
  // 点击按钮的回调
  onClick: eventType<MouseEventHandler>(),
});

export type BackTopProps = Partial<ExtractPropTypes<ReturnType<typeof backTopProps>>>;

export default backTopProps;
