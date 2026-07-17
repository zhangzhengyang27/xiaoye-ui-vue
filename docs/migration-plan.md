# XiaoyeUI 组件迁移详细实施计划

> **文档属性**：可交付其他 AI 执行的实施型计划 **源项目**：`/Users/xiaoye/Desktop/AI/自研组件库/xiaoye-ui-vue` **目标项目**：`/Users/xiaoye/Desktop/xiaoye-ui-vue` **制定日期**：2026-07-17 **执行方式**：分批串行，每批完成后验证通过再进入下一批

---

## 一、决策汇总（执行前必读）

| #   | 决策项                   | 选择                                                |
| --- | ------------------------ | --------------------------------------------------- |
| 1   | PrimeVue 风格等价组件    | **仅借鉴不迁移**                                    |
| 2   | 重型组件（Editor/Chart） | **迁入主包** `packages/xiaoye-ui/src/`              |
| 3   | TreeTable                | **独立迁移 + table-core**                           |
| 4   | 指令体系                 | **用组件方式实现**（不引入指令）                    |
| 5   | DynamicDialog            | **扩展现有 modal**（不新增独立组件）                |
| 6   | 子组件目录结构           | **合并到父目录**（遵循当前项目规范）                |
| 7   | FormList                 | **确认缺失，需迁移**（扫描证实当前 form/ 无此能力） |
| 8   | 已弃用组件               | **一律不迁移**                                      |
| 9   | 迁移批次                 | **分批迁移**                                        |

---

## 二、执行前必做：基础设施准备（批次 0）

**这是所有后续批次的前置依赖，必须先完成。**

### 任务 0.1：扩展 `@xiaoye-ui/utils/dom` 入口

**问题**：当前项目 `packages/utils/package.json` 的 `"./dom"` exports 指向占位符 `src/dom.ts`，仅导出 `isClient`(常量)、`isServer`、`createStyleAsString`。而源项目所需 `getHeight/getWidth/getOuterHeight/getOuterWidth/isVisible/isRTL/absolutePosition/relativePosition/findSingle/getHiddenElementOuterHeight/getHiddenElementOuterWidth/getViewport/isTouchDevice/addStyle/focus/getAttribute/setAttribute/getIndex/getOffset/clearSelection/find/getOuterWidth` 等函数虽在 `src/dom/methods/` 下存在，却无法通过包入口访问。

**执行步骤**：

1. 读取 `/Users/xiaoye/Desktop/xiaoye-ui-vue/packages/utils/package.json`
2. 修改 `"./dom"` exports 字段，指向 `src/dom/index.ts`
3. 创建 `/Users/xiaoye/Desktop/xiaoye-ui-vue/packages/utils/src/dom/index.ts`，从 `./methods/*` 聚合导出所有现有 dom 方法
4. 保留 `isClient`/`isServer`/`createStyleAsString` 的导出以兼容现有代码
5. 运行 `pnpm --filter @xiaoye-ui/utils build` 验证
6. 在主项目运行 `pnpm typecheck` 确认无破坏性变更

**验证标准**：`import { getHeight, isRTL, absolutePosition } from '@xiaoye-ui/utils/dom'` 可正常导入。

---

### 任务 0.2：在 theme/interface/components.ts 注册 ComponentToken

**问题**：当前项目 `genComponentStyleHook` 第一参数要求 `keyof ComponentTokenMap`，而源项目传字符串。需注册所有待迁移组件的 token。

**执行步骤**：

1. 读取 `/Users/xiaoye/Desktop/xiaoye-ui-vue/packages/xiaoye-ui/src/theme/interface/components.ts`
2. 在 `ComponentTokenMap` 接口中追加以下空接口（仅占位，不定义字段）：

```typescript
Portal: ComponentToken;
VirtualScroller: ComponentToken;
Panel: ComponentToken;
Toolbar: ComponentToken;
Fieldset: ComponentToken;
Splitter: ComponentToken;
SplitterPanel: ComponentToken;
ContextMenu: ComponentToken;
Galleria: ComponentToken;
OrganizationChart: ComponentToken;
TreeChart: ComponentToken;
ColorPicker: ComponentToken;
FormList: ComponentToken;
DataView: ComponentToken;
TreeTable: ComponentToken;
Editor: ComponentToken;
RichTextEditor: ComponentToken;
Chart: ComponentToken;
FocusTrap: ComponentToken;
Ripple: ComponentToken;
KeyFilter: ComponentToken;
OverlayBadge: ComponentToken;
```

3. 运行 `pnpm typecheck` 验证

---

### 任务 0.3：处理 `genComponentStyleHook` 第三参数兼容性

**问题**：源项目大量使用 `genComponentStyleHook(name, fn, 'xy-xxx')` 三参数形式，当前项目可能不支持。

**执行步骤**：

1. 读取 `/Users/xiaoye/Desktop/xiaoye-ui-vue/packages/xiaoye-ui/src/theme/internal.ts` 或 `theme/util/genComponentStyleHook.ts`
2. 确认第三参数签名。若不支持字符串第三参数：
   - 选项 A：扩展签名支持第三参数（rootClass 覆盖）
   - 选项 B：迁移每个组件时去掉第三参数，确保 `useConfigInject` 的 prefixCls 与 genComponentStyleHook 的 name 推导一致
