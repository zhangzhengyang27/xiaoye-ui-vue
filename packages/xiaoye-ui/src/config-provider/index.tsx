import type { App, Plugin } from 'vue';
import { watch, computed, defineComponent, watchEffect } from 'vue';
import defaultRenderEmpty from './renderEmpty';
import type { RenderEmptyHandler } from './renderEmpty';
import type { Locale } from '../locale-provider';
import LocaleProvider, { XY_MARK } from '../locale-provider';
import { registerComponent } from '../_util/registerComponent';

import LocaleReceiver from '../locale-provider/LocaleReceiver';

import message from '../message';
import notification from '../notification';
import defaultLocale from '../locale/en_US';
import type { ValidateMessages } from '../form/interface';
import useStyle from './style';
import useTheme from './hooks/useTheme';
import defaultSeedToken from '../theme/themes/seed';
import type { ConfigProviderInnerProps } from './context';
import {
  useConfigContextProvider,
  useConfigContextInject,
  configProviderProps,
  useProvideGlobalForm,
  defaultIconPrefixCls,
} from './context';
import { globalConfigBySet, setGlobalConfig } from './globalConfig';
import { useProviderSize } from './SizeContext';
import { useProviderDisabled } from './DisabledContext';
import { createTheme } from '../_util/cssinjs';
import { DesignTokenProvider } from '../theme/internal';

export {
  defaultPrefixCls,
  globalConfigForApi,
  globalConfig,
  setGlobalConfig,
  resolveGlobalTheme,
} from './globalConfig';
export type { GlobalConfigTheme, GlobalConfigProviderProps } from './globalConfig';
export type {
  ConfigProviderProps,
  ConfigProviderTheme,
  ThemeConfig,
  SizeType,
  Direction,
  CSPConfig,
  DirectionType,
} from './context';
export { defaultIconPrefixCls };

export const configConsumerProps = [
  'getTargetContainer',
  'getPopupContainer',
  'rootPrefixCls',
  'getPrefixCls',
  'renderEmpty',
  'csp',
  'autoInsertSpaceInButton',
  'locale',
  'pageHeader',
];

