# AGENTS.md

XiaoyeUI - 企业级 Vue 3 组件库开发指南

## 项目概述

XiaoyeUI 是一个基于 Vue 3 的企业级 UI 组件库，采用 monorepo 架构，使用 pnpm workspaces 管理多个包。

### 技术栈

| 技术       | 用途                           |
| ---------- | ------------------------------ |
| Vue 3.4+   | 核心框架，使用 Composition API |
| TypeScript | 类型系统                       |
| Vite       | 构建工具                       |
| pnpm       | 包管理器                       |
| Vitest     | 单元测试                       |
| VitePress  | 文档站点                       |
| CSS-in-JS  | 样式方案（基于 @emotion）      |

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 9.6.0

---

## Monorepo 结构

```
├── packages/
│   ├── xiaoye-ui/              # 主组件库（80+ 组件）
│   ├── core/                   # 核心工具库
│   ├── utils/                  # 通用工具函数
│   ├── icons/                  # 图标组件
│   ├── metadata/               # 组件元数据
│   ├── vite-plugin/            # Vite 插件（自动导入）
│   ├── auto-import-resolver/   # 自动导入解析器
│   └── nuxt-module/            # Nuxt.js 模块
├── apps/
│   └── docs/                   # VitePress 文档
└── pnpm-workspace.yaml
```

---

## 包详解

### xiaoye-ui（主组件库）

组件按功能分类存放于 `src/` 目录下：

```
src/
├── button/           # 按钮
├── input/            # 输入框
├── select/           # 选择器
├── table/            # 表格
├── modal/            # 模态框
├── form/             # 表单
├── date-picker/      # 日期选择器
├── tree/             # 树形控件
├── config-provider/  # 全局配置
├── theme/            # 主题系统
├── _util/            # 内部工具
│   ├── props-util/   # Props 工具函数
│   ├── vue-types/    # Vue 类型定义
│   ├── cssinjs/      # CSS-in-JS 实现
│   ├── hooks/        # 组合式函数
│   └── ...
├── vc-*/             # 第三方控件封装（vc- = vendor component）
│   ├── vc-table/     # 表格底层实现
│   ├── vc-select/    # 选择器底层实现
│   ├── vc-picker/    # 选择器底层实现
│   ├── vc-tree/      # 树形控件底层
│   ├── vc-trigger/   # 触发器组件
│   ├── vc-tooltip/   # 工具提示底层
│   └── ...
└── style/            # 全局样式
```

### 各包职责

| 包                                | 职责                              |
| --------------------------------- | --------------------------------- |
| `xiaoye-ui`                       | 80+ UI 组件                       |
| `@xiaoye-ui/core`                 | 核心响应式工具                    |
| `@xiaoye-ui/utils`                | 通用工具函数                      |
| `@xiaoye-ui/icons`                | 图标库                            |
| `@xiaoye-ui/vite-plugin`          | Vite 插件，提供组件和样式自动导入 |
| `@xiaoye-ui/auto-import-resolver` | 自动导入解析器                    |

---

## 常用命令

```bash
# 开发
pnpm dev                      # 启动文档站点开发服务器
pnpm --filter xiaoye-ui dev   # 仅开发主库

# 构建
pnpm build                    # 构建所有包和应用
pnpm build:packages           # 仅构建所有包
pnpm --filter xiaoye-ui build # 构建主组件库

# 测试
pnpm test:unit                # 运行单元测试
pnpm --filter xiaoye-ui test:unit  # 仅测试主库

# 代码质量
pnpm lint                     # ESLint 检查
pnpm lint:fix                 # ESLint 自动修复
pnpm format                   # Prettier 格式化
pnpm typecheck                # TypeScript 类型检查

# 发布
pnpm release                  # 发布所有包
```

---

## 组件开发规范

### 组件文件结构

每个组件遵循统一的目录结构：