3. **推荐选项 B**：迁移时统一去掉第三参数，靠 `useConfigInject('xxx', props)` + `genComponentStyleHook('Xxx', fn)` 自动推导

---

### 任务 0.4：创建缺失的共享模块（被多个组件依赖）

源项目以下模块被多个待迁移组件依赖，当前项目缺失，**必须先迁移**：

#### 0.4.1 创建 `packages/xiaoye-ui/src/portal/`

**源文件**：`/Users/xiaoye/Desktop/AI/自研组件库/xiaoye-ui-vue/packages/xiaoye-ui/src/portal/Portal.tsx`（40 行）

**执行步骤**：

1. 在当前项目创建 `packages/xiaoye-ui/src/portal/` 目录
2. 创建 `Portal.tsx`，基于源项目复制并做以下改造：
   - `name: 'Portal'` → `name: 'XYPortal'`（注意：当前项目 `_util/Portal.tsx` 已存在但用途不同，公开组件用 `XYPortal` 区分）
   - `import { isClient } from '@xiaoye-ui/utils/dom'` → 改为 `const isClient = typeof window !== 'undefined'`（避免依赖 utils 包函数版）
   - `import useConfigInject from '../configprovider/hooks/useConfigInject'` → `'../config-provider/hooks/useConfigInject'`
   - Props 改为函数式：`portalProps()`
   - 用 `initDefaultProps(portalProps(), { appendTo: 'body', disabled: false })`
3. 创建 `portalTypes.ts` 导出 `PortalProps` 类型
4. 创建 `style/index.ts`，用 `genComponentStyleHook('Portal', () => ({}))` 空样式占位
5. 创建 `index.ts`，用 `registerComponent(XYPortal)` 注册，导出 `XYPortal` + `PortalProps`
6. 在 `packages/xiaoye-ui/src/components.ts` 注册（或自动生成机制）

**验证**：

```bash
pnpm --filter xiaoye-ui typecheck
pnpm --filter xiaoye-ui test:unit -- portal
```

---

#### 0.4.2 创建 `packages/xiaoye-ui/src/ripple/`（用组件方式 + composable）

**源文件**：`/Users/xiaoye/Desktop/AI/自研组件库/xiaoye-ui-vue/packages/xiaoye-ui/src/ripple/Ripple.ts`

**决策依据**：用户选择"用组件方式实现"，但 Ripple 被 16 个内部组件使用，包裹组件会破坏 DOM 结构。**采用"组件 + composable 双形态"**：

- 外部业务用 `<xy-ripple>` 包裹组件
- 内部组件用 `useRipple(ref)` composable（不增加 DOM 层级）

**执行步骤**：

1. 创建 `packages/xiaoye-ui/src/ripple/` 目录
2. 创建 `useRipple.ts` composable，将源项目 `Ripple.ts` 中 `createRipple`、`onMouseDown`、`onAnimationEnd`、`remove` 函数迁移到内部
3. `import { addClass, createElement, getHeight, getOffset, getOuterHeight, getOuterWidth, removeClass } from '@xiaoye-ui/utils/dom'`
4. 创建 `Ripple.tsx` 包裹组件
5. 创建 `rippleTypes.ts`、`style/index.ts`（用 `genComponentStyleHook('Ripple', token => [...])` 迁移原 `.xy-ripple__ink` 样式）、`index.ts`（用 `registerComponent` 注册）
6. **全局 config.ripple 支持**：在 `config-provider/context.ts` 追加 `ripple: boolean` 字段，默认 `true`

**验证**：

```bash
pnpm --filter xiaoye-ui typecheck
pnpm --filter xiaoye-ui test:unit -- ripple
```

---

#### 0.4.3 创建 `packages/xiaoye-ui/src/focus-trap/`（用组件方式 + composable）

**源文件**：`/Users/xiaoye/Desktop/AI/自研组件库/xiaoye-ui-vue/packages/xiaoye-ui/src/focustrap/FocusTrap.ts`

**执行步骤**：

1. 创建 `packages/xiaoye-ui/src/focus-trap/` 目录（注意用连字符，符合当前项目规范）
2. 创建 `useFocusTrap.ts` composable，迁移源项目 `createHiddenFocusableElements`、`bind`、`unbind`、`autoElementFocus` 逻辑
3. `import { createElement, focus, getFirstFocusableElement, getLastFocusableElement, isFocusableElement } from '@xiaoye-ui/utils/dom'`
4. `import { isNotEmpty } from '@xiaoye-ui/utils/object'`
5. 创建 `FocusTrap.tsx` 包裹组件
6. 创建 `focusTrapTypes.ts`，Props 包含：`disabled`、`autoFocus`、`autoFocusSelector`、`firstFocusableSelector`、`lastFocusableSelector`、`tabIndex`、`onFocusIn`(eventType)、`onFocusOut`(eventType)
7. 创建 `style/index.ts`，迁移 `.xy-hidden-accessible` 和 `.xy-hidden-focusable` 样式
8. 创建 `index.ts`，用 `registerComponent` 注册

**验证**：

