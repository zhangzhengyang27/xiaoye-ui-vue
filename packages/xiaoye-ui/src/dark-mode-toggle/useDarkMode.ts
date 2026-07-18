import { getCurrentInstance, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { Ref } from 'vue';

const DARK_MODE_ATTRIBUTE = 'data-theme';

const getInitialDark = (): boolean => {
  if (typeof document === 'undefined') return false;
  return document.documentElement.getAttribute(DARK_MODE_ATTRIBUTE) === 'dark';
};

const getSystemDark = (): boolean => {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export interface UseDarkModeOptions {
  /** 初始是否为暗色模式 */
  initialValue?: boolean;
  /** 是否同步状态到 document.documentElement 的 data-theme 属性 */
  applyToDocument?: boolean;
  /** 是否跟随系统 prefers-color-scheme 设置 */
  followSystem?: boolean;
}

export interface UseDarkModeReturn {
  /** 当前是否为暗色模式 */
  isDark: Ref<boolean>;
  /** 切换暗色 / 亮色模式 */
  toggle: () => void;
  /** 直接设置暗色模式 */
  setDark: (dark: boolean) => void;
}

/**
 * 暗色模式状态管理 composable
 *
 * - `isDark`: 当前是否为暗色模式
 * - `toggle()`: 切换暗色 / 亮色模式
 * - `setDark(dark)`: 直接设置暗色模式
 *
 * 默认会把状态同步到 `document.documentElement` 的 `data-theme` 属性，
 * 便于和 CSS 变量主题（如 `[data-theme="dark"]`）配合使用。
 */
export function useDarkMode(options: UseDarkModeOptions = {}): UseDarkModeReturn {
  const { initialValue, applyToDocument = true, followSystem = false } = options;

  const isDark = ref<boolean>(
    initialValue !== undefined
      ? initialValue
      : getInitialDark() || (followSystem ? getSystemDark() : false),
  );

  let mediaQuery: MediaQueryList | null = null;
  let mediaHandler: ((event: MediaQueryListEvent) => void) | null = null;

  const apply = (dark: boolean) => {
    isDark.value = dark;
    if (applyToDocument && typeof document !== 'undefined') {
      document.documentElement.setAttribute(DARK_MODE_ATTRIBUTE, dark ? 'dark' : 'light');
    }
  };

  const setDark = (dark: boolean) => {
    apply(dark);
  };

  const toggle = () => {
    apply(!isDark.value);
  };

  // 仅在组件 setup 上下文中注册生命周期钩子，便于 composable 也能在测试 / 工具函数中直接调用
  const inComponent = !!getCurrentInstance();

  if (inComponent) {
    onMounted(() => {
      // 进入页面时同步一次初始状态到 document
      if (applyToDocument && typeof document !== 'undefined') {
        document.documentElement.setAttribute(DARK_MODE_ATTRIBUTE, isDark.value ? 'dark' : 'light');
      }
      if (followSystem && typeof window !== 'undefined' && window.matchMedia) {
        mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaHandler = (event: MediaQueryListEvent) => {
          apply(event.matches);
        };
        mediaQuery.addEventListener?.('change', mediaHandler);
      }
    });

    onBeforeUnmount(() => {
      if (mediaQuery && mediaHandler) {
        mediaQuery.removeEventListener?.('change', mediaHandler);
      }
    });
  } else if (applyToDocument && typeof document !== 'undefined') {
    // 非组件环境下立即同步一次初始状态
    document.documentElement.setAttribute(DARK_MODE_ATTRIBUTE, isDark.value ? 'dark' : 'light');
  }

  // 当外部直接修改 isDark.value 时，也同步到 document
  if (applyToDocument) {
    watch(isDark, value => {
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute(DARK_MODE_ATTRIBUTE, value ? 'dark' : 'light');
      }
    });
  }

  return {
    isDark,
    toggle,
    setDark,
  };
}

export default useDarkMode;