```
button/
├── index.ts              # 导出入口
├── Button.tsx            # 主组件（tsx）
├── buttonTypes.ts        # Props 类型定义
├── useButton.ts          # 组合式函数（可选）
├── LoadingIcon.tsx       # 子组件（可选）
├── demo/
│   ├── basic.vue         # 基础用法
│   ├── size.vue          # 尺寸示例
│   └── ...
└── style/
    ├── index.ts          # 样式入口
    ├── index.less        # 样式文件
    └── demo/
        └── button.css   # 示例样式（可选）
```

### Props 类型定义

使用 `vue-types` 和 TypeScript 组合定义 Props：

```typescript
// buttonTypes.ts
import PropTypes from '../_util/vue-types';
import type { ExtractPropTypes, PropType } from 'vue';
import type { SizeType } from '../config-provider';
import { eventType } from '../_util/type';
import type { MouseEventHandler } from '../_util/EventInterface';

export type ButtonType = 'link' | 'default' | 'primary' | 'ghost' | 'dashed' | 'text';
export type ButtonShape = 'default' | 'circle' | 'round';
export type ButtonHTMLType = 'submit' | 'button' | 'reset';

export const buttonProps = () => ({
  prefixCls: String,
  type: { type: String as PropType<ButtonType> },
  htmlType: { type: String as PropType<ButtonHTMLType>, default: 'button' },
  shape: { type: String as PropType<ButtonShape> },
  size: { type: String as PropType<SizeType> },
  loading: {
    type: [Boolean, Object] as PropType<boolean | { delay?: number }>,
    default: (): boolean | { delay?: number } => false,
  },
  disabled: { type: Boolean, default: undefined },
  ghost: { type: Boolean, default: undefined },
  block: { type: Boolean, default: undefined },
  danger: { type: Boolean, default: undefined },
  icon: PropTypes.any,
  href: String,
  target: String,
  onClick: eventType<MouseEventHandler>(),
});

export type ButtonProps = Partial<ExtractPropTypes<ReturnType<typeof buttonProps>>>;
```

### 组件实现模板

```typescript
import { computed, defineComponent, shallowRef, watch } from 'vue';
import Wave from '../_util/wave';
import buttonProps from './buttonTypes';
import { flattenChildren, initDefaultProps } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';
import type { ButtonType } from './buttonTypes';
import type { CustomSlotsType } from '../_util/type';

export default defineComponent({
  name: 'XYButton',
  inheritAttrs: false,
  __XY_BUTTON: true,  // 内部标识
  props: initDefaultProps(buttonProps(), { type: 'default' }),
  slots: Object as CustomSlotsType<{
    icon: any;
    default: any;
  }>,
  setup(props, { slots, attrs, emit, expose }) {
    // 1. 注入配置
    const { prefixCls, direction, size } = useConfigInject('btn', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    // 2. 计算属性
    const classes = computed(() => {
      const { type, shape = 'default', ghost } = props;
      return [
        hashId.value,
        `${prefixCls.value}`,
        {
          [`${prefixCls.value}-${shape}`]: shape !== 'default' && shape,
          [`${prefixCls.value}-${type}`]: type,
        },
      ];
    });

    // 3. 暴露给外部的方法
    expose({
      focus: () => { /* ... */ },
      blur: () => { /* ... */ },
    });

    // 4. 返回渲染函数
    return () => (
      <button
        class={classes.value}
        {...attrs}
        onClick={handleClick}
      >
        {slots.default?.()}
      </button>
    );
  },
});
```

### 组件导出方式

```typescript
// index.ts
import type { App, Plugin } from 'vue';
import Button from './Button';
import type { ButtonProps } from './buttonTypes';

export { buttonProps };
export type { ButtonProps, ButtonType, ButtonShape, ButtonHTMLType } from './buttonTypes';

const XButton = Button as any;

// 添加 install 方法
XButton.install = (app: App) => {
  app.component(Button.name!, Button);
  return app;
};

export default XButton;
```

---

## 样式开发规范

### 样式系统架构

组件库使用 CSS-in-JS 方案，基于 Design Token 机制：

```
Seed Token → Map Token → Alias Token → Component Token
    ↓            ↓            ↓              ↓
  颜色种子    间距/圆角    语义别名      组件专属
```