```bash
pnpm --filter xiaoye-ui typecheck
pnpm --filter xiaoye-ui test:unit -- focus-trap
```

---

#### 0.4.4 创建 `packages/xiaoye-ui/src/_util/overlayEventBus.ts`

**源文件**：`/Users/xiaoye/Desktop/AI/自研组件库/xiaoye-ui-vue/packages/xiaoye-ui/src/overlayeventbus/OverlayEventBus.ts`

**执行步骤**：

1. 读取源项目 `OverlayEventBus.ts`（基于 mitt 或自实现 EventEmitter）
2. 在当前项目 `packages/xiaoye-ui/src/_util/overlayEventBus.ts` 创建等价实现
3. 导出 `OverlayEventBus` 单例

**验证**：`pnpm --filter xiaoye-ui typecheck`

---

#### 任务 0.5：补充缺失的 `@xiaoye-ui/core/utils` 函数

**缺失函数**：`getVNodeProp`、`HelperSet`、`ConnectedOverlayScrollHandler`、`useProvide`

**执行步骤**：

1. 读取源项目 `/Users/xiaoye/Desktop/AI/自研组件库/xiaoye-ui-vue/packages/core/src/utils/` 下的对应文件
2. 在当前项目 `packages/core/src/utils/` 下创建对应 TS 文件并迁移
3. 在 `packages/core/src/index.ts` 导出
4. 运行 `pnpm --filter @xiaoye-ui/core build` 验证

---

#### 任务 0.6：补充缺失的 `@xiaoye-ui/utils/object` 函数

**缺失函数**：`resolveFieldData`、`localeComparator`、`sort`、`findLastIndex`、`isPrintableCharacter`、`resolve`、`isEmpty`、`isNotEmpty`

**执行步骤**：

1. 读取源项目 `/Users/xiaoye/Desktop/AI/自研组件库/xiaoye-ui-vue/packages/utils/src/object/` 下对应文件
2. 在当前项目 `packages/utils/src/object/methods/` 下创建对应 TS 文件并迁移
3. 在 `packages/utils/src/object/index.ts` 聚合导出
4. 运行 `pnpm --filter @xiaoye-ui/utils build` 验证

---

#### 任务 0.7：补充缺失的 `@xiaoye-ui/utils/uuid` 函数

**缺失函数**：`uuid`

**执行步骤**：

1. 在当前项目 `packages/utils/src/uuid.ts` 创建 `uuid(prefix?: string)` 函数
2. 在 `packages/utils/src/index.ts` 导出
3. 配置 `packages/utils/package.json` 的 `"./uuid"` exports

---

### 批次 0 验证清单

```bash
pnpm --filter @xiaoye-ui/utils build
pnpm --filter @xiaoye-ui/core build
pnpm --filter xiaoye-ui typecheck
pnpm --filter xiaoye-ui test:unit
```

**通过标准**：所有命令零错误，现有组件测试不回归。

---

## 三、批次 1：零依赖业务组件迁移

**目标**：迁移 6 个零依赖或仅依赖批次 0 基础设施的组件。

### 任务 1.1：迁移 Toolbar

**源文件**：`/Users/xiaoye/Desktop/AI/自研组件库/xiaoye-ui-vue/packages/xiaoye-ui/src/toolbar/Toolbar.tsx`（27 行）

**特点**：最简单的组件，无任何外部依赖，适合作为迁移流程验证。

**执行步骤**：

1. 创建 `packages/xiaoye-ui/src/toolbar/` 目录
2. 创建 `Toolbar.tsx`：
   - `name: 'XYToolbar'`
   - 用 `useConfigInject('toolbar', props)` 替代硬编码 `prefixCls`
   - Props 改为 `toolbarProps()` 函数式：`ariaLabelledby: String`
   - 三个插槽：`start`/`center`/`end`，center 占 `flex: 1`
3. 创建 `toolbarTypes.ts` 导出 `ToolbarProps`
4. 创建 `style/index.ts`，用 `genComponentStyleHook('Toolbar', token => [...])` 迁移样式
5. 创建 `index.ts`，用 `registerComponent(XYToolbar)` 注册
6. 创建 `__tests__/toolbar.test.tsx`

**验证**：

```bash
pnpm --filter xiaoye-ui typecheck
pnpm --filter xiaoye-ui test:unit -- toolbar
pnpm --filter xiaoye-ui lint
```

---

### 任务 1.2：迁移 Portal

**已在批次 0.4.1 完成**，本任务仅做集成验证。

---

### 任务 1.3：迁移 SplitterPanel + Splitter

**源文件**：

- `.../splitter/Splitter.tsx`（475 行）
- `.../splitterpanel/SplitterPanel.tsx`（30 行）

**特点**：可拖拽分割面板，复杂度高。按用户决策"子组件合并到父目录"，**SplitterPanel 放在 `splitter/` 目录内**。

**执行步骤**：

1. 创建 `packages/xiaoye-ui/src/splitter/` 目录
2. 创建 `SplitterPanel.tsx`：
   - `name: 'XYSplitterPanel'`
   - **修复源项目 bug**：在 .tsx 中真正声明 `size` 和 `minSize` props（源项目 .d.ts 声明但 .tsx 未实现）
