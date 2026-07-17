import type { ExtractPropTypes, PropType } from 'vue';
import { booleanType, anyType, objectType } from '../_util/type';

/** 文本变更事件载荷 */
export interface EditorTextChangeEvent {
  /** 当前 HTML 值 */
  htmlValue: string;
  /** 当前纯文本值 */
  textValue: any;
  /** 变更描述 */
  delta: any;
  /** 变更来源（'user' | 'api'） */
  source: string;
  /** Quill 实例 */
  instance: any;
}

/** 选区变更事件载荷 */
export interface EditorSelectionChangeEvent {
  /** 当前 HTML 值 */
  htmlValue: string;
  /** 当前纯文本值 */
  textValue: any;
  /** 当前选区 */
  range: any;
  /** 上一次选区 */
  oldRange: any;
  /** 变更来源（'user' | 'api'） */
  source: string;
  /** Quill 实例 */
  instance: any;
}

/** 加载完成事件载荷 */
export interface EditorLoadEvent {
  /** Quill 实例 */
  instance: any;
}

export const editorProps = () => ({
  prefixCls: String,
  modelValue: { type: String, default: undefined },
  defaultValue: { type: String, default: undefined },
  placeholder: { type: String as PropType<string | null>, default: null },
  readonly: booleanType(false),
  invalid: booleanType(false),
  formats: { type: Array as PropType<string[] | null>, default: null },
  editorStyle: anyType<any>(null),
  modules: objectType<any>(null),
});

export type EditorProps = Partial<ExtractPropTypes<ReturnType<typeof editorProps>>>;

export default editorProps;