### 样式文件结构

```typescript
// style/index.ts
import type { CSSInterpolation, CSSObject } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import { genFocusStyle } from '../../style';
import { genCompactItemStyle } from '../../style/compact-item';

// 组件 Token 接口
export interface ComponentToken {}

// 组件扩展 Token
export interface ButtonToken extends FullToken<'Button'> {
  colorOutlineDefault: string;
  buttonPaddingHorizontal: number;
}

// 生成样式函数
const genSharedButtonStyle: GenerateStyle<ButtonToken, CSSObject> = (token): CSSObject => {
  const { componentCls, iconCls } = token;

  return {
    [componentCls]: {
      outline: 'none',
      display: 'inline-block',
      // ...
      [`> ${iconCls} + span, > span + ${iconCls}`]: {
        marginInlineStart: token.marginXS,
      },
    },
  };
};

// 导出样式 hook
export default genComponentStyleHook('Button', token => {
  const buttonToken = mergeToken<ButtonToken>(token, {
    buttonPaddingHorizontal: token.paddingContentHorizontal,
  });

  return [
    genSharedButtonStyle(buttonToken),
    genTypeButtonStyle(buttonToken),
    genSizeButtonStyle(buttonToken),
    // ...
  ];
});
```

### Token 类型

| Token 类型      | 说明     | 示例                      |
| --------------- | -------- | ------------------------- |
| Seed Token      | 种子值   | `colorPrimary: #1890ff`   |
| Map Token       | 派生值   | `colorSuccessContainer`   |
| Alias Token     | 语义别名 | `colorLink`               |
| Component Token | 组件专属 | `buttonPaddingHorizontal` |

### 样式生成器函数

| 函数                    | 用途              |
| ----------------------- | ----------------- |
| `genComponentStyleHook` | 创建组件样式 hook |
| `mergeToken`            | 合并 Token        |
| `genFocusStyle`         | 生成焦点样式      |
| `genCompactItemStyle`   | 生成紧凑布局样式  |

---

## 类型系统

### 工具类型

项目定义了一系列工具类型（`src/_util/type.ts`）：

```typescript
// 固定长度的字符串元组
export const tuple = <T extends string[]>(...args: T) => args;

// Prop 类型辅助函数
export function eventType<T>() {
  return { type: [Function, Array] as PropType<T | T[]> };
}

export function objectType<T = {}>(defaultVal?: T) {
  return { type: Object as PropType<T>, default: defaultVal as T };
}

export function booleanType(defaultVal?: boolean) {
  return { type: Boolean, default: defaultVal as boolean };
}

export function functionType<T = () => {}>(defaultVal?: T) {
  return { type: Function as PropType<T>, default: defaultVal as T };
}

export function stringType<T extends string = string>(defaultVal?: T) {
  return { type: String as PropType<T>, default: defaultVal as T };
}

export function arrayType<T extends any[]>(defaultVal?: T) {
  return { type: Array as unknown as PropType<T>, default: defaultVal as T };
}

export type CustomSlotsType<T> = SlotsType<T>;
```

### Vue 类型扩展

```typescript
import type { VueNode } from '../_util/type';

// VNodeChildAtom = VNode | string | number | boolean | null | undefined | void
export type VueNode = VNodeChildAtom | VNodeChildAtom[] | VNode;
```

---

## 常用工具函数

### Props 工具 (`_util/props-util/`)

```typescript
import {
  flattenChildren, // 扁平化子节点
  initDefaultProps, // 初始化默认 Props
  getSlot, // 获取插槽
  getComponent, // 获取组件
  getOptionProps, // 获取组件 Props
  getEvents, // 获取事件
  getClass, // 获取类名
  getStyle, // 获取样式
  filterEmpty, // 过滤空元素
  hasProp, // 检查 Prop 是否存在
} from '../_util/props-util';
```

### Config 注入 (`config-provider/hooks/`)

