import type { ExtractPropTypes } from 'vue';
import { stringType } from '../_util/type';

export const toolbarProps = () => ({
  prefixCls: String,
  ariaLabelledby: stringType(undefined),
});

export type ToolbarProps = Partial<ExtractPropTypes<ReturnType<typeof toolbarProps>>>;

export default toolbarProps;
