import type { ExtractPropTypes, PropType } from 'vue';
import type { SizeType } from '../config-provider';
import { eventType, anyType } from '../_util/type';

/** 暗色模式切换组件的外观风格 */
export type DarkModeToggleVariant = 'button' | 'switch';

/** 暗色模式切换组件的尺寸 */
export type DarkModeToggleSize = SizeType;

export const darkModeToggleProps = () => ({
  prefixCls: String,
  /** 当前是否为暗色模式，支持 v-model:dark */
  dark: { type: Boolean, default: undefined },
  /** 初始是否为暗色模式（非受控模式下生效） */
  defaultDark: { type: Boolean, default: false },
  /** 组件尺寸 */
  size: { type: String as PropType<DarkModeToggleSize>, default: 'middle' },
  /** 外观风格：`button` 圆形按钮（默认），`switch` 开关风格 */
  variant: { type: String as PropType<DarkModeToggleVariant>, default: 'button' },
  /** 亮色模式下显示的图标 */
  sunIcon: anyType(),
  /** 暗色模式下显示的图标 */
  moonIcon: anyType(),
  /** 是否禁用 */
  disabled: { type: Boolean, default: undefined },
  /** 是否同步状态到 document.documentElement 的 data-theme 属性 */
  applyToDocument: { type: Boolean, default: true },
  /**
   * 是否同步切换全局组件主题算法（ConfigProvider.config）。
   * 开启后静态方法（message / notification / Modal.confirm）与 holder 弹层也会跟随切换暗/浅。
   */
  syncGlobalTheme: { type: Boolean, default: true },
  /** 是否跟随系统 prefers-color-scheme 设置（仅非受控模式下生效） */
  followSystem: { type: Boolean, default: false },
  onChange: eventType<(isDark: boolean) => void>(),
  'onUpdate:dark': eventType<(isDark: boolean) => void>(),
});

export type DarkModeToggleProps = Partial<ExtractPropTypes<ReturnType<typeof darkModeToggleProps>>>;

export default darkModeToggleProps;