```typescript
import useConfigInject from '../config-provider/hooks/useConfigInject';

// 在组件中使用
const {
  prefixCls, // 前缀类名
  direction, // 文本方向
  size, // 尺寸
  getPrefixCls, // 获取前缀类名方法
  rootPrefixCls, // 根前缀类名
  iconPrefixCls, // 图标前缀
  disabled, // 禁用状态
  getPopupContainer, // 弹出容器
  renderEmpty, // 空状态渲染
  space, // 间距配置
} = useConfigInject('btn', props);
```

### Vue Types

```typescript
import PropTypes from '../_util/vue-types';

// 可用的 PropTypes
PropTypes.string;
PropTypes.number;
PropTypes.bool;
PropTypes.func;
PropTypes.array;
PropTypes.object;
PropTypes.any;
PropTypes.looseBool; // 宽松布尔类型
PropTypes.style; // 样式属性
PropTypes.VueNode; // Vue 节点
```

---

## 上下文系统

### ConfigProvider

全局配置组件，提供主题、语言等功能：

```typescript
import { ConfigProvider } from 'xiaoye-ui';

<ConfigProvider
  theme={{
    token: {
      colorPrimary: '#1890ff',
    },
  }}
  locale={zhCN}
>
  <App />
</ConfigProvider>
```

### Context 注入

组件间通过 Context 共享状态：

```typescript
// 尺寸 Context
import { useInjectSize, useProvideSize } from '../config-provider/SizeContext';

// 禁用 Context
import { useInjectDisabled, useProvideDisabled } from '../config-provider/DisabledContext';
```

---

## 测试规范

### 测试文件位置

```
button/
├── __tests__/
│   ├── button.test.tsx   # 组件测试
│   └── __snapshots__/
│       └── button.test.tsx.snap  # 快照
├── demo/
└── style/
```

### 测试示例

```typescript
import { mount } from '@vue/test-utils';
import Button from '../Button';

describe('Button', () => {
  it('should render correctly', () => {
    const wrapper = mount(Button, {
      props: { type: 'primary' },
      slots: { default: 'Button' },
    });
    expect(wrapper.classes()).toContain('xiaoye-btn-primary');
  });

  it('should handle click', async () => {
    const onClick = vi.fn();
    const wrapper = mount(Button, {
      props: { onClick },
    });
    await wrapper.trigger('click');
    expect(onClick).toHaveBeenCalled();
  });
});
```

---

## 代码风格

### TypeScript

- 使用 `interface` 定义对象类型
- 使用 `type` 定义联合类型、映射类型
- 启用严格模式（除 `strictNullChecks: false`）
- 优先使用 `ComputedRef` 而非直接访问 `.value`

### Vue 组件

- 使用 `<script setup lang="ts">` 或 `defineComponent` 风格
- Props 使用函数式定义 `buttonProps()`
- 使用 `shallowRef` 优化性能
- 避免在模板中使用复杂的计算

### 样式

- 使用 Design Token 而非硬编码值
- 遵循 `genComponentStyleHook` 模式
- 组件类名使用 `componentCls` 占位符

### Git 提交

遵循 Conventional Commits：

```
feat(button): add new type 'link'
fix(input): resolve value sync issue
docs(readme): update installation guide
style(button): adjust padding for compact mode
refactor(utils): extract common logic
test(table): add unit tests for sorting
chore(deps): upgrade dependencies
```

---

## 路径别名

项目中配置了路径别名，方便导入：

```typescript
import Button from 'xiaoye-ui/button';
import { useConfigInject } from 'xiaoye-ui/config-provider/hooks/useConfigInject';
import { flattenChildren } from 'xiaoye-ui/_util/props-util';
import { genComponentStyleHook } from 'xiaoye-ui/theme/internal';
```

| 别名                     | 路径                       |
| ------------------------ | -------------------------- |
| `xiaoye-ui`              | `packages/xiaoye-ui/src`   |
| `xiaoye-ui/*`            | `packages/xiaoye-ui/src/*` |
| `@xiaoye-ui/core`        | `packages/core/src`        |
| `@xiaoye-ui/utils`       | `packages/utils/src`       |
| `@xiaoye-ui/icons`       | `packages/icons/src`       |
| `@xiaoye-ui/metadata`    | `packages/metadata/src`    |
| `@xiaoye-ui/vite-plugin` | `packages/vite-plugin/src` |

