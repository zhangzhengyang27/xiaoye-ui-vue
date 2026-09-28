# 更新日志

本项目所有 notable 变更都会记录在此文件中。

## Unreleased

### 工程与构建

- `packages/xiaoye-ui` 的导出聚合改为静态扫描生成：新增 `scripts/entry-generator.mjs` + `scripts/gen-entries.mjs`，删除 `scripts/prebuild.mjs`
- 取消手工维护的 `EXPORT_STAR_EXCEPTIONS` / `NAMED_EXPORT_OVERRIDES` / `NO_DEFAULT_EXPORT_DIRS` 黑名单；两个组件暴露同名导出时由生成器自动定主（显式 re-export 覆盖 `export *`），不再触发 TS2308
- `pnpm build` 的 prebuild 由「就地改写 tracked 文件」改为漂移校验：生成物过期时构建失败并提示运行 `pnpm gen:entries`；新增根脚本 `pnpm gen:entries`
- 112 个组件目录、668 个导出名全部解析成功，11 个同名冲突自动消解，`ColumnType` / `LabeledValue` / `SelectValue` 通过 `scripts/ownership-pins.mjs` 保持既有归属不变

### 公共 API

- 包根导出面从 356 个名字增加到 378 个（无移除）：此前被 `export *` 黑名单整体屏蔽的 `RangePicker`、`WeekPicker`、`MonthPicker`、`QuarterPicker`、`SubMenu`、`MenuItemGroup`、`MenuDivider`、`ListItemMeta`、`SelectOption`、`RadioGroup`、`RadioButton` 等子组件与 `selectProps`、`cascaderProps`、`listProps` 等 Props 工厂现在可从 `xiaoye-ui` 直接导入

### 测试

- 新增 `form` 单测 23 个（`useForm` 校验/trigger/reset/clearValidate/嵌套路径 + `Form` 提交与错误渲染）、`table-core` 单测 25 个（排序/分页/过滤/引擎分派）、`app` 单测 5 个
- 新增导出聚合生成器单测 19 个与包根导出面快照守卫，单测总数 1207 → 1282

## 6.0.0

### 架构与工程

- 基于 ant-design-vue 重构为 pnpm monorepo，主包迁移至 `packages/xiaoye-ui`
- 构建链迁移至 Vite 7 库模式（ESM-only）
- 文档站点迁移至 VitePress（`apps/docs`）
- 修复 ESLint 配置以支持 monorepo 与 Vitest，批量清理 500+ lint 错误
- 清理 100+ 个废弃的 webpack/site 依赖，升级 husky、@types/node、@typescript-eslint 等工具链
- 修复 pre-commit 钩子，迁移至 lint-staged

### 组件与样式

- 组件 CSS 类名前缀由 `ant-` 统一迁移为 `xy-`
- 组件标签前缀由 `a-` 统一迁移为 `xy-`，组件 `name` 由 `AXxx` 统一迁移为 `XYXxx`
- 新增 `registerComponent` 工具，自动将 `XYXxx` 映射为 `xy-xxx` 并防止重复注册
- 全部图标组件统一包裹 `<span class="xyicon">` 容器，修复组件内图标布局
- 图标导入统一迁移至 `@xiaoye-ui/icons` 命名导入，补充 39 个缺失的兼容层导出
- 新增 `AndroidIcon`、`EnterIcon`、`SwapIcon` 等图标组件

### 包与发布

- 新增 `@xiaoye-ui/icons`、`@xiaoye-ui/utils`、`@xiaoye-ui/metadata`、`@xiaoye-ui/vite-plugin`、`@xiaoye-ui/auto-import-resolver`、`@xiaoye-ui/nuxt-module` 等子包
- 新增 `scripts/prepare-dist-package.mjs`，为所有子包自动生成带正确入口、exports 和版本号的 `dist/package.json`
- 修复 Nuxt 模块构建产物路径与 `unbuild` 警告问题
- 删除空的 MCP 包

### 类型与测试

- 修复 `packages/vite-plugin` 与 `packages/auto-import-resolver` 的 TypeScript `rootDir` 冲突
- 修复 `vc-select/BaseSelect.tsx` 类型定义
- 修复 `packages/xiaoye-ui/tests/index.test.js` 全量导入超时问题
- 迁移并修复测试文件路径引用，移除失效的 `tests/shared/demoTest` 与旧快照
- 单测 99 个文件、610 通过、32 跳过、0 失败

### 文档

- 文档站样式整体迁移自 Element Plus，解决 VitePress 默认样式污染组件示例的问题
- 修复导航栏、侧边栏、锚点、主题切换等文档站点细节
- 新增安装指南、LLM / AI 使用指南，完善介绍页内容
- 导航栏版本标签改为动态读取 `xiaoye-ui` 组件库版本
- 新增 `scripts/generate-llms-txt.mjs`，自动生成 `llms.txt` 与 `llms-full.txt` 供 AI / LLM 消费
- 文档站托管 `/llms.txt` 与 `/llms-full.txt`，并修复 `.txt` 文件中文编码问题
