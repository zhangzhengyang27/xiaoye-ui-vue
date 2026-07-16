# AGENTS.md

XiaoyeUI - 企业级 Vue 3 组件库开发指南

## 项目概述

XiaoyeUI 是一个基于 Vue 3 的企业级 UI 组件库，采用 monorepo 架构，使用 pnpm workspaces 管理多个包。

### 技术栈

| 技术 | 用途 |
|------|------|
| Vue 3.4+ | 核心框架，使用 Composition API |
| TypeScript | 类型系统 |
| Vite | 构建工具 |
| pnpm | 包管理器 |
| Vitest | 单元测试 |
| VitePress | 文档站点 |
| CSS-in-JS | 样式方案（基于 @emotion） |

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
│   ├── nuxt-module/            # Nuxt.js 模块
│   └── mcp/                    # MCP 服务器
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

| 包 | 职责 |
|----|------|
| `xiaoye-ui` | 80+ UI 组件 |
| `@xiaoye-ui/core` | 核心响应式工具 |
| `@xiaoye-ui/utils` | 通用工具函数 |
| `@xiaoye-ui/icons` | 图标库 |
| `@xiaoye-ui/vite-plugin` | Vite 插件，提供组件和样式自动导入 |
| `@xiaoye-ui/auto-import-resolver` | 自动导入解析器 |
| `@xiaoye-ui/mcp` | Cursor MCP 服务器 |

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
  name: 'AButton',
  inheritAttrs: false,
  __ANT_BUTTON: true,  // 内部标识
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

| Token 类型 | 说明 | 示例 |
|-----------|------|------|
| Seed Token | 种子值 | `colorPrimary: #1890ff` |
| Map Token | 派生值 | `colorSuccessContainer` |
| Alias Token | 语义别名 | `colorLink` |
| Component Token | 组件专属 | `buttonPaddingHorizontal` |

### 样式生成器函数

| 函数 | 用途 |
|------|------|
| `genComponentStyleHook` | 创建组件样式 hook |
| `mergeToken` | 合并 Token |
| `genFocusStyle` | 生成焦点样式 |
| `genCompactItemStyle` | 生成紧凑布局样式 |

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
  flattenChildren,    // 扁平化子节点
  initDefaultProps,   // 初始化默认 Props
  getSlot,            // 获取插槽
  getComponent,       // 获取组件
  getOptionProps,     // 获取组件 Props
  getEvents,          // 获取事件
  getClass,           // 获取类名
  getStyle,           // 获取样式
  filterEmpty,        // 过滤空元素
  hasProp,            // 检查 Prop 是否存在
} from '../_util/props-util';
```

### Config 注入 (`config-provider/hooks/`)

```typescript
import useConfigInject from '../config-provider/hooks/useConfigInject';

// 在组件中使用
const {
  prefixCls,          // 前缀类名
  direction,          // 文本方向
  size,               // 尺寸
  getPrefixCls,       // 获取前缀类名方法
  rootPrefixCls,      // 根前缀类名
  iconPrefixCls,      // 图标前缀
  disabled,          // 禁用状态
  getPopupContainer,  // 弹出容器
  renderEmpty,        // 空状态渲染
  space,              // 间距配置
} = useConfigInject('btn', props);
```

### Vue Types

```typescript
import PropTypes from '../_util/vue-types';

// 可用的 PropTypes
PropTypes.string
PropTypes.number
PropTypes.bool
PropTypes.func
PropTypes.array
PropTypes.object
PropTypes.any
PropTypes.looseBool  // 宽松布尔类型
PropTypes.style      // 样式属性
PropTypes.VueNode     // Vue 节点
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

| 别名 | 路径 |
|------|------|
| `xiaoye-ui` | `packages/xiaoye-ui/src` |
| `xiaoye-ui/*` | `packages/xiaoye-ui/src/*` |
| `@xiaoye-ui/core` | `packages/core/src` |
| `@xiaoye-ui/utils` | `packages/utils/src` |
| `@xiaoye-ui/icons` | `packages/icons/src` |
| `@xiaoye-ui/metadata` | `packages/metadata/src` |
| `@xiaoye-ui/vite-plugin` | `packages/vite-plugin/src` |

---

## 开发工作流

### 添加新组件

1. 创建组件目录结构
2. 实现组件文件和样式
3. 导出组件（index.ts）
4. 注册到主入口（src/index.ts）
5. 添加导出到 package.json
6. 编写文档和示例
7. 添加单元测试
8. 运行 `pnpm typecheck` 确保类型正确

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