---

## 开发工作流

### 添加新组件

1. 创建组件目录结构
2. 实现组件文件和样式
3. 在组件 `index.ts` 里导出组件与 Props 类型
4. 运行 `pnpm gen:entries` 重新生成聚合入口与导出表（见下节，替代手工改 `src/index.ts` / `package.json`）
5. 编写文档和示例
6. 添加单元测试
7. 运行 `pnpm typecheck` 确保类型正确

### 生成物：导出聚合（强制了解）

`packages/xiaoye-ui` 有三个**生成物**，已纳入版本控制，禁止手工编辑：

| 生成物 | 作用 |
| --- | --- |
| `src/components.ts` | 组件聚合入口：`export * from './<dir>'` + `export { default as Xx }` + 样式副作用导入 + 歧义名定主语句 |
| `typings/global.d.ts` | Vue `GlobalComponents` 类型声明（`XYXxx`） |
| `package.json` 的 `exports` 字段 | 每个组件 `./<name>` 与 `./<name>/style` 双入口（开发期指向 `src`，发布期由 `postbuild` 转成 `dist`） |

生成器在 `packages/xiaoye-ui/scripts/`：`entry-generator.mjs`（静态扫描导出名）+ `gen-entries.mjs`（CLI）+ `ownership-pins.mjs`（归属 pin）。

```bash
pnpm gen:entries     # 写生成物（新增/改名/删除组件后必须执行）
pnpm check:entries   # 只校验生成物是否新鲜，漂移则退出码 1
```

- `pnpm build` 的 `prebuild` 只做 `--check`：**不再静默改写 tracked 文件**，检测到漂移即失败并提示运行 `pnpm gen:entries`。
- 两个组件暴露同名导出（如都导出 `XxxProps`）会让 `src/components.ts` 触发 TS2308。生成器会自动挑出 owner 并补一条显式 re-export 来消解，**不需要**也**不应该**再维护 `export *` 黑名单。
- 自动归属优先级：目录名正是该名字的 PascalCase → 只有一个候选目录就地声明了它（其余是转发）→ 目录名字典序。
- `ownership-pins.mjs` 只用于锁定「6.x 已经发布出去的」归属（`ColumnType`、`LabeledValue`、`SelectValue`），避免换 owner 改变公开 API。**新增冲突不要加 pin**；pin 失效时 `--check` 会报错要求删除。
- 新增组件时避免与既有公开名重名（尤其 `XxxProps` 之外的裸名如 `Group`/`Item`）；重名不会报错，但会让更多名字出现在包根导出面上，需要一并更新 `tests/__snapshots__/index.test.js.snap`。

### 添加新依赖

1. 确定依赖属于哪个包
2. 在对应包的 package.json 中添加
3. 对于主库依赖，使用 `workspace:*` 协议引用内部包
4. 运行 `pnpm install` 更新 lockfile

### 构建发布

```bash
# 1. 确保所有测试通过
pnpm test:unit

# 2. 类型检查
pnpm typecheck

# 3. 构建
pnpm build

# 4. 发布
pnpm release
```

---

## 注意事项

1. **避免循环依赖**：组件间避免相互引用，使用 Context 或 Props 传递
2. **Tree-shaking 支持**：按需导出组件和样式
3. **SSR 兼容**：组件需要支持服务端渲染
4. **无障碍性**：遵循 WCAG 规范，提供键盘导航和屏幕阅读器支持
5. **性能优化**：使用 `shallowRef`、避免不必要的响应式转换
6. **向后兼容**：遵循语义化版本，保持 API 稳定性

---

## AI 协作开发规范

> 本章节供 AI 编码助手阅读，用于在生成、修改、审查代码时统一遵循 XiaoyeUI 的硬性约定。

### 命名规范（强制）

