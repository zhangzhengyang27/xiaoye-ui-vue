# 迁移 PrimeVue 组件并改造为 Ant Design 风格

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` or inline execution with review checkpoints.

**Goal:** 将 AI 项目中的 7 个组件迁移到当前 xiaoye-ui-vue 项目，并按 Ant Design 风格与 xiaoye-ui 规范重新实现。

**Architecture:** 每个组件独立目录，使用 `XY` 前缀、`xy-` 类名前缀、CSS-in-JS（`genComponentStyleHook`）、Design Token；通过 `prebuild.mjs` 自动注册到 `components.ts`/`package.json`/`typings/global.d.ts`。

**Tech Stack:** Vue 3 + TSX、xiaoye-ui Design Token、Vitest、`@xiaoye-ui/icons`。

---

## 执行顺序

1. ImageCompare
2. ScrollPanel
3. Rating
4. ToggleButton
5. Chips
6. VirtualList
7. DataTable

---

## 每个组件的标准任务

### 任务 N: `<ComponentName>`

**Files:**

- Create: `packages/xiaoye-ui/src/<kebab-name>/index.ts`
- Create: `packages/xiaoye-ui/src/<kebab-name>/<ComponentName>.tsx`
- Create: `packages/xiaoye-ui/src/<kebab-name>/interface.ts`（Props 类型）
- Create: `packages/xiaoye-ui/src/<kebab-name>/style/index.ts`
- Create: `packages/xiaoye-ui/src/<kebab-name>/__tests__/<component>.test.tsx`

- [ ] **Step 1: 参考 AI 项目组件，设计 Ant Design 风格 API**
- [ ] **Step 2: 实现 Props 类型与主组件**
- [ ] **Step 3: 实现 CSS-in-JS 样式**
- [ ] **Step 4: 编写单元测试**
- [ ] **Step 5: 运行 `pnpm --filter xiaoye-ui prebuild` 注册组件**
- [ ] **Step 6: 运行类型检查与测试**
  ```bash
  pnpm --filter xiaoye-ui typecheck
  pnpm --filter xiaoye-ui test:unit
  ```
- [ ] **Step 7: 用户 review，确认后继续下一个组件**

---

## 规范要求

- 组件 `name` 使用 `XY<ComponentName>`
- CSS 类名使用 `xy-<kebab-name>`
- Props 使用函数式定义 `xxxProps()` + `initDefaultProps`
- 优先使用 `src/_util/type.ts` 辅助函数
- 图标从 `@xiaoye-ui/icons` 命名导入
- 安装使用 `registerComponent` 或 `withInstall`
- 样式使用 `genComponentStyleHook`，禁止硬编码颜色/间距
