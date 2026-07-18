# SortableList 可拖拽排序列表

SortableList 用于展示一个可通过拖拽调整顺序的列表，支持水平/垂直方向、拖拽手柄、禁用项等特性。基于 `@dnd-kit/vue` 实现，提供流畅的拖拽体验。

## 何时使用

- 需要用户通过拖拽调整列表项顺序时，例如：任务看板、图片排序、字段排序。
- 需要支持水平或垂直方向拖拽的场景。
- 需要禁用某些项参与排序时。

## 基础用法

:::demo 通过 `model` 传入列表项数组（每项包含 `key` 和 `label` 字段），监听 `update` 事件获取排序后的新数组。直接拖动列表项即可调整顺序。

sortable-list/basic

:::

## 拖拽手柄

:::demo 设置 `handle` 为 `true` 后，列表项左侧会出现一个拖拽手柄图标，只有通过手柄才能拖动，避免误触内容区域。

sortable-list/with-handle

:::

## 水平拖拽

:::demo 设置 `axis` 为 `x` 可实现水平方向的拖拽排序，列表项横向排列。

sortable-list/horizontal

:::

## 自定义列表项

:::demo 通过 `#item` 插槽可完全自定义列表项的渲染内容，插槽参数为 `{ item, index }`。

sortable-list/custom-item

:::

## 禁用某些项

:::demo 在 `model` 数组中给某一项设置 `disabled: true`，该项将无法被拖拽，但其他项仍可正常排序。

sortable-list/disabled-items

:::

## API

### SortableList Props

| 属性     | 说明                                          | 类型                 | 默认值  |
| -------- | --------------------------------------------- | -------------------- | ------- |
| model    | 列表项数组，每项含 `{ key, label, disabled }` | `SortableListItem[]` | `[]`    |
| itemKey  | 唯一标识字段名                                | string               | `'key'` |
| disabled | 是否禁用整体拖拽                              | boolean              | `false` |
| axis     | 拖拽方向                                      | `'x'` \| `'y'`       | `'y'`   |
| handle   | 是否使用拖拽手柄                              | boolean              | `false` |

### SortableList Events

| 事件名    | 说明             | 回调参数                                       |
| --------- | ---------------- | ---------------------------------------------- |
| update    | 顺序更新时触发   | `{ sourceId, targetId, value, originalEvent }` |
| dragStart | 拖拽开始时触发   | `{ sourceId, originalEvent }`                  |
| dragOver  | 拖拽经过项时触发 | `{ sourceId, targetId, originalEvent }`        |
| dragEnd   | 拖拽结束时触发   | `{ sourceId, targetId, originalEvent }`        |

> `value` 为重新排序后的数组；`sourceId` 为被拖拽项的唯一标识；`targetId` 为目标位置项的唯一标识。

### SortableList Slots

| 插槽名 | 说明               | 参数              |
| ------ | ------------------ | ----------------- |
| item   | 自定义列表项渲染   | `{ item, index }` |
| handle | 自定义拖拽手柄渲染 | `{ item, index }` |

### SortableListItem 数据结构

| 字段     | 说明                                  | 类型             | 默认值  |
| -------- | ------------------------------------- | ---------------- | ------- |
| key      | 唯一标识（字段名可由 `itemKey` 配置） | string \| number | -       |
| label    | 列表项显示文本                        | any              | -       |
| disabled | 是否禁用该项拖拽                      | boolean          | `false` |

### 交互说明

- 支持鼠标拖拽调整顺序，默认使用 `PointerSensor`。
- 支持键盘排序：聚焦到列表项后按空格键开始拖拽，方向键移动，再次按空格确认。
- 设置 `handle` 后仅能通过手柄拖拽，避免误触。
- 禁用项（`disabled: true`）不参与拖拽，但仍可作为放置目标之外的普通项展示。
- 拖拽中会显示半透明效果，放置目标会高亮提示。