- 组件标签统一使用 `xy-` 前缀，禁止使用 `a-` 前缀。
- 组件 `name` 属性统一使用 `XYXxx` 格式，禁止使用 `AXxx` 格式。
- 内部组件标识统一使用 `__XY_*` 前缀，禁止使用 `__ANT_*` 前缀。
- 示例组件标签统一使用 `demo-` 前缀，避免与真实组件冲突。
- CSS 类名统一使用 `xy-` 前缀，禁止使用 `ant-` 前缀。

### 图标规范（强制）

- 所有图标必须从 `@xiaoye-ui/icons` 命名导入，例如 `import { SearchOutlined } from '@xiaoye-ui/icons'`。
- 禁止从 `@ant-design/icons-vue` 或其子路径导入图标。
- 新增图标必须同时：
  1. 在 `packages/icons/src/[icon-name]/[IconName].vue` 创建组件；
  2. 在 `packages/icons/src/index.js` 兼容层添加导出；
  3. 图标组件必须将 `<svg>` 包裹在 `<span class="xyicon">` 中。

### 组件注册规范（强制）

- 全局注册组件必须使用 `registerComponent` 工具（`packages/xiaoye-ui/src/_util/registerComponent.ts`）。
- 该工具会自动将 `XYXxx` 映射为 `xy-xxx` 标签名，并防止重复注册。
- 禁止直接调用 `app.component('xy-button', Button)` 等硬编码标签名注册。

### 组件开发模板（强制）

每个新组件必须遵循以下目录结构：

```
packages/xiaoye-ui/src/<component>/
├── index.ts              # 导出入口
├── <Component>.tsx       # 主组件
├── <component>Types.ts   # Props 类型定义
├── use<Component>.ts     # 组合式函数（可选）
├── style/
│   └── index.ts          # CSS-in-JS 样式入口
└── demo/                 # 文档示例（如需要文档）
    ├── basic.vue
    └── ...
```

### Props 与类型（强制）

- Props 必须使用函数式定义，例如 `buttonProps()`，并通过 `initDefaultProps(buttonProps(), defaults)` 初始化。
- 优先使用 `src/_util/type.ts` 中的辅助函数：`booleanType`、`stringType`、`functionType`、`objectType`、`arrayType`、`eventType`。
- 事件处理器使用 `eventType<T>()` 定义。
- Props 类型文件使用 `ExtractPropTypes` 导出 `XXXProps` 类型。

### 样式开发（强制）

- 使用 CSS-in-JS 方案，基于 Design Token。
- 组件样式文件使用 `genComponentStyleHook('ComponentName', token => [...])` 创建。
- 禁止在组件样式中硬编码颜色、间距等值，应使用 Token。
- 组件类名占位符使用 `componentCls`。

### 文档与示例（强制）

- 新增组件必须补充文档：`apps/docs/components/<component>.md`。
- 文档中的示例组件标签使用 `demo-` 前缀，例如 `<demo-button-basic>`。
- 示例文件放在 `apps/docs/examples/<component>/<demo-name>.vue`。

### 测试（强制）

- 新增组件必须补充单元测试，测试文件放在组件目录内或 `__tests__` 子目录。
- 使用 Vitest 和 `@vue/test-utils`。
- 运行 `pnpm test:unit` 确保通过。

### 提交代码前必须执行的检查

```bash
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm build:packages
```

改动过组件目录（新增/改名/删除）时，还要：

```bash
pnpm gen:entries   # 重新生成 components.ts / global.d.ts / package.json exports
```

### 禁止事项

- 禁止手工编辑生成物 `packages/xiaoye-ui/src/components.ts`、`packages/xiaoye-ui/typings/global.d.ts`，或绕过 `pnpm gen:entries` 直接改 `packages/xiaoye-ui/package.json` 的 `exports`。
- 禁止引入新的 `@ant-design/icons-vue` 依赖或子路径导入。
- 禁止在组件代码中遗留 `console.log`（允许 `console.warn` / `console.error`）。
- 禁止在发布产物中保留 `workspace:*` 依赖声明。
- 禁止将构建产物 `dist/`、`node_modules/`、`.vitepress/cache/` 提交到 Git。
