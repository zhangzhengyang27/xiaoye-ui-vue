# Portal 传送门

Portal 基于 Vue 的 `<Teleport>` 封装，可将子内容渲染到 DOM 树中的其他位置，常用于解决父容器 `overflow: hidden` 裁剪浮层、z-index 层叠上下文等问题。

## 何时使用

- 自定义浮层（确认框、提示卡、右键菜单）需要脱离父容器 `overflow` 限制时。
- 需要将内容挂载到指定容器（而非默认 `body`）时，例如局部范围内的浮层。
- 需要一个可在"传送 / 原地渲染"之间切换的容器，便于在禁用动画或特定布局下回退到内联渲染时。

## 基础用法

:::demo 默认将内容传送到 `body`。点击按钮显示浮层，浮层会脱离下方设置了 `overflow: hidden` 的容器，完整显示在视口中央。

portal/basic

:::

## 自定义挂载容器

:::demo 通过 `appendTo` 指定挂载目标，支持 `'body'`、`'self'` 或任意 CSS 选择器。切换单选框可将浮层挂载到不同容器内部。

portal/custom-container

:::

## 禁用传送

:::demo 设置 `disabled` 为 `true` 时，内容将原地渲染而不再传送到 `body`，此时会受父容器 `overflow` 影响。可用于在特定布局下关闭传送行为。

portal/disabled

:::

## 嵌套使用

:::demo Portal 可嵌套使用。外层浮层本身设置了 `overflow: hidden`，内层 Portal 再次将内容传送到 `body`，从而跳出外层的裁剪。

portal/nested

:::

## 与表格配合

:::demo 在可滚动表格中，操作触发的自定义确认弹层通过 Portal 传送到 `body`，避免被表格容器的 `overflow: auto` 裁剪。

portal/with-modal

:::

## API

### Portal Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| appendTo | 内容挂载目标，可为 `'body'`、`'self'`、CSS 选择器字符串或 HTMLElement 实例 | 'body' \| 'self' \| string \| HTMLElement | `'body'` |
| disabled | 是否禁用传送，为 `true` 时内容原地渲染 | boolean | `false` |
| position | 预留的位置标识，可用于自定义样式或逻辑 | string | - |
| group | 分组标识，可用于批量管理同一组传送内容 | string | - |

### Portal Slots

| 插槽名  | 说明           |
| ------- | -------------- |
| default | 需要传送的内容 |

### 说明

- 当 `appendTo` 为 `'self'` 或 `disabled` 为 `true` 时，内容会原地渲染。
- 组件在客户端挂载后才会执行传送，SSR 环境下安全。
- 嵌套使用时，每一层 Portal 都会独立将内容传送到其 `appendTo` 指定的目标。
