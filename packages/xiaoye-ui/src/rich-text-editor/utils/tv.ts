/**
 * 1:1 复刻 ui-4 的 `tv()` 调用签名（简化实现）。
 *
 * 与 tailwind-variants 不同，本实现不依赖 Tailwind CSS，也不做类名去重/合并。
 * 它的唯一职责是：
 * 1. 组合 `extend` theme 与当前配置；
 * 2. 根据 props 与 defaultVariants 选择变体覆盖；
 * 3. 返回每个 slot 的类名字符串，并允许通过 `slot({ class: ... })` 追加外部类名。
 *
 * theme 中的 slots 应直接返回 XiaoyeUI CSS-in-JS 中已注册的类名（如
 * `xy-rich-text-editor-toolbar-base`），而非 Tailwind 工具类。
 */

type ClassValue = string | number | boolean | undefined | null | ClassValue[] | Record<string, any>;

function isPlainObject(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function flattenClass(value: ClassValue): string {
  if (value == null || typeof value === 'boolean') return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map(flattenClass).filter(Boolean).join(' ');
  if (isPlainObject(value)) {
    return Object.entries(value)
      .filter(([, v]) => !!v)
      .map(([k]) => k)
      .join(' ');
  }
  return '';
}

function resolveTheme(theme: any): {
  slots: Record<string, any>;
  variants: Record<string, any>;
  defaultVariants: Record<string, any>;
} {
  const raw = typeof theme === 'function' ? theme({}) : theme;
  return {
    slots: raw?.slots || {},
    variants: raw?.variants || {},
    defaultVariants: raw?.defaultVariants || {},
  };
}

function mergeTheme(base: any, override: any): any {
  const a = resolveTheme(base);
  const b = resolveTheme(override);

  // slots: override 覆盖 base
  const slots = { ...a.slots };
  for (const [key, value] of Object.entries(b.slots)) {
    slots[key] = value;
  }

  // variants: 递归合并变体定义
  const variants: Record<string, any> = {};
  for (const source of [a.variants, b.variants]) {
    for (const [variantName, variantMap] of Object.entries(source)) {
      variants[variantName] = variants[variantName] || {};
      for (const [variantValue, slotMap] of Object.entries(variantMap as Record<string, any>)) {
        variants[variantName][variantValue] = {
          ...(variants[variantName][variantValue] || {}),
          ...(slotMap || {}),
        };
      }
    }
  }

  // defaultVariants: override 优先
  const defaultVariants = { ...a.defaultVariants, ...b.defaultVariants };

  return { slots, variants, defaultVariants };
}

function buildSlotClasses(
  slotName: string,
  baseClass: any,
  variants: Record<string, any>,
  activeVariants: Record<string, any>,
): string {
  const classes: string[] = [];

  if (baseClass != null && baseClass !== '') {
    classes.push(flattenClass(baseClass));
  }

  for (const [variantName, variantValue] of Object.entries(activeVariants)) {
    const variantMap = variants[variantName];
    if (!variantMap) continue;
    const slotOverride = variantMap[variantValue as string]?.[slotName];
    if (slotOverride != null && slotOverride !== '') {
      classes.push(flattenClass(slotOverride));
    }
  }

  return classes.filter(Boolean).join(' ');
}

export interface TvSlotFn {
  (opts?: { class?: ClassValue; className?: ClassValue; [key: string]: any }): string;
}

export interface TvResult {
  [slot: string]: TvSlotFn | any;
}

export type TvOptions = {
  extend?: any;
  base?: ClassValue;
  slots?: Record<string, ClassValue>;
  variants?: Record<string, Record<string, Record<string, ClassValue>>>;
  compoundVariants?: any[];
  compoundSlots?: any[];
  defaultVariants?: Record<string, string | boolean | number>;
};

export function tv(componentConfig?: TvOptions) {
  const { extend, slots, variants, defaultVariants } = componentConfig || {};
  const theme = mergeTheme(extend, { slots, variants, defaultVariants });

  return (props: Record<string, any> = {}) => {
    const activeVariants: Record<string, any> = { ...theme.defaultVariants, ...props };

    const slotClasses: Record<string, string> = {};
    for (const [slotName, baseClass] of Object.entries(theme.slots)) {
      slotClasses[slotName] = buildSlotClasses(slotName, baseClass, theme.variants, activeVariants);
    }

    return new Proxy(slotClasses, {
      get(target, key: string) {
        if (
          key === 'extend' ||
          key === 'slots' ||
          key === 'variants' ||
          key === 'defaultVariants'
        ) {
          return (theme as any)[key];
        }

        const base = target[key] || '';
        return (opts: { class?: ClassValue; className?: ClassValue; [key: string]: any } = {}) => {
          const extra = flattenClass(opts.class ?? opts.className);
          return extra ? `${base} ${extra}`.trim() : base;
        };
      },
    }) as unknown as TvResult;
  };
}