3. 创建 `Splitter.tsx`：
   - `name: 'XYSplitter'`
   - **修复源项目 bug**：硬编码 `child.type.name === 'SplitterPanel'` → `'XYSplitterPanel'`
   - 用 `panelVNodes[i].props?.minSize` 直接读取，**不依赖 `getVNodeProp`**
   - SSR 安全：所有 `document.addEventListener`、`window.sessionStorage`、`getComputedStyle` 用 `typeof window !== 'undefined'` 守卫
   - Props 改为 `splitterProps()` 函数式
4. **修复 BEM 样式 bug**：样式文件用 `__`/`--` 而组件代码用短横线，**统一为短横线**
5. 创建 `splitterTypes.ts`、`style/index.ts`、`index.ts`、`__tests__/`

**验证**：

```bash
pnpm --filter xiaoye-ui typecheck
pnpm --filter xiaoye-ui test:unit -- splitter
pnpm --filter xiaoye-ui lint
```

---

### 任务 1.4：迁移 Fieldset

**源文件**：`/Users/xiaoye/Desktop/AI/自研组件库/xiaoye-ui-vue/packages/xiaoye-ui/src/fieldset/Fieldset.tsx`（107 行）

**执行步骤**：

1. 创建 `packages/xiaoye-ui/src/fieldset/` 目录
2. 创建 `Fieldset.tsx`：
   - `name: 'XYFieldset'`
   - **移除 Ripple 指令**：删除 `import Ripple` 和 `vRipple`
   - 保留键盘交互（Enter/Space 触发 toggle）和 `aria-expanded`
   - **修复图标导入**：`import { MinusIcon, PlusIcon } from '@xiaoye-ui/icons'`（命名导入根路径）
   - Props 改为 `fieldsetProps()` 函数式：`legend: String`、`toggleable: booleanType(false)`、`collapsed: booleanType(false)`、`toggleButtonProps: objectType()`
3. **修复 BEM 样式 bug**：`__`/`--` → 短横线
4. **补充全局过渡类**：`Transition name="xy-collapsible"` 的 enter/leave 动画类
5. 创建 `fieldsetTypes.ts`、`style/index.ts`、`index.ts`、`__tests__/`

**验证**：

```bash
pnpm --filter xiaoye-ui typecheck
pnpm --filter xiaoye-ui test:unit -- fieldset
pnpm --filter xiaoye-ui lint
```

---

### 任务 1.5：迁移 Panel（含 _shared/CardLike）

**源文件**：

- `.../panel/Panel.tsx`（99 行）
- `.../_shared/CardLike.tsx`
- `.../_shared/style/genCardLikeStyle.ts`

**执行步骤**：

1. 创建 `packages/xiaoye-ui/src/_shared/CardLike.tsx`，迁移源项目 CardLike
2. 创建 `packages/xiaoye-ui/src/_shared/style/genCardLikeStyle.ts`
3. **修复样式 bug**：`((cardLike[componentCls] || {})` 中 `componentCls` 是 `'.xy-panel'`（带点），但 `genCardLikeStyle` 返回 key 是 `'xy-panel'`（无点）。**修复方案**：统一为带点 key
4. 创建 `packages/xiaoye-ui/src/panel/` 目录
5. 创建 `Panel.tsx`，Props 改为 `panelProps()` 函数式
6. 创建 `panelTypes.ts`、`style/index.ts`、`index.ts`、`__tests__/`

**验证**：

```bash
pnpm --filter xiaoye-ui typecheck
pnpm --filter xiaoye-ui test:unit -- panel
pnpm --filter xiaoye-ui lint
```

---

### 任务 1.6：迁移 VirtualScroller

**源文件**：`/Users/xiaoye/Desktop/AI/自研组件库/xiaoye-ui-vue/packages/xiaoye-ui/src/virtualscroller/VirtualScroller.tsx`（667 行）

**执行步骤**：

1. 创建 `packages/xiaoye-ui/src/virtual-scroller/` 目录
2. 创建 `VirtualScroller.tsx`：
   - `name: 'XYVirtualScroller'`
   - **修复图标导入**：`import { SpinnerIcon } from '@xiaoye-ui/icons'`
   - Props 改为 `virtualScrollerProps()` 函数式，22 个 Props
   - 迁移 `calculateNumItems`、`onScrollPositionChange`、`setContentPosition`（translate3d）
   - `ResizeObserver` + window resize 监听
   - `expose` 暴露 `scrollTo`、`scrollToIndex`、`getOptions` 等
3. 创建 `virtualScrollerTypes.ts`、`style/index.ts`、`index.ts`、`__tests__/`

**验证**：

```bash
pnpm --filter xiaoye-ui typecheck
pnpm --filter xiaoye-ui test:unit -- virtual-scroller
pnpm --filter xiaoye-ui lint
pnpm --filter xiaoye-ui build
```

---

### 批次 1 完成验证

```bash
pnpm typecheck
pnpm test:unit
pnpm lint
pnpm build:packages
```

---

## 四、批次 2：有依赖业务组件迁移

**目标**：迁移 7 个有依赖的组件，依赖批次 0 基础设施 + 批次 1 组件。

### 任务 2.1：迁移 OrganizationChart + TreeChart

**源文件**：

