import type { ExtractPropTypes } from 'vue';
import PropTypes from '../_util/vue-types';
import { booleanType, eventType, stringType } from '../_util/type';

/** 行内编辑输入类型 */
export type InlineEditType = 'text' | 'number' | 'textarea';

export const inlineEditProps = () => ({
  prefixCls: String,
  /** 当前值，支持 v-model */
  modelValue: PropTypes.any,
  /** 输入类型：单行文本、数字、多行文本 */
  type: stringType<InlineEditType>('text'),
  /** 是否禁用，禁用后无法进入编辑模式 */
  disabled: booleanType(false),
  /** 占位符：展示区为空时显示，编辑模式传入输入框 */
  placeholder: String,
  /** 是否处于编辑状态，支持 v-model:editable */
  editable: booleanType(false),
  /** 自动保存：每次输入变化时即触发 save 并保留编辑态 */
  autoSave: booleanType(false),
  /** 值变化回调 */
  onChange: eventType<(value: any) => void>(),
  /** 保存回调 */
  onSave: eventType<(value: any) => void>(),
  /** 取消回调 */
  onCancel: eventType<(value: any) => void>(),
  /** 进入编辑模式回调 */
  onEdit: eventType<(event: Event) => void>(),
});

export type InlineEditProps = Partial<ExtractPropTypes<ReturnType<typeof inlineEditProps>>>;
