import type { ExtractPropTypes } from 'vue';
import { stringType, booleanType, anyType } from '../_util/type';

export const fieldsetProps = () => ({
  prefixCls: String,
  legend: stringType<string | null>(null),
  toggleable: booleanType(false),
  collapsed: booleanType(false),
  // 接受任意形状的按钮属性对象（aria-label 等）
  toggleButtonProps: anyType<Record<string, any> | null>(null),
});

export type FieldsetProps = Partial<ExtractPropTypes<ReturnType<typeof fieldsetProps>>>;

export default fieldsetProps;