- `.../organizationchart/OrganizationChart.tsx` + `OrganizationChartNode.tsx`
- `.../treechart/TreeChart.tsx` + `TreeChartNode.tsx`

**特点**：两者几乎同构，依赖最少（仅 icons），**建议一起迁移**。

**执行步骤**：

1. 创建 `packages/xiaoye-ui/src/organization-chart/` 目录
2. 创建 `OrganizationChart.tsx` + `OrganizationChartNode.tsx`（子组件合并到父目录）
3. 创建 `packages/xiaoye-ui/src/tree-chart/` 目录
4. 创建 `TreeChart.tsx` + `TreeChartNode.tsx`
5. 各自创建 `xxxTypes.ts`、`style/index.ts`、`index.ts`、`__tests__/`

**验证**：

```bash
pnpm --filter xiaoye-ui typecheck
pnpm --filter xiaoye-ui test:unit -- "organization-chart|tree-chart"
pnpm --filter xiaoye-ui lint
```

---

### 任务 2.2：迁移 ContextMenu

**源文件**：`.../contextmenu/ContextMenu.tsx` + `ContextMenuSub.tsx`

**依赖**：Portal（批次 0.4.1）、Ripple（composable）、utils/dom、utils/object、utils/zindex、icons/angleright

**执行步骤**：

1. 创建 `packages/xiaoye-ui/src/context-menu/` 目录
2. 创建 `ContextMenu.tsx` + `ContextMenuSub.tsx`（子组件合并到父目录）
3. **移除 Ripple 指令**，改用 `useRipple(ref)` composable
4. **处理 menuitem 类型依赖**：在 `contextMenuTypes.ts` 内联定义 MenuItem 类型
5. 迁移完整键盘导航 + 全局监听器
6. 创建 `contextMenuTypes.ts`、`style/index.ts`、`index.ts`、`__tests__/`

**验证**：

```bash
pnpm --filter xiaoye-ui typecheck
pnpm --filter xiaoye-ui test:unit -- context-menu
pnpm --filter xiaoye-ui lint
```

---

### 任务 2.3：迁移 ColorPicker

**源文件**：`.../colorpicker/ColorPicker.tsx`

**依赖**：Portal、OverlayEventBus、utils/dom、utils/zindex、@xiaoye-ui/core/utils（ConnectedOverlayScrollHandler）

**执行步骤**：

1. 创建 `packages/xiaoye-ui/src/color-picker/` 目录
2. 创建 `ColorPicker.tsx`：
   - 迁移自实现颜色转换函数（HEX/RGB/HSB 互转）
   - 迁移拖拽监听、`pickColor`/`pickHue`
   - SSR 安全：所有 DOM 操作用 `typeof window !== 'undefined'` 守卫
   - Props 改为 `colorPickerProps()` 函数式，15 个 Props
3. 创建 `colorPickerTypes.ts`、`style/index.ts`、`index.ts`、`__tests__/`

**验证**：

```bash
pnpm --filter xiaoye-ui typecheck
pnpm --filter xiaoye-ui test:unit -- color-picker
pnpm --filter xiaoye-ui lint
```

---

### 任务 2.4：迁移 Galleria

**源文件**：`.../galleria/Galleria.tsx` + `GalleriaContent.tsx` + `GalleriaItem.tsx` + `GalleriaThumbnails.tsx`

**依赖**：Portal、FocusTrap（composable）、Ripple（composable）、utils/dom、utils/zindex、utils/uuid、icons、blockBodyScroll/unblockBodyScroll

**执行步骤**：

1. 创建 `packages/xiaoye-ui/src/galleria/` 目录
2. 创建 4 个 tsx 文件（子组件合并到父目录）
3. 用 `useFocusTrap` 替代 `v-focustrap`，用 `useRipple` 替代 `v-ripple`
4. 迁移全屏模式、触摸滑动、响应式 style 标签注入
5. Props 改为 `galleriaProps()` 函数式，27 个 Props
6. 创建 `galleriaTypes.ts`、`style/index.ts`（含 keyframes）、`index.ts`、`__tests__/`

**验证**：

```bash
pnpm --filter xiaoye-ui typecheck
pnpm --filter xiaoye-ui test:unit -- galleria
pnpm --filter xiaoye-ui lint
```

---

### 任务 2.5：迁移 FormList

**源文件**：`.../formlist/FormList.tsx`

**依赖**：`xiaoye-ui/useform`（含 normalizeName）、`$pcForm` context

**关键障碍**：源项目 Form 通过 `provide('$pcForm', ...)` 暴露 `register/setFieldValue/removeListField`；当前项目 Form 是 antd 风格 FormContext，API 完全不同。

**执行步骤**：

1. **先调研当前项目 Form context**，理解 register/setFieldValue 能力
2. 迁移 `normalizeName` 到 `packages/xiaoye-ui/src/_util/useForm/normalizeName.ts`
3. 创建 `packages/xiaoye-ui/src/form/FormList.tsx`（合并到现有 form/ 目录）
4. **适配当前项目 FormContext**：将源项目的 `$pcForm` 调用改为当前 FormContext 等价 API
5. 在 `packages/xiaoye-ui/src/form/index.tsx` 导出 `FormList`

**验证**：

