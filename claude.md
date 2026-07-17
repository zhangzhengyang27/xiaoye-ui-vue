# XiaoyeUI 项目规则

你是 XiaoyeUI 的 AI 编码助手。XiaoyeUI 是一个基于 Vue 3 + TypeScript 的企业级 UI 组件库，采用 pnpm monorepo 架构。在生成或修改代码时，必须严格遵守以下规则。

## 项目核心约定

- 组件标签统一使用 `xy-` 前缀，禁止使用 `a-` 前缀。
- 组件 `name` 属性统一使用 `XYXxx` 格式，禁止使用 `AXxx` 格式。
- 内部组件标识统一使用 `__XY_*` 前缀，禁止使用 `__ANT_*` 前缀。
- 示例组件标签统一使用 `demo-` 前缀，避免与真实组件冲突。
- CSS 类名统一使用 `xy-` 前缀，禁止使用 `ant-` 前缀。

## 图标规则

- 所有图标必须从 `@xiaoye-ui/icons` 命名导入： `import { SearchOutlined } from '@xiaoye-ui/icons'`
- 禁止从 `@ant-design/icons-vue` 或其子路径导入图标。
- 新增图标必须同时满足：
  1. 在 `packages/icons/src/[icon-name]/[IconName].vue` 创建组件；
  2. 在 `packages/icons/src/index.js` 兼容层添加导出；
  3. 图标组件必须将 `<svg>` 包裹在 `<span class="xyicon">` 中。

## 组件注册

- 全局注册组件必须使用 `registerComponent` 工具（`packages/xiaoye-ui/src/_util/registerComponent.ts`）。
- 该工具会自动将 `XYXxx` 映射为 `xy-xxx` 标签名，并防止重复注册。
- 禁止直接调用 `app.component('xy-button', Button)` 等硬编码标签名注册。

## 新组件目录结构

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

## Props 与类型

- Props 必须使用函数式定义，例如 `buttonProps()`，并通过 `initDefaultProps(buttonProps(), defaults)` 初始化。
- 优先使用 `src/_util/type.ts` 中的辅助函数：`booleanType`、`stringType`、`functionType`、`objectType`、`arrayType`、`eventType`。
- 事件处理器使用 `eventType<T>()` 定义。
- Props 类型文件使用 `ExtractPropTypes` 导出 `XXXProps` 类型。

## 样式开发

- 使用 CSS-in-JS 方案，基于 Design Token。
- 组件样式文件使用 `genComponentStyleHook('ComponentName', token => [...])` 创建。
- 禁止在组件样式中硬编码颜色、间距等值，应使用 Token。
- 组件类名占位符使用 `componentCls`。

## 文档与示例

- 新增组件必须补充文档：`apps/docs/components/<component>.md`。
- 文档中的示例组件标签使用 `demo-` 前缀，例如 `<demo-button-basic>`。
- 示例文件放在 `apps/docs/examples/<component>/<demo-name>.vue`。

## 测试

- 新增组件必须补充单元测试，测试文件放在组件目录内或 `__tests__` 子目录。
- 使用 Vitest 和 `@vue/test-utils`。
- 运行 `pnpm test:unit` 确保通过。

## 提交前检查

在每次提交前必须执行：

```bash
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm build:packages
```

## 禁止事项

- 禁止引入新的 `@ant-design/icons-vue` 依赖或子路径导入。
- 禁止在组件代码中遗留 `console.log`（允许 `console.warn` / `console.error`）。
- 禁止在发布产物中保留 `workspace:*` 依赖声明。
- 禁止将构建产物 `dist/`、`node_modules/`、`.vitepress/cache/` 提交到 Git。

## 路径别名

- 组件内导入使用 `xiaoye-ui/*` 别名，例如 `import Button from 'xiaoye-ui/button'`。
- 内部工具使用 `xiaoye-ui/_util/*`，例如 `import { flattenChildren } from 'xiaoye-ui/_util/props-util'`。

## 参考文档

更详细的项目规范请阅读项目根目录的 `AGENTS.md`。
