import type { ExtractPropTypes } from 'vue';
import { anyType, booleanType, stringType } from '../_util/type';

export interface OrganizationChartNode {
  key: any;
  type?: string;
  styleClass?: string;
  data?: any;
  selectable?: boolean;
  collapsible?: boolean;
  children?: OrganizationChartNode[];
  [key: string]: any;
}

export interface OrganizationChartSelectionKeys {
  [key: string]: any;
}

export interface OrganizationChartCollapsedKeys {
  [key: string]: any;
}

export const organizationChartProps = () => ({
  prefixCls: String,
  value: anyType<OrganizationChartNode | null>(null),
  selectionKeys: anyType<OrganizationChartSelectionKeys | null>(null),
  selectionMode: stringType<'single' | 'multiple' | null>(null),
  collapsible: booleanType(false),
  collapsedKeys: anyType<OrganizationChartCollapsedKeys | null>(null),
  ariaLabel: stringType<string>(),
});

export type OrganizationChartProps = Partial<
  ExtractPropTypes<ReturnType<typeof organizationChartProps>>
>;

export default organizationChartProps;
