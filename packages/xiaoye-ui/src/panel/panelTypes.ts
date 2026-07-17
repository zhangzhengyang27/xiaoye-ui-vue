import type { ExtractPropTypes } from 'vue';
import { stringType, booleanType, anyType } from '../_util/type';

export const panelProps = () => ({
  prefixCls: String,
  title: stringType<string | undefined>(undefined),
  bordered: booleanType(true),
  loading: booleanType(false),
  hoverable: booleanType(false),
  toggleable: booleanType(false),
  collapsed: booleanType(undefined),
  // 透传给 CardLike 的 class/style（保留源项目模式）
  class: anyType(undefined),
  style: anyType(undefined),
});

export type PanelProps = Partial<ExtractPropTypes<ReturnType<typeof panelProps>>>;

export default panelProps;