const ConfigProvider = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'XYConfigProvider',
  inheritAttrs: false,
  props: configProviderProps(),
  setup(props, { slots }) {
    const parentContext = useConfigContextInject();
    const getPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
      const { prefixCls = 'xy' } = props;
      if (customizePrefixCls) return customizePrefixCls;
      const mergedPrefixCls = prefixCls || parentContext.getPrefixCls('');
      return suffixCls ? `${mergedPrefixCls}-${suffixCls}` : mergedPrefixCls;
    };
    const iconPrefixCls = computed(
      () => props.iconPrefixCls || parentContext.iconPrefixCls.value || defaultIconPrefixCls,
    );
    const shouldWrapSSR = computed(() => iconPrefixCls.value !== parentContext.iconPrefixCls.value);
    const csp = computed(() => props.csp || parentContext.csp?.value);

    const wrapSSR = useStyle(iconPrefixCls);

    const mergedTheme = useTheme(
      computed(() => props.theme),
      computed(() => parentContext.theme?.value),
    );
    const renderEmptyComponent = (name?: string) => {
      const renderEmpty = (props.renderEmpty ||
        slots.renderEmpty ||
        parentContext.renderEmpty ||
        defaultRenderEmpty) as RenderEmptyHandler;
      return renderEmpty(name);
    };
    const autoInsertSpaceInButton = computed(
      () => props.autoInsertSpaceInButton ?? parentContext.autoInsertSpaceInButton?.value,
    );
    const locale = computed(() => props.locale || parentContext.locale?.value);
    watch(
      locale,
      () => {
        globalConfigBySet.locale = locale.value;
      },
      { immediate: true },
    );
    const direction = computed(() => props.direction || parentContext.direction?.value);
    const space = computed(() => props.space ?? parentContext.space?.value);
    const virtual = computed(() => props.virtual ?? parentContext.virtual?.value);
    const dropdownMatchSelectWidth = computed(
      () => props.dropdownMatchSelectWidth ?? parentContext.dropdownMatchSelectWidth?.value,
    );
    const getTargetContainer = computed(() =>
      props.getTargetContainer !== undefined
        ? props.getTargetContainer
        : parentContext.getTargetContainer?.value,
    );
    const getPopupContainer = computed(() =>
      props.getPopupContainer !== undefined
        ? props.getPopupContainer
        : parentContext.getPopupContainer?.value,
    );
    const pageHeader = computed(() =>
      props.pageHeader !== undefined ? props.pageHeader : parentContext.pageHeader?.value,
    );
    const input = computed(() =>
      props.input !== undefined ? props.input : parentContext.input?.value,
    );
    const pagination = computed(() =>
      props.pagination !== undefined ? props.pagination : parentContext.pagination?.value,
    );
    const form = computed(() =>
      props.form !== undefined ? props.form : parentContext.form?.value,
    );
    const select = computed(() =>
      props.select !== undefined ? props.select : parentContext.select?.value,
    );
    const componentSize = computed(() => props.componentSize);
    const componentDisabled = computed(() => props.componentDisabled);
    const wave = computed(() => props.wave ?? parentContext.wave?.value);
    const ripple = computed(() => props.ripple ?? parentContext.ripple?.value ?? true);
    const componentProps = computed(() => {
      const self = props.componentProps;
      const parent = parentContext.componentProps?.value;
      if (!self && !parent) return {};
      if (!self) return parent || {};
      if (!parent) return self;
      // 父子合并：子覆盖父（同组件名时浅合并，组件内 props 深合并）
      const merged: Record<string, Record<string, any>> = { ...parent };
      for (const key of Object.keys(self)) {
        merged[key] = { ...(parent[key] || {}), ...self[key] };
      }
      return merged;
    });
    const configProvider: ConfigProviderInnerProps = {
      csp,
      autoInsertSpaceInButton,
      locale,
      direction,
      space,
      virtual,
      dropdownMatchSelectWidth,
      getPrefixCls,
      iconPrefixCls,
      theme: computed(() => {
        return mergedTheme.value ?? parentContext.theme?.value;
      }),
      renderEmpty: renderEmptyComponent,
      getTargetContainer,
      getPopupContainer,
      pageHeader,
      input,
      pagination,
      form,
      select,
      componentSize,
      componentDisabled,
      transformCellText: computed(() => props.transformCellText),
      wave,
      ripple,
      componentProps,
    };

    // ================================ Dynamic theme ================================
    const memoTheme = computed(() => {
      const { algorithm, token, ...rest } = mergedTheme.value || {};
      const themeObj =
        algorithm && (!Array.isArray(algorithm) || algorithm.length > 0)
          ? createTheme(algorithm)
          : undefined;
      return {
        ...rest,
        theme: themeObj,

        token: {
          ...defaultSeedToken,
          ...token,
        },
      };
    });
    const validateMessagesRef = computed(() => {
      // Additional Form provider
      let validateMessages: ValidateMessages = {};

      if (locale.value) {
        validateMessages =
          locale.value.Form?.defaultValidateMessages ||
          defaultLocale.Form?.defaultValidateMessages ||
          {};
      }
      if (props.form && props.form.validateMessages) {
        validateMessages = { ...validateMessages, ...props.form.validateMessages };
      }
      return validateMessages;
    });
    useConfigContextProvider(configProvider);
    useProvideGlobalForm({ validateMessages: validateMessagesRef });
    useProviderSize(componentSize);
    useProviderDisabled(componentDisabled);

    const renderProvider = (legacyLocale: Locale) => {
      let childNode = shouldWrapSSR.value ? wrapSSR(slots.default?.()) : slots.default?.();
      if (props.theme)
        childNode = <DesignTokenProvider value={memoTheme.value}>{childNode}</DesignTokenProvider>;
      return (
        <LocaleProvider locale={locale.value || legacyLocale} XY_MARK__={XY_MARK}>
          {childNode}
        </LocaleProvider>
      );
    };

    watchEffect(() => {
      if (direction.value) {
        message.config({
          rtl: direction.value === 'rtl',
        });
        notification.config({
          rtl: direction.value === 'rtl',
        });
      }
    });

    return () => (
      <LocaleReceiver children={(_, __, legacyLocale) => renderProvider(legacyLocale as Locale)} />
    );
  },
});

ConfigProvider.config = setGlobalConfig;

ConfigProvider.install = function (app: App) {
  registerComponent(app, ConfigProvider);
};

export default ConfigProvider as typeof ConfigProvider &
  Plugin & {
    readonly config: typeof setGlobalConfig;
  };
