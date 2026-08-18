import { computed, defineComponent, shallowRef, watch } from 'vue';
import type { VNode } from 'vue';
import Wave from '../_util/wave';
import Switch from '../switch';
import { SunIcon, MoonIcon } from '@xiaoye-ui/icons';
import { initDefaultProps } from '../_util/props-util';
import { useInjectDisabled } from '../config-provider/DisabledContext';
import { setGlobalConfig } from '../config-provider/globalConfig';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';
import darkModeToggleProps from './darkModeToggleTypes';
import { useDarkMode } from './useDarkMode';
import theme from '../theme';
import type { CustomSlotsType } from '../_util/type';

export default defineComponent({
  name: 'XYDarkModeToggle',
  inheritAttrs: false,
  __XY_DARK_MODE_TOGGLE: true,
  props: initDefaultProps(darkModeToggleProps(), {
    variant: 'button',
    size: 'middle',
    defaultDark: false,
    applyToDocument: true,
    followSystem: false,
  }),
  slots: Object as CustomSlotsType<{
    sunIcon?: any;
    moonIcon?: any;
    default?: any;
  }>,
  emits: ['change', 'update:dark'],
  setup(props, { slots, attrs, emit, expose }) {
    const { prefixCls, direction, size } = useConfigInject('dark-mode-toggle', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const disabledContext = useInjectDisabled();
    const mergedDisabled = computed(() => props.disabled ?? disabledContext.value);

    // 受控 / 非受控模式判断
    const isControlled = () => props.dark !== undefined;

    // 内部非受控状态（受控模式下仅作为占位，实际值由 props.dark 决定）
    const internalDark = useDarkMode({
      initialValue: props.defaultDark,
      applyToDocument: props.applyToDocument,
      followSystem: props.followSystem,
    });

    // 合并后的当前状态：受控优先
    const mergedDark = computed(() => (isControlled() ? !!props.dark : internalDark.isDark.value));

    // 受控模式下，外部 dark 变化时也同步到 document
    watch(
      mergedDark,
      value => {
        if (isControlled() && props.applyToDocument && typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', value ? 'dark' : 'light');
        }
      },
      { immediate: true },
    );

    // 同步全局主题算法：使 message / notification / Modal.confirm 等静态方法与
    // holder 弹层（包括未包裹在页面级 ConfigProvider 内的场景）跟随暗/浅切换
    if (props.syncGlobalTheme) {
      watch(
        mergedDark,
        dark => {
          setGlobalConfig({
            theme: {
              algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
            },
          });
        },
        { immediate: true },
      );
    }

    const setDark = (dark: boolean) => {
      if (mergedDisabled.value) return;
      emit('update:dark', dark);
      emit('change', dark);
      props.onChange?.(dark);
      if (!isControlled()) {
        internalDark.setDark(dark);
      }
    };

    const handleClick = () => {
      if (mergedDisabled.value) return;
      setDark(!mergedDark.value);
    };

    const buttonRef = shallowRef<HTMLElement | null>(null);

    expose({
      focus: () => buttonRef.value?.focus(),
      blur: () => buttonRef.value?.blur(),
    });

    // 图标：优先使用 props，其次插槽，最后用内置 SunIcon / MoonIcon
    // props 既支持 VNode，也支持返回 VNode 的渲染函数
    const resolveIcon = (source: any, slotFn: (() => any) | undefined, fallback: VNode): VNode => {
      const custom = source ?? slotFn?.();
      if (typeof custom === 'function') {
        return (custom as () => VNode)();
      }
      return (custom as VNode) || fallback;
    };

    const sunNode = computed<VNode>(() => resolveIcon(props.sunIcon, slots.sunIcon, <SunIcon />));
    const moonNode = computed<VNode>(() =>
      resolveIcon(props.moonIcon, slots.moonIcon, <MoonIcon />),
    );

    const iconNode = computed<VNode>(() => (mergedDark.value ? moonNode.value : sunNode.value));

    const classes = computed(() => ({
      [hashId.value]: true,
      [prefixCls.value]: true,
      [`${prefixCls.value}-checked`]: mergedDark.value,
      [`${prefixCls.value}-disabled`]: mergedDisabled.value,
      [`${prefixCls.value}-small`]: size.value === 'small',
      [`${prefixCls.value}-large`]: size.value === 'large',
      [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
    }));

    const ariaLabel = computed(() => (mergedDark.value ? '切换到亮色模式' : '切换到暗色模式'));

    return () => {
      // 开关风格：直接复用 Switch 组件
      if (props.variant === 'switch') {
        return wrapSSR(
          <Switch
            {...attrs}
            class={[classes.value, `${prefixCls.value}-switch`, attrs.class]}
            checked={mergedDark.value}
            disabled={mergedDisabled.value}
            size={size.value === 'small' ? 'small' : 'default'}
            aria-label={ariaLabel.value}
            onUpdate:checked={(v: boolean | string | number) => setDark(!!v)}
          >
            {{
              checkedChildren: () => moonNode.value,
              unCheckedChildren: () => sunNode.value,
            }}
          </Switch>,
        );
      }

      // 按钮风格：圆形按钮带图标
      return wrapSSR(
        <Wave>
          <button
            {...attrs}
            ref={buttonRef}
            type="button"
            role="switch"
            aria-checked={mergedDark.value}
            aria-label={ariaLabel.value}
            disabled={mergedDisabled.value}
            class={[classes.value, attrs.class]}
            style={attrs.style}
            onClick={handleClick}
          >
            {iconNode.value}
          </button>
        </Wave>,
      );
    };
  },
});
