# MeterGroup 多指标进度组

将多个指标聚合到同一条进度条中并列展示，适用于资源占比、任务分布等多维度进度场景。

## 何时使用

- 需要在一条进度条中展示多个分段的占比时；
- 需要同时呈现指标标签、颜色与数值时；
- 需要水平或垂直方向展示多指标进度时。

## 基础用法

:::demo 通过 `values` 传入指标数组，每项包含 `label`、`value`、`color`。

meter-group/basic

:::

## 垂直方向

:::demo 设置 `orientation="vertical"` 让进度条纵向展示。

meter-group/vertical

:::

## 自定义颜色

:::demo 为每个指标指定 `color`，标签区会自动同步颜色标记。

meter-group/custom-colors

:::

## 带标签

:::demo 通过 `labelPosition` 控制标签位置（`start` 或 `end`），`labelOrientation` 控制标签排列方向。

meter-group/with-labels

:::

## 多指标展示

:::demo 在同一条进度条中展示更多维度的指标，并自定义数值范围。

meter-group/multiple-meters

:::

## 自定义指标模板

:::demo 通过 `#meter` 插槽自定义单个指标的渲染内容。

meter-group/custom-meter

:::

## API

### MeterGroup

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| values | 指标数组，每项含 `{ label, value, color, icon }` | `MeterItem[]` | `[]` |  |
| min | 最小边界值 | number | `0` |  |
| max | 最大边界值 | number | `100` |  |
| orientation | 进度条方向，可选 `horizontal` `vertical` | string | `horizontal` |  |
| labelPosition | 标签位置，可选 `start` `end` | string | `end` |  |
| labelOrientation | 标签排列方向，可选 `horizontal` `vertical` | string | `horizontal` |  |

### MeterItem

| 属性  | 说明                             | 类型   | 默认值 |
| ----- | -------------------------------- | ------ | ------ |
| label | 指标标签文本                     | string | -      |
| value | 指标当前值                       | number | -      |
| color | 指标颜色                         | string | -      |
| icon  | 指标图标类名（覆盖默认圆点标记） | string | -      |

### 插槽

| 名称  | 说明             | 参数                                                       |
| ----- | ---------------- | ---------------------------------------------------------- |
| label | 自定义整个标签区 | `{ value, totalPercent, percentages }`                     |
| meter | 自定义单个指标   | `{ value, index, class, orientation, size, totalPercent }` |
| start | 进度条前置内容   | `{ value, totalPercent, percentages }`                     |
| end   | 进度条后置内容   | `{ value, totalPercent, percentages }`                     |
| icon  | 自定义标签图标   | `{ value, class }`                                         |
