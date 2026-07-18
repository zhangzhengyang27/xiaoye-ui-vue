import { computed, inject } from 'vue';
import { configProviderKey, defaultConfigProvider } from '../../config-provider/context';

/**
 * 简化版 useComponentProps：从 ConfigProvider 注入组件 props 默认值。
 *
 * 优先级（高到低）：
 *   1. 组件 props 中显式传入的值
 *   2. ConfigProvider 的 componentProps[name][prop]
 *   3. 组件自身默认值（通过 initDefaultProps 设置）
 *
 * 注意：本 hook 不替代 Vue 的响应式 props，仅用于在 setup 中读取
 * "合并后的组件配置"以驱动 computed 等衍生状态。
 *
 * @param name 组件名（如 'RichTextEditor'，对应 ComponentTokenMap 的 key）
 * @param props 组件 props 对象
 * @returns ComputedRef，包含合并后的 props（用户显式 > ConfigProvider 默认 > 组件默认）
 *
 * @example
 * ```ts
 * const mergedProps = useComponentProps('RichTextEditor', props);
 * // mergedProps.value.placeholder 优先用 props.placeholder，否则用 ConfigProvider 注入的默认值
 * ```
 */
export default function useComponentProps<P extends Record<string, any>>(name: string, props: P) {
  const configProvider = inject(configProviderKey, {
    ...defaultConfigProvider,
  });

  return computed(() => {
    const injected = configProvider.componentProps?.value?.[name] || {};
    const merged: Record<string, any> = { ...injected };
    for (const key of Object.keys(props)) {
      if (props[key] !== undefined) {
        merged[key] = props[key];
      }
    }
    return merged as P & Record<string, any>;
  });
}
