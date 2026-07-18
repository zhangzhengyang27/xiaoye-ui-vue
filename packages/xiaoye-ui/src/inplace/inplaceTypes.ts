import type { ExtractPropTypes } from 'vue';
import { booleanType, functionType } from '../_util/type';

/**
 * 切换前的回调，返回 false 可阻止切换到编辑模式
 */
export type DisplayToggleCallback = (event?: Event) => boolean | void | Promise<boolean | void>;

export const inplaceProps = () => ({
  prefixCls: String,
  /** 是否处于编辑状态，支持 v-model:active */
  active: booleanType(false),
  /** 是否禁用，禁用后无法进入编辑模式 */
  disabled: booleanType(false),
  /** 编辑模式是否显示关闭按钮 */
  closable: booleanType(true),
  /** 切换到编辑模式前的回调，返回 false 阻止切换 */
  displayToggleCallback: functionType<DisplayToggleCallback>(),
});

export type InplaceProps = Partial<ExtractPropTypes<ReturnType<typeof inplaceProps>>>;

export const inplaceDisplayProps = () => ({
  prefixCls: String,
});

export type InplaceDisplayProps = Partial<ExtractPropTypes<ReturnType<typeof inplaceDisplayProps>>>;

export const inplaceContentProps = () => ({
  prefixCls: String,
  /** 是否显示关闭按钮 */
  closable: booleanType(true),
});

export type InplaceContentProps = Partial<ExtractPropTypes<ReturnType<typeof inplaceContentProps>>>;