```bash
pnpm --filter xiaoye-ui typecheck
pnpm --filter xiaoye-ui test:unit -- "form|formlist"
pnpm --filter xiaoye-ui lint
```

---

### 任务 2.6：迁移 DataView

**源文件**：`.../dataview/DataView.tsx`

**依赖**：`xiaoye-ui/pagination`（PrimeVue 风格）、utils/object

**关键障碍**：当前项目 Pagination 是 antd 风格，API 完全不同。

**执行步骤**：

1. 创建 `packages/xiaoye-ui/src/data-view/` 目录
2. 创建 `DataView.tsx`：
   - **改写 `renderPagination`**：使用当前项目 antd 风格 Pagination，映射 props
   - **移除 PrimeVue 专属 props**：`paginationTemplate`、`pageLinkSize`、`currentPageReportTemplate`、`alwaysShowPagination`
   - 保留 slots：`header`、`footer`、`empty`、`list`、`grid`
3. 创建 `dataViewTypes.ts`、`style/index.ts`、`index.ts`、`__tests__/`

**验证**：

```bash
pnpm --filter xiaoye-ui typecheck
pnpm --filter xiaoye-ui test:unit -- data-view
pnpm --filter xiaoye-ui lint
```

---

### 批次 2 完成验证

```bash
pnpm typecheck
pnpm test:unit
pnpm lint
pnpm build:packages
```

---

## 五、批次 3：重型/复杂组件迁移

**目标**：迁移 5 个重型组件，含第三方依赖。按用户决策"迁入主包"。

### 任务 3.1：迁移 Chart

**源文件**：`.../chart/Chart.tsx`（138 行）

**第三方依赖**：`chart.js`（动态 import）

**执行步骤**：

1. 在 `packages/xiaoye-ui/package.json` 的 `dependencies` 添加 `"chart.js": "^4.4.0"`
2. 运行 `pnpm install`
3. 创建 `packages/xiaoye-ui/src/chart/` 目录
4. 创建 `Chart.tsx`：`name: 'XYChart'`，SSR 安全，`expose` 暴露 6 个方法
5. 创建 `chartTypes.ts`、`style/index.ts`、`index.ts`、`__tests__/`
6. **Vite 配置**：`manualChunks` 拆分 `chart.js`

**验证**：

```bash
pnpm --filter xiaoye-ui typecheck
pnpm --filter xiaoye-ui test:unit -- chart
pnpm --filter xiaoye-ui build
ls packages/xiaoye-ui/dist/assets/ | grep chart
```

---

### 任务 3.2：迁移 Editor（基于 Quill）

**源文件**：`.../editor/Editor.tsx`（234 行）

**第三方依赖**：`quill`（动态 import + 主题 CSS）

**执行步骤**：

1. 在 `packages/xiaoye-ui/package.json` 的 `dependencies` 添加 `"quill": "^2.0.0"`
2. 运行 `pnpm install`
3. 创建 `packages/xiaoye-ui/src/editor/` 目录
4. 创建 `Editor.tsx`：保留 `import 'quill/dist/quill.snow.css'`，`onMounted` 内动态 import，SSR 安全
5. 创建 `editorTypes.ts`、`style/index.ts`（覆盖 `.ql-snow` 主题）、`index.ts`、`__tests__/`
6. **Vite 配置**：`manualChunks` 拆分 `quill`

**验证**：

```bash
pnpm --filter xiaoye-ui typecheck
pnpm --filter xiaoye-ui test:unit -- editor
pnpm --filter xiaoye-ui build
```

---

### 任务 3.3：迁移 RichTextEditor 系列（基于 Tiptap）

**源文件**：6 个目录（richtexteditor + 5 个子菜单目录）

**第三方依赖**：28+ 个 `@tiptap/*` 包、`defu`、`@floating-ui/dom`、`tiptap-extension-code-block-shiki`

**执行步骤**：

1. 在 `packages/xiaoye-ui/package.json` 的 `dependencies` 添加所有 Tiptap 依赖
2. 运行 `pnpm install`
3. 创建 `packages/xiaoye-ui/src/rich-text-editor/` 目录，**将 6 个子目录全部合并到此**
4. 目录结构（6 个子组件全部放在 `rich-text-editor/` 下）：
   ```
   rich-text-editor/
   ├── index.ts                    # 主组件导出
   ├── RichTextEditor.tsx
   ├── RichTextEditorToolbar.tsx
   ├── RichTextEditorDragHandle.tsx
   ├── RichTextEditorMentionMenu.tsx
   ├── RichTextEditorEmojiMenu.tsx
   ├── RichTextEditorSuggestionMenu.tsx
   ├── EditorLinkPopover.tsx
   ├── composables/useEditorMenu.ts
   ├── types/editor.ts
   ├── utils/editor.ts             # createHandlers() 40+ 个处理器
   ├── style/index.ts
   └── __tests__/
   ```
5. SSR 安全：`<ClientOnly>` 包裹主组件
6. **Vite 配置**：`manualChunks` 拆分 `@tiptap/*`，Shiki 主题异步加载

**验证**：

