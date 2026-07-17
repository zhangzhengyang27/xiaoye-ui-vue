import type { ExtractPropTypes } from 'vue';
import { stringType } from '../_util/type';

// Splitter 类型
export type SplitterLayoutType = 'horizontal' | 'vertical';
export type SplitterStateStorageType = 'local' | 'session';

export const splitterProps = () => ({
  prefixCls: String,
  layout: stringType<SplitterLayoutType>('horizontal'),
  gutterSize: { type: Number, default: 4 },
  stateKey: { type: String, default: null },
  stateStorage: stringType<SplitterStateStorageType>('session'),
  step: { type: Number, default: 5 },
});

export type SplitterProps = Partial<ExtractPropTypes<ReturnType<typeof splitterProps>>>;

// SplitterPanel 类型
export const splitterPanelProps = () => ({
  prefixCls: String,
  // 修复源项目 bug：.d.ts 声明了 size/minSize，但 .tsx 未实现
  size: { type: Number, default: undefined },
  minSize: { type: Number, default: undefined },
});

export type SplitterPanelProps = Partial<ExtractPropTypes<ReturnType<typeof splitterPanelProps>>>;

export default splitterProps;
