# Rating 评分

用于对事物进行评分，支持鼠标点击和悬停交互。

## 何时使用

- 需要用户快速给出评分时。
- 需要展示内容评分等级时。

## 基础用法

:::demo 通过 `v-model:value` 绑定评分值。

rating/basic

:::

## 禁用与只读

:::demo 设置 `disabled` 禁用交互，设置 `readonly` 只读展示。

rating/disabled-readonly

:::

## 自定义字符

:::demo 通过插槽或属性自定义评分图标。

rating/custom-character

:::

## API

通过设置 Rating 的属性来控制评分行为。

### Props

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| allowClear | 是否允许再次点击后清除评分 | boolean | `true` |  |
| character | 自定义评分字符的渲染函数 | ({ index, value }) => VueNode | - |  |
| count | 评分项总数 | number | `5` |  |
| defaultValue | 非受控模式下的初始评分值 | number | `0` |  |
| disabled | 是否禁用交互 | boolean | - |  |
| readonly | 是否只读展示 | boolean | - |  |
| value | 受控模式下的评分值，与 `v-model:value` 一起使用 | number | - |  |

### 事件

| 事件名称     | 说明                          | 回调参数                    | 版本 |
| ------------ | ----------------------------- | --------------------------- | ---- |
| change       | 评分值变化时的回调            | (value: number) => void     |      |
| focus        | 评分项获得焦点时的回调        | (event: FocusEvent) => void |      |
| blur         | 评分项失去焦点时的回调        | (event: FocusEvent) => void |      |
| update:value | 用于 `v-model:value` 双向绑定 | (value: number) => void     |      |

### Slots

| 插槽名称  | 说明                     | 参数                             | 版本 |
| --------- | ------------------------ | -------------------------------- | ---- |
| character | 自定义评分字符           | { index: number, value: number } |      |
| default   | 默认插槽，通常不需要使用 | -                                |      |

## Types

从 `xiaoye-ui/rating` 导出的 TypeScript 类型：

| 类型        | 说明                             |
| ----------- | -------------------------------- |
| RatingProps | Rating 组件完整的 Props 类型定义 |

## 使用说明

### 受控与非受控

- 非受控模式：仅设置 `defaultValue`，组件内部自行维护评分值。
- 受控模式：使用 `v-model:value`（等价于同时绑定 `value` 与 `update:value` 事件），由外部状态控制评分值。

### allowClear 行为

当 `allowClear` 为 `true` 时，再次点击当前选中的评分项会将值重置为 `0`；设置为 `false` 则无法清除已选评分。

### 自定义字符插槽参数

`character` 插槽接收 `{ index, value }` 参数：

- `index`：当前评分项的索引，从 `1` 开始。
- `value`：当前评分值。
