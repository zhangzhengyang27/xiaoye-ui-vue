import type { ExtractPropTypes, PropType } from 'vue';
import type { NamePath } from '../form/interface';

export interface FormListField {
  key: string;
  name: number;
  isListField: true;
}

export interface FormListOperation {
  add: (defaultValue?: any, insertIndex?: number) => void;
  remove: (index: number) => void;
  move: (from: number, to: number) => void;
}

export const formListProps = () => ({
  prefixCls: String,
  name: { type: [String, Number, Array] as PropType<NamePath>, default: undefined },
  initialValue: { type: Array as PropType<any[]>, default: undefined },
});

export type FormListProps = Partial<ExtractPropTypes<ReturnType<typeof formListProps>>>;

export default formListProps;
