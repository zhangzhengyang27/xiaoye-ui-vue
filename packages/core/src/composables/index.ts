// Core composables
import type { InjectionKey, PropType } from 'vue';
import { provide } from 'vue';

export interface BaseIconProps {
  size?: string | number;
  strokeWidth?: string | number;
  fill?: string;
  spin?: boolean;
}

export const baseIconProps = {
  size: [String, Number] as PropType<string | number>,
  strokeWidth: [String, Number] as PropType<string | number>,
  fill: String,
  spin: Boolean,
};

export function useBaseIcon(props: BaseIconProps) {
  const pti = () => {
    const attrs: Record<string, any> = {};
    if (props.size) attrs.width = attrs.height = String(props.size);
    if (props.fill) attrs.fill = props.fill;
    if (props.strokeWidth) attrs['stroke-width'] = String(props.strokeWidth);
    return attrs;
  };
  return { pti };
}

/**
 * 将父组件的内部状态/方法通过 provide 暴露给子组件 inject。
 * 替代 Object.defineProperty(proxy, ...) + provide(proxy) 的老模式。
 *
 * @param provideKey provide 的 key（字符串或 symbol），子组件 inject 时用同一个 key
 * @param expose    plain object，包含所有需要暴露给子组件的属性和方法
 * @returns         返回传入的 expose 对象本身，方便在父组件中也直接使用
 */
export function useProvide(provideKey: string | symbol, expose: Record<string, any>) {
  provide(provideKey, expose);
  return expose;
}

/**
 * 泛型版本，带 TypeScript 类型提示。
 */
export function useProvideTyped<T extends Record<string, any>>(
  provideKey: InjectionKey<T> | string | symbol,
  expose: T,
): T {
  provide(provideKey as any, expose);
  return expose;
}