```bash
pnpm --filter xiaoye-ui typecheck
pnpm --filter xiaoye-ui test:unit -- rich-text-editor
pnpm --filter xiaoye-ui build
ls packages/xiaoye-ui/dist/assets/ | grep tiptap
```

---

### 任务 3.4：迁移 TreeTable + table-core

**源文件**：

- `.../treetable/`（8 个文件，主组件 1056 行）
- `.../table-core/`（7 个文件）

**第三方依赖**：无（纯内部包）

**执行步骤**：

1. 创建 `packages/xiaoye-ui/src/table-core/` 目录，迁移 table-core 模块
2. 创建 `packages/xiaoye-ui/src/tree-table/` 目录
3. 迁移 TreeTable.tsx + TreeTableRow.tsx + BodyCell.tsx + HeaderCell.tsx + FooterCell.tsx（子组件合并到父目录）
4. **改造复用 table-core**：将内联 sort/filter 改为调用 table-core 函数
5. Props 改为 `treeTableProps()` 函数式，38 个 Props
6. 迁移列宽拖拽（document mousemove + style 注入 + CSP nonce）、键盘导航、checkbox 双向半选
7. 创建 `treeTableTypes.ts`、`style/index.ts`、`index.ts`、`__tests__/`

**验证**：

```bash
pnpm --filter xiaoye-ui typecheck
pnpm --filter xiaoye-ui test:unit -- tree-table
pnpm --filter xiaoye-ui lint
pnpm --filter xiaoye-ui build
```

---

### 任务 3.5：（可选）NuxtEditor 系列

**建议**：**跳过**。NuxtEditor 与 RichTextEditor 高度重叠（80%+ 代码相同），在 RichTextEditor 中通过 `table?: boolean`、`codeBlockShiki?: boolean` 等 props 控制扩展能力即可覆盖。

---

### 批次 3 完成验证

```bash
pnpm typecheck
pnpm test:unit
pnpm lint
pnpm build:packages
ls packages/xiaoye-ui/dist/assets/ | grep -E "chart|quill|tiptap"
```

---

## 六、批次 4：指令等价组件化

**目标**：将 4 个指令用组件方式实现。按用户决策"用组件方式实现"。

### 任务 4.1：Ripple 组件化（已在批次 0.4.2 完成）

### 任务 4.2：FocusTrap 组件化（已在批次 0.4.3 完成）

### 任务 4.3：KeyFilter 组件化 + Input 集成

**源文件**：`.../keyfilter/KeyFilter.js`

**执行步骤**：

1. 创建 `packages/xiaoye-ui/src/key-filter/` 目录
2. 创建 `presets.ts`，迁移 9 种预设正则常量
3. 创建 `useKeyFilter.ts` composable，迁移 6 个事件监听器（keypress/paste/input/compositionstart/compositionend/change）
4. 创建 `KeyFilter.tsx` 包裹组件：`name: 'XYKeyFilter'`
5. **扩展 XYInput**：在 `packages/xiaoye-ui/src/input/Input.tsx` 追加 `keyFilterPreset`、`keyFilterPattern`、`keyFilterValidateOnly` Props，内部集成 `useKeyFilter`
6. 创建 `keyFilterTypes.ts`、`style/index.ts`、`index.ts`、`__tests__/`

**验证**：

```bash
pnpm --filter xiaoye-ui typecheck
pnpm --filter xiaoye-ui test:unit -- "key-filter|input"
pnpm --filter xiaoye-ui lint
```

---

### 任务 4.4：BadgeDirective → OverlayBadge

**关键发现**：源项目已有 `overlaybadge/` 组件作为 BadgeDirective 的替代品。

**执行步骤**：

1. **不新建 BadgeDirective**
2. 读取源项目 `/Users/xiaoye/Desktop/AI/自研组件库/xiaoye-ui-vue/packages/xiaoye-ui/src/overlaybadge/OverlayBadge.tsx`
3. 创建 `packages/xiaoye-ui/src/overlay-badge/` 目录，迁移 OverlayBadge 组件
4. `name: 'XYOverlayBadge'`
5. Props：`value: string | number`、`type: 'default' | 'info' | 'success' | 'warn' | 'danger'`、`size: SizeType`
6. 创建 `overlayBadgeTypes.ts`、`style/index.ts`、`index.ts`、`__tests__/`

**验证**：

```bash
pnpm --filter xiaoye-ui typecheck
pnpm --filter xiaoye-ui test:unit -- overlay-badge
pnpm --filter xiaoye-ui lint
```

---

### 批次 4 完成验证

```bash
pnpm typecheck
pnpm test:unit
pnpm lint
pnpm build:packages
```

---

## 七、批次 5：扩展 modal 支持 DynamicDialog

**目标**：按用户决策"扩展现有 modal"，不新增独立组件。

### 任务 5.1：扩展 XYModal 支持动态内容渲染

**执行步骤**：

1. 读取当前项目 `packages/xiaoye-ui/src/modal/Modal.tsx` 和 `useModal.ts`
2. 在 `useModal.ts` 中扩展 API：
   - `open(component, componentProps?, modalProps?)`：动态打开一个组件作为 modal 内容
   - `close()`
   - `update(componentProps)`
3. 内部维护 `dynamicModal` ref，通过 `<component :is>` 渲染
4. 在 `Modal.tsx` 中支持 `content` slot 接收动态组件
5. 创建 `__tests__/modal-dynamic.test.tsx`

