# OverlayBadge 覆盖徽标

在子元素右上角叠加一个徽标，常用于头像、图标、按钮等元素的未读数提示。

## 何时使用

- 在头像、图标右上角展示未读消息数量。
- 在按钮、入口图标上叠加状态或计数提示。
- 需要比独立徽标更直观地关联目标元素时。

## 基础用法

:::demo 使用默认插槽包裹目标元素，通过 `value` 设置徽标显示的内容（数字或文本）。

overlay-badge/basic

:::

## 包裹图标

:::demo 将 `xy-overlay-badge` 包裹在图标外侧，常用于通知、消息入口的未读提示。

overlay-badge/with-icon

:::

## 包裹按钮

:::demo 将 `xy-overlay-badge` 包裹在按钮外侧，用于强调操作项的待处理数量。

overlay-badge/with-button

:::

## 自定义颜色与尺寸

:::demo 通过 `size` 设置尺寸（`small` / `large`），通过外层自定义类名配合 `:deep()` 穿透可覆盖徽标颜色。

overlay-badge/custom-color

:::

## API

### OverlayBadge Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 徽标显示内容，数字或文本 | string \| number \| null | null |
| severity | 预留语义类型（当前版本未透传至底层徽标） | `secondary` \| `info` \| `success` \| `warn` \| `danger` \| `contrast` \| string | - |
| size | 徽标尺寸 | `small` \| `large` | - |
| icon | 预留图标（当前版本未透传至底层徽标） | string | undefined |
| style | 容器自定义样式 | string \| object | undefined |
| class | 容器自定义类名 | string \| array \| object | undefined |

### OverlayBadge Slots

| 插槽名  | 说明             | 参数 |
| ------- | ---------------- | ---- |
| default | 被包裹的目标内容 | -    |

## 备注

`OverlayBadge` 内部基于 `Badge` 实现，当前版本将 `value` 映射为 `count`、`size` 映射为徽标尺寸。如需自定义颜色，可通过外层类名配合 `:deep(.xy-badge-count)` 进行样式覆盖。
