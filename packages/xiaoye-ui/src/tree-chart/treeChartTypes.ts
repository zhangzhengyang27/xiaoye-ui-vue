import type { ExtractPropTypes } from 'vue';
import { anyType, booleanType, stringType } from '../_util/type';

export interface TreeChartNode {
  key: any;
  type?: string;
  styleClass?: string;
  data?: any;
  selectable?: boolean;
  collapsible?: boolean;
  children?: TreeChartNode[];
  [key: string]: any;
}

export interface TreeChartSelectionKeys {
  [key: string]: any;
}

export interface TreeChartCollapsedKeys {
  [key: string]: any;
}

export const treeChartProps = () => ({
  prefixCls: String,
  value: anyType<TreeChartNode | null>(null),
  selectionKeys: anyType<TreeChartSelectionKeys | null>(null),
  selectionMode: stringType<'single' | 'multiple' | null>(null),
  collapsible: booleanType(false),
  collapsedKeys: anyType<TreeChartCollapsedKeys | null>(null),
});

export type TreeChartProps = Partial<ExtractPropTypes<ReturnType<typeof treeChartProps>>>;

export default treeChartProps;