**验证**：

```bash
pnpm --filter xiaoye-ui typecheck
pnpm --filter xiaoye-ui test:unit -- modal
pnpm --filter xiaoye-ui lint
```

---

## 八、全局收尾任务

### 任务 6.1：更新主入口导出

**执行步骤**：

1. 读取 `packages/xiaoye-ui/src/index.ts`
2. 追加所有新组件的导出

### 任务 6.2：更新 package.json exports 字段

**执行步骤**：

1. 读取 `packages/xiaoye-ui/package.json`
2. 在 `exports` 字段为每个新组件添加子路径导出

### 任务 6.3：补充文档与示例

**执行步骤**：

1. 为每个新组件在 `apps/docs/components/` 创建 `.md` 文档
2. 文档中示例组件标签使用 `demo-` 前缀
3. 示例文件放在 `apps/docs/examples/<component>/<demo-name>.vue`
4. 至少包含 `basic.vue` 基础用法示例

### 任务 6.4：最终全局验证

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm build:packages
pnpm build
```

**通过标准**：

- 所有命令零错误
- 所有新组件有单元测试且通过
- 所有新组件有文档和示例
- 构建产物包含所有新组件的 `.mjs` 和 `.d.ts` 文件
- 第三方依赖（chart.js/quill/@tiptap/*）被正确拆分为独立 chunk

---

## 九、风险与回滚

### 风险点

1. **批次 0 基础设施变更可能影响现有组件**：扩展 utils/dom 入口、注册 ComponentToken 等可能引发类型错误或运行时问题
   - **缓解**：每步后运行 `pnpm typecheck` + `pnpm test:unit`，发现回归立即修复

2. **FormList 适配当前 FormContext 可能复杂**：当前 Form 是 antd 风格，与源项目 PrimeVue 风格 `$pcForm` 差异大
   - **缓解**：任务 2.5 第一步先充分调研，必要时与用户确认是否降级为独立组件

3. **DataView 适配当前 Pagination 可能丢失功能**：PrimeVue 风格 Pagination 的 `paginationTemplate` 等功能在 antd 风格中无等价
   - **缓解**：移除这些 props，在文档中说明功能差异

4. **RichTextEditor 第三方依赖体积大**：28+ 个 @tiptap/* 包，打包体积约 550KB
   - **缓解**：Vite manualChunks 拆分 + Shiki 异步加载 + 文档建议按需引入

5. **SSR 兼容性**：Editor/Chart/RichTextEditor 需要 `<ClientOnly>`
   - **缓解**：组件内部默认包裹 `<ClientOnly>`，或文档明确说明需业务方包裹

### 回滚策略

- 每个批次完成后 git commit，便于回滚
- 若某批次验证失败，回滚到上一批次最后的 commit
- 批次 0 基础设施变更若引发大面积回归，立即回滚并重新评估方案

---

## 十、执行顺序总览

```
批次 0（基础设施）→ 验证 → commit
  ├─ 0.1 扩展 utils/dom 入口
  ├─ 0.2 注册 ComponentToken
  ├─ 0.3 处理 genComponentStyleHook 第三参数
  ├─ 0.4 创建 portal/ripple/focus-trap/overlayEventBus
  ├─ 0.5 补充 @xiaoye-ui/core/utils 函数
  ├─ 0.6 补充 @xiaoye-ui/utils/object 函数
  └─ 0.7 补充 @xiaoye-ui/utils/uuid

批次 1（零依赖组件）→ 验证 → commit
  ├─ 1.1 Toolbar
  ├─ 1.2 Portal（已在 0.4.1 完成，仅验证）
  ├─ 1.3 SplitterPanel + Splitter
  ├─ 1.4 Fieldset
  ├─ 1.5 Panel（含 _shared/CardLike）
  └─ 1.6 VirtualScroller

批次 2（有依赖组件）→ 验证 → commit
  ├─ 2.1 OrganizationChart + TreeChart
  ├─ 2.2 ContextMenu
  ├─ 2.3 ColorPicker
  ├─ 2.4 Galleria
  ├─ 2.5 FormList
  └─ 2.6 DataView

批次 3（重型组件）→ 验证 → commit
  ├─ 3.1 Chart
  ├─ 3.2 Editor
  ├─ 3.3 RichTextEditor 系列
  ├─ 3.4 TreeTable + table-core
  └─ 3.5 NuxtEditor（建议跳过）

批次 4（指令组件化）→ 验证 → commit
  ├─ 4.1 Ripple（已在 0.4.2 完成，仅验证）
  ├─ 4.2 FocusTrap（已在 0.4.3 完成，仅验证）
  ├─ 4.3 KeyFilter + Input 集成
  └─ 4.4 OverlayBadge（复用替代 BadgeDirective）

批次 5（扩展 modal）→ 验证 → commit
  └─ 5.1 扩展 XYModal 支持 DynamicDialog

全局收尾 → 最终验证 → commit
  ├─ 6.1 更新主入口导出
  ├─ 6.2 更新 package.json exports
  ├─ 6.3 补充文档与示例
  └─ 6.4 最终全局验证
```
