import type { ExtractPropTypes, PropType } from 'vue';
import { booleanType, stringType } from '../_util/type';
import type { KeyFilterPresetName } from './presets';

export type KeyFilterPreset = KeyFilterPresetName;

export type KeyFilterPattern = RegExp;

export interface KeyFilterOptions {
  pattern?: KeyFilterPattern;
  validateOnly?: boolean;
}

export const keyFilterProps = () => ({
  prefixCls: String,
  // 预设名：pint / int / pnum / money / num / hex / email / alpha / alphanum
  preset: stringType<KeyFilterPreset>(),
  // 自定义正则
  pattern: { type: Object as PropType<KeyFilterPattern>, default: undefined },
  // 仅验证模式：不阻止按键，内部验证整体值
  validateOnly: booleanType(),
});

export type KeyFilterProps = Partial<ExtractPropTypes<ReturnType<typeof keyFilterProps>>>;
