import type { MaybeRef, WatchStopHandle } from 'vue';
import { reactive, unref, watchEffect } from 'vue';
import { registerTheme } from './cssVariables';
import type { AliasToken } from '../theme/interface';
import type { ConfigProviderProps, ConfigProviderTheme, ThemeConfig } from './context';
import { defaultIconPrefixCls } from './context';

export const defaultPrefixCls = 'xy';

function getGlobalPrefixCls() {
  return globalConfigForApi.prefixCls || defaultPrefixCls;
}

function getGlobalIconPrefixCls() {
  return globalConfigForApi.iconPrefixCls || defaultIconPrefixCls;
}

export const globalConfigBySet = reactive<ConfigProviderProps>({}); // 权重最大
export const globalConfigForApi: ConfigProviderProps & {
  getRootPrefixCls?: (rootPrefixCls?: string, customizePrefixCls?: string) => string;
} = reactive({});

watchEffect(() => {
  Object.assign(globalConfigForApi, globalConfigBySet);
  // 只从 globalConfigBySet 读取，不能读 globalConfigForApi.prefixCls：
  // 那样会同时读写同一个响应式对象形成自依赖，写入值一旦与读回值不同即无限重跑
  globalConfigForApi.prefixCls = globalConfigBySet.prefixCls || defaultPrefixCls;
  globalConfigForApi.iconPrefixCls = globalConfigBySet.iconPrefixCls || defaultIconPrefixCls;
  globalConfigForApi.getPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
    if (customizePrefixCls) return customizePrefixCls;
    return suffixCls
      ? `${globalConfigForApi.prefixCls}-${suffixCls}`
      : globalConfigForApi.prefixCls;
  };
  globalConfigForApi.getRootPrefixCls = () => {
    // If Global prefixCls provided, use this
    if (globalConfigForApi.prefixCls) {
      return globalConfigForApi.prefixCls;
    }

    // Fallback to default prefixCls
    return getGlobalPrefixCls();
  };
});

export type GlobalConfigProviderProps = {
  prefixCls?: MaybeRef<ConfigProviderProps['prefixCls']>;
  iconPrefixCls?: MaybeRef<ConfigProviderProps['iconPrefixCls']>;
  getPopupContainer?: ConfigProviderProps['getPopupContainer'];
};

/**
 * 全局静态 API（message / notification / modal.confirm）的主题配置。
 * 支持新式 ThemeConfig（algorithm / token / components），也兼容旧版 CSS 变量风格（primaryColor 等）。
 */
export type GlobalConfigTheme = ThemeConfig & Partial<ConfigProviderTheme>;

const legacyThemeColorKeys = [
  'primaryColor',
  'infoColor',
  'successColor',
  'warningColor',
  'errorColor',
  'processingColor',
] as const;

function isLegacyTheme(theme: GlobalConfigTheme | undefined): theme is ConfigProviderTheme {
  return !!theme && legacyThemeColorKeys.some(key => (theme as any)[key] !== undefined);
}

// 旧版 CSS 变量主题（primaryColor 等）映射为对应 token，供新式主题链路消费
export function resolveGlobalTheme(theme?: GlobalConfigTheme): ThemeConfig | undefined {
  if (!theme) {
    return undefined;
  }
  const {
    token = {},
    primaryColor,
    infoColor,
    successColor,
    warningColor,
    errorColor,
    processingColor,
    ...rest
  } = theme;
  const legacyToken: Partial<AliasToken> = {};
  if (primaryColor) {
    legacyToken.colorPrimary = primaryColor;
  }
  if (processingColor) {
    legacyToken.colorPrimary = processingColor;
  }
  if (infoColor) {
    legacyToken.colorInfo = infoColor;
  }
  if (successColor) {
    legacyToken.colorSuccess = successColor;
  }
  if (warningColor) {
    legacyToken.colorWarning = warningColor;
  }
  if (errorColor) {
    legacyToken.colorError = errorColor;
  }
  const hasLegacy = Object.keys(legacyToken).length > 0;
  const hasModern =
    !!rest.algorithm ||
    !!rest.components ||
    rest.hashed !== undefined ||
    Object.keys(token as object).length > 0;
  if (!hasLegacy && !hasModern) {
    return undefined;
  }
  return {
    ...rest,
    ...(hasLegacy
      ? { token: { ...(token as object), ...legacyToken } as ThemeConfig['token'] }
      : { token }),
  };
}

let stopWatchEffect: WatchStopHandle;
export const setGlobalConfig = (
  params: GlobalConfigProviderProps & { theme?: MaybeRef<GlobalConfigTheme> },
) => {
  if (stopWatchEffect) {
    stopWatchEffect();
  }
  stopWatchEffect = watchEffect(() => {
    const { theme, ...rest } = params;
    const resolvedTheme = resolveGlobalTheme(unref(theme));
    Object.assign(globalConfigBySet, reactive(rest));
    Object.assign(globalConfigForApi, reactive({ ...rest, theme: resolvedTheme }));
  });
  const rawTheme = unref(params.theme);
  if (rawTheme && isLegacyTheme(rawTheme)) {
    // 兼容旧 API：继续注册 CSS 变量主题（--xy-primary-color 等）
    registerTheme(getGlobalPrefixCls(), rawTheme);
  }
};

export const globalConfig = () => ({
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => {
    if (customizePrefixCls) return customizePrefixCls;
    return suffixCls ? `${getGlobalPrefixCls()}-${suffixCls}` : getGlobalPrefixCls();
  },
  getIconPrefixCls: getGlobalIconPrefixCls,
  getRootPrefixCls: () => {
    // If Global prefixCls provided, use this
    if (globalConfigForApi.prefixCls) {
      return globalConfigForApi.prefixCls;
    }

    // Fallback to default prefixCls
    return getGlobalPrefixCls();
  },
});
